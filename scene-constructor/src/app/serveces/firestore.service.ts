import { Injectable } from '@angular/core';
import {AngularFirestore} from '@angular/fire/firestore';
import {Game} from '../models/game.model';

@Injectable({
  providedIn: 'root'
})
export class FirestoreService {

  private readonly nameGameCollection = 'Games'
  private readonly nameScenesCollection = 'Scenes'
  private readonly namePlayersCollection = 'Players'
  private readonly nameAnswersCollection = 'Answers'

  constructor(private fireStore: AngularFirestore) { }

  async saveGame(game: Game) {

    try {
      await this.fireStore.collection<any>(this.nameGameCollection)
        .doc(game.id)
        .set({
          name: game.name,
          description: game.description
        })
    } catch (error) {
      console.log('При сохранении данных игры проихошла ошибка', error);
    }

    for(const player of game.players) {

      try {
        await this.fireStore.collection<any>(this.nameGameCollection)
          .doc(game.id)
          .collection(this.namePlayersCollection)
          .doc(player.id)
          .set({
            name: player.name,
            description: player.description,
          })
      } catch (error) {
        console.log('При сохранении игроков произошла ошибка', error);
      }
    }

    for (const scene of game.scenes) {
      try {
        await this.fireStore.collection<any>(this.nameGameCollection)
          .doc(game.id)
          .collection(this.nameScenesCollection)
          .doc(scene.id)
          .set({
            title: scene.title,
            text: scene.text,
            x: scene.coordinate.x,
            y: scene.coordinate.y,
            players: scene.players.map(item => item.id)
          })
      } catch (error) {
        console.log('При сохранении сцен произошла ошибка', error);
      }

      for (const answer of scene.answers) {
        try {
          // список ответов
          await this.fireStore.collection<any>(this.nameGameCollection)
            .doc(game.id)
            .collection(this.nameScenesCollection)
            .doc(scene.id)
            .collection(this.nameAnswersCollection)
            .doc(answer.id)
            .set({
              text: answer.text,
              position: answer.position,
              color: answer.color,
              sceneId: answer.sceneId ? answer.sceneId : '',
              x: answer.coordinate.x,
              y: answer.coordinate.y
            })
        } catch (error) {
          console.log('При сохранении ответов произошла ошибка', error);
        }
      }
    }
  }
}
