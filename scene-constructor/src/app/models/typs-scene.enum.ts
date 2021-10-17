export enum TypeSceneEnum {
  Answer = 'Answer',
  Panorama = 'Panorama',
  Puzzle = 'Puzzle',
  Undefined = 'undefined'
}

export class TypeScene {
  constructor(
    public type: TypeSceneEnum,
    public name: string) {
  }
}

export const getDefaultScene = (): TypeScene => {
  //return new TypeScene(TypeSceneEnum.Answer, 'Сцена ответов')
  return new TypeScene(TypeSceneEnum.Puzzle, 'Головоломка')
}

export function getTypeScene(): Array<TypeScene> {
  return new Array<TypeScene>(
    new TypeScene(TypeSceneEnum.Answer, 'Сцена ответов'),
    new TypeScene(TypeSceneEnum.Panorama, 'Панорама'),
    new TypeScene(TypeSceneEnum.Puzzle, 'Головоломка'))
}
