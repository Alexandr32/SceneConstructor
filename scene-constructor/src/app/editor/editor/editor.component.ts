import { AfterViewInit, Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { PuzzleEditScene } from '../models/puzzle-edit-scene';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { Answer } from '../models/answer.model';
import { Coordinate } from '../models/coordinate.model';
import { Player } from '../../core/models/player.model';
import { FirestoreService } from '../services/firestore.service';
import { Game } from '../models/game.model';
import { MessageDialogComponent } from '../../core/message-dialog/message-dialog.component';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { SaveMediaFileDialogComponent } from '../dialogs/save-media-file-dialog/save-media-file-dialog.component';
import { RunGameService } from 'src/app/run-game/services/run-game.service';
import { TypeSceneEnum } from 'src/app/core/models/type-scene.enum';
import { EditSceneDialogComponent } from '../dialogs/edit-scene-dialog/edit-scene-dialog.component';
import { EditPlayerDialogComponent } from '../dialogs/edit-player-dialog/edit-player-dialog.component';
import { EditPanoramaDialogComponent } from '../dialogs/edit-panorama-dialog/edit-panorama-dialog.component';
import { EditPuzzleDialogComponent } from '../dialogs/edit-puzzle-dialog/edit-puzzle-dialog.component';
import {StateService} from "../../run-game/services/state.service";
import {IBaseEditScene} from "../models/base-edit-scene.model";
import {PanoramaEditScene} from "../models/panorama-edit-scene";
import {SceneEditScene} from "../models/scene-edit-scene";
import {AngularFirestore} from "@angular/fire/compat/firestore";
import {BaseComponent} from "../../base-component/base-component.component";
import {takeUntil} from "rxjs/operators";

@Component({
  selector: 'app-editor',
  templateUrl: './editor.component.html',
  styleUrls: ['./editor.component.scss']
})
export class EditorComponent extends BaseComponent implements OnInit, AfterViewInit, OnDestroy {

  scenes: IBaseEditScene[] = [];
  players: Player[] = [];

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

  // ?????????????????? ??????????
  selectSceneForChangeSelectMode: Answer;

  widthScreen: number

  startScene$: Subject<SceneEditScene> = new Subject<SceneEditScene>()
  startDebugModeScene$: Subject<SceneEditScene> = new Subject<SceneEditScene>()

  constructor(public dialog: MatDialog,
    private fireStore: AngularFirestore,
    private firestoreServiceService: FirestoreService,
    private runGameService: RunGameService,
    private stateService: StateService,
    private route: ActivatedRoute,
    private router: Router) {
    super()
  }
  ngOnDestroy(): void {
    this.startScene$.unsubscribe()
    this.startDebugModeScene$.unsubscribe()
    this.changeSelectModeEvent$.unsubscribe()
    this.unsubscribe()
  }

  async ngOnInit() {

    this.widthScreen = window.screen.width;

    this.ctx = this.canvas.nativeElement.getContext('2d');

    await this.getGameData();

    this.startScene$
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe(async (scene) => {
      await this.runGameByScene(scene)
    })

    this.startDebugModeScene$
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe(async (scene) => {
        await this.runGameBySceneInDebugMode(scene)
      })
  }

  private async getGameData() {
    const gameId = this.route.snapshot.params.gameId;
    const game = await this.firestoreServiceService.getGameById(gameId).toPromise();

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
    const title = '?????????? ????????????????';
    const description = '???????????????? ???????????? ??????????????????';

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

    const index = this.players.indexOf(player);
    this.players.splice(index, 1);

    this.scenes.forEach(scene => {
      const index = scene.players.indexOf(player.id);
      scene.players.splice(index, 1);
    });
  }

  openEditDialog(scene: IBaseEditScene): void {

    if (scene.typesScene === TypeSceneEnum.Answer) {
      this.showSceneAnswerDialog(scene as SceneEditScene)
    }

    if (scene.typesScene === TypeSceneEnum.Panorama) {
      this.showPanoramaDialog(scene as PanoramaEditScene)
    }

    if (scene.typesScene === TypeSceneEnum.Puzzle) {
      this.showPuzzleDialog(scene as PuzzleEditScene)
    }


  }

  private showPanoramaDialog(scene: PanoramaEditScene) {
    const dialogRef = this.dialog.open(EditPanoramaDialogComponent, {
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

  private showSceneAnswerDialog(scene: SceneEditScene) {
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

  private showPuzzleDialog(scene: PuzzleEditScene) {
    const dialogRef = this.dialog.open(EditPuzzleDialogComponent, {
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
   * ???????????????????????? ?????????? ????????????
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

  isCheckingSceneStart(): { isChecking: boolean, message: string } {
    const startList = this.scenes.filter(item => item.isStartGame)

    if (startList.length == 0) {
      return {
        isChecking: false,
        message: '???? ???????????? ?????????????????? ??????????'
      }
    }

    if (startList.length > 1) {
      return {
        isChecking: false,
        message: '???????????? ???????? ???????????? ???????? ?????????? ?????? ????????????'
      }
    }

    return {
      isChecking: true, message: ''
    }
  }


  async saveGame() {

    const isCheckingSceneStart = this.isCheckingSceneStart()
    if (!isCheckingSceneStart.isChecking) {
      this.showMessage(isCheckingSceneStart.message)
      return
    }

    const dialogSave = this.dialog.open(MessageDialogComponent, {
      data: '????????????????????...'
    });

    this.game.scenes = this.scenes;
    this.game.players = this.players;

    this.game.name = this.form.get('name').value;
    this.game.description = this.form.get('description').value;

    try {

      await this.firestoreServiceService.saveGame(this.game);

      dialogSave.close();

    } catch (error) {

      this.showMessage('?????? ?????????????????????? ?????????????????? ????????????' + error);

    }

    await this.getGameData();
  }

  async runGame() {

    const isCheckingSceneStart = this.isCheckingSceneStart()
    if (!isCheckingSceneStart.isChecking) {
      this.showMessage(isCheckingSceneStart.message)
      return
    }

    this.showMessage('????????????????')

    await this.runGameService.saveNewGame(this.game)

    const startScene = this.game.scenes.find(item => {
      if (item.isStartGame) {
        return item
      }
    })

    const savingGame = await this.runGameService.getGameById(this.game.id)

    await this.stateService.saveNewStateGameForScene(this.game.id, savingGame.scenesMap.get(startScene.id))

    const url = this.router.serializeUrl(
      this.router.createUrlTree(['run',  this.game.id])
    );

    window.open(url, '_blank');

    this.closeMessage()
  }

  async runGameDevelopMode() {

    const isCheckingSceneStart = this.isCheckingSceneStart()
    if (!isCheckingSceneStart.isChecking) {
      this.showMessage(isCheckingSceneStart.message)
      return
    }

    this.showMessage('????????????????')

    await this.runGameService.saveNewGame(this.game)

    const startScene = this.game.scenes.find(item => {
      if (item.isStartGame) {
        return item
      }
    })

    const savingGame = await this.runGameService.getGameById(this.game.id)

    await this.stateService.saveNewStateGameForScene(this.game.id, savingGame.scenesMap.get(startScene.id))

    const url = this.router.serializeUrl(
      this.router.createUrlTree(['run',  this.game.id, {
        isDevelopMode: 'true',
      } ])
    );

    window.open(url, '_blank');

    this.closeMessage()
  }

  async runGameByScene(scene: SceneEditScene) {

    const isCheckingSceneStart = this.isCheckingSceneStart()
    if (!isCheckingSceneStart.isChecking) {
      this.showMessage(isCheckingSceneStart.message)
      return
    }

    this.showMessage('????????????????')
    await this.saveDataGame(scene)

    const url = this.router.serializeUrl(
      this.router.createUrlTree(['run', this.game.id])
    );

    window.open(url, '_blank');
    this.closeMessage()
  }

  async runGameBySceneInDebugMode(scene: SceneEditScene) {

    const isCheckingSceneStart = this.isCheckingSceneStart()
    if (!isCheckingSceneStart.isChecking) {
      this.showMessage(isCheckingSceneStart.message)
      return
    }

    this.showMessage('????????????????')
    await this.saveDataGame(scene)

    const url = this.router.serializeUrl(
      this.router.createUrlTree(['run',  this.game.id, {
        isDevelopMode: 'true',
      } ])
    );

    window.open(url, '_blank');
    this.closeMessage()
  }

  private async saveDataGame(scene: SceneEditScene) {
    await this.runGameService.saveNewGame(this.game)

    const savingGame = await this.runGameService.getGameById(this.game.id)

    await this.stateService.saveNewStateGameForScene(this.game.id, savingGame.scenesMap.get(scene.id))
  }

  private showMessage(message: string) {
    this.dialog.open(MessageDialogComponent, {
      data: message
    });
  }

  closeMessage() {
    this.dialog.closeAll()
  }

  /**
   * ?????????????? ?????????? ??????????
   */
  addNewScene(param: 'top' | 'bottom') {

    const scene = new SceneEditScene();
    scene.id = this.fireStore.createId();
    scene.text = '?????????? ??????????';
    scene.title = '?????????? ????????????????';
    scene.color = '#7B68EE';
    scene.imageFileId = ''
    scene.videoFileId = ''
    scene.coordinate = new Coordinate();
    scene.coordinate.y = param === 'top' ? 0 : this.canvas.nativeElement.height - 350;
    scene.coordinate.x = 0;
    scene.imageFile = '/assets/http_scene.jpg';

    const answers1 = new Answer(this.fireStore.createId(), 'a', 0, scene);
    const answers2 = new Answer(this.fireStore.createId(), '??', 1, scene);
    const answers3 = new Answer(this.fireStore.createId(), '??', 2, scene);

    scene.answers = [answers1, answers2, answers3];

    this.scenes.push(scene);

    this.renderLine();
  }

  addPanorama(param: 'top' | 'bottom') {

    const panorama = new PanoramaEditScene()
    panorama.id = this.fireStore.createId();
    panorama.text = '?????????? ??????????';
    panorama.title = '?????????? ????????????????';
    panorama.color = '#7B68EE';
    panorama.imageFileId = ''
    panorama.coordinate = new Coordinate();
    panorama.coordinate.y = param === 'top' ? 0 : this.canvas.nativeElement.height - 350;
    panorama.coordinate.x = 0;
    panorama.imageFile = '/assets/http_scene.jpg';
    panorama.isTimer = false
    panorama.times = 0


    const answers1 = new Answer(this.fireStore.createId(), '?????????????????? ??????????', 0, panorama);

    panorama.answers = [answers1];

    this.scenes.push(panorama);

  }

  addPuzzle(param: 'top' | 'bottom') {
    const panorama = new PuzzleEditScene()
    panorama.id = this.fireStore.createId();
    panorama.text = '?????????? ??????????';
    panorama.title = '?????????? ????????????????';
    panorama.color = '#7B68EE';
    panorama.coordinate = new Coordinate();
    panorama.coordinate.y = param === 'top' ? 0 : this.canvas.nativeElement.height - 350;
    panorama.coordinate.x = 0;

    const answers1 = new Answer(this.fireStore.createId(), '?????????????????? ??????????', 0, panorama);

    panorama.answers = [answers1];

    this.scenes.push(panorama);
  }

  addMediaFile() {

    const dialogRef = this.dialog.open(SaveMediaFileDialogComponent, {
      data: {
        gameId: this.game.id
      }
    });

    dialogRef.afterClosed().subscribe(() => {
      console.log('closeDialog');
    });

  }

  deletedScene(scene: IBaseEditScene) {

    this.scenes.flatMap((item) => {
      return item.answers;
    }).filter((item) => {
      return item.sceneId == scene.id;
    }).forEach((item) => {
      item.sceneId = null;
    });

    const index = this.scenes.indexOf(scene);

    this.scenes.splice(index, 1);

    this.clearCanvas();
    this.renderLine();
  }

  private clearCanvas() {
    this.ctx.clearRect(0, 0, this.canvas.nativeElement.width, this.canvas.nativeElement.height);
  }

  /**
   * ???????????????????????? z ???????????????? ??????????
   * @param coordinateOne
   * @param coordinateTwo
   * @param color ???????? ??????????
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
   * ???????????? ??????????
   * @param coordinate
   * @param color ???????? ??????????
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
   * ?????????????????????????? ???????? ??????????
   * @param coordinateOne
   * @param coordinateTwo
   * @param color ???????? ??????????
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
   * ?????????? ???????????? ?? ??????????
   * @param scene
   */
  selectAnswerScene(scene: Answer) {
    const isChangeSelectMode = this.changeSelectModeEvent$.getValue();

    if (isChangeSelectMode) {
      this.selectSceneForChangeSelectMode = scene;
    }

  }

  /**
   * ?????????? ?????????? ?????? ????????????????????
   * @param scene
   */
  selectScene(scene: IBaseEditScene) {

    const isChangeSelectMode = this.changeSelectModeEvent$.getValue();

    if (isChangeSelectMode) {
      this.selectSceneForChangeSelectMode.sceneId = scene.id;
      this.clearCanvas();
      this.renderLine();
    }

    this.changeSelectModeEvent$.next(false);
  }

  /**
   * ???????? ???? ??????????????
   */
  onClickWorkingSpace() {
    this.changeSelectModeEvent$.next(false);
  }

  increaseWorkingSpace() {
    this.canvas.nativeElement.height += 500;

    this.clearCanvas();
    this.renderLine();
  }

  // ?????????????????? ??????????
  enlargeCanvas() {
    this.canvas.nativeElement.width += 500;
    this.working.nativeElement.style.width = `${this.canvas.nativeElement.width}px`
    this.editor.nativeElement.style.width = `${this.canvas.nativeElement.width}px`
  }

  getWidthScreen(): number {
    return window.screen.width;
  }

}
