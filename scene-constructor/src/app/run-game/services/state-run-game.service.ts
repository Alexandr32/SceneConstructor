import {Injectable} from '@angular/core';
import {IBaseSceneRunGame} from "../models/other-models/base-scene-run-game.model";
import {RunGame} from "../models/other-models/run-game.model";
import {RunGameService} from "./run-game.service";
import {Observable, of, Subject} from "rxjs";
import {StateService} from "./state.service";
import {Player} from "../models/other-models/player.model";
import {TypeSceneEnum} from "../../core/models/type-scene.enum";
import {StateGame} from "../models/other-models/state-game.model";

@Injectable({
  providedIn: 'root'
})
export class StateRunGameService {

  private scenesMap: Map<string, IBaseSceneRunGame> = new Map<string, IBaseSceneRunGame>()
  private currentSceneId: string

  runGame$: Observable<RunGame>
  players$: Observable<Player[]>
  currentScene$: Subject<IBaseSceneRunGame> = new Subject<IBaseSceneRunGame>()

  constructor(private runGameService: RunGameService, private stateService: StateService) { }

  async getGameById(gameId: string): Promise<RunGame> {

    const runGame = await this.runGameService.getGameById(gameId)

    this.scenesMap = runGame.scenesMap

    this.players$ = of(runGame.players)
    this.runGame$ = of(runGame)

    this.subscribeState(gameId)
    return runGame
  }

  private subscribeState(gameId: string) {
    this.stateService.getStateGame(gameId).subscribe(x => {
      const currentScene =  this.scenesMap.get(x.currentSceneId)

      if(currentScene.id !== this.currentSceneId) {
        this.currentScene$.next(currentScene)
      }

      if(currentScene.typesScene === TypeSceneEnum.Answer) {
        this.selectAnswer(currentScene, x)
      }

    })
  }

  private selectAnswer(currentScene: IBaseSceneRunGame, stateGame: StateGame) {

    // Кто должен отвечать
    const players = currentScene.players

    // Кол-во ожидаемых ответов
    const countAnswer = players.length
    const currentAnswer = stateGame.answer

    if(!currentAnswer) {
      return;
    }

    if(countAnswer !== currentAnswer.length) {
      return
    }


    const map = new Map<string, number>()

    currentAnswer.forEach(item => {
      let hasAnswer = map.has(item.answerId)
      if(hasAnswer) {
        let value = map.get(item.answerId)
        map.set(item.answerId, value + 1)
      } else {
        map.set(item.answerId, 1)
      }
    })

    //  Выбранный ответ
    const selectAnswer =  [...map.entries()]?.reduce((a, e ) => e[1] > a[1] ? e : a)

    if(selectAnswer) {
      console.log('Ответы не найдены')
    }

    // Список доступных ответов
    const answers = currentScene.answers.find(a => a.id === selectAnswer[0])
    const scene = this.scenesMap.get(answers.sceneId)

    this.stateService.nextDataStateGame(stateGame.id, scene).then((error) => {
      console.error('При смене сцены произошла ошибка:', error)
    })
  }


  selectedScene(selectSceneId: string) {
    const scene = this.scenesMap.get(selectSceneId)
    this.currentSceneId = scene.id
    this.currentScene$.next(scene)
  }


}
