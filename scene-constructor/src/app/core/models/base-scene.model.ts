import { FileLink } from "./file-link.model.ts";

export interface ISceneCore {
  soundFileId: string

  imageFileId: string
  videoFileId: string

  imageFile: string
  videoFile: string

  soundFileLink: FileLink
}
