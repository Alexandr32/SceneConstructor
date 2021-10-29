/**
 * Описание сцены
 */
import { Coordinate } from './coordinate.model';
import { Answer } from './answer.model';
import { Entity } from './entity.model';
import { FileLink } from './file-link.model.ts';
import { TypeSceneEnum } from './type-scene.enum';

export interface IBaseScene extends Entity {
  id: string
  title: string
  text: string
  color: string

  soundFileId: string
  soundFileLink: FileLink

  typesScene: TypeSceneEnum

  isStartGame: boolean
  coordinate: Coordinate
  players: string[]

  answers: Answer[]

  maxCountAnswers: number
}

export class Puzzle implements IBaseScene {
  id: string
  title: string
  text: string
  color: string

  soundFileId: string
  soundFileLink: FileLink

  typesScene: TypeSceneEnum = TypeSceneEnum.Puzzle

  isStartGame: boolean = false
  coordinate: Coordinate
  players: string[] = []

  answers: Answer[] = []
  maxCountAnswers: number = 1

}

export class Panorama implements IBaseScene {

  id: string
  title: string
  text: string
  color: string

  soundFileId: string
  soundFileLink: FileLink

  typesScene: TypeSceneEnum = TypeSceneEnum.Panorama

  isStartGame: boolean = false
  coordinate: Coordinate
  players: string[] = []

  answers: Answer[] = []
  maxCountAnswers: number = 1

  imageFileId: string
  imageFile: string

  isTimer: boolean
  times: number // В мс
}

export class Scene implements IBaseScene {
  id: string
  title: string
  text: string
  color: string

  soundFileId: string
  soundFileLink: FileLink

  typesScene: TypeSceneEnum = TypeSceneEnum.Answer

  isStartGame: boolean = false
  coordinate: Coordinate
  players: string[] = []

  imageFileId: string
  videoFileId: string

  answers: Answer[] = []
  maxCountAnswers = 3

  imageFile: string
  videoFile: string
}
