import {Answer} from "./answer.model"
import {Coordinate} from "./coordinate.model"
import {AnswerFirebase} from "./firebase-models/answer-firebase.model"
import {PanoramaFirebase} from "./firebase-models/panorama-firebase.model"
import {PuzzleFirebase} from "./firebase-models/puzzle-firebase.model"
import {SceneAnswerFirebase} from "./firebase-models/scene-answer-firestore.model"
import {ItemPartsPuzzleImage} from "../../core/models/item-parts-puzzle-image.model"
import {PartsPuzzleImage} from "../../core/models/parts-puzzle-image.model"
import {Player} from "../../run-game/models/other-models/player.model"
import {IBaseEditScene} from "./base-edit-scene.model";
import {PanoramaEditScene} from "./panorama-edit-scene";
import {SceneEditScene} from "./scene-edit-scene";
import {PuzzleEditScene, SceneForEditPlayer} from "./puzzle-edit-scene";
import {PartsPuzzleImageFirebase} from "./firebase-models/parts-puzzle-image-firebase.model";
import {SceneForEditPlayerFirebase} from "./firebase-models/scene-for-edit-player-firebase.model";

export class Mapper {

  static sceneForEditPlayerFirebaseToSceneForEditPlayer(sceneForEditPlayer: SceneForEditPlayerFirebase): SceneForEditPlayer {
    const value = new SceneForEditPlayer()
    value.playerId = sceneForEditPlayer.playerId
    value.name = sceneForEditPlayer.name
    //TODO: раскомментировать

    //debugger
    value.imgPlace1 = sceneForEditPlayer.imgPlace1 ? [sceneForEditPlayer.imgPlace1] : []
    value.imgPlace2 = sceneForEditPlayer.imgPlace2 ? [sceneForEditPlayer.imgPlace2] : []
    value.imgPlace3 = sceneForEditPlayer.imgPlace3 ? [sceneForEditPlayer.imgPlace3] : []
    value.imgPlace4 = sceneForEditPlayer.imgPlace4 ? [sceneForEditPlayer.imgPlace4] : []
    value.imgPlace5 = sceneForEditPlayer.imgPlace5 ? [sceneForEditPlayer.imgPlace5] : []
    value.imgPlace6 = sceneForEditPlayer.imgPlace6 ? [sceneForEditPlayer.imgPlace6] : []
    value.imgPlace7 = sceneForEditPlayer.imgPlace7 ? [sceneForEditPlayer.imgPlace7] : []
    value.imgPlace8 = sceneForEditPlayer.imgPlace8 ? [sceneForEditPlayer.imgPlace8] : []
    value.imgPlace9 = sceneForEditPlayer.imgPlace9 ? [sceneForEditPlayer.imgPlace9] : []
    //
    // value.isDraggableImgPlace1 = sceneForEditPlayer.isDraggableImgPlace1
    // value.isDraggableImgPlace2 = sceneForEditPlayer.isDraggableImgPlace2
    // value.isDraggableImgPlace3 = sceneForEditPlayer.isDraggableImgPlace2
    // value.isDraggableImgPlace4 = sceneForEditPlayer.isDraggableImgPlace4
    // value.isDraggableImgPlace5 = sceneForEditPlayer.isDraggableImgPlace5
    // value.isDraggableImgPlace6 = sceneForEditPlayer.isDraggableImgPlace6
    // value.isDraggableImgPlace7 = sceneForEditPlayer.isDraggableImgPlace7
    // value.isDraggableImgPlace8 = sceneForEditPlayer.isDraggableImgPlace8
    // value.isDraggableImgPlace9 = sceneForEditPlayer.isDraggableImgPlace9
    //
    //
    // value.imgPlace1 = sceneForEditPlayer.imgPlace1
    // value.imgPlace2 = sceneForEditPlayer.imgPlace2
    // value.imgPlace3 = sceneForEditPlayer.imgPlace3
    // value.imgPlace4 = sceneForEditPlayer.imgPlace4
    // value.imgPlace5 = sceneForEditPlayer.imgPlace5
    // value.imgPlace6 = sceneForEditPlayer.imgPlace6
    // value.imgPlace7 = sceneForEditPlayer.imgPlace7
    // value.imgPlace8 = sceneForEditPlayer.imgPlace8
    // value.imgPlace9 = sceneForEditPlayer.imgPlace9

    return value
  }

  static sceneForEditPlayerToSceneForEditPlayerFirebase(sceneForEditPlayer: SceneForEditPlayer,
                                                        puzzleEditScene: PuzzleEditScene): SceneForEditPlayerFirebase {
    return {
      playerId: sceneForEditPlayer.playerId,

      name: sceneForEditPlayer.name,

      // Доступные изображения для выбора
      imgPlace1: Mapper.partsPuzzleImageToPartsPuzzleImageFirebase(sceneForEditPlayer.imgPlace1[0]),
      imgPlace2: Mapper.partsPuzzleImageToPartsPuzzleImageFirebase(sceneForEditPlayer.imgPlace2[0]),
      imgPlace3: Mapper.partsPuzzleImageToPartsPuzzleImageFirebase(sceneForEditPlayer.imgPlace3[0]),
      imgPlace4: Mapper.partsPuzzleImageToPartsPuzzleImageFirebase(sceneForEditPlayer.imgPlace4[0]),
      imgPlace5: Mapper.partsPuzzleImageToPartsPuzzleImageFirebase(sceneForEditPlayer.imgPlace5[0]),
      imgPlace6: Mapper.partsPuzzleImageToPartsPuzzleImageFirebase(sceneForEditPlayer.imgPlace6[0]),
      imgPlace7: Mapper.partsPuzzleImageToPartsPuzzleImageFirebase(sceneForEditPlayer.imgPlace7[0]),
      imgPlace8: Mapper.partsPuzzleImageToPartsPuzzleImageFirebase(sceneForEditPlayer.imgPlace8[0]),
      imgPlace9: Mapper.partsPuzzleImageToPartsPuzzleImageFirebase(sceneForEditPlayer.imgPlace9[0]),

      // Проверка есть ли на сцене что-то
      imgInPlace1: Mapper.partsPuzzleImageToPartsPuzzleImageFirebase(puzzleEditScene.imgInPlace1[0]),
      isDraggableImgPlace1: puzzleEditScene.imgInPlace1.length > 0 ? false : true,

      imgInPlace2: Mapper.partsPuzzleImageToPartsPuzzleImageFirebase(puzzleEditScene.imgInPlace2[0]),
      isDraggableImgPlace2: puzzleEditScene.imgInPlace2.length > 0 ? false : true,

      imgInPlace3: Mapper.partsPuzzleImageToPartsPuzzleImageFirebase(puzzleEditScene.imgInPlace3[0]),
      isDraggableImgPlace3: puzzleEditScene.imgInPlace3.length > 0 ? false : true,

      imgInPlace4: Mapper.partsPuzzleImageToPartsPuzzleImageFirebase(puzzleEditScene.imgInPlace4[0]),
      isDraggableImgPlace4: puzzleEditScene.imgInPlace4.length > 0 ? false : true,

      imgInPlace5: Mapper.partsPuzzleImageToPartsPuzzleImageFirebase(puzzleEditScene.imgInPlace5[0]),
      isDraggableImgPlace5: puzzleEditScene.imgInPlace5.length > 0 ? false : true,

      imgInPlace6: Mapper.partsPuzzleImageToPartsPuzzleImageFirebase(puzzleEditScene.imgInPlace6[0]),
      isDraggableImgPlace6: puzzleEditScene.imgInPlace6.length > 0 ? false : true,

      imgInPlace7: Mapper.partsPuzzleImageToPartsPuzzleImageFirebase(puzzleEditScene.imgInPlace7[0]),
      isDraggableImgPlace7: puzzleEditScene.imgInPlace7.length > 0 ? false : true,

      imgInPlace8: Mapper.partsPuzzleImageToPartsPuzzleImageFirebase(puzzleEditScene.imgInPlace8[0]),
      isDraggableImgPlace8: puzzleEditScene.imgInPlace8.length > 0 ? false : true,

      imgInPlace9: Mapper.partsPuzzleImageToPartsPuzzleImageFirebase(puzzleEditScene.imgInPlace9[0]),
      isDraggableImgPlace9: puzzleEditScene.imgInPlace9.length > 0 ? false : true,

    } as SceneForEditPlayerFirebase
  }

  static partsPuzzleImageToPartsPuzzleImageFirebase(partsPuzzleImage: PartsPuzzleImage | null): PartsPuzzleImageFirebase {

    if(!partsPuzzleImage) {
      return null;
    }

    return {
      id: partsPuzzleImage.id,
      src: partsPuzzleImage.src
    } as PartsPuzzleImageFirebase
  }

  static partsPuzzleImageFirebaseToPartsPuzzleImage(partsPuzzleImage: PartsPuzzleImageFirebase): PartsPuzzleImage {
    return {
      id: partsPuzzleImage.id,
      src: partsPuzzleImage.src
    } as PartsPuzzleImage
  }

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

    // const playerScenePartsPuzzleImages: {
    //   playerId: string,
    //
    //   scenePartsPuzzleImages: {
    //     number: number,
    //     imgId: number
    //   }[]
    //
    // }[] = puzzle.playerScenePartsPuzzleImages.map(item => {
    //   return {
    //     playerId: item.playerId,
    //     scenePartsPuzzleImages: item.scenePartsPuzzleImages.map(x => {
    //       return {
    //         number: x.number,
    //         imgId: x.value ? x.value.id : null
    //       }
    //     })
    //   }
    // })

    // const playerScenePartsPuzzleImages: {
    //   playerId: string,
    //   dataForPlayerPartsImages: SceneForEditPlayer
    //   }[] = puzzle.dataForPlayerPartsImages.map((item) => {
    //     return {
    //       playerId: item.playerId,
    //       dataForPlayerPartsImages: item
    //     }
    //   })

    // Изображение на экране сцены
    // const scenePartsPuzzleImages: {
    //   number: number,
    //   imgId: number
    // }[] = puzzle.scenePartsPuzzleImages.map(item => {
    //   return {
    //     number: item.number,
    //     imgId: item.value ? item.value.id : null
    //   }
    // })

    //const dataForPlayerPartsImages: SceneForEditPlayer[] = puzzle.dataForPlayerPartsImages

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

      imgInPlace1: puzzle.imgInPlace1.map(item => {
        return Mapper.partsPuzzleImageToPartsPuzzleImageFirebase(item)
      }),

      imgInPlace2: puzzle.imgInPlace2.map(item => {
        return Mapper.partsPuzzleImageToPartsPuzzleImageFirebase(item)
      }),

      imgInPlace3: puzzle.imgInPlace3.map(item => {
        return Mapper.partsPuzzleImageToPartsPuzzleImageFirebase(item)
      }),

      imgInPlace4: puzzle.imgInPlace4.map(item => {
        return Mapper.partsPuzzleImageToPartsPuzzleImageFirebase(item)
      }),

      imgInPlace5: puzzle.imgInPlace5.map(item => {
        return Mapper.partsPuzzleImageToPartsPuzzleImageFirebase(item)
      }),

      imgInPlace6: puzzle.imgInPlace6.map(item => {
        return Mapper.partsPuzzleImageToPartsPuzzleImageFirebase(item)
      }),

      imgInPlace7: puzzle.imgInPlace7.map(item => {
        return Mapper.partsPuzzleImageToPartsPuzzleImageFirebase(item)
      }),

      imgInPlace8: puzzle.imgInPlace8.map(item => {
        return Mapper.partsPuzzleImageToPartsPuzzleImageFirebase(item)
      }),

      imgInPlace9: puzzle.imgInPlace9.map(item => {
        return Mapper.partsPuzzleImageToPartsPuzzleImageFirebase(item)
      }),

      dataForPlayerPartsImages: puzzle.dataForPlayerPartsImages.map(item => {
        return Mapper.sceneForEditPlayerToSceneForEditPlayerFirebase(item, puzzle)
      })

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
        return Mapper.sceneForEditPlayerFirebaseToSceneForEditPlayer(item)
      })
    } else {
      puzzle.dataForPlayerPartsImages = []
    }



    return puzzle
  }

  static arrayPuzzleFBtoModelMapping(imgInPlaceFirebase: PartsPuzzleImageFirebase[] | undefined) {
    if (imgInPlaceFirebase) {
      return imgInPlaceFirebase.map(item => {
        return Mapper.partsPuzzleImageFirebaseToPartsPuzzleImage(item)
      })
    } else {
      return []
    }
  }


}
