/**
 * Описание сцены
 */
import {Coordinate} from './coordinate.model';
import {Answer} from './answer.model';
import {Entity} from './entity.model';

export class Scene implements Entity  {
  id: string
  title: string
  text: string
  color: string
  imageFile: string
  videoFile: string
  answers: Answer[] = []
  coordinate: Coordinate
  players: string[] = []

  isStartGame: boolean = false
  isStopGame: boolean = false
}
