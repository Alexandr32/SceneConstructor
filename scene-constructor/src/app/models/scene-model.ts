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
  constructor(public id: number,
              public text: string,
              public sceneId?: number,
              public startCoordinate?: Coordinate, // Координаты при отрисовке на холсте
              public coordinate?: Coordinate // Текущие координаты
  ) {
  }
}
