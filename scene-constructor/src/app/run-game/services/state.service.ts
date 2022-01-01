import { Injectable } from '@angular/core';
import {FileService} from "../../core/services/file.service";
import {Observable} from "rxjs";
import {StateGame, StateGameAnswer} from "../models/other-models/state-game.model";
import {first, map} from "rxjs/operators";
import {Player} from "../models/other-models/player.model";
import {AnswerRunGame} from "../models/other-models/answer.model";
import {Game as EditGame} from "../../editor/models/game.model";
import {TypeScene} from "../../core/models/type-scene.enum";
import {IBaseEditScene} from "../../editor/models/base-edit-scene.model";
import {IBaseSceneRunGame} from "../models/other-models/base-scene-run-game.model";
import {AngularFirestore} from "@angular/fire/compat/firestore";
import {AngularFireStorage} from "@angular/fire/compat/storage";
import {TypeControls} from "../models/other-models/type-controls.enum";

export interface StateGameFirebase {
  id: string,
  currentSceneId: string
  //typeScene: TypeScene
}


@Injectable({
  providedIn: 'root'
})
export class StateService {

  private readonly runGameCollection = 'RunGameCollection'
  private readonly stateGameAnswerCollection = 'stateGameAnswerCollection'
  private readonly stateGame = 'StateGame'

  constructor(
    private fireStore: AngularFirestore,
    private storage: AngularFireStorage,
    private fileService: FileService) {
  }

  getStateGame(gameId: string): Observable<StateGame> {
    return this.fireStore.doc<StateGame>(`${this.runGameCollection}/${gameId}/${this.stateGame}/${gameId}`)
      .snapshotChanges()
      .pipe(
        map((doc) => {
          const stateGame = doc.payload.data() as StateGame;
          const newStateGame = new StateGame(doc.payload.id, stateGame.currentSceneId)
          newStateGame.answer = stateGame.answer
          newStateGame.typeControls = stateGame.typeControls
          return newStateGame;
        })
      )
  }

  // getStateAnswerGame(gameId: string): Observable<StateGameAnswer> {
  //   return this.fireStore.doc<StateGameAnswer>(`${this.stateGameAnswerCollection}/${gameId}/${this.stateGame}/${gameId}`)
  //     .snapshotChanges()
  //     .pipe(
  //       map((doc) => {
  //         const stateGame = doc.payload.data() as StateGameAnswer;
  //         const newStateGame = new StateGameAnswer(doc.payload.id)
  //         newStateGame.answer = stateGame.answer
  //         return newStateGame;
  //       })
  //     )
  // }

  async saveNewStateGame(game: EditGame) {

    const startScene = game.scenes.find(item => {
      if (item.isStartGame) {
        return item
      }
    })

    if (!startScene) {
      throw new Error('Стартовая сцена не найдена')
    }

    // const statePlayer = [...game.players.map(item => {
    //   return {id: item.id, value: ''}
    // })]

    try {

      await this.fireStore.collection<any>(`${this.runGameCollection}/${game.id}/${this.stateGame}`)
        .doc(game.id)
        .set({
          currentSceneId: startScene.id,
          //answer: statePlayer
        }  as StateGameFirebase)

    } catch (error) {
      console.error('При сохранении данных состояния игры произошла ошибка', error);
      throw error;
    }
  }

  /**
   *  Сохранение выбранного ответа у сцены
   * @param stateGameId
   * @param player
   * @param selectAnswer
   */
  async saveSelectAnswerStateGame(stateGameId: string, player: Player, selectAnswer: AnswerRunGame) {

    const state = await this.getStateGame(stateGameId)
      .pipe(first()).toPromise()

    if(!state.answer) {
      state.answer = []
    }

    state.answer.push({playerId: player.id, answerId: selectAnswer.id})

    await this.fireStore.collection<any>(`${this.runGameCollection}/${stateGameId}/${this.stateGame}`)
      .doc(stateGameId)
      .update({...state})
  }

  async saveSelectTypeControls(stateGameId: string, typeControls: TypeControls) {
    const state = await this.getStateGame(stateGameId)
      .pipe(first()).toPromise()
    state.typeControls = typeControls

    if(!state.answer) {
      state.answer = []
    }

    await this.fireStore.collection<any>(`${this.runGameCollection}/${stateGameId}/${this.stateGame}`)
      .doc(stateGameId)
      .update({...state})
  }

  async nextDataStateGame(stateGameId: string, currentScene: IBaseSceneRunGame) {

    const state = await this.getStateGame(stateGameId)
     .pipe(first()).toPromise()

    state.currentSceneId = currentScene.id
    state.answer = []

    await this.fireStore.collection<any>(`${this.runGameCollection}/${stateGameId}/${this.stateGame}`)
      .doc(stateGameId)
      .set({...state})
  }

  async resetDataStateGame(stateGameId: string, currentScene: IBaseEditScene) {
    //const state = await this.getStateGame(stateGameId)
    //  .pipe(first()).toPromise()

    // const statePlayer = [...state.answer.map(item => {
    //   return item
    // })]

    // const answer = statePlayer.map((item) => {
    //   item.value = ''
    //   return item
    // })

    //state.answer = answer
    // const answer = currentScene.players.map(item => {
    //   return {id: item, value: ''}
    // })

    //console.log('currentSceneId:::::::::', currentScene.id);

    // const stateGameFirebase = {
    //   currentSceneId: currentScene.id,
    //   a
    // }as StateGameFirebase

    await this.fireStore.collection<any>(`${this.runGameCollection}/${stateGameId}/${this.stateGame}`)
      .doc(stateGameId)
      .set({currentSceneId: currentScene.id} as StateGameFirebase)
  }
}
