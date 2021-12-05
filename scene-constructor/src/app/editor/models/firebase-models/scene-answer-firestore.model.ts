import { Player } from "../../../run-game/models/other-models/player.model"
import { TypeSceneEnum } from "../../../core/models/type-scene.enum"
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
