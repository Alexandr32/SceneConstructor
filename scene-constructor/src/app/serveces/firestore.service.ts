import { Injectable } from '@angular/core';
import {AngularFirestore} from '@angular/fire/firestore';
import {Game} from '../models/game.model';
import {Scene} from '../models/scene.model';
import {AngularFireStorage} from '@angular/fire/storage';
import {Player} from '../models/player.model';

@Injectable({
  providedIn: 'root'
})
export class FirestoreService {

  private readonly nameGameCollection = 'Games'
  private readonly nameScenesCollection = 'Scenes'
  private readonly namePlayersCollection = 'Players'
  private readonly nameAnswersCollection = 'Answers'
  private readonly ImageFileSceneCollection = 'images'
  private readonly ImageFilePlayersCollection = 'Players'

  constructor(private fireStore: AngularFirestore, private storage: AngularFireStorage) { }

  async saveGame(game: Game) {

    try {
      await this.fireStore.collection<any>(this.nameGameCollection)
        .doc(game.id)
        .set({
          name: game.name,
          description: game.description
        })
    } catch (error) {
      console.log('При сохранении данных игры произошла ошибка', error);
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

        if(player.imgFile) {
          await this.saveImage(player)
        }

      } catch (error) {
        console.log('При сохранении игроков произошла ошибка', error);
        throw error
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

        if(scene.imgFile) {
          await this.saveImage(scene)
        }

      } catch (error) {
        console.log('При сохранении сцен произошла ошибка', error);
        throw error
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
          throw error
        }
      }
    }
  }

  /**
   * Сохраняет сцену как запись в БД в base64
   * @param scene
   */
  async saveImageSceneToBase64(scene: Scene) {
    try {
      await this.fireStore.collection<any>(this.ImageFileSceneCollection)
        .doc(scene.id)
        .set({
          imgFile: scene.imgFile
        })
    } catch (error) {
      console.log('При сохранении изображения сцены произошла ошибка', error);
      throw error
    }
  }

  async saveImagePlayersToBase64(player: Player) {
    try {
      await this.fireStore.collection<any>(this.ImageFilePlayersCollection)
        .doc(player.id)
        .set({
          imgFile: player.imgFile
        })
    } catch (error) {
      console.log('При сохранении изображения персонажа произошла ошибка', error);
      throw error
    }
  }


  async saveImage(value: Scene | Player) {

    if(!value.imgFile) {
      throw Error('Получена пустая строка base64')
    }

    try {
      const file = FirestoreService.base64ToFile(
        value.imgFile,
        value.id,
      )

      let folderName

      if(value instanceof Player) {
        folderName = 'Players'
      } else {
        folderName = 'Scene'
      }

      await this.storage.upload(`${folderName}/${value.id}`, file)

    } catch (error) {
      console.log('При сохранении изображения сцены произошла ошибка', error);
      throw error
    }

  }

  /**
   * Хз как это работает
   * https://coderoad.ru/61041916/%D0%92%D0%BE%D0%B7%D0%B2%D1%80%D0%B0%D1%82-
   * %D1%84%D0%B0%D0%B9%D0%BB%D0%B0-%D0%B8%D0%B7-ngx-image-cropper-%D0%B2-upload-Angular
   * @param data
   * @param filename
   * @private
   */
  private static base64ToFile(data, filename) {

    const arr = data.split(',');
    const mime = arr[0].match(/:(.*?);/)[1];
    const bstr = atob(arr[1]);
    let n = bstr.length;
    let u8arr = new Uint8Array(n);

    while(n--){
      u8arr[n] = bstr.charCodeAt(n);
    }

    return new File([u8arr], filename, { type: mime });
  }
}
