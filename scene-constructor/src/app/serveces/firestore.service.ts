import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { Game } from '../models/game.model';
import { Scene } from '../models/scene.model';
import { AngularFireStorage, AngularFireUploadTask } from '@angular/fire/storage';
import { Player } from '../models/player.model';
import { filter, map, switchMap, first } from 'rxjs/operators';
import { Observable, pipe, Subscription, zip } from 'rxjs';
import { Answer } from '../models/answer.model';
import { Coordinate } from '../models/coordinate.model';
import { TypeFile } from '../models/type-file.model';
import { MediaFile } from '../models/media-file.model.ts';

@Injectable({
  providedIn: 'root'
})
export class FirestoreService {

  private readonly nameGameCollection = 'Games';
  private readonly nameScenesCollection = 'Scenes';
  private readonly ImageFileSceneCollection = 'images';
  private readonly ImageFilePlayersCollection = 'Players';

  private readonly fileCollection = 'FileCollection'

  constructor(private fireStore: AngularFirestore, private storage: AngularFireStorage) {
  }

  getGames(): Observable<Game[]> {
    return this.fireStore.collection<Game>('Games')
      .valueChanges({ idField: 'id' });
  }

  getGameById(gameId: string): Observable<Game> {

    return this.fireStore.doc<Game>(`Games/${gameId}`)
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
              answer.coordinate = new Coordinate();
              answer.coordinate.x = answerInFireBase.coordinate.x;
              answer.coordinate.y = answerInFireBase.coordinate.y;

              answers.push(answer);
            });
            scene.answers = answers;
          });

          game.players = game.players.map((player) => {
            return new Player(player.id,
              player.name, player.description,
              player.imageFile,
              player.videoFile);
          });

          game.id = doc.payload.id;
          return game;
        })
      )
      .pipe(first());
  }

  async deleteGame(game: Game): Promise<any> {

    game.players.map(async (item) => {
      try {
        await this.deleteImagePlayer(game.id, item.id, 'Image').toPromise();
      } catch (error) {
        console.log('Ошибка при удалении файла', error);
      }
    });

    game.scenes.map(async (item) => {
      try {
        await this.deleteFileScene(game.id, item.id, 'Image').toPromise();
        await this.deleteFileScene(game.id, item.id, 'Video').toPromise();
      } catch (error) {
        console.log('Ошибка при удалении файла', error);
      }
    });

    await this.fireStore.collection('Games').doc(game.id).delete();
  }

  deleteScene(gameId: string, scene: Scene): Promise<any> {
    return this.fireStore.collection(`Games/${gameId}/Scenes`).doc(scene.id).delete();
  }

  async saveGame(game: Game) {


    const players = [...(game.players.map(item => {
      return {
        id: item.id,
        name: item.name,
        description: item.description
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
            coordinate: {
              x: item.coordinate.x,
              y: item.coordinate.y
            }
          };
        }))];

      return {
        id: scene.id,
        title: scene.title,
        text: scene.text,
        color: scene.color,
        coordinate: {
          x: scene.coordinate.x,
          y: scene.coordinate.y
        },
        answers: answers,
        players: scene.players,
        isStartGame: scene.isStartGame,
        isStopGame: scene.isStopGame
      };
    }))
    ];

    try {
      await this.fireStore.collection<any>(this.nameGameCollection)
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

    for (const scene of game.scenes) {

      if (scene.imageFile) {
        if (!scene.imageFile.includes('http')) {
          await this.saveFile(game.id, scene, 'Image');
        }
      }

      if (scene.videoFile) {
        if (!scene.videoFile.includes('http')) {
          await this.saveFile(game.id, scene, 'Video');
        }
      }
    }

    for (const player of game.players) {
      if (player.imageFile) {
        if (!player.imageFile.includes('http')) {
          await this.saveFile(game.id, player, 'Image');
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
          imgFile: scene.imageFile
        });
    } catch (error) {
      console.log('При сохранении изображения сцены произошла ошибка', error);
      throw error;
    }
  }

  async saveImagePlayersToBase64(player: Player) {
    try {
      await this.fireStore.collection<any>(this.ImageFilePlayersCollection)
        .doc(player.id)
        .set({
          imgFile: player.imageFile
        });
    } catch (error) {
      console.log('При сохранении изображения персонажа произошла ошибка', error);
      throw error;
    }
  }

  getFileScene(gameId: string, id: string, typeFile: 'Video' | 'Image'): Observable<string> {
    let ref = this.storage.ref(`${gameId}/Scenes/${id}/${typeFile}/${id}`);
    return ref.getDownloadURL();
  }

  deleteFileScene(gameId: string, id: string, typeFile: 'Video' | 'Image'): Observable<string> {
    let ref = this.storage.ref(`${gameId}/Scenes/${id}/${typeFile}/${id}`);
    return ref.delete();
  }

  getImagePlayer(gameId: string, id: string, typeFile: 'Video' | 'Image'): Observable<string> {
    let ref = this.storage.ref(`${gameId}/Players/${id}/${typeFile}/${id}`);
    return ref.getDownloadURL();
  }

  deleteImagePlayer(gameId: string, id: string, typeFile: 'Video' | 'Image'): Observable<string> {
    const path = `${gameId}/Players/${id}/${typeFile}/${id}`;
    let ref = this.storage.ref(path);
    return ref.delete();
  }

  saveFile(gameId: string, value: Scene | Player, typeFile: 'Video' | 'Image') {

    if (typeFile === 'Image') {
      if (!value.imageFile) {
        throw Error('Получена пустая строка base64');
      }

      if (value.imageFile.includes('http')) {
        throw Error('Получена не строка base64');
      }
    } else {
      if (!value.videoFile) {
        throw Error('Получена пустая строка base64');
      }

      if (value.videoFile.includes('http')) {
        throw Error('Получена не строка base64');
      }
    }

    console.log('id для записи', value.id);

    try {
      let mediaFile: string;
      if (typeFile === 'Video') {
        mediaFile = value.videoFile;
      } else {
        mediaFile = value.imageFile;
      }

      const file = FirestoreService.base64ToFile(
        mediaFile,
        value.id,
      );

      let folderName;

      if (value instanceof Player) {
        folderName = `${gameId}/Players/${value.id}`;
      } else {
        folderName = `${gameId}/Scenes/${value.id}`;
      }

      folderName = folderName + '/' + typeFile;

      return this.storage.upload(`${folderName}/${value.id}`, file);

    } catch (error) {
      console.error(`При сохранении файла ${typeFile} произошла ошибка`, error);
      throw error;
    }
  }

  async saveMediaFile(mediaFile: MediaFile) {

    if (!mediaFile.srs) {
      throw Error('Получена пустая строка base64');
    }

    try {
      await this.fireStore.collection<any>(this.fileCollection)
        .doc(mediaFile.id)
        .set({
          gameId: mediaFile.gameId,
          typeFile: mediaFile.typeFile
        });
    } catch (error) {
      console.error('При сохранении файла в таблицу произошла ошибка', error);
      throw error;
    }

    let file: File
    try {

      file = FirestoreService.base64ToFile(
        mediaFile.srs,
        mediaFile.id,
      );
    } catch (error) {
      console.error('Ошибка преобразования base64', error);
      throw error;
    }

    // Общая папка для хранения файлов
    const folderName = `SourceStore/${mediaFile.gameId}/${mediaFile.typeFile}/${mediaFile.id}`

    try {
      await this.storage.upload(`${folderName}`, file);
    } catch (error) {
      console.error('Ошибка загрузки файла в хранилище', error);
      throw error;
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

    while (n--) {
      u8arr[n] = bstr.charCodeAt(n);
    }

    return new File([u8arr], filename, { type: mime });
  }
}
