import {Injectable} from '@angular/core';
import { first, map, take} from 'rxjs/operators';
import {Game as EditGame} from '../../editor/models/game.model';
import {Player} from "../models/other-models/player.model";
import {TypeSceneEnum} from 'src/app/core/models/type-scene.enum';
import {RunGameMapper} from '../run-game-mapper.model';
import {PuzzleEditScene} from 'src/app/editor/models/puzzle-edit-scene';
import {SceneAnswerRunGameFirebase} from '../models/firebase-models/scene-answer-run-game-firebase.model';
import {PanoramaRunGameFirebase} from '../models/firebase-models/panorama-scene-run-game-firebase.model';
import {PuzzleSceneRunGameFirebase} from '../models/firebase-models/puzzle-scene-run-game-firebase.model';
import {FileService} from 'src/app/core/services/file.service';
import {TypeFile} from 'src/app/editor/models/type-file.model';
import {RunGame} from '../models/other-models/run-game.model';
import {PuzzleRunGame} from "../models/other-models/scenes.models";
import {PanoramaEditScene} from "../../editor/models/panorama-edit-scene";
import {SceneRunGame} from "../models/other-models/scene-run-game";
import {PanoramaRunGame} from "../models/other-models/panorama-run-game";
import {SceneEditScene} from "../../editor/models/scene-edit-scene";
import {AngularFirestore} from "@angular/fire/compat/firestore";
import {AngularFireStorage} from "@angular/fire/compat/storage";
import {IBaseSceneRunGame} from "../models/other-models/base-scene-run-game.model";

@Injectable({
  providedIn: 'root'
})
export class RunGameService {

  private readonly runGameCollection = 'RunGameCollection'

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
            return RunGameMapper.sceneAnswerToSceneAnswerFirebase(scene as SceneEditScene)
          }
          case TypeSceneEnum.Panorama: {
            return RunGameMapper.panoramaToPanoramaFirebase((scene as PanoramaEditScene))
          }
          case TypeSceneEnum.Puzzle: {
            return RunGameMapper.puzzleToPuzzleFirebase((scene as PuzzleEditScene))
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

          const promiseImg = this.promiseAnswerImageScene(
            resultGame.id,
            (item as SceneRunGame)
          )
          promiseList.push(promiseImg)
          break
        }
        case TypeSceneEnum.Panorama: {

          const promise = this.promisePanoramaImageScene(
            resultGame.id,
            (item as PanoramaRunGame)
          )
          promiseList.push(promise)

          break
        }
        case TypeSceneEnum.Puzzle: {

          const promise = this.promisePuzzleImageScene(
            resultGame.id,
            (item as PuzzleRunGame)
          )
          promiseList.push(promise)
          break
        }
      }


      const promise = this.promiseSoundScene(resultGame.id,item)
      promiseList.push(promise)
    }

    await Promise.all(promisePlayerList)
    await Promise.all(promiseList)

    return resultGame
  }

  private async promiseSoundScene(resultGameId: string, scene: IBaseSceneRunGame) {

    if(scene.soundFileId) {
      try {
        scene.soundFile = await this.fileService
          .getUrl(resultGameId, scene.soundFileId, TypeFile.Sound)
          .toPromise()
      } catch (error) {
        console.log('Звук не найден или не установлен');
        console.log(error);
      }
    }

  }

  private async promisePuzzleImageScene(resultGameId: string, scene: PuzzleRunGame) {

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

    if (scene.imageFileId) {
      try {
        scene.imageFile = await this.fileService.getUrl(resultGameId, scene.imageFileId, TypeFile.SceneImages).toPromise()
      } catch (error) {
        scene.imageFile = '/assets/http_scene.jpg';
        console.error('Изображение не найдено');
        console.error(error);
      }
    } else {
      scene.imageFile = '/assets/http_scene.jpg';
    }

    for (const item of scene.partsPuzzleImages) {
      const src = await this.fileService.getUplPartsPuzzleImages(resultGameId, scene.imagePuzzleFileId, item).toPromise()
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
  }

  private async promisePanoramaImageScene(resultGameId: string, scene: PanoramaRunGame) {

    try {
      scene.imageFile = await this.fileService.getUrl(resultGameId, scene.imageFileId, TypeFile.PanoramaImages).toPromise()
    } catch (error) {
      scene.imageFile = '/assets/http_scene.jpg';
      console.error('Изображение не найдено');
      console.error(error);
    }
  }

  private async promiseAnswerImageScene(resultGameId: string, scene: SceneRunGame) {

    if(scene.imageFileId) {
      try {
        scene.imageFile = await this.fileService.getUrl(resultGameId, scene.imageFileId, TypeFile.SceneImages)
          .toPromise()
      } catch (error) {
        scene.imageFile = '/assets/http_scene.jpg';
        console.error('Изображение не найдено');
        console.error(error);
      }
    } else {
      scene.imageFile = '/assets/http_scene.jpg';
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

  }

}
