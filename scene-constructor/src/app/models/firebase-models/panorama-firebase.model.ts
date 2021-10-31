import { TypeSceneEnum } from "../type-scene.enum";
import { AnswerFirebase } from "./answer-firebase.model";

export interface PanoramaFirebase {
  id: string
  title: string
  text: string
  color: string

  soundFileId: string

  typesScene: TypeSceneEnum

  isStartGame: boolean
  coordinate: {
    x: number,
    y: number
  }
  players: string[]

  answers: AnswerFirebase[]

  maxCountAnswers: number

  imageFileId: string

  isTimer: boolean
  times: number // В мс
}
