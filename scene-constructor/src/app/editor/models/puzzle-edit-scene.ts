/**
 * Описание сцены
 */
import {Coordinate} from './coordinate.model';
import {Answer} from './answer.model';
import {FileLink} from '../../core/models/file-link.model.ts';
import {TypeSceneEnum} from '../../core/models/type-scene.enum';
import {PartsPuzzleImage} from '../../core/models/parts-puzzle-image.model';
import {ItemPartsPuzzleImage} from '../../core/models/item-parts-puzzle-image.model';
import {IBaseBackgroundScene} from "../../core/models/base-background-scene.model";
import {IBaseEditScene} from "./base-edit-scene.model";

export class PuzzleEditScene implements IBaseEditScene, IBaseBackgroundScene {
  id: string
  title: string
  text: string
  color: string

  soundFileId: string
  soundFileLink: FileLink

  typesScene: TypeSceneEnum = TypeSceneEnum.Puzzle

  isStartGame: boolean = false
  coordinate: Coordinate
  players: string[] = []

  answers: Answer[] = []
  maxCountAnswers: number = 1

  // Изображение пазла
  imagePuzzleFileId: string
  imagePuzzleFile: string

  // Список доступных изображений
  partsPuzzleImages: PartsPuzzleImage[]

  // Изображение на экране сцены
  scenePartsPuzzleImages: ItemPartsPuzzleImage[]

  // Изображения для игроков
  playerScenePartsPuzzleImages: { playerId: string, scenePartsPuzzleImages: ItemPartsPuzzleImage[] }[] = []

  // Изображение фона
  imageFileId: string
  imageFile: string

  // Видео фона
  videoFileId: string
  videoFile: string
}
