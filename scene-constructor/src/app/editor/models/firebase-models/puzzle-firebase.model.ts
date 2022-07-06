import { TypeSceneEnum } from "../../../core/models/type-scene.enum";
import { AnswerFirebase } from "./answer-firebase.model";
import { IBaseSceneFirebase } from "./base-scene-firebase.mode";
import {PartsPuzzleImage} from "../../../core/models/parts-puzzle-image.model";
import {SceneForEditPlayer} from "../puzzle-edit-scene";
import {PartsPuzzleImageFirebase} from "./parts-puzzle-image-firebase.model";
import {SceneForEditPlayerFirebase} from "./scene-for-edit-player-firebase.model";

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

  // Изображение на экране сцены
  imgInPlace1: PartsPuzzleImageFirebase[];
  imgInPlace2: PartsPuzzleImageFirebase[];
  imgInPlace3: PartsPuzzleImageFirebase[];
  imgInPlace4: PartsPuzzleImageFirebase[];
  imgInPlace5: PartsPuzzleImageFirebase[];
  imgInPlace6: PartsPuzzleImageFirebase[];
  imgInPlace7: PartsPuzzleImageFirebase[];
  imgInPlace8: PartsPuzzleImageFirebase[];
  imgInPlace9: PartsPuzzleImageFirebase[];

  // Изображения для игроков
  dataForPlayerPartsImages: SceneForEditPlayerFirebase[]
}
