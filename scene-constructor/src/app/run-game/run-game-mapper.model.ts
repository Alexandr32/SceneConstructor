import { ItemPartsPuzzleImage } from "../core/models/item-parts-puzzle-image.model";
import { PartsPuzzleImage } from "../core/models/parts-puzzle-image.model";
import { Answer } from "../editor/models/answer.model";
import { PuzzleEditScene } from "../editor/models/puzzle-edit-scene";
import { AnswerRunGameFirebase } from "./models/firebase-models/answer-run-game-firebase.model";
import { PanoramaRunGameFirebase } from "./models/firebase-models/panorama-scene-run-game-firebase.model";
import { PuzzleSceneRunGameFirebase } from "./models/firebase-models/puzzle-scene-run-game-firebase.model";
import { SceneAnswerRunGameFirebase } from "./models/firebase-models/scene-answer-run-game-firebase.model";
import { AnswerRunGame } from "./models/other-models/answer.model";
import { IBaseSceneRunGame } from "./models/other-models/base-scene-run-game.model";
import { PuzzleRunGame} from "./models/other-models/scenes.models";
import {SceneRunGame} from "./models/other-models/scene-run-game";
import {PanoramaRunGame} from "./models/other-models/panorama-run-game";
import {SceneEditScene} from "../editor/models/scene-edit-scene";
import {PanoramaEditScene} from "../editor/models/panorama-edit-scene";


export class RunGameMapper {

  static answerToAnswerFirebase(answer: Answer): AnswerRunGameFirebase {
    return {
      id: answer.id,
      text: answer.text,
      position: answer.position,
      sceneId: answer.sceneId,
    } as AnswerRunGameFirebase
  }

  static answerFirebaseToAnswer(answerFirebase: AnswerRunGameFirebase, parentScene: IBaseSceneRunGame): AnswerRunGame {

    return new AnswerRunGame(
      answerFirebase.id,
      answerFirebase.text,
      answerFirebase.position,
      parentScene,
      answerFirebase.sceneId
    )
  }

  static sceneAnswerToSceneAnswerFirebase(scene: SceneEditScene): SceneAnswerRunGameFirebase {

    return {
      id: scene.id,
      title: scene.title,
      text: scene.text,
      soundFileId: scene.soundFileLink ? scene.soundFileLink.id : '',
      imageFileId: scene.imageFileId,
      videoFileId: scene.videoFileId,
      typesScene: scene.typesScene,
      answers: scene.answers.map(item => {
        return RunGameMapper.answerToAnswerFirebase(item)
      }),
      players: scene.players,
      isStartGame: scene.isStartGame
    } as SceneAnswerRunGameFirebase;

  }

  static sceneAnswerFirebaseToSceneAnswer(sceneAnswerFirebase: SceneAnswerRunGameFirebase): SceneRunGame {

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
      return RunGameMapper.answerFirebaseToAnswer(item, scene)
    })

    return scene

  }

  static panoramaToPanoramaFirebase(panorama: PanoramaEditScene): PanoramaRunGameFirebase {

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
        return RunGameMapper.answerToAnswerFirebase(item)
      }),

      imageFileId: panorama.imageFileId,
      isTimer: panorama.isTimer,
      times: panorama.times
    } as PanoramaRunGameFirebase;
  }

  static panoramaFirebaseToPanorama(panoramaFirebase: PanoramaRunGameFirebase): PanoramaRunGame {
    const panorama = new PanoramaRunGame()
    panorama.id = panoramaFirebase.id
    panorama.title = panoramaFirebase.title
    panorama.text = panoramaFirebase.text

    panorama.soundFileId = panoramaFirebase.soundFileId
    panorama.typesScene = panoramaFirebase.typesScene
    panorama.isStartGame = panoramaFirebase.isStartGame

    panorama.players = panoramaFirebase.players
    panorama.answers = panoramaFirebase.answers.map(item => {
      return RunGameMapper.answerFirebaseToAnswer(item, panorama)
    })

    panorama.imageFileId = panoramaFirebase.imageFileId
    panorama.isTimer = panoramaFirebase.isTimer
    panorama.times = panoramaFirebase.times

    return panorama
  }

  static puzzleToPuzzleFirebase(puzzle: PuzzleEditScene): PuzzleSceneRunGameFirebase {

    const playerScenePartsPuzzleImages: {
      playerId: string,
      scenePartsPuzzleImages: {
        number: number,
        imgId: number
      }[]
    }[] = puzzle.playerScenePartsPuzzleImages.map(item => {
      return {
        playerId: item.playerId,
        scenePartsPuzzleImages: item.scenePartsPuzzleImages.map(x => {
          return {
            number: x.number,
            imgId: x.value ? x.value.id : null
          }
        })
      }
    })

    // Изображение на экране сцены
    const scenePartsPuzzleImages: {
      number: number,
      imgId: number
    }[] = puzzle.scenePartsPuzzleImages.map(item => {
      return {
        number: item.number,
        imgId: item.value ? item.value.id : null
      }
    })

    return {
      id: puzzle.id,
      title: puzzle.title,
      text: puzzle.text,
      soundFileId: puzzle.soundFileLink ? puzzle.soundFileLink.id : '',
      imagePuzzleFileId: puzzle.imagePuzzleFileId,
      // Изображение фона
      imageFileId: puzzle.imageFileId,
      // Видео фона
      videoFileId: puzzle.videoFileId,
      answers: puzzle.answers.map(item => {
        return RunGameMapper.answerToAnswerFirebase(item)
      }),
      typesScene: puzzle.typesScene,
      players: puzzle.players,
      isStartGame: puzzle.isStartGame,
      scenePartsPuzzleImages: scenePartsPuzzleImages,
      playerScenePartsPuzzleImages: playerScenePartsPuzzleImages
    } as PuzzleSceneRunGameFirebase;

  }

  static puzzleFirebaseToPuzzle(puzzleFirebase: PuzzleSceneRunGameFirebase): PuzzleRunGame {
    const puzzle = new PuzzleRunGame()
    puzzle.id = puzzleFirebase.id
    puzzle.title = puzzleFirebase.title
    puzzle.text = puzzleFirebase.text

    puzzle.soundFileId = puzzleFirebase.soundFileId
    puzzle.typesScene = puzzleFirebase.typesScene
    puzzle.isStartGame = puzzleFirebase.isStartGame

    puzzle.imagePuzzleFileId = puzzleFirebase.imagePuzzleFileId
    puzzle.imageFileId = puzzleFirebase.imageFileId
    puzzle.videoFileId = puzzleFirebase.videoFileId

    puzzle.players = puzzleFirebase.players

    puzzle.answers = puzzleFirebase.answers.map(item => {
      return RunGameMapper.answerFirebaseToAnswer(item, puzzle)
    })

    const partsPuzzleImages: PartsPuzzleImage[] = []

    for (let i: number = 1; i <= 9; i++) {

      const partsPuzzleImage = new PartsPuzzleImage()
      partsPuzzleImage.id = i
      partsPuzzleImage.src = ''

      partsPuzzleImages.push(partsPuzzleImage)
    }

    puzzle.partsPuzzleImages = partsPuzzleImages

    puzzle.scenePartsPuzzleImages = puzzleFirebase.scenePartsPuzzleImages
      .map((item: { number: number, imgId: number }, index) => {
      return {
        number: item.number,
        value: item.imgId ? ({ id: item.imgId, src: '' } as PartsPuzzleImage) : null
      }
    })

    puzzle.playerScenePartsPuzzleImages = puzzleFirebase
      .playerScenePartsPuzzleImages.map((item, index) => {

        return {
          playerId: item.playerId,
          scenePartsPuzzleImages: item.scenePartsPuzzleImages.map(x => {
            return {
              number: x.number,
              value: x.imgId
                ? {
                  id: x.imgId,
                  src: ''
                } as PartsPuzzleImage
                : null
            } as ItemPartsPuzzleImage
          })

        }
      })

    return puzzle
  }
}
