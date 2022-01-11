import { TypeSceneEnum } from "src/app/core/models/type-scene.enum";
import { AnswerRunGame } from "./answer.model";

export interface IBaseSceneRunGame {
  id: string
  title: string
  text: string
  color: string

  soundFileId: string
  soundFile: string

  typesScene: TypeSceneEnum

  isStartGame: boolean
  players: string[]

  answers: AnswerRunGame[]
}
