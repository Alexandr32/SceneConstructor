import { ItemPartsPuzzleImage } from "../core/models/item-parts-puzzle-image.model";
import { PartsPuzzleImage } from "../core/models/parts-puzzle-image.model";
import { Answer } from "../editor/models/answer.model";
import {PuzzleEditScene, SceneForEditPlayer} from "../editor/models/puzzle-edit-scene";
import { AnswerRunGameFirebase } from "./models/firebase-models/answer-run-game-firebase.model";
import { PanoramaRunGameFirebase } from "./models/firebase-models/panorama-scene-run-game-firebase.model";
import { PuzzleSceneRunGameFirebase } from "./models/firebase-models/puzzle-scene-run-game-firebase.model";
import { SceneAnswerRunGameFirebase } from "./models/firebase-models/scene-answer-run-game-firebase.model";
import { AnswerRunGame } from "./models/other-models/answer.model";
import { IBaseSceneRunGame } from "./models/other-models/base-scene-run-game.model";
import {PuzzleRunGame, SceneForPuzzleControlPlayerRunGame} from "./models/other-models/puzzle-run-game.models";
import {SceneRunGame} from "./models/other-models/scene-run-game";
import {PanoramaRunGame} from "./models/other-models/panorama-run-game";
import {SceneEditScene} from "../editor/models/scene-edit-scene";
import {PanoramaEditScene} from "../editor/models/panorama-edit-scene";
import {PuzzleFirebase} from "../editor/models/firebase-models/puzzle-firebase.model";
import {
  AnswerEditorMapper,
  ImagePuzzleEditorMapper,
  SceneForEditPuzzleControlPlayerEditorMapper
} from "../editor/models/editor-mapper.model";
import {Coordinate} from "../editor/models/coordinate.model";
import {PartsPuzzleImageFirebase} from "../editor/models/firebase-models/parts-puzzle-image-firebase.model";
import {SceneForEditPlayerFirebase} from "../editor/models/firebase-models/scene-for-edit-player-firebase.model";

export class AnswerRunGameMapper {
  static toFirebase(answer: Answer): AnswerRunGameFirebase {
    return {
      id: answer.id,
      text: answer.text,
      position: answer.position,
      sceneId: answer.sceneId,
    } as AnswerRunGameFirebase
  }

  static toDtoRunGame(answerFirebase: AnswerRunGameFirebase, parentScene: IBaseSceneRunGame): AnswerRunGame {

    return new AnswerRunGame(
      answerFirebase.id,
      answerFirebase.text,
      answerFirebase.position,
      parentScene,
      answerFirebase.sceneId
    )
  }
}

export class AnswerSceneRunGameMapper {
  static toFirebase(scene: SceneEditScene): SceneAnswerRunGameFirebase {

    return {
      id: scene.id,
      title: scene.title,
      text: scene.text,
      soundFileId: scene.soundFileLink ? scene.soundFileLink.id : '',
      imageFileId: scene.imageFileId,
      videoFileId: scene.videoFileId,
      typesScene: scene.typesScene,
      answers: scene.answers.map(item => {
        return AnswerRunGameMapper.toFirebase(item)
      }),
      players: scene.players,
      isStartGame: scene.isStartGame
    } as SceneAnswerRunGameFirebase;

  }

  static toDtoRunGame(sceneAnswerFirebase: SceneAnswerRunGameFirebase): SceneRunGame {

    const scene = new SceneRunGame()
    scene.id = sceneAnswerFirebase.id
    scene.title = sceneAnswerFirebase.title
    scene.text = sceneAnswerFirebase.text

    scene.soundFileId = sceneAnswerFirebase.soundFileId

    scene.typesScene = sceneAnswerFirebase.typesScene

    scene.isStartGame = sceneAnswerFirebase.isStartGame

    scene.players = sceneAnswerFirebase.players

    scene.imageFileId = sceneAnswerFirebase.imageFileId
    scene.videoFileId = sceneAnswerFirebase.videoFileId

    scene.answers = sceneAnswerFirebase.answers.map(item => {
      return AnswerRunGameMapper.toDtoRunGame(item, scene)
    })

    return scene

  }
}

export class PanoramaSceneRunGameMapper {
  static toFirebase(panorama: PanoramaEditScene): PanoramaRunGameFirebase {

    return {
      id: panorama.id,
      title: panorama.title,
      text: panorama.text,
      color: panorama.color,
      soundFileId: panorama.soundFileLink ? panorama.soundFileLink.id : '',
      typesScene: panorama.typesScene,
      isStartGame: panorama.isStartGame,

      players: panorama.players,
      answers: panorama.answers.map(item => {
        return AnswerRunGameMapper.toFirebase(item)
      }),

      imageFileId: panorama.imageFileId,
      isTimer: panorama.isTimer,
      times: panorama.times
    } as PanoramaRunGameFirebase;
  }

  static toDtoRunGame(panoramaFirebase: PanoramaRunGameFirebase): PanoramaRunGame {
    const panorama = new PanoramaRunGame()
    panorama.id = panoramaFirebase.id
    panorama.title = panoramaFirebase.title
    panorama.text = panoramaFirebase.text

    panorama.soundFileId = panoramaFirebase.soundFileId
    panorama.typesScene = panoramaFirebase.typesScene
    panorama.isStartGame = panoramaFirebase.isStartGame

    panorama.players = panoramaFirebase.players
    panorama.answers = panoramaFirebase.answers.map(item => {
      return AnswerRunGameMapper.toDtoRunGame(item, panorama)
    })

    panorama.imageFileId = panoramaFirebase.imageFileId
    panorama.isTimer = panoramaFirebase.isTimer
    panorama.times = panoramaFirebase.times

    return panorama
  }
}

export class SceneForControlPuzzlePlayerRunGameMapper {
  static toDtoForRunGame(sceneForEditPlayer: SceneForEditPlayerFirebase): SceneForPuzzleControlPlayerRunGame {
    const value = new SceneForPuzzleControlPlayerRunGame()
    value.playerId = sceneForEditPlayer.playerId
    value.name = sceneForEditPlayer.name

    // Изображеняи на сцене для пользователя
    value.imgInPlace1 = sceneForEditPlayer.imgPlace1 ? [sceneForEditPlayer.imgPlace1] : []
    value.isStopDraggableImgPlace1 = sceneForEditPlayer.isStopDraggableImgPlace1

    value.imgInPlace2 = sceneForEditPlayer.imgPlace2 ? [sceneForEditPlayer.imgPlace2] : []
    value.isStopDraggableImgPlace2 = sceneForEditPlayer.isStopDraggableImgPlace2

    value.imgInPlace3 = sceneForEditPlayer.imgPlace3 ? [sceneForEditPlayer.imgPlace3] : []
    value.isStopDraggableImgPlace3 = sceneForEditPlayer.isStopDraggableImgPlace3

    value.imgInPlace4 = sceneForEditPlayer.imgPlace4 ? [sceneForEditPlayer.imgPlace4] : []
    value.isStopDraggableImgPlace4 = sceneForEditPlayer.isStopDraggableImgPlace4

    value.imgInPlace5 = sceneForEditPlayer.imgPlace5 ? [sceneForEditPlayer.imgPlace5] : []
    value.isStopDraggableImgPlace5 = sceneForEditPlayer.isStopDraggableImgPlace5

    value.imgInPlace6 = sceneForEditPlayer.imgPlace6 ? [sceneForEditPlayer.imgPlace6] : []
    value.isStopDraggableImgPlace6 = sceneForEditPlayer.isStopDraggableImgPlace6

    value.imgInPlace7 = sceneForEditPlayer.imgPlace7 ? [sceneForEditPlayer.imgPlace7] : []
    value.isStopDraggableImgPlace7 = sceneForEditPlayer.isStopDraggableImgPlace7

    value.imgInPlace8 = sceneForEditPlayer.imgPlace8 ? [sceneForEditPlayer.imgPlace8] : []
    value.isStopDraggableImgPlace8 = sceneForEditPlayer.isStopDraggableImgPlace8

    value.imgInPlace9 = sceneForEditPlayer.imgPlace9 ? [sceneForEditPlayer.imgPlace9] : []
    value.isStopDraggableImgPlace9 = sceneForEditPlayer.isStopDraggableImgPlace9

    value.imgInPlace1 = sceneForEditPlayer.imgPlace1 ? [sceneForEditPlayer.imgPlace1] : []
    value.isStopDraggableImgPlace1 = sceneForEditPlayer.isStopDraggableImgPlace1

    value.imgPlace1 = sceneForEditPlayer.imgPlace1
    value.imgPlace2 = sceneForEditPlayer.imgPlace2
    value.imgPlace3 = sceneForEditPlayer.imgPlace3
    value.imgPlace4 = sceneForEditPlayer.imgPlace4
    value.imgPlace5 = sceneForEditPlayer.imgPlace5
    value.imgPlace6 = sceneForEditPlayer.imgPlace6
    value.imgPlace7 = sceneForEditPlayer.imgPlace7
    value.imgPlace8 = sceneForEditPlayer.imgPlace8
    value.imgPlace9 = sceneForEditPlayer.imgPlace9

    return value
  }
}

/**
 * Маппер для панорамы с ответами для области редактирования
 */
export class PuzzleSceneRunGameMapper {
  static toFirebase(puzzle: PuzzleEditScene): PuzzleSceneRunGameFirebase {

    return {
      id: puzzle.id,
      title: puzzle.title,
      text: puzzle.text,
      soundFileId: puzzle.soundFileLink ? puzzle.soundFileLink.id : '',
      color: puzzle.color,

      imagePuzzleFileId: puzzle.imagePuzzleFileId ? puzzle.imagePuzzleFileId : '',

      imageFileId: puzzle.imageFileId ? puzzle.imageFileId : '',
      videoFileId: puzzle.videoFileId ? puzzle.videoFileId : '',

      answers: puzzle.answers.map(item => {
        return AnswerEditorMapper.toFirebase(item)
      }),
      typesScene: puzzle.typesScene,
      players: puzzle.players,
      isStartGame: puzzle.isStartGame,

      imgInPlace1: puzzle.imgInPlace1.map(item => {
        return ImagePuzzleEditorMapper.toFirebase(item)
      }),

      imgInPlace2: puzzle.imgInPlace2.map(item => {
        return ImagePuzzleEditorMapper.toFirebase(item)
      }),

      imgInPlace3: puzzle.imgInPlace3.map(item => {
        return ImagePuzzleEditorMapper.toFirebase(item)
      }),

      imgInPlace4: puzzle.imgInPlace4.map(item => {
        return ImagePuzzleEditorMapper.toFirebase(item)
      }),

      imgInPlace5: puzzle.imgInPlace5.map(item => {
        return ImagePuzzleEditorMapper.toFirebase(item)
      }),

      imgInPlace6: puzzle.imgInPlace6.map(item => {
        return ImagePuzzleEditorMapper.toFirebase(item)
      }),

      imgInPlace7: puzzle.imgInPlace7.map(item => {
        return ImagePuzzleEditorMapper.toFirebase(item)
      }),

      imgInPlace8: puzzle.imgInPlace8.map(item => {
        return ImagePuzzleEditorMapper.toFirebase(item)
      }),

      imgInPlace9: puzzle.imgInPlace9.map(item => {
        return ImagePuzzleEditorMapper.toFirebase(item)
      }),

      dataForPlayerPartsImages: puzzle.dataForPlayerPartsImages.map(item => {
        return SceneForEditPuzzleControlPlayerEditorMapper.toFirebase(item, puzzle)
      })

    } as PuzzleSceneRunGameFirebase;

  }

  static toDtoRunGame(puzzleFirebase: PuzzleSceneRunGameFirebase): PuzzleRunGame {

    const puzzle = new PuzzleRunGame()
    puzzle.id = puzzleFirebase.id
    puzzle.title = puzzleFirebase.title
    puzzle.text = puzzleFirebase.text
    puzzle.color = puzzleFirebase.color
    puzzle.soundFileId = puzzleFirebase.soundFileId
    puzzle.typesScene = puzzleFirebase.typesScene
    puzzle.isStartGame = puzzleFirebase.isStartGame
    puzzle.imagePuzzleFileId = puzzleFirebase.imagePuzzleFileId

    puzzle.imageFileId = puzzleFirebase.imageFileId
    puzzle.videoFileId = puzzleFirebase.videoFileId


    puzzle.players = puzzleFirebase.players

    puzzle.answers = puzzleFirebase.answers.map(item => {
      return AnswerRunGameMapper.toDtoRunGame(item, puzzle)
    })

    puzzle.maxCountAnswers = puzzleFirebase.maxCountAnswers

    const partsPuzzleImages: PartsPuzzleImage[] = []

    for (let i: number = 1; i <= 9; i++) {

      const partsPuzzleImage = new PartsPuzzleImage()
      partsPuzzleImage.id = i
      partsPuzzleImage.src = ''

      partsPuzzleImages.push(partsPuzzleImage)
    }

    puzzle.partsPuzzleImages = partsPuzzleImages

    puzzle.imgInPlace1 = this.arrayPuzzleFBtoModelMapping(puzzleFirebase.imgInPlace1)
    puzzle.imgInPlace2 = this.arrayPuzzleFBtoModelMapping(puzzleFirebase.imgInPlace2)
    puzzle.imgInPlace3 = this.arrayPuzzleFBtoModelMapping(puzzleFirebase.imgInPlace3)
    puzzle.imgInPlace4 = this.arrayPuzzleFBtoModelMapping(puzzleFirebase.imgInPlace4)
    puzzle.imgInPlace5 = this.arrayPuzzleFBtoModelMapping(puzzleFirebase.imgInPlace5)
    puzzle.imgInPlace6 = this.arrayPuzzleFBtoModelMapping(puzzleFirebase.imgInPlace6)
    puzzle.imgInPlace7 = this.arrayPuzzleFBtoModelMapping(puzzleFirebase.imgInPlace7)
    puzzle.imgInPlace8 = this.arrayPuzzleFBtoModelMapping(puzzleFirebase.imgInPlace8)
    puzzle.imgInPlace9 = this.arrayPuzzleFBtoModelMapping(puzzleFirebase.imgInPlace9)

    if(puzzleFirebase.dataForPlayerPartsImages) {
      puzzle.dataForPlayerPartsImages = puzzleFirebase.dataForPlayerPartsImages?.map((item) => {
        return SceneForControlPuzzlePlayerRunGameMapper.toDtoForRunGame(item)
      })
    } else {
      puzzle.dataForPlayerPartsImages = []
    }

    return puzzle
  }

  private static arrayPuzzleFBtoModelMapping(imgInPlaceFirebase: PartsPuzzleImageFirebase[] | undefined) {
    if (imgInPlaceFirebase) {
      return imgInPlaceFirebase.map(item => {
        return ImagePuzzleEditorMapper.toDto(item)
      })
    } else {
      return []
    }
  }
}
