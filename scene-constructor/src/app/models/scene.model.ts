/**
 * Описание сцены
 */
import {Coordinate} from './coordinate.model';
import {Answer} from './answer.model';
import {Player} from './player.model';
import {Entity} from './entity.model';

export class Scene implements Entity  {
  id: string
  title: string
  text: string
  imgFile: string
  answers: Answer[] = []
  coordinate: Coordinate
  players: Player[] = []
}
