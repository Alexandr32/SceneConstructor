import { Injectable } from '@angular/core';
import { RunGameService } from "./run-game.service";
import {BehaviorSubject, Observable} from "rxjs";
import { RunGame } from "../models/other-models/run-game.model";
import { StateGame } from "../models/other-models/state-game.model";
import { Player } from "../models/other-models/player.model";
import { IBaseSceneRunGame } from "../models/other-models/base-scene-run-game.model";
import { StateService } from "./state.service";
import { TypeControls } from "../models/other-models/type-controls.enum";
import { AnswerRunGame } from "../models/other-models/answer.model";
import { TypeSceneEnum } from "../../core/models/type-scene.enum";
import { PuzzleRunGame } from "../models/other-models/scenes.models";
import { ItemPartsPuzzleImage } from "../../core/models/item-parts-puzzle-image.model";
import { PanoramaRunGame } from '../models/other-models/panorama-run-game';
import { SceneRunGame } from '../models/other-models/scene-run-game';
import {first} from "rxjs/operators";

@Injectable({
  providedIn: 'root'
})
export class StoreRunGameService {

  #stateGame$: BehaviorSubject<StateGame | undefined> = new BehaviorSubject<StateGame | undefined>(null)
  get stateGame$(): Observable<StateGame> {
    return this.#stateGame$
  }

  #runGame$: BehaviorSubject<RunGame> = new BehaviorSubject<RunGame>(null)
  get runGame$(): Observable<RunGame> {
    return this.#runGame$
  }

  #players$: BehaviorSubject<Player[]> = new BehaviorSubject<Player[]>([])
  get players$(): Observable<Player[]> {
    return this.#players$
  }

  #currentScene$: BehaviorSubject<IBaseSceneRunGame> = new BehaviorSubject<IBaseSceneRunGame>(null)
  get currentScene$(): Observable<IBaseSceneRunGame> {
    return this.#currentScene$
  }

  #loadingGame$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(true)
  get loadingGame$(): Observable<boolean> {
    return this.#loadingGame$
  }

  private stateGameId: string

  constructor(private runGameService: RunGameService, private stateService: StateService) { }

  async initGame(gameId: string) {

    this.stateGameId = gameId

    const runGame = await this.runGameService.getGameById(gameId)
    this.#runGame$.next(runGame)
    this.#players$.next(runGame.players)
    const state = await this.stateService.getStateGame(gameId)
      .pipe(first())
      .toPromise()
    const startScene = runGame.scenesMap.get(state.currentSceneId)
    this.#loadingGame$.next(false)
    this.#currentScene$.next(startScene)
    this.#stateGame$.next(state)

    this.stateService.getStateGame(gameId).subscribe(x => {

      this.#stateGame$.next(x)

      const currentScene = this.#currentScene$.getValue()

      if (currentScene.typesScene === TypeSceneEnum.Answer ||
        currentScene.typesScene === TypeSceneEnum.Panorama) {
        this.switchingAnswerScene(x, currentScene as SceneRunGame | PanoramaRunGame)
      }

      if (currentScene.typesScene === TypeSceneEnum.Puzzle) {
        this.switchingPuzzleScene(x, currentScene as PuzzleRunGame)
      }

    })
  }

  private switchingPuzzleScene(stateGame: StateGame, sceneRunGame: PuzzleRunGame) {
    if (!sceneRunGame) {
      return
    }

    const partsPuzzleId = stateGame.scenePartsPuzzleImages
      .filter(f => f.value)
      .map(m => m.value.id)

    if (partsPuzzleId.length !== 9) {
      return
    }

    let isError: boolean = false

    partsPuzzleId.forEach((value: number, index: number) => {
      const idx = index + 1
      if (value !== idx) {
        isError = true
      }
    })

    if (isError) {
      return
    }

    const findAnswer = sceneRunGame.answers[0]

    if (findAnswer) {
      this.selectedScene(findAnswer.sceneId)
    }

  }

  private switchingAnswerScene(stateGame: StateGame, sceneRunGame: SceneRunGame | PanoramaRunGame) {

    if (!sceneRunGame) {
      return
    }

    if (stateGame.answer.length !== sceneRunGame.players.length) {
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

    const findAnswer = sceneRunGame.answers.find(x => x.id === maxValue.key)

    if (findAnswer) {
      this.selectedScene(findAnswer.sceneId)
    }

  }

  async saveSelectTypeControls(typeControls: TypeControls) {

    const stateGame = this.#stateGame$.value

    if (stateGame) {
      stateGame.typeControls = typeControls
      if (!stateGame.answer) {
        stateGame.answer = []
      }
      return this.stateService.updateState(this.stateGameId, { ...stateGame })
    }
  }

  /**
   *  Сохранение выбранного ответа у сцены
   * @param stateGameId
   * @param player
   * @param selectAnswer
   */
  async saveSelectAnswerStateGame(player: Player, selectAnswer: AnswerRunGame) {

    const stateGame = this.#stateGame$.value

    if (!stateGame.typeControls) {
      stateGame.typeControls = TypeControls.center
    }

    if (stateGame) {
      if (!stateGame.answer) {
        stateGame.answer = []
      }

      stateGame.answer.push({ playerId: player.id, answerId: selectAnswer.id })

      return this.stateService.updateState(this.stateGameId, { ...stateGame })
    }
  }

  async selectPuzzleImage(part: ItemPartsPuzzleImage) {

    const stateGame = this.#stateGame$.value

    if (stateGame) {


      const findOldItem: ItemPartsPuzzleImage = stateGame.scenePartsPuzzleImages.find(i => i?.value?.id === part?.value?.id)
      if (findOldItem) {
        findOldItem.value = null
      }

      const findItem: ItemPartsPuzzleImage = stateGame.scenePartsPuzzleImages.find(i => i.number === part.number)
      findItem.value = part.value
      stateGame.answer = []
      stateGame.typeControls = TypeControls.center

      return this.stateService.updateState(this.stateGameId, { ...stateGame })
    }
  }

  async selectedScene(selectSceneId: string) {

    const runGame = this.#runGame$.value

    if (!runGame) {
      return
    }

    const scene = runGame.scenesMap.get(selectSceneId)
    this.#currentScene$.next(scene)

    const stateGame = this.#stateGame$.value
    stateGame.currentSceneId = selectSceneId
    stateGame.scenePartsPuzzleImages = this.getClearScenePartsPuzzleImages()
    stateGame.answer = []
    stateGame.typeControls = TypeControls.center
    try {
      await this.stateService.updateState(this.stateGameId, { ...stateGame })
    } catch (e) {
      console.error(e)
    }
  }

  private getClearScenePartsPuzzleImages(): ItemPartsPuzzleImage[] {
    return [
      { number: 1, value: null },
      { number: 2, value: null },
      { number: 3, value: null },
      { number: 4, value: null },
      { number: 5, value: null },
      { number: 6, value: null },
      { number: 7, value: null },
      { number: 8, value: null },
      { number: 9, value: null },
    ]
  }
}
