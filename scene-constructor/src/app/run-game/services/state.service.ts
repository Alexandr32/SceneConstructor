import {Injectable} from '@angular/core';
import {Observable} from "rxjs";
import {StateGame, StateGameFirebase, StateGameMapper} from "../models/other-models/state-game.model";
import {map} from "rxjs/operators";
import {AngularFirestore} from "@angular/fire/compat/firestore";
import {TypeControls} from "../models/other-models/type-controls.enum";
import {Player} from "../models/other-models/player.model";
import {AnswerRunGame} from "../models/other-models/answer.model";
import {IBaseSceneRunGame} from "../models/other-models/base-scene-run-game.model";
import {TypeSceneEnum} from "../../core/models/type-scene.enum";
import {PuzzleRunGame, SceneForPuzzleControlPlayerRunGame} from "../models/other-models/puzzle-run-game.models";
import {PartsPuzzleImage} from "../../core/models/parts-puzzle-image.model";


@Injectable()
export class StateService {

  private readonly runGameCollection = 'RunGameCollection'
  private readonly stateGameAnswerCollection = 'stateGameAnswerCollection'
  private readonly stateGameKey = 'StateGame'

  private currentStateGame: StateGame
  private gameId: string

  constructor(
    private fireStore: AngularFirestore) {
  }

  getStateGame(gameId: string): Observable<StateGame> {
    this.gameId = gameId

    return this.fireStore.doc<StateGameFirebase>(`${this.runGameCollection}/${gameId}/${this.stateGameKey}/${gameId}`)
      .snapshotChanges()
      .pipe(
        map((doc) => {

          const stateGameFB = doc.payload.data() as StateGameFirebase;

          if (this.currentStateGame) {

            const newState = StateGameMapper.toDTO(stateGameFB, doc.payload.id)
            this.currentStateGame = newState
            this.currentStateGame.currentSceneId = newState.currentSceneId
            this.currentStateGame.answer = newState.answer
            this.currentStateGame.typeControls = newState.typeControls

          } else {
            this.currentStateGame = StateGameMapper.toDTO(stateGameFB, doc.payload.id)
          }

          return {state: this.currentStateGame};
        }),

        map(doc => doc.state)
      )
  }

  // Создает новое состояние для конкретной сцены при запуске из экрана игры
  async saveNewStateGameForScene(gameId: string, scene: IBaseSceneRunGame) {

    try {

      const stateGame: StateGame = new StateGame(null, scene.id)
      stateGame.typeControls = TypeControls.center
      stateGame.answer = []

      if (scene.typesScene === TypeSceneEnum.Puzzle) {
        const puzzleRunGame = scene as PuzzleRunGame
        stateGame.imgInPlace1 = puzzleRunGame.imgInPlace1
        stateGame.imgInPlace2 = puzzleRunGame.imgInPlace2
        stateGame.imgInPlace3 = puzzleRunGame.imgInPlace3
        stateGame.imgInPlace4 = puzzleRunGame.imgInPlace4
        stateGame.imgInPlace5 = puzzleRunGame.imgInPlace5
        stateGame.imgInPlace6 = puzzleRunGame.imgInPlace6
        stateGame.imgInPlace7 = puzzleRunGame.imgInPlace7
        stateGame.imgInPlace8 = puzzleRunGame.imgInPlace8
        stateGame.imgInPlace9 = puzzleRunGame.imgInPlace9

        stateGame.partsPuzzleImages = puzzleRunGame.partsPuzzleImages
        stateGame.dataForPlayerPartsImages = puzzleRunGame.dataForPlayerPartsImages
      }

      const stateGameFirebase = StateGameMapper.toFirebase(stateGame)

      await this.fireStore.collection<any>(`${this.runGameCollection}/${gameId}/${this.stateGameKey}`)
        .doc(gameId)
        .set(stateGameFirebase)

    } catch (error) {
      console.error('При сохранении данных состояния игры произошла ошибка', error);
      throw error;
    }
  }

  /**
   *  Сохранение выбранного ответа у сцены в состояние
   * @param player
   * @param selectAnswer
   */
  async saveSelectAnswerStateGame(player: Player, selectAnswer: AnswerRunGame) {

    try {

      const stateGame = this.currentStateGame

      if (!stateGame.typeControls) {
        stateGame.typeControls = TypeControls.center
      }

      if (!stateGame.answer) {
        stateGame.answer = []
      }

      stateGame.answer.push({playerId: player.id, answerId: selectAnswer.id})

      const stateGameFirebase = StateGameMapper.toFirebase(stateGame)

      await this.fireStore.collection<any>(`${this.runGameCollection}/${this.gameId}/${this.stateGameKey}`)
        .doc(this.gameId)
        .set(stateGameFirebase)

    } catch (error) {
      console.error('При сохранении данных состояния игры произошла ошибка', error);
      throw error;
    }
  }

  async saveSelectTypeControls(typeControls: TypeControls) {

    try {

      // Костыльный костыль сначала обновляем пустое состояние потом меняем состояние. Если предыдущее состояние равно
      // предыдущему события не наступают
      this.currentStateGame.typeControls = null
      let stateGameFirebase = StateGameMapper.toFirebase(this.currentStateGame)

      await this.fireStore.collection<any>(`${this.runGameCollection}/${this.gameId}/${this.stateGameKey}`)
        .doc(this.gameId)
        .set(stateGameFirebase)

      this.currentStateGame.typeControls = typeControls
      stateGameFirebase = StateGameMapper.toFirebase(this.currentStateGame)

      await this.fireStore.collection<any>(`${this.runGameCollection}/${this.gameId}/${this.stateGameKey}`)
        .doc(this.gameId)
        .set(stateGameFirebase)

    } catch (error) {
      console.error('При сохранении данных состояния игры произошла ошибка', error);
      throw error;
    }
  }

  async selectPuzzle(value: {
    sceneForPuzzleControlPlayerRunGame: SceneForPuzzleControlPlayerRunGame, // Сцена игрока
    event: 'del' | 'add' // Добавить или удалить элемент со сцены,
    numberPosition: number // Номер позиции с 1-9,
    image: PartsPuzzleImage
  }) {

    const stateGame = this.currentStateGame

    // Состояние для игрока
    const findItem = stateGame.dataForPlayerPartsImages
      .find(item => item.playerId === value.sceneForPuzzleControlPlayerRunGame.playerId)

    if (!findItem) {
      return
    }

    const index = stateGame.dataForPlayerPartsImages.indexOf(findItem)
    stateGame.dataForPlayerPartsImages[index] = value.sceneForPuzzleControlPlayerRunGame


    // Сначала удаляем изобрадение из всех ячеек сцены
    // Затем добаляем / перемещаем
    this.deleteImageInAllImage(stateGame, value.image)

    if (value.event === 'add') {

      switch (value.numberPosition) {
        case 1:
          stateGame.imgInPlace1.push(value.image)
          break;
        case 2:
          stateGame.imgInPlace2.push(value.image)
          break;
        case 3:
          stateGame.imgInPlace3.push(value.image)
          break;
        case 4:
          stateGame.imgInPlace4.push(value.image)
          break;
        case 5:
          stateGame.imgInPlace5.push(value.image)
          break;
        case 6:
          stateGame.imgInPlace6.push(value.image)
          break;
        case 7:
          stateGame.imgInPlace7.push(value.image)
          break;
        case 8:
          stateGame.imgInPlace8.push(value.image)
          break;
        case 9:
          stateGame.imgInPlace9.push(value.image)
          break;
      }
    }


    try {
      const stateGameFirebase = StateGameMapper.toFirebase(stateGame)
      await this.fireStore.collection<any>(`${this.runGameCollection}/${this.gameId}/${this.stateGameKey}`)
        .doc(this.gameId)
        .set(stateGameFirebase)
    } catch (error) {
      console.error('При сохранении данных состояния игры произошла ошибка', error);
      throw error;
    }
  }

  deleteImageInAllImage(stateGame: StateGame, imgInPlaceItem: PartsPuzzleImage) {

    const array = [
      stateGame.imgInPlace1,
      stateGame.imgInPlace2,
      stateGame.imgInPlace3,
      stateGame.imgInPlace4,
      stateGame.imgInPlace5,
      stateGame.imgInPlace6,
      stateGame.imgInPlace7,
      stateGame.imgInPlace8,
      stateGame.imgInPlace9
    ]

    array.forEach((imgInPlace) => {
      let findItem: number = imgInPlace.findIndex(i => i.id === imgInPlaceItem.id)
      if(findItem < 0) {
        return
      }
      imgInPlace.splice(findItem, 1)
    })

  }

}
