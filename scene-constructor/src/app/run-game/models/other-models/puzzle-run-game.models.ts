import {FileLink} from "src/app/core/models/file-link.model.ts";
import {ItemPartsPuzzleImage} from "src/app/core/models/item-parts-puzzle-image.model";
import {PartsPuzzleImage} from "src/app/core/models/parts-puzzle-image.model";
import {TypeSceneEnum} from "src/app/core/models/type-scene.enum";
import {AnswerRunGame} from "./answer.model";
import {IBaseSceneRunGame} from "./base-scene-run-game.model";
import {IBaseBackgroundScene} from "../../../core/models/base-background-scene.model";
import {Coordinate} from "../../../editor/models/coordinate.model";
import {Answer} from "../../../editor/models/answer.model";
import {SceneForEditPlayer} from "../../../editor/models/puzzle-edit-scene";

export class PuzzleRunGame implements IBaseSceneRunGame, IBaseBackgroundScene {

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
  dataForPlayerPartsImages: SceneForPlayerRunGame[] = []

  // Изображение фона
  imageFileId: string
  imageFile: string

  // Видео фона
  videoFileId: string
  videoFile: string
  soundFile: string;



//   id: string
//   title: string
//   text: string
//   color: string
//
//   soundFileId: string
//   soundFile: string
//   soundFileLink: FileLink
//
//   typesScene: TypeSceneEnum = TypeSceneEnum.Puzzle
//
//   isStartGame: boolean = false
//
//   players: string[] = []
//
//   answers: AnswerRunGame[] = []
//
//   imagePuzzleFileId: string;
//
//   // Изображение фона
//   imageFileId: string
//   imageFile: string
//
//   // Видео фона
//   videoFileId: string
//   videoFile: string
//
//   // Список доступных изображений
//   partsPuzzleImages: PartsPuzzleImage[]
//
//   // Изображение на экране сцены в браузере
//   scenePartsPuzzleImages: ItemPartsPuzzleImage[] //TODO: на одно место должно быть несколько элементов, разделить на списки от 1 до 9
//
//   // Изображения для игроков
//   playerScenePartsPuzzleImages: { playerId: string, scenePartsPuzzleImages: ItemPartsPuzzleImage[] }[] = [] //TODO: Удалить
 }

class SceneForPlayerRunGame {

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

