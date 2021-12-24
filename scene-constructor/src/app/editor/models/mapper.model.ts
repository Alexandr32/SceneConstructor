import { Answer } from "./answer.model"
import { Coordinate } from "./coordinate.model"
import { AnswerFirebase } from "./firebase-models/answer-firebase.model"
import { PanoramaFirebase } from "./firebase-models/panorama-firebase.model"
import { PuzzleFirebase } from "./firebase-models/puzzle-firebase.model"
import { SceneAnswerFirebase } from "./firebase-models/scene-answer-firestore.model"
import { ItemPartsPuzzleImage } from "../../core/models/item-parts-puzzle-image.model"
import { PartsPuzzleImage } from "../../core/models/parts-puzzle-image.model"
import { Player } from "../../run-game/models/other-models/player.model"
import {IBaseEditScene} from "./base-edit-scene.model";
import {PanoramaEditScene} from "./panorama-edit-scene";
import {SceneEditScene} from "./scene-edit-scene";
import {PuzzleEditScene} from "./puzzle-edit-scene";

export class Mapper {

  static answerToAnswerFirebase(answer: Answer): AnswerFirebase {

    return {
      id: answer.id,
      text: answer.text,
      position: answer.position,
      sceneId: answer.sceneId ? answer.sceneId : '',
      coordinate: {
        x: answer.coordinate.x,
        y: answer.coordinate.y
      }
    } as AnswerFirebase;
  }

  static answerFirebaseToAnswer(answerFirebase: AnswerFirebase, parentScene: IBaseEditScene): Answer {

    return new Answer(
      answerFirebase.id,
      answerFirebase.text,
      answerFirebase.position,
      parentScene,
      answerFirebase.sceneId
    )
  }

  static sceneAnswerToSceneAnswerFirebase(scene: SceneEditScene): SceneAnswerFirebase {

    return {
      id: scene.id,
      title: scene.title,
      text: scene.text,
      soundFileId: scene.soundFileLink ? scene.soundFileLink.id : '',
      color: scene.color,
      imageFileId: scene.imageFileId,
      videoFileId: scene.videoFileId,
      coordinate: {
        x: scene.coordinate.x,
        y: scene.coordinate.y
      },
      typesScene: scene.typesScene,
      answers: scene.answers.map(item => {
        return Mapper.answerToAnswerFirebase(item)
      }),
      players: scene.players,
      isStartGame: scene.isStartGame
    } as SceneAnswerFirebase;

  }

  static sceneAnswerFirebaseToSceneAnswer(sceneAnswerFirebase: SceneAnswerFirebase): SceneEditScene {

    const scene = new SceneEditScene()
    scene.id = sceneAnswerFirebase.id
    scene.title = sceneAnswerFirebase.title
    scene.text = sceneAnswerFirebase.text
    scene.color = sceneAnswerFirebase.color

    scene.soundFileId = sceneAnswerFirebase.soundFileId

    scene.typesScene = sceneAnswerFirebase.typesScene

    scene.isStartGame = sceneAnswerFirebase.isStartGame

    const coordinate = {
      x: sceneAnswerFirebase.coordinate.x,
      y: sceneAnswerFirebase.coordinate.y
    }

    scene.coordinate = coordinate

    scene.players = sceneAnswerFirebase.players

    scene.imageFileId = sceneAnswerFirebase.imageFileId
    scene.videoFileId = sceneAnswerFirebase.videoFileId

    scene.answers = sceneAnswerFirebase.answers.map(item => {
      return Mapper.answerFirebaseToAnswer(item, scene)
    })

    scene.maxCountAnswers = sceneAnswerFirebase.maxCountAnswers

    return scene

  }

  static panoramaToPanoramaFirebase(panorama: PanoramaEditScene): PanoramaFirebase {

    return {
      id: panorama.id,
      title: panorama.title,
      text: panorama.text,
      color: panorama.color,
      soundFileId: panorama.soundFileLink ? panorama.soundFileLink.id : '',
      typesScene: panorama.typesScene,
      isStartGame: panorama.isStartGame,
      coordinate: {
        x: panorama.coordinate.x,
        y: panorama.coordinate.y
      },
      players: panorama.players,
      answers: panorama.answers.map(item => {
        return Mapper.answerToAnswerFirebase(item)
      }),

      maxCountAnswers: panorama.maxCountAnswers,
      imageFileId: panorama.imageFileId,
      isTimer: panorama.isTimer,
      times: panorama.times
    } as PanoramaFirebase;
  }

  static panoramaFirebaseToPanorama(panoramaFirebase: PanoramaFirebase): PanoramaEditScene {
    const panorama = new PanoramaEditScene()
    panorama.id = panoramaFirebase.id
    panorama.title = panoramaFirebase.title
    panorama.text = panoramaFirebase.text
    panorama.color = panoramaFirebase.color
    panorama.soundFileId = panoramaFirebase.soundFileId
    panorama.typesScene = panoramaFirebase.typesScene
    panorama.isStartGame = panoramaFirebase.isStartGame

    const coordinate = new Coordinate()
    coordinate.x = panoramaFirebase.coordinate.x
    coordinate.y = panoramaFirebase.coordinate.y

    panorama.coordinate = coordinate

    panorama.color = panoramaFirebase.color
    panorama.players = panoramaFirebase.players
    panorama.answers = panoramaFirebase.answers.map(item => {
      return Mapper.answerFirebaseToAnswer(item, panorama)
    })

    panorama.maxCountAnswers = panoramaFirebase.maxCountAnswers
    panorama.imageFileId = panoramaFirebase.imageFileId
    panorama.isTimer = panoramaFirebase.isTimer
    panorama.times = panoramaFirebase.times


    return panorama

  }

  static puzzleToPuzzleFirebase(puzzle: PuzzleEditScene): PuzzleFirebase {

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
      color: puzzle.color,

      imagePuzzleFileId: puzzle.imagePuzzleFileId ? puzzle.imagePuzzleFileId : '',

      imageFileId: puzzle.imageFileId ? puzzle.imageFileId : '',
      videoFileId: puzzle.videoFileId ? puzzle.videoFileId : '',

      coordinate: {
        x: puzzle.coordinate.x,
        y: puzzle.coordinate.y
      },

      answers: puzzle.answers.map(item => {
        return Mapper.answerToAnswerFirebase(item)
      }),
      typesScene: puzzle.typesScene,
      players: puzzle.players,
      isStartGame: puzzle.isStartGame,
      scenePartsPuzzleImages: scenePartsPuzzleImages,
      playerScenePartsPuzzleImages: playerScenePartsPuzzleImages
    } as PuzzleFirebase;

  }

  static puzzleFirebaseToPuzzle(puzzleFirebase: PuzzleFirebase): PuzzleEditScene {
    const puzzle = new PuzzleEditScene()
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

    const coordinate = new Coordinate()
    coordinate.x = puzzleFirebase.coordinate.x
    coordinate.y = puzzleFirebase.coordinate.y

    puzzle.coordinate = coordinate

    puzzle.players = puzzleFirebase.players

    puzzle.answers = puzzleFirebase.answers.map(item => {
      return Mapper.answerFirebaseToAnswer(item, puzzle)
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

    puzzle.scenePartsPuzzleImages = puzzleFirebase.scenePartsPuzzleImages.map((item: { number: number, imgId: number }, index) => {
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
