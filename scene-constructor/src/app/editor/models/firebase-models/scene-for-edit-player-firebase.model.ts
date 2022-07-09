import {PartsPuzzleImageFirebase} from "./parts-puzzle-image-firebase.model";
import {PartsPuzzleImage} from "../../../core/models/parts-puzzle-image.model";

// Модель для редактирования и заупска игры
export interface SceneForEditPlayerFirebase {

  playerId: string

  name: string

  // Изображеняи на сцене для пользователя
  imgInPlace1: PartsPuzzleImage[]
  isStopDraggableImgPlace1: boolean

  imgInPlace2: PartsPuzzleImage[]
  isStopDraggableImgPlace2: boolean

  imgInPlace3: PartsPuzzleImage[]
  isStopDraggableImgPlace3: boolean

  imgInPlace4: PartsPuzzleImage[]
  isStopDraggableImgPlace4: boolean

  imgInPlace5: PartsPuzzleImage[]
  isStopDraggableImgPlace5: boolean

  imgInPlace6: PartsPuzzleImage[]
  isStopDraggableImgPlace6: boolean

  imgInPlace7: PartsPuzzleImage[]
  isStopDraggableImgPlace7: boolean

  imgInPlace8: PartsPuzzleImage[]
  isStopDraggableImgPlace8: boolean

  imgInPlace9: PartsPuzzleImage[]
  isStopDraggableImgPlace9: boolean

  // Доступные изображения для выбора
  imgPlace1: PartsPuzzleImageFirebase | null | undefined;
  imgPlace2: PartsPuzzleImageFirebase | null | undefined;
  imgPlace3: PartsPuzzleImageFirebase | null | undefined;
  imgPlace4: PartsPuzzleImageFirebase | null | undefined;
  imgPlace5: PartsPuzzleImageFirebase | null | undefined;
  imgPlace6: PartsPuzzleImageFirebase | null | undefined;
  imgPlace7: PartsPuzzleImageFirebase | null | undefined;
  imgPlace8: PartsPuzzleImageFirebase | null | undefined;
  imgPlace9: PartsPuzzleImageFirebase | null | undefined;
}
