import { FileLink } from "src/app/core/models/file-link.model.ts";
import { ItemPartsPuzzleImage } from "src/app/core/models/item-parts-puzzle-image.model";
import { PartsPuzzleImage } from "src/app/core/models/parts-puzzle-image.model";
import { TypeSceneEnum } from "src/app/core/models/type-scene.enum";
import { AnswerRunGame } from "./answer.model";
import { IBaseSceneRunGame } from "./base-scene-run-game.model";

export class PuzzleRunGame implements IBaseSceneRunGame {
  id: string
  title: string
  text: string
  color: string

  soundFileId: string
  soundFileLink: FileLink

  typesScene: TypeSceneEnum = TypeSceneEnum.Puzzle

  isStartGame: boolean = false

  players: string[] = []

  answers: AnswerRunGame[] = []

  imageFileId: string
  imageFile: string

  // Список доступных изображений
  partsPuzzleImages: PartsPuzzleImage[]

  // Изображение на экране сцены
  scenePartsPuzzleImages: ItemPartsPuzzleImage[]

  // Изображения для игроков
  playerScenePartsPuzzleImages: { playerId: string, scenePartsPuzzleImages: ItemPartsPuzzleImage[] }[] = []
}

export class PanoramaRunGame implements IBaseSceneRunGame {

  id: string
  title: string
  text: string
  color: string

  soundFileId: string
  soundFileLink: FileLink

  typesScene: TypeSceneEnum = TypeSceneEnum.Panorama

  isStartGame: boolean = false

  players: string[] = []

  answers: AnswerRunGame[] = []

  imageFileId: string
  imageFile: string

  isTimer: boolean
  times: number // В мс
}

export class SceneRunGame implements IBaseSceneRunGame {
  id: string
  title: string
  text: string
  color: string

  soundFileId: string
  soundFileLink: FileLink

  typesScene: TypeSceneEnum = TypeSceneEnum.Answer

  isStartGame: boolean = false

  players: string[] = []

  imageFileId: string
  videoFileId: string

  answers: AnswerRunGame[] = []

  imageFile: string
  videoFile: string
}
