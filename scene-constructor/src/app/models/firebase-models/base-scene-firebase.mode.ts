import { Entity } from "../entity.model";
import { TypeSceneEnum } from "../type-scene.enum";
import { AnswerFirebase } from "./answer-firebase.model";

export interface IBaseSceneFirebase extends Entity {
  id: string
  title: string
  text: string
  soundFileId: string
  color: string
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
