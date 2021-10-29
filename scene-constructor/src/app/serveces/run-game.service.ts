import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { AngularFireStorage } from '@angular/fire/storage';
import { Observable } from 'rxjs';
import { first, map } from 'rxjs/operators';
import { Game as EditGame } from '../models/game.model';
import { Answer, Game, Player, Scene, StateGame } from '../models/run/run-game.models';
import { IBaseScene } from '../models/scene.model';

@Injectable({
  providedIn: 'root'
})
export class RunGameService {

  private readonly runGameCollection = 'RunGameCollection'
  private readonly stateGame = 'StateGame'

  constructor(private fireStore: AngularFirestore, private storage: AngularFireStorage) { }

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

      const answers = [...(scene.answers
        .map(item => {
          return {
            id: item.id,
            text: item.text,
            position: item.position,
            sceneId: item.sceneId ? item.sceneId : '',
          };
        }))];

      return {
        id: scene.id,
        title: scene.title,
        text: scene.text,
        //imageFileId: scene.imageFileId,
        //videoFileId: scene.videoFileId,
        answers: answers,
        players: scene.players,
        isStartGame: scene.isStartGame,
      };
    }))
    ];

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
  async saveSelectAnswerStateGame(stateGameId: string, player: Player, selectAnswer: Answer) {

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

  // RunGameCollection/NEd2cC8BFsg84VWOU75A/StateGame
  //RunGameCollection/NEd2cC8BFsg84VWOU75A/StateGame/NEd2cC8BFsg84VWOU75A)

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

    // .doc(this.fireStore.createId())
    // .snapshotChanges()
    // .pipe(
    //   map((doc) => {
    //     const stateGame = doc.payload.data() as StateGame
    //     stateGame.id = doc.payload.id;
    //     return stateGame;
    //   })
    // )
  }

  async getGameById(gameId: string) {

    return this.fireStore.doc<Game>(`${this.runGameCollection}/${gameId}`)
      .snapshotChanges()
      .pipe(
        map((doc) => {
          const game = doc.payload.data() as Game;
          game.scenes.forEach(scene => {
            const answers: Answer[] = [];
            scene.answers.forEach(answerInFireBase => {

              const answer = new Answer(
                answerInFireBase.id,
                answerInFireBase.text,
                answerInFireBase.position,
                scene,
                answerInFireBase.sceneId
              );

              answers.push(answer);
            });
            scene.answers = answers;
          });

          game.players = game.players.map((player) => {
            return new Player(
              player.id,
              player.name,
              player.description,
              player.imageFileId);
          });

          game.id = doc.payload.id;
          return game;
        })
      )
      .pipe(first());
  }

}
