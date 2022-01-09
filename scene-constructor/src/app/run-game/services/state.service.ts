import { Injectable } from '@angular/core';
import { FileService } from "../../core/services/file.service";
import { BehaviorSubject, Observable, Subject, timer } from "rxjs";
import { StateGame, StateGameAnswer } from "../models/other-models/state-game.model";
import { debounceTime, distinct, distinctUntilChanged, filter, first, last, map, switchMap, take } from "rxjs/operators";
import { Player } from "../models/other-models/player.model";
import { AnswerRunGame } from "../models/other-models/answer.model";
import { Game as EditGame } from "../../editor/models/game.model";
import { TypeScene } from "../../core/models/type-scene.enum";
import { IBaseEditScene } from "../../editor/models/base-edit-scene.model";
import { IBaseSceneRunGame } from "../models/other-models/base-scene-run-game.model";
import { AngularFirestore } from "@angular/fire/compat/firestore";
import { AngularFireStorage } from "@angular/fire/compat/storage";
import { TypeControls } from "../models/other-models/type-controls.enum";
import { ItemPartsPuzzleImage } from 'src/app/core/models/item-parts-puzzle-image.model';


@Injectable()
export class StateService {

  private readonly runGameCollection = 'RunGameCollection'
  private readonly stateGameAnswerCollection = 'stateGameAnswerCollection'
  private readonly stateGameKey = 'StateGame'

  private isFirstTap = false

  constructor(
    private fireStore: AngularFirestore) {
  }

  getStateGame(gameId: string): Observable<StateGame> {

    return this.fireStore.doc<StateGame>(`${this.runGameCollection}/${gameId}/${this.stateGameKey}/${gameId}`)
      .snapshotChanges()
      .pipe(
        map((doc) => {

          const stateGame = doc.payload.data() as StateGame;
          const newStateGame = new StateGame(doc.payload.id, stateGame.currentSceneId)
          newStateGame.answer = stateGame.answer
          newStateGame.typeControls = stateGame.typeControls
          newStateGame.scenePartsPuzzleImages = stateGame.scenePartsPuzzleImages
          return { state: newStateGame, hasPendingWrites: doc.payload.metadata.hasPendingWrites };
        }),
        // ПРОВЕРИТЬ НА ЗАДВОЕНИЕ
        // filter((doc) => {
        //   if(!this.isFirstTap) {
        //     this.isFirstTap = true
        //     return true
        //   }

        //   return doc.hasPendingWrites
        // }),
        map(doc => doc.state)
      )
  }

  async saveNewStateGame(game: EditGame) {

    console.log('saveNewStateGame')

    const startScene = game.scenes.find(item => {
      if (item.isStartGame) {
        return item
      }
    })

    if (!startScene) {
      throw new Error('Стартовая сцена не найдена')
    }

    try {

      await this.fireStore.collection<any>(`${this.runGameCollection}/${game.id}/${this.stateGameKey}`)
        .doc(game.id)
        .set({
          currentSceneId: startScene.id,
          answer: [],
          typeControls: TypeControls.center,
          scenePartsPuzzleImages: this.getClearScenePartsPuzzleImages()
        })

    } catch (error) {
      console.error('При сохранении данных состояния игры произошла ошибка', error);
      throw error;
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


  updateState(stateGameId: string, stateGame: StateGame) {
    return this.fireStore.collection<any>(`${this.runGameCollection}/${stateGameId}/${this.stateGameKey}`)
      .doc(stateGameId)
      .update(stateGame)
  }

  async setState(stateGameId: string, stateGame: StateGame) {
    return this.fireStore.collection<any>(`${this.runGameCollection}/${stateGameId}/${this.stateGameKey}`)
      .doc(stateGameId)
      .set(stateGame)
  }

  // async nextDataStateGame(stateGameId: string, currentScene: IBaseSceneRunGame) {
  //
  //   debugger
  //
  //   const state = this.stateGame
  //
  //   state.currentSceneId = currentScene.id
  //   state.answer = []
  //
  //   await this.fireStore.collection<any>(`${this.runGameCollection}/${stateGameId}/${this.stateGameKey}`)
  //     .doc(stateGameId)
  //     .set({...state})
  // }

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

    await this.fireStore.collection<any>(`${this.runGameCollection}/${stateGameId}/${this.stateGameKey}`)
      .doc(stateGameId)
      .set({ currentSceneId: currentScene.id })
  }
}
