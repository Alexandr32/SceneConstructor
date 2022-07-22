import {Injectable} from '@angular/core';
import {RunGameService} from "./run-game.service";
import {BehaviorSubject, Observable} from "rxjs";
import {RunGame} from "../models/other-models/run-game.model";
import {StateGame} from "../models/other-models/state-game.model";
import {Player} from "../models/other-models/player.model";
import {StateService} from "./state.service";
import {TypeSceneEnum} from "../../core/models/type-scene.enum";

@Injectable({
  providedIn: 'root'
})
export class StoreRunGameService {

  #stateGame$: BehaviorSubject<StateGame | undefined> = new BehaviorSubject<StateGame | undefined>(null)
  get stateGame$(): Observable<StateGame> {
    return this.#stateGame$
  }

  private runGame: RunGame
  private currentSceneId: string

  #players$: BehaviorSubject<Player[]> = new BehaviorSubject<Player[]>([])
  get players$(): Observable<Player[]> {
    return this.#players$
  }

  #loadingGame$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(true)
  get loadingGame$(): Observable<boolean> {
    return this.#loadingGame$
  }

  private _stateGameId: string
  get stateGameId(): string {
    return this._stateGameId
  }

  constructor(private runGameService: RunGameService, private stateService: StateService) { }

  async initGame(gameId: string) {

    this._stateGameId = gameId
    this.runGame = await this.runGameService.getGameById(gameId)
    this.#players$.next(this.runGame.players)

    this.stateService.getStateGame(gameId).subscribe((state) => {

      const startScene = this.runGame.scenesMap.get(state.currentSceneId)
      state.currentScene = startScene as any

      this.currentSceneId = state.currentSceneId

      this.#stateGame$.next(state)
      this.#loadingGame$.next(false)

      //TODO: Здесь логика по обработке ответов

      if (state.currentScene.typesScene === TypeSceneEnum.Answer ||
        state.currentScene.typesScene === TypeSceneEnum.Panorama) {
        this.switchingAnswerScene(state)
      } else if(state.currentScene.typesScene === TypeSceneEnum.Puzzle) {
        this.switchingPuzzle(state)
      }
    })
  }

  // Переключение сцены с пазлом на следующую сцену
  switchingPuzzle(stateGame: StateGame) {

    // Большое условие что везде лежит только один элемент
    if(
      stateGame.imgInPlace1.length != 1 &&
      stateGame.imgInPlace2.length != 1 &&
      stateGame.imgInPlace3.length != 1 &&
      stateGame.imgInPlace4.length != 1 &&
      stateGame.imgInPlace5.length != 1 &&
      stateGame.imgInPlace6.length != 1 &&
      stateGame.imgInPlace7.length != 1 &&
      stateGame.imgInPlace8.length != 1 &&
      stateGame.imgInPlace9.length != 1
    ) {
      return
    }

    const item1 = stateGame.imgInPlace1.find(i => i.id === 1)
    if(!item1) {
      return;
    }
    const item2 = stateGame.imgInPlace2.find(i => i.id === 2)
    if(!item2) {
      return;
    }
    const item3 = stateGame.imgInPlace3.find(i => i.id === 3)
    if(!item3) {
      return;
    }
    const item4 = stateGame.imgInPlace4.find(i => i.id === 4)
    if(!item4) {
      return;
    }
    const item5 = stateGame.imgInPlace5.find(i => i.id === 5)
    if(!item5) {
      return;
    }
    const item6 = stateGame.imgInPlace6.find(i => i.id === 6)
    if(!item6) {
      return;
    }
    const item7 = stateGame.imgInPlace7.find(i => i.id === 7)
    if(!item7) {
      return;
    }
    const item8 = stateGame.imgInPlace8.find(i => i.id === 8)
    if(!item8) {
      return;
    }
    const item9 = stateGame.imgInPlace9.find(i => i.id === 9)
    if(!item9) {
      return;
    }

    const sceneId = stateGame.currentScene.answers[0].sceneId

    if (sceneId) {
      this.selectedScene(sceneId)
    }

  }

  // Переключение сцены которая зависит от ответов на следующие сцены
  private switchingAnswerScene(stateGame: StateGame) {


    if (stateGame.answer.length !== stateGame.currentScene.players.length) {
      return
    }

    // Ключ: answerId, Значение кол-во
    const map = new Map<string, number>()

    stateGame.answer.forEach(answer => {
      let value = map.get(answer.answerId)
      if (value) {
        value = value + 1
        map.set(answer.answerId, value)
      } else {
        map.set(answer.answerId, 1)
      }
    })

    let maxValue: {
      value: number,
      key: string
    } = {
      key: '',
      value: 0
    }

    map.forEach((value: number, key: string) => {

      if (value > maxValue.value) {
        maxValue = {
          key, value
        }
      }
    })

    const findAnswer = stateGame.currentScene.answers.find(x => x.id === maxValue.key)

    if (findAnswer) {
      this.selectedScene(findAnswer.sceneId)
    }

  }

  // Выбираем следующую сцену путем обновления состояния
  selectedScene(selectSceneId: string) {

    setTimeout(() => {
      const nextScene = this.runGame.scenesMap.get(selectSceneId)

      this.stateService.saveNewStateGameForScene(
        this.runGame.id,
        nextScene
      )
    }, 1000)

  }
}
