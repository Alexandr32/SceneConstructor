import { Injectable } from '@angular/core';
import { Observable } from "rxjs";
import { StateGame} from "../models/other-models/state-game.model";
import { map } from "rxjs/operators";
import { Game as EditGame } from "../../editor/models/game.model";
import { AngularFirestore } from "@angular/fire/compat/firestore";
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

  async saveStateGameForScene(gameId: string, currentSceneId: string) {

    try {

      await this.fireStore.collection<any>(`${this.runGameCollection}/${gameId}/${this.stateGameKey}`)
        .doc(gameId)
        .set({
          currentSceneId: currentSceneId,
          answer: [],
          typeControls: TypeControls.center,
          scenePartsPuzzleImages: this.getClearScenePartsPuzzleImages()
        })

    } catch (error) {
      console.error('При сохранении данных состояния игры произошла ошибка', error);
      throw error;
    }
  }
}
