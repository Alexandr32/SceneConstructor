import { FileLink } from "./file-link.model.ts";
import { ItemPartsPuzzleImage } from "./item-parts-puzzle-image.model";
import { PartsPuzzleImage } from "./parts-puzzle-image.model";

export interface IPuzzleCore {
  soundFileId: string

  imageFileId: string

  imageFile: string

  soundFileLink: FileLink

  // Список доступных изображений
  partsPuzzleImages: PartsPuzzleImage[]

  // Изображение на экране сцены
  scenePartsPuzzleImages: ItemPartsPuzzleImage[]

  // Изображения для игроков
  playerScenePartsPuzzleImages: { playerId: string, scenePartsPuzzleImages: ItemPartsPuzzleImage[] }[]
}
