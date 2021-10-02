import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Scene } from '../../models/scene.model';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { EditSceneDialogComponent } from '../edit-scene-dialog/edit-scene-dialog.component';
import { Answer } from '../../models/answer.model';
import { Coordinate } from '../../models/coordinate.model';
import { Player } from '../../models/player.model';
import { EditPlayerDialogComponent } from '../edit-player-dialog/edit-player-dialog.component';
import { FirestoreService } from '../../serveces/firestore.service';
import { AngularFirestore } from '@angular/fire/firestore';
import { Game } from '../../models/game.model';
import { MessageDialogComponent } from '../../core/message-dialog/message-dialog.component';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MediaFileDialogComponent } from '../media-file-dialog/media-file-dialog.component';
import { FileLink } from 'src/app/models/file-link.model.ts';
import { RunGameService } from 'src/app/serveces/run-game.service';

@Component({
  selector: 'app-editor',
  templateUrl: './editor.component.html',
  styleUrls: ['./editor.component.scss']
})
export class EditorComponent implements OnInit, AfterViewInit {

  scenes: Scene[] = [];
  players: Player[] = [];

  private fileForDeleteScenes: { id: string, typeFile: 'Video' | 'Image' }[] = [];
  private fileForDeletePlayers: { id: string, typeFile: 'Video' | 'Image' }[] = [];

  game: Game;
  form: FormGroup = new FormGroup({});
  showForm = false;

  @ViewChild('editor', { static: true })
  editor: ElementRef<HTMLDivElement>;

  @ViewChild('working', { static: true })
  working: ElementRef<HTMLDivElement>;

  @ViewChild('canvas', { static: true })
  canvas: ElementRef<HTMLCanvasElement>;
  private ctx: CanvasRenderingContext2D;

  changeSelectModeEvent$ = new BehaviorSubject<boolean>(false);

  // Выбранный ответ
  selectSceneForChangeSelectMode: Answer;

  widthScreen: number

  startScene$: Subject<Scene> = new Subject<Scene>()

  constructor(public dialog: MatDialog,
    private fireStore: AngularFirestore,
    private firestoreServiceService: FirestoreService,
    private runGameService: RunGameService,
    private route: ActivatedRoute,
    private router: Router) {
  }

  async ngOnInit() {

    this.widthScreen = window.screen.width;

    this.ctx = this.canvas.nativeElement.getContext('2d');

    await this.getGameData();

    this.startScene$.subscribe(async (scene) => {
      await this.runGameByScene(scene)
    })
  }

  private async getGameData() {
    const gameId = this.route.snapshot.params.gameId;
    const game = await this.firestoreServiceService.getGameById(gameId).toPromise();

    console.log('game:', game);

    this.game = game;

    this.scenes = [];
    this.game.scenes.forEach(scene => {
      this.scenes.push(scene);
    });

    if (this.game.scenes.length == 0) {
      this.canvas.nativeElement.height = 880;
    } else {
      const array: number[] = this.game.scenes
        .flatMap(item => Number(item.coordinate.y));
      this.canvas.nativeElement.height = Math.max(...array) + 500;
    }

    this.players = [];
    this.game.players.forEach(player => {
      this.players.push(player);
    });


    for (const player of this.game.players) {

      if (player.imageFileId) {
        try {
          player.imageFile = await this.firestoreServiceService
            .getUrl(this.game.id, player.imageFileId, 'PlayerImage').toPromise()
        } catch (error) {
          player.imageFile = '/assets/http_player.jpg';
          console.log('Изображение не найдено');
          console.log(error);
        }
      } else {
        player.imageFile = '/assets/http_player.jpg';
      }
    }

    for (const scene of this.game.scenes) {

      if (scene.imageFileId) {
        try {
          scene.imageFile = await this.firestoreServiceService
            .getUrl(this.game.id, scene.imageFileId, 'SceneImage').toPromise()
        } catch (error) {
          scene.imageFile = '/assets/http_scene.jpg';
          console.error('Изображение не найдено');
          console.error(error);
        }
      } else {
        scene.imageFile = '/assets/http_scene.jpg';
      }

      if (scene.videoFileId) {
        try {

          scene.videoFile = await this.firestoreServiceService
            .getUrl(this.game.id, scene.videoFileId, 'SceneVideo').toPromise()

        } catch (error) {
          scene.videoFile = '';
          console.error(error);
        }
      } else {
        scene.videoFile = '';
      }
    }

    this.form = new FormGroup({
      'name':
        new FormControl(
          this.game.name,
          [
            Validators.required
          ]),
      'description':
        new FormControl(
          this.game.description,
          [
            Validators.required
          ]),
    });
    this.showForm = true;

    this.renderLine();
  }

  ngAfterViewInit(): void {
    this.renderLine();
  }

  addNewPlayer() {

    if (this.players.length > 3) {
      return;
    }

    const id = this.fireStore.createId();
    const title = 'Новый персонаж';
    const description = 'Описание нового персонажа';

    const player = new Player(id, title, description, '');
    player.imageFile = '/assets/http_player.jpg';

    this.players.push(player);
  }

  onClickEditPlayer(player: Player) {

    const dialogRef = this.dialog.open(EditPlayerDialogComponent, {
      data: { gameId: this.game.id, player }
    });

    dialogRef.afterClosed().subscribe(() => {
      console.log('closeDialog');
    });

  }

  onClickDeletePlayer(player: Player) {

    this.fileForDeletePlayers.push({ id: player.id, typeFile: 'Image' });

    const index = this.players.indexOf(player);
    this.players.splice(index, 1);

    this.scenes.forEach(scene => {
      const index = scene.players.indexOf(player.id);
      scene.players.splice(index, 1);
    });
  }

  openEditDialog(scene: Scene): void {

    const dialogRef = this.dialog.open(EditSceneDialogComponent, {
      data: { gameId: this.game.id, scene, players: this.players }
    });

    dialogRef.componentInstance.saveEvent.subscribe(() => {
      this.clearCanvas();
      this.renderLine();
    });

    dialogRef.afterClosed().subscribe(() => {
      console.log('closeDialog');
    });
  }

  /**
   * Перерисовать линии связей
   */
  private renderLine() {
    this.scenes.forEach((item) => {
      const answers = item.answers.filter(answer => answer.sceneId);

      answers.forEach((answer) => {
        const coordinateOne = new Coordinate();
        coordinateOne.x = answer.coordinate.x;
        coordinateOne.y = answer.coordinate.y;

        const scene = this.scenes.find(scene => scene.id == answer.sceneId);

        if (!scene) {
          return;
        }

        const coordinateTwo: Coordinate = new Coordinate();
        coordinateTwo.x = scene.coordinate.x + 4;
        coordinateTwo.y = scene.coordinate.y + 4;

        this.moveZLine(coordinateOne, coordinateTwo, scene.color);
      });
    });
  }

  onChangeDrag() {

    this.clearCanvas();
    this.renderLine();
  }

  async saveGame() {

    const dialogSave = this.dialog.open(MessageDialogComponent, {
      data: 'Сохранение...'
    });

    this.game.scenes = this.scenes;
    this.game.players = this.players;

    this.game.name = this.form.get('name').value;
    this.game.description = this.form.get('description').value;

    try {

      await this.firestoreServiceService.saveGame(this.game);

      dialogSave.close();

    } catch (error) {

      this.showMessage('При сохраненнии произошла ошибка' + error);

    }

    await this.getGameData();
  }

  async runGame() {

    await this.runGameService.saveNewGame(this.game)

    const url = this.router.serializeUrl(
      this.router.createUrlTree(['run', this.game.id])
    );

    window.open(url, '_blank');
  }

  async runGameByScene(scene: Scene) {

    await this.runGameService.saveNewGame(this.game)

    await this.runGameService.resetDataStateGame(this.game.id, scene)

    const url = this.router.serializeUrl(
      this.router.createUrlTree(['run', this.game.id])
    );

    window.open(url, '_blank');
  }

  private showMessage(message: string) {
    this.dialog.open(MessageDialogComponent, {
      data: message
    });
  }

  /**
   * Создает новую сцену
   */
  addNewScene() {

    const scene = new Scene();
    scene.id = this.fireStore.createId();
    scene.text = 'Новая сцена';
    scene.title = 'Новое описание';
    scene.color = '#7B68EE';
    scene.imageFileId = ''
    scene.videoFileId = ''
    scene.coordinate = new Coordinate();
    scene.coordinate.y = 0;
    scene.coordinate.x = 0;
    scene.imageFile = '/assets/http_scene.jpg';

    const answers1 = new Answer(this.fireStore.createId(), 'a', 0, scene);
    const answers2 = new Answer(this.fireStore.createId(), 'б', 1, scene);
    const answers3 = new Answer(this.fireStore.createId(), 'в', 2, scene);

    scene.answers = [answers1, answers2, answers3];

    this.scenes.push(scene);

    this.renderLine();
  }

  addMediaFile() {

    const dialogRef = this.dialog.open(MediaFileDialogComponent, {
      data: {
        gameId: this.game.id
      }
    });

    dialogRef.afterClosed().subscribe(() => {
      console.log('closeDialog');
    });

  }

  deletedScene(scene: Scene) {

    this.fileForDeleteScenes.push({ id: scene.id, typeFile: 'Video' });
    this.fileForDeleteScenes.push({ id: scene.id, typeFile: 'Image' });

    this.game.scenes.flatMap((item) => {
      return item.answers;
    }).filter((item) => {
      return item.sceneId == scene.id;
    }).forEach((item) => {
      item.sceneId = null;
    });

    const index = this.game.scenes.indexOf(scene);
    this.scenes.splice(index, 1);

    this.clearCanvas();
    this.renderLine();

  }

  private clearCanvas() {
    this.ctx.clearRect(0, 0, this.canvas.nativeElement.width, this.canvas.nativeElement.height);
  }

  /**
   * Отрисовывает z образную линию
   * @param coordinateOne
   * @param coordinateTwo
   * @param color цвет линии
   * @private
   */
  private moveZLine(coordinateOne: Coordinate, coordinateTwo: Coordinate, color: string) {

    this.moveCircle(coordinateOne, color);

    const coordinateX2Y1 = new Coordinate();
    coordinateX2Y1.x = coordinateOne.x;
    coordinateX2Y1.y = coordinateTwo.y;

    this.moveLine(coordinateOne, coordinateX2Y1, color);

    const coordinateX2Y2 = new Coordinate();
    coordinateX2Y2.x = coordinateTwo.x;
    coordinateX2Y2.y = coordinateTwo.y;

    this.moveLine(coordinateX2Y1, coordinateX2Y2, color);

    this.moveCircle(coordinateTwo, color);

  }

  /**
   * Рисует точку
   * @param coordinate
   * @param color цвет линии
   * @private
   */
  private moveCircle(coordinate: Coordinate, color: string) {
    this.ctx.beginPath();
    this.ctx.arc(coordinate.x, coordinate.y, 6, 0, 2 * Math.PI);
    this.ctx.fillStyle = color;
    this.ctx.fill();
    this.ctx.closePath();
  }

  /**
   * Открисовывает одну линию
   * @param coordinateOne
   * @param coordinateTwo
   * @param color цвет линии
   * @private
   */
  private moveLine(coordinateOne: Coordinate, coordinateTwo: Coordinate, color: string) {
    this.ctx.beginPath();
    this.ctx.moveTo(coordinateOne.x, coordinateOne.y);
    this.ctx.lineTo(coordinateTwo.x, coordinateTwo.y);
    this.ctx.strokeStyle = color;
    this.ctx.lineWidth = 2;
    this.ctx.stroke();
    this.ctx.closePath();
  }

  /**
   * Выбор ответа у сцены
   * @param scene
   */
  selectAnswerScene(scene: Answer) {
    const isChangeSelectMode = this.changeSelectModeEvent$.getValue();

    if (isChangeSelectMode) {
      this.selectSceneForChangeSelectMode = scene;
    }

  }

  /**
   * Выбор сцены для связывания
   * @param scene
   */
  selectScene(scene: Scene) {

    const isChangeSelectMode = this.changeSelectModeEvent$.getValue();

    if (isChangeSelectMode) {
      this.selectSceneForChangeSelectMode.sceneId = scene.id;
      this.clearCanvas();
      this.renderLine();
    }

    this.changeSelectModeEvent$.next(false);
  }

  /**
   * Клик по канвасу
   */
  onClickWorkingSpace() {
    this.changeSelectModeEvent$.next(false);
  }

  increaseWorkingSpace() {
    this.canvas.nativeElement.height += 500;

    this.clearCanvas();
    this.renderLine();
  }

  // Увеличить влево
  enlargeCanvas() {
    this.canvas.nativeElement.width += 500;
    this.working.nativeElement.style.width = `${this.canvas.nativeElement.width}px`
    this.editor.nativeElement.style.width = `${this.canvas.nativeElement.width}px`

    console.log('width::', this.working.nativeElement.style);
  }

  getWidthScreen(): number {
    return window.screen.width;
  }

}
