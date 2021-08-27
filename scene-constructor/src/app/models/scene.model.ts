/**
 * Описание сцены
 */
import {Coordinate} from './coordinate.model';
import {Answer} from './answer.model';

export class Scene {
  id: number
  title: string
  text: string
  answers: Answer[] = []
  coordinate: Coordinate
}
