import {Component, ComponentFactoryResolver, Input, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {MatDialog} from '@angular/material/dialog';
import {RunGameService} from 'src/app/run-game/services/run-game.service';
import {FirestoreService} from 'src/app/editor/services/firestore.service';
import {Observable} from 'rxjs';
import {RunGame} from '../models/other-models/run-game.model';
import {IBaseSceneRunGame} from '../models/other-models/base-scene-run-game.model';
import {StateService} from "../services/state.service";
import {RefDirective} from "../../core/directive/ref.directive";
import {TypeSceneEnum} from "../../core/models/type-scene.enum";
import {AnswerSceneComponentComponent} from "../answer-scene-component/answer-scene-component.component";
import {PanoramaSceneComponentComponent} from "../panorama-scene-component/panorama-scene-component.component";
import {PuzzleSceneComponentComponent} from "../puzzle-scene-component/puzzle-scene-component.component";

@Component({
  selector: 'app-run-game',
  templateUrl: './run-game.component.html',
  styleUrls: ['./run-game.component.scss']
})
export class RunGameComponent implements OnInit, OnDestroy {

  @Input()
  runGame$: Observable<RunGame>

  @ViewChild(RefDirective) refDirective: RefDirective | undefined;

  //title: string

  private scenesMap: Map<string, IBaseSceneRunGame> = new Map<string, IBaseSceneRunGame>()

  selectScene: IBaseSceneRunGame

  //url = 'assets/scene.jpg'

  //isShowListPlayers: boolean = false

  //selectScene: Scene

  videoSources: string[] = [];
  //players: string[] = []

  private gameId: string

  //answers$: BehaviorSubject<{ id: string, value: string }[]> = new BehaviorSubject([])

  constructor(private route: ActivatedRoute,
              private dialog: MatDialog,
              private runGameService: RunGameService,
              private stateService: StateService,
              private firestoreService: FirestoreService,
              private componentFactoryResolver: ComponentFactoryResolver) {

  }

  ngOnDestroy(): void {

    // this.scenesListComponent.selectedScene.subscribe(value => {
    //   this.selectScene = this.scenesMap.get(value.id)
    // })

    //console.log('ngOnDestroy');
  }

  //static count = 0

  async ngOnInit() {

    this.runGame$.subscribe(game => {
      this.gameId = game.id
      this.scenesMap = game.scenesMap

      console.log(this.scenesMap)
    })

    this.stateService.getStateGame(this.gameId).subscribe(state => {

      this.selectScene = this.scenesMap.get(state.currentSceneId)
      this.setScene()
      console.log('getStateGame:', this.selectScene)
    })

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

  private subscribeStateGame() {
    /*this.runGameService.getStateGame(this.gameId)
      .subscribe(async (stateGame) => {

        console.log('stateGame::::', stateGame);

        this.answers$.next(stateGame.answer)

        const isEmpty = stateGame.answer.map(item => item.value).includes('')

        if (isEmpty) {
          return
        }

        // Ищем выбранные ответы
        const dictionary = new Map<string, number>();
        stateGame.answer
          .map(item => {
            return item.value
          })
          .forEach((item) => {
            let count: number = dictionary.get(item)
            if (count) {
              count++
              dictionary.set(item, count)
            } else {
              dictionary.set(item, 0)
            }
          });

        if (dictionary.size === 0) {
          return
        }

        const selectAnswerId = [...dictionary.entries()].reduce((a, e) => e[1] > a[1] ? e : a)

        const selectAnswer = this.selectScene.answers.find((item) => item.id === selectAnswerId[0])

        if (!selectAnswer) {
          return
        }

        // Есть выбранная сцена
        if (selectAnswer.sceneId) {
          await this.delay(500)
          this.selectScene = this.scenes.get(selectAnswer.sceneId)
        }

        this.videoSources = []
        this.videoSources.push(this.selectScene.videoFile)

        // Обнуляем данные
        //this.runGameService.resetDataStateGame(this.gameId, this.selectScene)

      })*/
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
    console.log('selectedScene')
    this.selectScene = this.scenesMap.get(scene.id)
    this.setScene()
  }

  private setScene() {

    if (this.selectScene.typesScene == TypeSceneEnum.Answer) {
      this.refDirective.containerRef?.clear()
      const answerSceneComponent = this.componentFactoryResolver.resolveComponentFactory(AnswerSceneComponentComponent)
      const component = this.refDirective.containerRef.createComponent(answerSceneComponent)
      component.instance.scene = this.selectScene
    }

    if (this.selectScene.typesScene == TypeSceneEnum.Panorama) {
      this.refDirective.containerRef?.clear()
      const panoramaSceneComponentComponent = this.componentFactoryResolver.resolveComponentFactory(PanoramaSceneComponentComponent)
      const component =this.refDirective.containerRef.createComponent(panoramaSceneComponentComponent)
      component.instance.scene = this.selectScene
    }

    if (this.selectScene.typesScene == TypeSceneEnum.Puzzle) {
      this.refDirective.containerRef?.clear()
      const puzzleSceneComponentComponent = this.componentFactoryResolver.resolveComponentFactory(PuzzleSceneComponentComponent)
      const component =this.refDirective.containerRef.createComponent(puzzleSceneComponentComponent)
      component.instance.scene = this.selectScene
    }
  }
}
