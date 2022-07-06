/**
 * Описание сцены
 */
import {Coordinate} from './coordinate.model';
import {Answer} from './answer.model';
import {FileLink} from '../../core/models/file-link.model.ts';
import {TypeSceneEnum} from '../../core/models/type-scene.enum';
import {PartsPuzzleImage} from '../../core/models/parts-puzzle-image.model';
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
  imgInPlace1: PartsPuzzleImage[];
  imgInPlace2: PartsPuzzleImage[];
  imgInPlace3: PartsPuzzleImage[];
  imgInPlace4: PartsPuzzleImage[];
  imgInPlace5: PartsPuzzleImage[];
  imgInPlace6: PartsPuzzleImage[];
  imgInPlace7: PartsPuzzleImage[];
  imgInPlace8: PartsPuzzleImage[];
  imgInPlace9: PartsPuzzleImage[];

  // Изображения для игроков
  dataForPlayerPartsImages: SceneForEditPlayer[] = []

  // Изображение фона
  imageFileId: string
  imageFile: string

  // Видео фона
  videoFileId: string
  videoFile: string
}

export class SceneForEditPlayer {

  playerId: string

  name: string

  // Доступные изображения для выбора
  imgPlace1: PartsPuzzleImage[];
  imgPlace2: PartsPuzzleImage[];
  imgPlace3: PartsPuzzleImage[];
  imgPlace4: PartsPuzzleImage[];
  imgPlace5: PartsPuzzleImage[];
  imgPlace6: PartsPuzzleImage[];
  imgPlace7: PartsPuzzleImage[];
  imgPlace8: PartsPuzzleImage[];
  imgPlace9: PartsPuzzleImage[];
}
