import { Answer } from "../answer.model"

export interface AnswerFirebase {
  id: string
  text: string
  position: number
  sceneId: string

  coordinate: { x: number, y: number }
}



