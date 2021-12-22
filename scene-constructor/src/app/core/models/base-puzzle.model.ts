import { FileLink } from "./file-link.model.ts";
import { ItemPartsPuzzleImage } from "./item-parts-puzzle-image.model";
import { PartsPuzzleImage } from "./parts-puzzle-image.model";
import {IBackgroundScene} from "../../editor/models/scenes.models";

export interface IPuzzleCore extends IBackgroundScene {
  soundFileId: string

  // Изображение пазла
  imagePuzzleFileId: string
  imagePuzzleFile: string

  // Изображение фона
  imageFileId: string
  imageFile: string

  // Видео фона
  videoFileId: string
  videoFile: string

  soundFileLink: FileLink

  // Список доступных изображений
  partsPuzzleImages: PartsPuzzleImage[]

  // Изображение на экране сцены
  scenePartsPuzzleImages: ItemPartsPuzzleImage[]

  // Изображения для игроков
  playerScenePartsPuzzleImages: { playerId: string, scenePartsPuzzleImages: ItemPartsPuzzleImage[] }[]
}
