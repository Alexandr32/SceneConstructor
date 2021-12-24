import {IBaseEditScene} from "./base-edit-scene.model";
import {IBaseBackgroundScene} from "../../core/models/base-background-scene.model";
import {FileLink} from "../../core/models/file-link.model.ts";
import {TypeSceneEnum} from "../../core/models/type-scene.enum";
import {Coordinate} from "./coordinate.model";
import {Answer} from "./answer.model";

export class SceneEditScene implements IBaseEditScene, IBaseBackgroundScene {
  id: string
  title: string
  text: string
  color: string

  soundFileId: string
  soundFileLink: FileLink

  typesScene: TypeSceneEnum = TypeSceneEnum.Answer

  isStartGame: boolean = false
  coordinate: Coordinate
  players: string[] = []

  imageFileId: string
  videoFileId: string

  answers: Answer[] = []
  maxCountAnswers = 3

  imageFile: string
  videoFile: string
}
