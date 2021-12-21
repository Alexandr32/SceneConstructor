import { Injectable, Type } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { Game } from '../models/game.model';
import { IBaseScene, Panorama, Puzzle, Scene } from '../models/scenes.models';
import { AngularFireStorage, AngularFireUploadTask } from '@angular/fire/storage';
import { Player } from '../../core/models/player.model';
import { map, first } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { TypeFile } from '../models/type-file.model';
import { MediaFile } from '../models/media-file.model.ts';
import { base64ToFile } from '../models/base64-to-file.model';
import { TypeSceneEnum } from '../../core/models/type-scene.enum';
import { Mapper } from '../models/mapper.model';
import { SceneAnswerFirebase } from '../models/firebase-models/scene-answer-firestore.model';
import { PuzzleFirebase } from '../models/firebase-models/puzzle-firebase.model';
import { PanoramaFirebase } from '../models/firebase-models/panorama-firebase.model';
import { PartsPuzzleImage } from '../../core/models/parts-puzzle-image.model';
import { FileService } from 'src/app/core/services/file.service';

@Injectable({
  providedIn: 'root'
})
export class FirestoreService {

  private readonly nameGameCollection = 'Games';
  private readonly nameScenesCollection = 'Scenes';
  private readonly ImageFileSceneCollection = 'images';
  private readonly ImageFilePlayersCollection = 'Players';

  constructor(
    private fireStore: AngularFirestore,
    private storage: AngularFireStorage,
    private fileService: FileService) {
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

          game.scenes = game.scenes.map(baseScene => {

            // Вернет нужный тип данных
            const resultScene = (): any => {
              switch (baseScene.typesScene) {
                case TypeSceneEnum.Answer: {
                  return Mapper.sceneAnswerFirebaseToSceneAnswer(baseScene as unknown as SceneAnswerFirebase)

                }
                case TypeSceneEnum.Panorama: {
                  return Mapper.panoramaFirebaseToPanorama(baseScene as unknown as PanoramaFirebase)

                }
                case TypeSceneEnum.Puzzle: {
                  return Mapper.puzzleFirebaseToPuzzle(baseScene as unknown as PuzzleFirebase)

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
        }));
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

      const result = (): any => {
        switch (scene.typesScene) {
          case TypeSceneEnum.Answer: {
            return Mapper.sceneAnswerToSceneAnswerFirebase(scene as Scene)
          }
          case TypeSceneEnum.Panorama: {
            return Mapper.panoramaToPanoramaFirebase((scene as Panorama))
          }
          case TypeSceneEnum.Puzzle: {
            return Mapper.puzzleToPuzzleFirebase((scene as Puzzle))
          }
        }
      }

      return result()

    }))];

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

  async savePuzzleMediaFile(mediaFile: MediaFile, parts: Array<PartsPuzzleImage>) {

    if (mediaFile.typeFile != TypeFile.PuzzleImages) {
      throw Error('Не Верный тип файла');
    }

    parts.forEach((async (item: PartsPuzzleImage) => {

      let file: File
      try {

        file = base64ToFile(
          item.src,
          item.id,
        );
      } catch (error) {
        console.error('Ошибка преобразования base64', error);
        throw error;
      }

      // Папка хранения файлов
      const folderName = `SourceStore/${mediaFile.gameId}/${mediaFile.typeFile.toString()}/${mediaFile.id}/${item.id}`

      try {
        await this.storage.upload(`${folderName}`, file);
      } catch (error) {
        console.error('Ошибка загрузки файла в хранилище', error);
        throw error;
      }

    }))

  }

}