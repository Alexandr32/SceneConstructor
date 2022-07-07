import { TypeSceneEnum } from "../../../core/models/type-scene.enum";
import { IBaseSceneRunGameFirebase } from "./ibase-scene-run-game-firebase.model";
import {AnswerFirebase} from "../../../editor/models/firebase-models/answer-firebase.model";
import {PartsPuzzleImageFirebase} from "../../../editor/models/firebase-models/parts-puzzle-image-firebase.model";
import {SceneForEditPlayerFirebase} from "../../../editor/models/firebase-models/scene-for-edit-player-firebase.model";


export interface PuzzleSceneRunGameFirebase extends IBaseSceneRunGameFirebase {

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
