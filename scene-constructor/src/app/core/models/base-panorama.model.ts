import { FileLink } from "./file-link.model.ts";

export interface IPanoramaCore {
  soundFileId: string

  imageFileId: string

  imageFile: string

  soundFileLink: FileLink
}
