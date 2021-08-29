import {Coordinate} from './coordinate.model';
import {Scene} from './scene.model';


/**
 * Вариант ответа на сцене
 */
export class Answer {

  private readonly startY = 85
  private readonly startX = 120

  // Координаты при отрисовке на холсте
  private startCoordinate?: Coordinate
  // Текущие координаты
  public coordinate: Coordinate

  private _position: number

  get position(): number {
    return this._position
  }

  set position(value: number) {
    this._position = value
    this.startCoordinate.y = 20 * this._position + this.startY //+ this.startCoordinate.y
    this.coordinate.y = 20 * this._position + this.startY + this.parentScene.coordinate.y
  }

  constructor(public id: string,
              public text: string,
              position: number,
              public parentScene: Scene,
              public color: string,
              public sceneId?: number,
  ) {

    this._position = position

    this.startCoordinate = new Coordinate()
    this.startCoordinate.x = this.startX
    this.startCoordinate.y = 20 * position + this.startY

    this.coordinate = new Coordinate()
    this.coordinate.x = this.startX
    this.coordinate.y = 20 * position + this.startY + parentScene.coordinate.y
  }

  setX(x: number) {
    this.coordinate.x = this.startCoordinate.x + x
  }

  setY(y: number) {
    this.coordinate.y = this.startCoordinate.y + y
  }
}