import { Coordinate } from './coordinate.model';
import { IBaseScene, Scene } from './scenes.models';
import { Entity } from '../../core/models/entity.model';


/**
 * Вариант ответа на сцене
 */
export class Answer implements Entity {

  private readonly startY = 260
  private readonly startX = 60

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
    //this.startCoordinate.y = 20 * this._position + this.startY //+ this.startCoordinate.y
    //this.coordinate.y = 20 * this._position + this.startY + this.parentScene.coordinate.y

    //this.startCoordinate.x = 200 * this._position + this.startX
    //this.coordinate.x = 200 * this._position + this.startX + this.parentScene.coordinate.x
  }

  constructor(public id: string,
    public text: string,
    position: number,
    public parentScene: IBaseScene,
    public sceneId: string = null,
  ) {

    this._position = position

    this.startCoordinate = new Coordinate()
    this.startCoordinate.x = 100 * position + this.startX
    this.startCoordinate.y = this.startY

    this.coordinate = new Coordinate()
    this.coordinate.x = 100 * position + parentScene.coordinate.x + this.startX
    this.coordinate.y = this.startY + parentScene.coordinate.y
  }

  setX(x: number) {
    this.coordinate.x = this.startCoordinate.x + x
  }

  setY(y: number) {
    this.coordinate.y = this.startCoordinate.y + y
  }
}
