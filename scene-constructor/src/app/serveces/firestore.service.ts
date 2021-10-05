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
import { identifierModuleUrl } from '@angular/compiler';
import { FileLink } from '../models/file-link.model.ts';
import { base64ToFile } from '../models/base64-to-file.model';

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
    return this.fireStore.collection<Game>('Games', ref => ref.orderBy('number', 'desc'))
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

  async deleteGame(game: Game): Promise<any> {
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
        imageFileId: scene.imageFileId,
        videoFileId: scene.videoFileId,
        coordinate: {
          x: scene.coordinate.x,
          y: scene.coordinate.y
        },
        answers: answers,
        players: scene.players,
        isStartGame: scene.isStartGame
      };
    }))
    ];

    try {
      await this.fireStore.collection<any>(this.nameGameCollection)
        .doc(game.id)
        .set({
          number: game.number,
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

      file = base64ToFile(
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

  async getMediaFileLink(gameId: string, typeFile: 'SceneVideo' | 'SceneImage' | 'PlayerImage'): Promise<FileLink[]> {

    const mediaFileList: { id: string }[] = await this.fireStore.collection(this.fileCollection, ref => ref.where('gameId', '==', gameId).where('typeFile', '==', typeFile))
      .valueChanges({ idField: 'id' })
      .pipe(first())
      .toPromise();

    const resultLink: { id: string, url: string }[] = []

    mediaFileList.forEach(async (item) => {

      const folderName = `SourceStore/${gameId}/${typeFile}/${item.id}`

      const ref = this.storage.ref(folderName);
      const url = await ref.getDownloadURL().toPromise();

      //const url = await this.getUrl(folderName).toPromise()
      const fileLink = new FileLink(item.id, url)

      resultLink.push(fileLink)
    })

    return resultLink
  }

  getUrl(gameId: string, fileId: string, typeFile: 'SceneVideo' | 'SceneImage' | 'PlayerImage'): Observable<string> {
    const folderName = `SourceStore/${gameId}/${typeFile}/${fileId}`
    let ref = this.storage.ref(folderName);
    return ref.getDownloadURL();
  }

  async deleteMediaFile(id: string) {

    const mediaFile: MediaFile = await this.fireStore.doc<MediaFile>(`${this.fileCollection}/${id}`)
      .snapshotChanges()
      .pipe(
        map((doc) => {
          const mediaFile = doc.payload.data() as MediaFile;
          mediaFile.id = doc.payload.id;
          return mediaFile;
        })
      )
      .pipe(first())
      .toPromise()

    const path = `SourceStore/${mediaFile.gameId}/${mediaFile.typeFile}/${mediaFile.id}`
    let ref = this.storage.ref(path);
    await ref.delete().toPromise();

    await this.fireStore.doc<MediaFile>(`fileCollection/${id}`).delete();
  }
}
