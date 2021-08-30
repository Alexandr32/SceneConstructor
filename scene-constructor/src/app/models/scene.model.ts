/**
 * Описание сцены
 */
import {Coordinate} from './coordinate.model';
import {Answer} from './answer.model';
import {Player} from './player.model';

export class Scene {
  id: number
  title: string
  text: string
  answers: Answer[] = []
  coordinate: Coordinate
  players: Player[] = []
}
