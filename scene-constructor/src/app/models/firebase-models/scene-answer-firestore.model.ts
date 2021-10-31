import { Player } from "../run/run-game.models"
import { TypeSceneEnum } from "../type-scene.enum"
import { AnswerFirebase } from "./answer-firebase.model"
import { IBaseSceneFirebase } from "./base-scene-firebase.mode"

export interface SceneAnswerFirebase extends IBaseSceneFirebase {
  id: string
  title: string
  text: string
  soundFileId: string
  color: string
  imageFileId: string
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

}
