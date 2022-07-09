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
import {PartsPuzzleImageFirebase} from "../../../editor/models/firebase-models/parts-puzzle-image-firebase.model";

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
  dataForPlayerPartsImages: SceneForPuzzleControlPlayerRunGame[] = []

  // Изображение фона
  imageFileId: string
  imageFile: string

  // Видео фона
  videoFileId: string
  videoFile: string
  soundFile: string;
}

export class SceneForPuzzleControlPlayerRunGame {

  playerId: string

  name: string

  // Изображеняи на сцене для пользователя
  imgInPlace1: PartsPuzzleImage[]
  isStopDraggableImgPlace1: boolean = false

  imgInPlace2: PartsPuzzleImage[]
  isStopDraggableImgPlace2: boolean = false

  imgInPlace3: PartsPuzzleImage[]
  isStopDraggableImgPlace3: boolean = false

  imgInPlace4: PartsPuzzleImage[]
  isStopDraggableImgPlace4: boolean = false

  imgInPlace5: PartsPuzzleImage[]
  isStopDraggableImgPlace5: boolean = false

  imgInPlace6: PartsPuzzleImage[]
  isStopDraggableImgPlace6: boolean = false

  imgInPlace7: PartsPuzzleImage[]
  isStopDraggableImgPlace7: boolean = false

  imgInPlace8: PartsPuzzleImage[]
  isStopDraggableImgPlace8: boolean = false

  imgInPlace9: PartsPuzzleImage[]
  isStopDraggableImgPlace9: boolean = false

  // Доступные изображения для выбора
  imgPlace1: PartsPuzzleImage | null | undefined;
  imgPlace2: PartsPuzzleImage | null | undefined;
  imgPlace3: PartsPuzzleImage | null | undefined;
  imgPlace4: PartsPuzzleImage | null | undefined;
  imgPlace5: PartsPuzzleImage | null | undefined;
  imgPlace6: PartsPuzzleImage | null | undefined;
  imgPlace7: PartsPuzzleImage | null | undefined;
  imgPlace8: PartsPuzzleImage | null | undefined;
  imgPlace9: PartsPuzzleImage | null | undefined;
}

