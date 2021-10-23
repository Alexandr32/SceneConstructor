/**
 * Описание сцены
 */
import { Coordinate } from './coordinate.model';
import { Answer } from './answer.model';
import { Entity } from './entity.model';
import { FileLink } from './file-link.model.ts';
import { TypeSceneEnum } from './type-scene.enum';

export class Scene implements Entity {
  id: string
  title: string
  text: string
  color: string

  soundFileId: string
  soundFileLink: FileLink

  typesScene: TypeSceneEnum = TypeSceneEnum.Answer

  isStartGame: boolean = false
  coordinate: Coordinate
  players: string[] = []

  imageFileId: string
  videoFileId: string
  answers: Answer[] = []

  imageFile: string
  videoFile: string
}
