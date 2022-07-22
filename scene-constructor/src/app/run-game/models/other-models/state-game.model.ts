import {TypeControls} from "./type-controls.enum";
import {ItemPartsPuzzleImage} from "../../../core/models/item-parts-puzzle-image.model";
import {PartsPuzzleImage} from "../../../core/models/parts-puzzle-image.model";
import {PanoramaRunGame} from "./panorama-run-game";
import {SceneRunGame} from "./scene-run-game";
import {PuzzleRunGame, SceneForPuzzleControlPlayerRunGame} from "./puzzle-run-game.models";
import {PartsPuzzleImageFirebase} from "../../../editor/models/firebase-models/parts-puzzle-image-firebase.model";
import {SceneForEditPlayerFirebase} from "../../../editor/models/firebase-models/scene-for-edit-player-firebase.model";
import {ImagePuzzleEditorMapper} from "../../../editor/models/editor-mapper.model";
import {SceneForControlPuzzlePlayerRunGameMapper} from "../../run-game-mapper.model";

// Это объек в который пишутя данные в текущий момент времени
// Значений ответов игроков
// Выбранные изображения сцены и игроков и тд
// Это динамический объект под каждый тип сцены он имеет свои значения
export class StateGame {

  // Текущая сцена
  public currentScene: PanoramaRunGame | SceneRunGame | PuzzleRunGame

  // Тригер для панорамы
  typeControls: TypeControls | null = TypeControls.center

  // Текущие ответы игроков
  answer: Array<{ playerId: string, answerId: string }> = []

  // Список доступных изображений
  partsPuzzleImages: PartsPuzzleImage[]

  // Изображение на экране сцены
  imgInPlace1: PartsPuzzleImage[];
  imgInPlace2: PartsPuzzleImage[];
  imgInPlace3: PartsPuzzleImage[];
  imgInPlace4: PartsPuzzleImage[];
  imgInPlace5: PartsPuzzleImage[];
  imgInPlace6: PartsPuzzleImage[];
  imgInPlace7: PartsPuzzleImage[];
  imgInPlace8: PartsPuzzleImage[];
  imgInPlace9: PartsPuzzleImage[];

  // Изображения для игроков
  dataForPlayerPartsImages: SceneForPuzzleControlPlayerRunGame[] = []

  constructor(
    public id: string | null, // ИД состояния
    public currentSceneId: string,
  ) {
  }
}

export interface StateGameFirebase {
  currentSceneId: string
  // Тригер для панорамы
  typeControls: TypeControls
  // Текущие ответы игроков
  answer: Array<{ playerId: string, answerId: string }>

  // Список доступных изображений
  partsPuzzleImages: PartsPuzzleImageFirebase[]

  // Изображение на экране сцены
  imgInPlace1: PartsPuzzleImageFirebase[];
  imgInPlace2: PartsPuzzleImageFirebase[];
  imgInPlace3: PartsPuzzleImageFirebase[];
  imgInPlace4: PartsPuzzleImageFirebase[];
  imgInPlace5: PartsPuzzleImageFirebase[];
  imgInPlace6: PartsPuzzleImageFirebase[];
  imgInPlace7: PartsPuzzleImageFirebase[];
  imgInPlace8: PartsPuzzleImageFirebase[];
  imgInPlace9: PartsPuzzleImageFirebase[];

  // Изображения для игроков
  dataForPlayerPartsImages: SceneForEditPlayerFirebase[]
}

export class StateGameMapper {
  static toDTO(stateGameFirebase: StateGameFirebase, stateId: string): StateGame {
    const stateGame = new StateGame(
      stateId,
      stateGameFirebase.currentSceneId
    )
    stateGame.typeControls = stateGameFirebase.typeControls
    stateGame.answer = stateGameFirebase.answer
    stateGame.partsPuzzleImages = stateGameFirebase.partsPuzzleImages?.map(item => {
      return ImagePuzzleEditorMapper.toDto(item)
    })
    stateGame.imgInPlace1 = stateGameFirebase.imgInPlace1?.map((item) => {
      return ImagePuzzleEditorMapper.toDto(item)
    })
    stateGame.imgInPlace2 = stateGameFirebase.imgInPlace2?.map((item) => {
      return ImagePuzzleEditorMapper.toDto(item)
    })
    stateGame.imgInPlace3 = stateGameFirebase.imgInPlace3?.map((item) => {
      return ImagePuzzleEditorMapper.toDto(item)
    })
    stateGame.imgInPlace4 = stateGameFirebase.imgInPlace4?.map((item) => {
      return ImagePuzzleEditorMapper.toDto(item)
    })
    stateGame.imgInPlace5 = stateGameFirebase.imgInPlace5?.map((item) => {
      return ImagePuzzleEditorMapper.toDto(item)
    })
    stateGame.imgInPlace6 = stateGameFirebase.imgInPlace6?.map((item) => {
      return ImagePuzzleEditorMapper.toDto(item)
    })
    stateGame.imgInPlace7 = stateGameFirebase.imgInPlace7?.map((item) => {
      return ImagePuzzleEditorMapper.toDto(item)
    })
    stateGame.imgInPlace8 = stateGameFirebase.imgInPlace8?.map((item) => {
      return ImagePuzzleEditorMapper.toDto(item)
    })
    stateGame.imgInPlace9 = stateGameFirebase.imgInPlace9?.map((item) => {
      return ImagePuzzleEditorMapper.toDto(item)
    })

    stateGame.dataForPlayerPartsImages = stateGameFirebase.dataForPlayerPartsImages.map((item) => {
      return SceneForControlPuzzlePlayerRunGameMapper.toDtoForRunGame(item)
    })

    return stateGame
  }

  static toFirebase(stateGame: StateGame): StateGameFirebase {

    const partsPuzzleImages = stateGame.partsPuzzleImages?.map(item => {
      return ImagePuzzleEditorMapper.toFirebase(item)
    })

    const imgInPlace1 = stateGame.imgInPlace1?.map((item) => {
      return ImagePuzzleEditorMapper.toFirebase(item)
    })
    const imgInPlace2 = stateGame.imgInPlace2?.map((item) => {
      return ImagePuzzleEditorMapper.toFirebase(item)
    })
    const imgInPlace3 = stateGame.imgInPlace3?.map((item) => {
      return ImagePuzzleEditorMapper.toFirebase(item)
    })
    const imgInPlace4 = stateGame.imgInPlace4?.map((item) => {
      return ImagePuzzleEditorMapper.toFirebase(item)
    })
    const imgInPlace5 = stateGame.imgInPlace5?.map((item) => {
      return ImagePuzzleEditorMapper.toFirebase(item)
    })
    const imgInPlace6 = stateGame.imgInPlace6?.map((item) => {
      return ImagePuzzleEditorMapper.toFirebase(item)
    })
    const imgInPlace7 = stateGame.imgInPlace7?.map((item) => {
      return ImagePuzzleEditorMapper.toFirebase(item)
    })
    const imgInPlace8 = stateGame.imgInPlace8?.map((item) => {
      return ImagePuzzleEditorMapper.toFirebase(item)
    })
    const imgInPlace9 = stateGame.imgInPlace9?.map((item) => {
      return ImagePuzzleEditorMapper.toFirebase(item)
    })

    const dataForPlayerPartsImages: SceneForEditPlayerFirebase[] = stateGame.dataForPlayerPartsImages.map((item) => {
      return SceneForControlPuzzlePlayerRunGameMapper.toFirebase(item)
    })

    return {
      currentSceneId: stateGame.currentSceneId,
      typeControls: stateGame.typeControls,
      answer: stateGame.answer,
      partsPuzzleImages: partsPuzzleImages || [],
      imgInPlace1: imgInPlace1 || [],
      imgInPlace2: imgInPlace2 || [],
      imgInPlace3: imgInPlace3 || [],
      imgInPlace4: imgInPlace4 || [],
      imgInPlace5: imgInPlace5 || [],
      imgInPlace6: imgInPlace6 || [],
      imgInPlace7: imgInPlace7 || [],
      imgInPlace8: imgInPlace8 || [],
      imgInPlace9: imgInPlace9 || [],
      dataForPlayerPartsImages: dataForPlayerPartsImages || []
    } as StateGameFirebase
  }
}
