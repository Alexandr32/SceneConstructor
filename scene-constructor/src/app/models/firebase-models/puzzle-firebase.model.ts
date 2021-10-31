import { TypeSceneEnum } from "../type-scene.enum";
import { AnswerFirebase } from "./answer-firebase.model";

export interface PuzzleFirebase {
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
}
