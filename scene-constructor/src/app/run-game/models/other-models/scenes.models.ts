import {FileLink} from "src/app/core/models/file-link.model.ts";
import {ItemPartsPuzzleImage} from "src/app/core/models/item-parts-puzzle-image.model";
import {PartsPuzzleImage} from "src/app/core/models/parts-puzzle-image.model";
import {TypeSceneEnum} from "src/app/core/models/type-scene.enum";
import {AnswerRunGame} from "./answer.model";
import {IBaseSceneRunGame} from "./base-scene-run-game.model";
import {IBaseBackgroundScene} from "../../../core/models/base-background-scene.model";

export class PuzzleRunGame implements IBaseSceneRunGame, IBaseBackgroundScene {
  id: string
  title: string
  text: string
  color: string

  soundFileId: string
  soundFile: string
  soundFileLink: FileLink

  typesScene: TypeSceneEnum = TypeSceneEnum.Puzzle

  isStartGame: boolean = false

  players: string[] = []

  answers: AnswerRunGame[] = []

  imagePuzzleFileId: string;

  // Изображение фона
  imageFileId: string
  imageFile: string

  // Видео фона
  videoFileId: string
  videoFile: string

  // Список доступных изображений
  partsPuzzleImages: PartsPuzzleImage[]

  // Изображение на экране сцены в браузере
  scenePartsPuzzleImages: ItemPartsPuzzleImage[] //TODO: на одно место должно быть несколько элементов, разделить на списки от 1 до 9

  // Изображения для игроков
  playerScenePartsPuzzleImages: { playerId: string, scenePartsPuzzleImages: ItemPartsPuzzleImage[] }[] = [] //TODO: Удалить
}

class SceneForPlayer {

  playerId: string

  // Доступные изображения для выбора
  partsPuzzleImages: ItemPartsPuzzleImage[]

  // Те изображения которые он выложил
  partsPuzzleImagesInPlace: ItemPartsPuzzleImage[] //TODO: проще разбить на 1-9 меньше головников
}

