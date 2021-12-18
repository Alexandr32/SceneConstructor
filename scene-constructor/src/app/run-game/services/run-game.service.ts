import {Injectable} from '@angular/core';
import {AngularFirestore} from '@angular/fire/firestore';
import {AngularFireStorage} from '@angular/fire/storage';
import {BehaviorSubject, Observable, Subject} from 'rxjs';
import {concatMap, first, map, take} from 'rxjs/operators';
import {Game as EditGame} from '../../editor/models/game.model';
import {StateGame} from "../models/other-models/state-game.model";
import {Player} from "../models/other-models/player.model";
import {AnswerRunGame} from "../models/other-models/answer.model";
import {TypeSceneEnum} from 'src/app/core/models/type-scene.enum';
import {RunGameMapper} from '../run-game-mapper.model';
import {IBaseScene, Panorama, Puzzle, Scene} from 'src/app/editor/models/scenes.models';
import {SceneAnswerRunGameFirebase} from '../models/firebase-models/scene-answer-run-game-firebase.model';
import {PanoramaRunGameFirebase} from '../models/firebase-models/panorama-scene-run-game-firebase.model';
import {PuzzleSceneRunGameFirebase} from '../models/firebase-models/puzzle-scene-run-game-firebase.model';
import {FileService} from 'src/app/core/services/file.service';
import {TypeFile} from 'src/app/editor/models/type-file.model';
import {RunGame} from '../models/other-models/run-game.model';
import {IPanoramaCore} from "../../core/models/base-panorama.model";
import {PanoramaRunGame, PuzzleRunGame, SceneRunGame} from "../models/other-models/scenes.models";

@Injectable({
  providedIn: 'root'
})
export class RunGameService {

  private readonly runGameCollection = 'RunGameCollection'
  //private readonly stateGame = 'StateGame'

  get runGame$(): Observable<RunGame> {
    return this._runGame$.asObservable()
  }

  private _runGame$: Subject<RunGame> = new BehaviorSubject(null)

  constructor(
    private fireStore: AngularFirestore,
    private storage: AngularFireStorage,
    private fileService: FileService) {
  }

  async saveNewGame(game: EditGame) {

    const players = [...(game.players.map(item => {
      return {
        id: item.id,
        idForRun: this.fireStore.createId(), // ид для получения ид с телефона
        name: item.name,
        description: item.description,
        imageFileId: item.imageFileId
      };
    }))];

    const scenes = [...(game.scenes.map(scene => {

      const result = (): any => {
        switch (scene.typesScene) {
          case TypeSceneEnum.Answer: {
            return RunGameMapper.sceneAnswerToSceneAnswerFirebase(scene as Scene)
          }
          case TypeSceneEnum.Panorama: {
            return RunGameMapper.panoramaToPanoramaFirebase((scene as Panorama))
          }
          case TypeSceneEnum.Puzzle: {
            return RunGameMapper.puzzleToPuzzleFirebase((scene as Puzzle))
          }
        }
      }

      return result()

    }))];

    const startScene = game.scenes.find(item => {
      if (item.isStartGame) {
        return item
      }
    })

    if (!startScene) {
      throw new Error('Стартовая сцена не найдена')
    }

    try {

      await this.fireStore.collection<any>(this.runGameCollection)
        .doc(game.id)
        .set({
          name: game.name,
          description: game.description,
          scenes: scenes,
          players: players,
        });
    } catch (error) {
      console.error('При сохранении данных игры произошла ошибка', error);
      throw error;
    }

    // const statePlayer = [...game.players.map(item => {
    //   return {id: item.id, value: ''}
    // })]
    //
    // try {
    //
    //   this.fireStore.collection<any>(`${this.runGameCollection}/${game.id}/${this.stateGame}`)
    //     .doc(game.id)
    //     .set({
    //       currentScene: startScene.id,
    //       answer: statePlayer
    //     })
    //
    // } catch (error) {
    //   console.error('При сохранении данных состояния игры произошла ошибка', error);
    //   throw error;
    // }

  }


  async resetDataStateGame(stateGameId: string, currentScene: IBaseScene) {
    //const state = await this.getStateGame(stateGameId)
    //  .pipe(first()).toPromise()

    // const statePlayer = [...state.answer.map(item => {
    //   return item
    // })]

    // const answer = statePlayer.map((item) => {
    //   item.value = ''
    //   return item
    // })

    //state.answer = answer
    // const answer = currentScene.players.map(item => {
    //   return {id: item, value: ''}
    // })
    //
    // //console.log('currentSceneId:::::::::', currentSceneId);
    //
    // this.fireStore.collection<any>(`${this.runGameCollection}/${stateGameId}/${this.stateGame}`)
    //   .doc(stateGameId)
    //   .set({currentScene: currentScene.id, answer: answer})
  }



  async getGameById(gameId: string): Promise<RunGame> {

    const resultGame = await this.fireStore.doc<RunGame>(`Games/${gameId}`)
      .snapshotChanges()
      .pipe(
        map((doc) => {

          const gameFirebase = doc.payload.data() as RunGame;

          const scenes = gameFirebase.scenes.map(baseScene => {

            // Вернет нужный тип данных
            const resultScene = (): any => {
              switch (baseScene.typesScene) {
                case TypeSceneEnum.Answer: {
                  return RunGameMapper.sceneAnswerFirebaseToSceneAnswer(baseScene as unknown as SceneAnswerRunGameFirebase)

                }
                case TypeSceneEnum.Panorama: {
                  return RunGameMapper.panoramaFirebaseToPanorama(baseScene as unknown as PanoramaRunGameFirebase)

                }
                case TypeSceneEnum.Puzzle: {
                  return RunGameMapper.puzzleFirebaseToPuzzle(baseScene as unknown as PuzzleSceneRunGameFirebase)
                }
              }
            }

            return resultScene()
          });

          const players = gameFirebase.players.map((item) => {

            return new Player(
              item.id,
              item.name,
              item.description,
              item.imageFileId);
          });

          const newRunGame = new RunGame(
            doc.payload.id,
            gameFirebase.number,
            gameFirebase.name,
            gameFirebase.description,
            scenes,
            players
          )

          newRunGame.createsScenesMap()

          return newRunGame;
        })
      )
      .pipe(
        first(),
        take(1))
      .toPromise()

    const promisePlayerList = []

    for (let player of resultGame.players) {
      if (player.imageFileId) {
        const promise = this.promiseImgPlayer(resultGame.id, player)
        promisePlayerList.push(promise)
      } else {
        player.imageFile = '/assets/http_player.jpg';
      }
    }

    // Здесь тормоза нужно переписать
    const promiseList = []

    for (let item of resultGame.scenes) {
      switch (item.typesScene) {
        case TypeSceneEnum.Answer: {


          // const promiseImg = this.fileService.setAnswerSceneFile(resultGame.id, item as Scene)
          // promiseList.push(promiseImg)

          const promiseImg = this.promiseAnswerImageScene(
            resultGame.id,
            (item as Scene)
          )
          promiseList.push(promiseImg)
          // //
          // const promiseAnswerVideoScene = this.promiseAnswerVideoScene(
          //   resultGame.id,
          //   (item as Scene)
          // )
          // promiseList.push(promiseAnswerVideoScene)

          // const answer =  this.fileService.setAnswerSceneFile(resultGame.id, item as Scene)
          // const answer = this.fileService.getUrl(resultGame.id, (item as SceneRunGame).imageFileId, TypeFile.SceneImages).toPromise()
          // promiseList.push(answer)
          break
        }
        case TypeSceneEnum.Panorama: {

          // const promise = await this.fileService.setFilePanoramaFile(resultGame.id, item as Panorama)
          // promiseList.push(promise)

          const promise = this.promisePanoramaImageScene(
            resultGame.id,
            (item as PanoramaRunGame)
          )
          promiseList.push(promise)

          //const panorama = await this.fileService.setFilePanoramaFile(resultGame.id, item as Panorama)
          // promiseList.push(panorama)
          break
        }
        case TypeSceneEnum.Puzzle: {

          // const promise = await this.fileService.setFilePuzzleFile(resultGame.id, item as Puzzle)
          // promiseList.push(promise)

          const promise = this.promisePuzzleImageScene(
            resultGame.id,
            (item as PuzzleRunGame)
          )
          promiseList.push(promise)
          //const puzzle = await this.fileService.setFilePuzzleFile(resultGame.id, item as Puzzle)
          // promiseList.push(puzzle)
          break
        }
      }
    }

    await Promise.all(promisePlayerList)
    await Promise.all(promiseList)

    this._runGame$.next(resultGame)

    return resultGame
  }

  private async promisePuzzleImageScene(resultGameId: string, scene: PuzzleRunGame) {

    if (scene.imageFileId) {
      try {
        scene.imageFile = await this.fileService.getUrl(resultGameId, scene.imageFileId, TypeFile.PuzzleImages).toPromise()
      } catch (error) {
        scene.imageFile = '/assets/http_puzzle.jpg';
        console.error('Изображение не найдено');
        console.error(error);
      }
    } else {
      scene.imageFile = '/assets/http_puzzle.jpg';
    }

    // if (scene.soundFileId) {
    //
    //   scene.soundFileLink =
    //     await this.getMediaFileLinkById(resultGameId, TypeFile.Sound, scene.soundFileId)
    //
    // }

    for (const item of scene.partsPuzzleImages) {
      const src = await this.fileService.getUplPartsPuzzleImages(resultGameId, scene.imageFileId, item).toPromise()
      item.src = src

      const scenePartsPuzzleImages = scene.scenePartsPuzzleImages
        .filter(x => x.value !== null)
        .find(p => p.value.id === item.id)

      if (scenePartsPuzzleImages) {
        scenePartsPuzzleImages.value.src = src
      }

    }

    scene.playerScenePartsPuzzleImages.map(x => {
      x.scenePartsPuzzleImages.map(i => {
        if (i.value) {
          i.value.src = scene.partsPuzzleImages.find(f => f.id === i.value.id).src
        }
      })
    })


    // return new Promise((resolve, reject) => {
    //
    //   this.fileService.getUrl(resultGameId, scene.imageFileId, TypeFile.PuzzleImages)
    //     .toPromise()
    //     .then((value) => {
    //       scene.imageFile = value
    //       resolve()
    //     })
    //     .catch((error) => {
    //       scene.imageFile = '/assets/http_puzzle.jpg';
    //       console.error('Изображение не найдено');
    //       console.error(error);
    //       reject()
    //     })
    // })
  }

  private async promisePanoramaImageScene(resultGameId: string, scene: PanoramaRunGame) {

    try {
      scene.imageFile = await this.fileService.getUrl(resultGameId, scene.imageFileId, TypeFile.PanoramaImages).toPromise()
    } catch (error) {
      scene.imageFile = '/assets/http_scene.jpg';
      console.error('Изображение не найдено');
      console.error(error);
    }


    // return new Promise((resolve, reject) => {
    //
    //   this.fileService.getUrl(resultGameId, scene.imageFileId, TypeFile.PanoramaImages)
    //     .toPromise()
    //     .then((value) => {
    //       scene.imageFile = value
    //       resolve()
    //     })
    //     .catch((error) => {
    //       scene.imageFile = '/assets/http_scene.jpg';
    //       console.error('Изображение не найдено');
    //       console.error(error);
    //       reject()
    //     })
    // })
  }

  private async promiseAnswerImageScene(resultGameId: string, scene: SceneRunGame) {

    try {
      scene.imageFile = await this.fileService.getUrl(resultGameId, scene.imageFileId, TypeFile.SceneImages)
        .toPromise()
    } catch (error) {
      scene.imageFile = '/assets/http_scene.jpg';
      console.error('Изображение не найдено');
      console.error(error);
    }


    if (scene.videoFileId) {

      try {
        scene.videoFile = await this.fileService
          .getUrl(resultGameId, scene.videoFileId, TypeFile.SceneVideos)
          .toPromise()
      } catch (error) {
        console.log('Видео не найдено');
        console.log(error);
      }

    }

    // return new Promise((resolve, reject) => {
    //
    //   if (scene.videoFileId) {
    //     this.fileService.getUrl(resultGameId, scene.imageFileId, TypeFile.SceneImages)
    //       .toPromise()
    //       .then((value) => {
    //         scene.imageFile = value
    //         resolve()
    //       })
    //       .catch((error) => {
    //         scene.imageFile = '/assets/http_scene.jpg';
    //         console.log('Изображение не найдено');
    //         console.log(error);
    //         reject()
    //       })
    //   } else {
    //     resolve()
    //   }
    // })
  }

  private async promiseImgPlayer(resultGameId: string, player: Player) {

    try {
      player.imageFile = await this.fileService.getUrl(resultGameId, player.imageFileId, TypeFile.PlayerImages)
        .toPromise()
    } catch (error) {
      player.imageFile = '/assets/http_player.jpg';
      console.log('Изображение не найдено');
      console.log(error);
    }


    // return new Promise((resolve, reject) => {
    //   this.fileService
    //     .getUrl(resultGameId, player.imageFileId, TypeFile.PlayerImages)
    //     .toPromise()
    //     .then((value) => {
    //       player.imageFile = value
    //       resolve()
    //     })
    //     .catch((error) => {
    //       player.imageFile = '/assets/http_player.jpg';
    //       console.log('Изображение не найдено');
    //       console.log(error);
    //       reject()
    //     })
    // })
  }

  // private promiseImgPlayer
  //   = (resultGameId: string, player: Player): Promise<any> => {
  //   return new Promise((resolve, reject) => {
  //     this.fileService
  //       .getUrl(resultGameId, player.imageFileId, TypeFile.PlayerImages)
  //       .toPromise()
  //       .then((value) => {
  //         player.imageFile = value
  //         resolve()
  //       })
  //       .catch((error) => {
  //         player.imageFile = '/assets/http_player.jpg';
  //         console.log('Изображение не найдено');
  //         console.log(error);
  //         reject()
  //       })
  //   })
  // }

  // добавить звук!!!
  // добавить изображения сцен

}
