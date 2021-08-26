/**
 * Описание сцены
 */
export class Scene {
  id: number
  title: string
  text: string
  answers: Answer[] = []
  coordinate: Coordinate
}

/**
 * Координаты элемента
 */
export class Coordinate {
  x: number = 0
  y: number = 0
}

/**
 * Вариант ответа на сцене
 */
export class Answer {

  private readonly startY = 65
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
    this.startCoordinate.y = 20 * this._position + this.startY + this.startCoordinate.y
    this.coordinate.y = 20 * this._position + this.startY //+ this.startCoordinate.y
  }

  constructor(public id: number,
              public text: string,
              position: number,
              public sceneId?: number,
  ) {

    this._position = position

    this.startCoordinate = new Coordinate()
    this.startCoordinate.x = this.startX
    this.startCoordinate.y = 20 * position + this.startY

    this.coordinate = new Coordinate()
    this.coordinate.x = this.startX
    this.coordinate.y = 20 * position + this.startY
  }

  setX(x: number) {
    this.coordinate.x = this.startCoordinate.x + x
  }

  setY(y: number) {
    this.coordinate.y = this.startCoordinate.y + y
  }
}
