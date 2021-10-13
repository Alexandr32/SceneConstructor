/**
 * Описание сцены
 */
import { Coordinate } from './coordinate.model';
import { Answer } from './answer.model';
import { Entity } from './entity.model';
import { FileLink } from './file-link.model.ts';

export class Scene implements Entity {
  id: string
  title: string
  text: string
  color: string

  soundFileId: string
  soundFileLink: FileLink

  imageFileId: string
  videoFileId: string
  answers: Answer[] = []
  coordinate: Coordinate
  players: string[] = []

  isStartGame: boolean = false

  imageFile: string
  videoFile: string
}
