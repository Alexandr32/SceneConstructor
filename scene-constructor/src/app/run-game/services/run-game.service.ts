import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { AngularFireStorage } from '@angular/fire/storage';
import { Observable } from 'rxjs';
import { first, map } from 'rxjs/operators';
import { Game as EditGame } from '../../editor/models/game.model';
import { StateGame } from "../models/other-models/state-game.model";
import { Player } from "../models/other-models/player.model";
import { AnswerRunGame } from "../models/other-models/answer.model";
import { TypeSceneEnum } from 'src/app/core/models/type-scene.enum';
import { RunGameMapper } from '../run-game-mapper.model';
import { IBaseScene, Panorama, Puzzle, Scene } from 'src/app/editor/models/scenes.models';
import { SceneAnswerRunGameFirebase } from '../models/firebase-models/scene-answer-run-game-firebase.model';
import { PanoramaRunGameFirebase } from '../models/firebase-models/panorama-scene-run-game-firebase.model';
import { PuzzleSceneRunGameFirebase } from '../models/firebase-models/puzzle-scene-run-game-firebase.model';
import { FileService } from 'src/app/core/services/file.service';
import { TypeFile } from 'src/app/editor/models/type-file.model';
import { RunGame } from '../models/other-models/run-game.model';

@Injectable({
  providedIn: 'root'
})
export class RunGameService {

  private readonly runGameCollection = 'RunGameCollection'
  private readonly stateGame = 'StateGame'

  constructor(
    private fireStore: AngularFirestore,
    private storage: AngularFireStorage,
    private fileService: FileService) { }

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

    const statePlayer = [...game.players.map(item => {
      return { id: item.id, value: '' }
    })]

    try {

      this.fireStore.collection<any>(`${this.runGameCollection}/${game.id}/${this.stateGame}`)
        .doc(game.id)
        .set({
          currentScene: startScene.id,
          answer: statePlayer
        })

    } catch (error) {
      console.error('При сохранении данных состояния игры произошла ошибка', error);
      throw error;
    }

  }

  /**
   *  Сохранение выбранного ответа у сцены
   * @param stateGameId
   * @param player
   * @param selectAnswer
   */
  async saveSelectAnswerStateGame(stateGameId: string, player: Player, selectAnswer: AnswerRunGame) {

    const state = await this.getStateGame(stateGameId)
      .pipe(first()).toPromise()

    const statePlayer = [...state.answer.map(item => {
      return item
    })]

    const answer = statePlayer.find((item) => player.id === item.id)
    answer.value = selectAnswer.id

    state.answer = statePlayer

    this.fireStore.collection<any>(`${this.runGameCollection}/${stateGameId}/${this.stateGame}`)
      .doc(stateGameId)
      .update({ ...state })
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
    const answer = currentScene.players.map(item => {
      return { id: item, value: '' }
    })

    //console.log('currentSceneId:::::::::', currentSceneId);

    this.fireStore.collection<any>(`${this.runGameCollection}/${stateGameId}/${this.stateGame}`)
      .doc(stateGameId)
      .set({ currentScene: currentScene.id, answer: answer })
  }

  getStateGame(gameId: string): Observable<StateGame> {
    return this.fireStore.doc<StateGame>(`${this.runGameCollection}/${gameId}/${this.stateGame}/${gameId}`)
      .snapshotChanges()
      .pipe(
        map((doc) => {
          const stateGame = doc.payload.data() as StateGame;
          stateGame.id = doc.payload.id;
          return new StateGame(stateGame.id, stateGame.currentScene, stateGame.answer);
        })
      )
  }

  getGameById(gameId: string): Observable<RunGame> {

    return this.fireStore.doc<RunGame>(`Games/${gameId}`)
      .snapshotChanges()
      .pipe(
        map((doc) => {
          const game = doc.payload.data() as RunGame;

          game.scenes = game.scenes.map(baseScene => {

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

          game.players = game.players.map((item) => {

            return new Player(
              item.id,
              item.name,
              item.description,
              item.imageFileId);
          });

          game.id = doc.payload.id;
          return game;
        })
      )
      .pipe(first())
      .pipe(
        map((game) => {

          game.scenes.forEach(async item => {
            switch (item.typesScene) {
              case TypeSceneEnum.Answer: {
                await this.fileService.setAnswerSceneFile(game.id, item as Scene)
                break
              }
              case TypeSceneEnum.Panorama: {
                await this.fileService.setFilePanoramaFile(game.id, item as Panorama)
                break
              }
              case TypeSceneEnum.Puzzle: {
                await this.fileService.setFilePuzzleFile(game.id, item as Puzzle)
                break
              }
            }
          })

          game.players.forEach(async player => {
            if (player.imageFileId) {
              try {
                player.imageFile = await this.fileService.getUrl(game.id, player.imageFileId, TypeFile.PlayerImages).toPromise()
              } catch (error) {
                player.imageFile = '/assets/http_player.jpg';
                console.log('Изображение не найдено');
                console.log(error);
              }
            } else {
              player.imageFile = '/assets/http_player.jpg';
            }
          })

          return game
        }))
      .pipe(first());
  }

}
