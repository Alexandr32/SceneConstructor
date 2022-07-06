import {PartsPuzzleImageFirebase} from "./parts-puzzle-image-firebase.model";

export interface SceneForEditPlayerFirebase {

  playerId: string

  name: string

  // Те изображения которые есть на сцена играка (которые он выложил и те которые уже там есть)
  imgInPlace1: PartsPuzzleImageFirebase | null | undefined;
  // Можно ли перетаскивать элемент
  isDraggableImgPlace1: boolean

  imgInPlace2: PartsPuzzleImageFirebase | null | undefined;
  // Можно ли перетаскивать элемент
  isDraggableImgPlace2: boolean

  imgInPlace3: PartsPuzzleImageFirebase | null | undefined;
  // Можно ли перетаскивать элемент
  isDraggableImgPlace3: boolean

  imgInPlace4: PartsPuzzleImageFirebase | null | undefined;
  // Можно ли перетаскивать элемент
  isDraggableImgPlace4: boolean

  imgInPlace5: PartsPuzzleImageFirebase | null | undefined;
  // Можно ли перетаскивать элемент
  isDraggableImgPlace5: boolean

  imgInPlace6: PartsPuzzleImageFirebase | null | undefined;
  // Можно ли перетаскивать элемент
  isDraggableImgPlace6: boolean

  imgInPlace7: PartsPuzzleImageFirebase | null | undefined;
  // Можно ли перетаскивать элемент
  isDraggableImgPlace7: boolean

  imgInPlace8: PartsPuzzleImageFirebase | null | undefined;
  // Можно ли перетаскивать элемент
  isDraggableImgPlace8: boolean

  imgInPlace9: PartsPuzzleImageFirebase | null | undefined;
  // Можно ли перетаскивать элемент
  isDraggableImgPlace9: boolean

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
