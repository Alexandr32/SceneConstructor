/**
 * Описание сцены
 */
import {Coordinate} from './coordinate.model';
import {Answer} from './answer.model';
import {Player} from './player.model';
import {Entity} from './entity.model';
import {TypeFile} from './type-file.model';

export class Scene implements Entity  {
  id: string
  title: string
  text: string
  imageFile: string
  videoFile: string
  answers: Answer[] = []
  coordinate: Coordinate
  players: string[] = []
}
