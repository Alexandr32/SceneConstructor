import {
  Component,
  Input,
  OnDestroy,
  OnInit,
  ViewChild
} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {MatDialog} from '@angular/material/dialog';
import {RunGameService} from 'src/app/run-game/services/run-game.service';
import {combineLatest, Observable} from 'rxjs';
import {RunGame} from '../models/other-models/run-game.model';
import {IBaseSceneRunGame} from '../models/other-models/base-scene-run-game.model';
import {StateService} from "../services/state.service";
import {RefDirective} from "../../core/directive/ref.directive";
import {StateGame} from "../models/other-models/state-game.model";
import {flatMap, map} from "rxjs/operators";
import {Player} from "../models/other-models/player.model";
import {StateRunGameService} from "../services/state-run-game.service";

@Component({
  selector: 'app-run-game',
  templateUrl: './run-game.component.html',
  styleUrls: ['./run-game.component.scss']
})
export class RunGameComponent implements OnInit, OnDestroy {

  players: Player[]

  runGame$: Observable<RunGame>

  // @Input()
  // runGame$: Observable<RunGame>

  @ViewChild(RefDirective) refDirective: RefDirective | undefined;

 // private scenesMap: Map<string, IBaseSceneRunGame> = new Map<string, IBaseSceneRunGame>()

  selectScene$: Observable<IBaseSceneRunGame>

  //private gameId: string

  state$: Observable<StateGame>

  constructor(private route: ActivatedRoute,
              private dialog: MatDialog,
              private stateRunGameService: StateRunGameService,
              private runGameService: RunGameService,
              private stateService: StateService) {

  }

  ngOnDestroy(): void {

    // this.scenesListComponent.selectedScene.subscribe(value => {
    //   this.selectScene = this.scenesMap.get(value.id)
    // })

    //console.log('ngOnDestroy');
  }

  async ngOnInit() {

    this.selectScene$ = this.stateRunGameService.currentScene$
    this.runGame$ = this.stateRunGameService.runGame$
    this.state$ = this.stateRunGameService.stateGame$

    // ЗАФИГАЧИТЬ СЕРВИС С КАКИМ ТО СОСТОЯНИЕМ ИЛИ КАК МИНИМУМ ДЛЯ ПЕРЕКЛЮЧЕНИЯ СЦЕНЫ

    // this.runGame$
    //   .subscribe(game => {
    //   this.gameId = game.id
    //   this.scenesMap = game.scenesMap
    //   this.selectScene = game.scenes.find(i => i.isStartGame)
    // })

    // this.state$ = this.runGame$.pipe(
    //   flatMap(game => {
    //     this.gameId = game.id
    //     this.scenesMap = game.scenesMap
    //     this.selectScene = game.scenes.find(i => i.isStartGame)
    //     return this.stateService.getStateGame(game.id)
    //   })
    // )
    //
    // this.state$.subscribe(state => {
    //     this.selectScene = this.scenesMap.get(state.currentSceneId)
    // })

    //const state$ = this.stateService.getStateGame(this.gameId)

    // combineLatest(this.runGame$, state$, (runGame, state) => ({runGame, state}))
    //   .pipe(
    //     map(pair => {
    //       this.selectScene = this.scenesMap.get(pair.state.currentSceneId)
    //
    //       return
    //
    //       // this.name = pair.name;
    //       // this.document = pair.document;
    //       // this.showForm();
    //     })
    //   )

    // this.stateService.getStateGame(this.gameId).subscribe(state => {
    //   this.selectScene = this.scenesMap.get(state.currentSceneId)
    // })

    // this.route.data.subscribe(data => {
    //   this.runGame = data.runGame
    //   console.log('runGame:', this.runGame);
    // })

    /*this.gameId = this.route.snapshot.params.gameId;

    const game = await (await this.runGameService.getGameById(this.gameId)).toPromise()

    for (const scene of game.scenes) {

      if (scene.imageFileId) {
        try {
          scene.imageFile = await this.firestoreService
            .getUrl(game.id, scene.imageFileId, TypeFile.SceneImages).toPromise()
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

          scene.videoFile = await this.firestoreService
            .getUrl(game.id, scene.videoFileId, TypeFile.SceneVideos).toPromise()

        } catch (error) {
          scene.videoFile = '';
          console.error(error);
        }
      } else {
        scene.videoFile = '';
      }

      this.scenes.set(scene.id, scene)
    }

    this.players = game.players.map(item => {
      return item.id
    })

    this.videoSources = []

    const stateGame = await this.runGameService.getStateGame(this.gameId)
      .pipe(first())
      .toPromise()

    this.selectScene = this.scenes.get(stateGame.currentScene)
    this.videoSources = []
    this.videoSources.push(this.selectScene.videoFile)

    this.subscribeStateGame()

    this.playSound()*/
  }

  private delay = (time: number): Promise<any> => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        console.log('setTimeout');

        resolve('')
      }, time);
    })
  }

  private playSound() {
    var audio = new Audio('../assets/audio_file.mp3');
    audio.play();
  }

  selectedScene(scene: IBaseSceneRunGame) {
   this.stateRunGameService.selectedScene(scene.id)
  }
}
