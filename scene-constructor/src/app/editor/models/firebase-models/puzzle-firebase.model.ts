import { TypeSceneEnum } from "../../../core/models/type-scene.enum";
import { AnswerFirebase } from "./answer-firebase.model";
import { IBaseSceneFirebase } from "./base-scene-firebase.mode";
import {PartsPuzzleImage} from "../../../core/models/parts-puzzle-image.model";
import {SceneForEditPlayer} from "../puzzle-edit-scene";

export interface PuzzleFirebase extends IBaseSceneFirebase {
  id: string
  title: string
  text: string
  soundFileId: string
  color: string
  imagePuzzleFileId: string
  // Изображение фона
  imageFileId: string
  // Видео фона
  videoFileId: string

  coordinate: {
    x: number,
    y: number
  }
  typesScene: TypeSceneEnum
  answers: AnswerFirebase[]
  maxCountAnswers: number
  players: string[]
  isStartGame: boolean

  //TODO: Удалить
  scenePartsPuzzleImages: { number: number, imgId: number }[]

  // TODO: Удалить
  playerScenePartsPuzzleImages: {
    playerId: string,
    scenePartsPuzzleImages: {
      number: number,
      imgId: number
    }[]
  }[]

  // Изображение на экране сцены
  imgInPlace1: PartsPuzzleImage[];
  imgInPlace2: PartsPuzzleImage[];
  imgInPlace3: PartsPuzzleImage[];
  imgInPlace4: PartsPuzzleImage[];
  imgInPlace5: PartsPuzzleImage[];
  imgInPlace6: PartsPuzzleImage[];
  imgInPlace7: PartsPuzzleImage[];
  imgInPlace8: PartsPuzzleImage[];
  imgInPlace9: PartsPuzzleImage[];

  // Изображения для игроков
  dataForPlayerPartsImages: SceneForEditPlayer[]
}
