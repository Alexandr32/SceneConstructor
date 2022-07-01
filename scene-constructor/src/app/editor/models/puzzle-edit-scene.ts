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

  // TODO: Удалить
  // Изображение на экране сцены
  //scenePartsPuzzleImages: ItemPartsPuzzleImage[]

  // TODO: Удалить
  // Изображения для игроков
  //playerScenePartsPuzzleImages: { playerId: string, scenePartsPuzzleImages: ItemPartsPuzzleImage[] }[]
}

export class SceneForEditPlayer {

  playerId: string

  name: string

  // Те изображения которые есть на сцена играка (которые он выложил и те которые уже там есть)
  imgInPlace1: PartsPuzzleImage = null;
  // Можно ли перетаскивать элемент
  isDraggableImgPlace1: boolean
  imgInPlace2: PartsPuzzleImage = null;
  // Можно ли перетаскивать элемент
  isDraggableImgPlace2: boolean
  imgInPlace3: PartsPuzzleImage = null;
  // Можно ли перетаскивать элемент
  isDraggableImgPlace3: boolean
  imgInPlace4: PartsPuzzleImage = null;
  // Можно ли перетаскивать элемент
  isDraggableImgPlace4: boolean
  imgInPlace5: PartsPuzzleImage = null;
  // Можно ли перетаскивать элемент
  isDraggableImgPlace5: boolean
  imgInPlace6: PartsPuzzleImage = null;
  // Можно ли перетаскивать элемент
  isDraggableImgPlace6: boolean
  imgInPlace7: PartsPuzzleImage = null;
  // Можно ли перетаскивать элемент
  isDraggableImgPlace7: boolean
  imgInPlace8: PartsPuzzleImage = null;
  // Можно ли перетаскивать элемент
  isDraggableImgPlace8: boolean
  imgInPlace9: PartsPuzzleImage = null;
  // Можно ли перетаскивать элемент
  isDraggableImgPlace9: boolean

  // Доступные изображения для выбора
  imgPlace1: PartsPuzzleImage;
  imgPlace2: PartsPuzzleImage;
  imgPlace3: PartsPuzzleImage;
  imgPlace4: PartsPuzzleImage;
  imgPlace5: PartsPuzzleImage;
  imgPlace6: PartsPuzzleImage;
  imgPlace7: PartsPuzzleImage;
  imgPlace8: PartsPuzzleImage;
  imgPlace9: PartsPuzzleImage;
}
