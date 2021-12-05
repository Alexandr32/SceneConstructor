import { TypeSceneEnum } from "../../../core/models/type-scene.enum";
import { AnswerFirebase } from "./answer-firebase.model";
import { IBaseSceneFirebase } from "./base-scene-firebase.mode";

export interface PuzzleFirebase extends IBaseSceneFirebase {
  id: string
  title: string
  text: string
  soundFileId: string
  color: string
  imageFileId: string

  coordinate: {
    x: number,
    y: number
  }
  typesScene: TypeSceneEnum
  answers: AnswerFirebase[]
  maxCountAnswers: number
  players: string[]
  isStartGame: boolean

  scenePartsPuzzleImages: { number: number, imgId: number }[]

  playerScenePartsPuzzleImages: {
    playerId: string,
    scenePartsPuzzleImages: {
      number: number,
      imgId: number
    }[]
  }[]
}
