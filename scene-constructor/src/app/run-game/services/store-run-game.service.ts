import {Injectable} from '@angular/core';
import {RunGameService} from "./run-game.service";
import {BehaviorSubject} from "rxjs";
import {RunGame} from "../models/other-models/run-game.model";
import {StateGame} from "../models/other-models/state-game.model";
import {Player} from "../models/other-models/player.model";
import {IBaseSceneRunGame} from "../models/other-models/base-scene-run-game.model";
import {StateService} from "./state.service";
import {TypeControls} from "../models/other-models/type-controls.enum";
import {AnswerRunGame} from "../models/other-models/answer.model";

@Injectable({
  providedIn: 'root'
})
export class StoreRunGameService {

  stateGame$: BehaviorSubject<StateGame | undefined> = new BehaviorSubject<StateGame | undefined>(null)
  runGame$: BehaviorSubject<RunGame> = new BehaviorSubject<RunGame>(null)
  players$: BehaviorSubject<Player[]> = new BehaviorSubject<Player[]>([])
  currentScene$: BehaviorSubject<IBaseSceneRunGame> = new BehaviorSubject<IBaseSceneRunGame>(null)

  private stateGameId: string

  constructor(private runGameService: RunGameService, private stateService: StateService) { }

  async initGame(gameId: string) {

    this.stateGameId = gameId

    const runGame = await this.runGameService.getGameById(gameId)
    this.runGame$.next(runGame)
    this.players$.next(runGame.players)
    const startScene = runGame.scenes.find(x => x.isStartGame)
    this.currentScene$.next(startScene)
    const stateGame = new StateGame('', startScene.id)
    this.stateGame$.next(stateGame)

    this.stateService.getStateGame(gameId).subscribe(x => {
      this.stateGame$.next(x)
    })
  }

  async saveSelectTypeControls(typeControls: TypeControls) {

    const stateGame = this.stateGame$.value

    if(stateGame) {
      stateGame.typeControls = typeControls
      if (!stateGame.answer) {
        stateGame.answer = []
      }
      return this.stateService.updateState(this.stateGameId, {...stateGame})
    }
  }

  /**
   *  Сохранение выбранного ответа у сцены
   * @param stateGameId
   * @param player
   * @param selectAnswer
   */
  async saveSelectAnswerStateGame(player: Player, selectAnswer: AnswerRunGame) {

    const stateGame = this.stateGame$.value

    if(!stateGame.typeControls) {
      stateGame.typeControls = TypeControls.center
    }

    if(stateGame) {
      if (!stateGame.answer) {
        stateGame.answer = []
      }

      stateGame.answer.push({playerId: player.id, answerId: selectAnswer.id})

      return this.stateService.updateState(this.stateGameId, {...stateGame})
    }
  }

  async nextDataStateGame(currentScene: IBaseSceneRunGame) {
    const stateGame = this.stateGame$.value
    if(stateGame) {
      stateGame.currentSceneId = currentScene.id
      stateGame.answer = []
      return this.stateService.setState(this.stateGameId, {...stateGame})
    }
  }

  selectedScene(selectSceneId: string) {
    const runGame = this.runGame$.value
    if(runGame) {
      const scene = runGame.scenesMap.get(selectSceneId)
      this.currentScene$.next(scene)
    }
  }
}
