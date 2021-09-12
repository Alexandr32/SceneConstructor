import {AfterViewInit, Component, ElementRef, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {Scene} from '../models/scene.model';
import {BehaviorSubject, Observable, Subscription} from 'rxjs';
import {MatDialog} from '@angular/material/dialog';
import {EditSceneDialogComponent} from '../edit-scene-dialog/edit-scene-dialog.component';
import {Answer} from '../models/answer.model';
import {Coordinate} from '../models/coordinate.model';
import {Player} from '../models/player.model';
import {EditPlayerDialogComponent} from '../edit-player-dialog/edit-player-dialog.component';
import {FirestoreService} from '../serveces/firestore.service';
import {AngularFirestore} from '@angular/fire/firestore';
import {Game} from '../models/game.model';
import {MessageDialogComponent} from '../message-dialog/message-dialog.component';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {ActivatedRoute} from '@angular/router';

@Component({
  selector: 'app-editor',
  templateUrl: './editor.component.html',
  styleUrls: ['./editor.component.scss']
})
export class EditorComponent implements OnInit, AfterViewInit, OnDestroy {

  scenes: Scene[] = [];
  players: Player[] = [];

  game: Game;
  form: FormGroup = new FormGroup({});
  showForm = false;

  @ViewChild('working', {static: true})
  working: ElementRef<HTMLDivElement>;

  @ViewChild('canvas', {static: true})
  canvas: ElementRef<HTMLCanvasElement>;
  private ctx: CanvasRenderingContext2D;

  changeSelectModeEvent$ = new BehaviorSubject<boolean>(false);

  // Выбранный ответ
  selectSceneForChangeSelectMode: Answer;

  game$: Subscription;

  constructor(public dialog: MatDialog,
              private fireStore: AngularFirestore,
              private firestoreServiceService: FirestoreService,
              private route: ActivatedRoute) {
  }

  ngOnDestroy(): void {
    this.game$.unsubscribe();
  }

  ngOnInit() {

    this.ctx = this.canvas.nativeElement.getContext('2d');

    const gameId = this.route.snapshot.params.gameId;
    this.game$ = this.firestoreServiceService.getGameById(gameId).subscribe((game) => {
      this.game = game;
      console.log('this.game:', this.game);

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

      this.scenes = [];
      this.game.scenes.forEach(scene => {
        this.scenes.push(scene);
      });

      if (this.game.scenes.length == 0) {
        this.canvas.nativeElement.height = 880;
      } else {
        this.canvas.nativeElement.height = this.game.scenes
          .flatMap(item => item.coordinate.y)
          .reduce((previousValue, currentValue) => previousValue + currentValue) + 500;
      }

      this.players = [];
      this.game.players.forEach(player => {
        this.players.push(player);
      });

      this.renderLine();
    });
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

    this.players.push(player);

    this.game.name = '123';
  }

  onClickEditPlayer(player: Player) {

    const dialogRef = this.dialog.open(EditPlayerDialogComponent, {
      data: player
    });

    /*dialogRef.componentInstance.saveEvent.subscribe(() => {
      this.clearCanvas()
      this.renderLine()
    })*/

    dialogRef.afterClosed().subscribe(() => {
      console.log('closeDialog');
    });

  }

  onClickDeletePlayer(player: Player) {

    const index = this.players.indexOf(player);
    this.players.splice(index, 1);

    this.scenes.forEach(scene => {
      const index = scene.players.indexOf(player.id);
      scene.players.splice(index, 1);
    });
  }

  openEditDialog(scene: Scene): void {

    const dialogRef = this.dialog.open(EditSceneDialogComponent, {
      data: {scene, players: this.players}
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
        const coordinateTwo: Coordinate = new Coordinate();
        coordinateTwo.x = scene.coordinate.x + 4;
        coordinateTwo.y = scene.coordinate.y + 4;

        this.moveZLine(coordinateOne, coordinateTwo, answer.color, answer.position);
      });
    });
  }

  onChangeDrag() {

    this.clearCanvas();
    this.renderLine();
  }

  async saveGame() {

    console.log('saveGame');

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

      /*this.dialog.open(MessageDialogComponent, {
        data: 'Игра сохранена'
      });*/

    } catch (error) {
      this.dialog.open(MessageDialogComponent, {
        data: 'При сохраненнии произошла ошибка' + error
      });
    }

  }

  /**
   * Создает новую сцену
   */
  addNewScene() {

    const scene = new Scene();
    scene.id = this.fireStore.createId();
    scene.text = 'Новая сцена';
    scene.title = 'Новое описание';
    scene.coordinate = new Coordinate();
    scene.coordinate.y = 0;
    scene.coordinate.x = 0;

    const answers1 = new Answer(this.fireStore.createId(), 'a', 0, scene, 'red');
    const answers2 = new Answer(this.fireStore.createId(), 'б', 1, scene, 'red');
    const answers3 = new Answer(this.fireStore.createId(), 'в', 2, scene, 'red');

    scene.answers = [answers1, answers2, answers3];

    this.scenes.push(scene);

    this.renderLine();
  }

  deletedScene(scene: Scene) {

    const answers = this.scenes
      .flatMap((item) => item.answers)
      .filter(item => item.sceneId == scene.id)
      .map(item => item.sceneId = null);

    /*answers.forEach(it => {
      it.sceneId = null
    })*/

    console.log(answers);

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
   * @param position номер ответа
   * @private
   */
  private moveZLine(coordinateOne: Coordinate, coordinateTwo: Coordinate, color: string, position: number) {

    this.moveCircle(coordinateOne, color);

    const coordinateX2Y1 = new Coordinate();
    coordinateX2Y1.x = 4 / 5 * (coordinateTwo.x);
    coordinateX2Y1.y = coordinateOne.y;

    this.moveLine(coordinateOne, coordinateX2Y1, color, position);

    const coordinateX2Y2 = new Coordinate();
    coordinateX2Y2.x = 4 / 5 * (coordinateTwo.x);
    coordinateX2Y2.y = coordinateTwo.y;

    this.moveLine(coordinateX2Y1, coordinateX2Y2, color, position);

    this.moveLine(coordinateX2Y2, coordinateTwo, color, position);

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
   * @param position номер ответа
   * @private
   */
  private moveLine(coordinateOne: Coordinate, coordinateTwo: Coordinate, color: string, position: number) {
    this.ctx.beginPath();
    this.ctx.moveTo(coordinateOne.x, coordinateOne.y);
    this.ctx.lineTo(coordinateTwo.x, coordinateTwo.y);
    this.ctx.strokeStyle = color;
    this.ctx.lineWidth = 2 * position;
    this.ctx.stroke();
    this.ctx.closePath();
  }

  /**
   * Выбор ответа у сцены
   * @param scene
   */
  selectAnswerScene(scene: Answer) {
    console.log('Выбор ответа у сцены', scene);

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
    console.log('Выбор сцены для связывания', scene);

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
    //this.canvasHeight += 500;

    this.clearCanvas();
    this.renderLine();
  }

  getWidthScreen(): number {
    return window.screen.width;
  }

}
