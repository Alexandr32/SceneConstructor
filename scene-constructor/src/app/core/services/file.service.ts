import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { first, map } from "rxjs/operators";
import { base64ToFile } from "src/app/editor/models/base64-to-file.model";
import { MediaFile } from "src/app/editor/models/media-file.model.ts";
import { TypeFile } from "src/app/editor/models/type-file.model";
import { IPanoramaCore } from "../models/base-panorama.model";
import { ISceneCore } from "../models/base-scene.model";
import { FileLink } from "../models/file-link.model.ts";
import { PartsPuzzleImage } from "../models/parts-puzzle-image.model";
import {AngularFirestore} from "@angular/fire/compat/firestore";
import {AngularFireStorage} from "@angular/fire/compat/storage";
import {PuzzleEditScene} from "../../editor/models/puzzle-edit-scene";

@Injectable({
  providedIn: 'root'
})
export class FileService {

  private readonly fileCollection = 'FileCollection'

  constructor(
    private fireStore: AngularFirestore,
    private storage: AngularFireStorage) {
  }

  async setAnswerSceneFile(gameId: string, scene: ISceneCore) {

    if (scene.imageFileId) {
      try {
        scene.imageFile = await this.getUrl(gameId, scene.imageFileId, TypeFile.SceneImages).toPromise()
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

        scene.videoFile = await this.getUrl(gameId, scene.videoFileId, TypeFile.SceneVideos).toPromise()

      } catch (error) {
        scene.videoFile = '';
        console.error(error);
      }
    } else {
      scene.videoFile = '';
    }

    if (scene.soundFileId) {

      scene.soundFileLink =
        await this.getMediaFileLinkById(gameId, TypeFile.Sound, scene.soundFileId)

    }
  }

  async setFilePanoramaFile(gameId: string, scene: IPanoramaCore) {

    if (scene.imageFileId) {
      try {
        scene.imageFile = await this.getUrl(gameId, scene.imageFileId, TypeFile.PanoramaImages).toPromise()
      } catch (error) {
        scene.imageFile = '/assets/http_scene.jpg';
        console.error('Изображение не найдено');
        console.error(error);
      }
    } else {
      scene.imageFile = '/assets/http_scene.jpg';
    }

    if (scene.soundFileId) {

      scene.soundFileLink =
        await this.getMediaFileLinkById(gameId, TypeFile.Sound, scene.soundFileId)

    }
  }

  async setFilePuzzleFile(gameId: string, scene: PuzzleEditScene) {

    if (scene.imagePuzzleFileId) {
      try {
        scene.imagePuzzleFile = await this.getUrl(gameId, scene.imagePuzzleFileId, TypeFile.PuzzleImages).toPromise()
      } catch (error) {
        scene.imagePuzzleFile = '/assets/http_puzzle.jpg';
        console.error('Изображение не найдено');
        console.error(error);
      }
    } else {
      scene.imagePuzzleFile = '/assets/http_puzzle.jpg';
    }

    if (scene.videoFileId) {
      try {
        scene.videoFile = await this.getUrl(gameId, scene.videoFileId, TypeFile.SceneVideos).toPromise()
      } catch (error) {
        scene.videoFile = '';
        console.error(error);
      }
    } else {
      scene.videoFile = '';
    }

    if (scene.imageFileId) {
      try {
        scene.imageFile = await this.getUrl(gameId, scene.imageFileId, TypeFile.SceneImages).toPromise()
      } catch (error) {
        scene.imageFile = '/assets/http_puzzle.jpg';
        console.error('Изображение не найдено');
        console.error(error);
      }
    } else {
      scene.imageFile = '/assets/http_puzzle.jpg';
    }

    if (scene.soundFileId) {

      scene.soundFileLink =
        await this.getMediaFileLinkById(gameId, TypeFile.Sound, scene.soundFileId)

    }

    for (const item of scene.partsPuzzleImages) {

      const src = await this.getUplPartsPuzzleImages(gameId, scene.imagePuzzleFileId, item).toPromise()
      item.src = src

      // TODO: Что-то лишнее
      // const scenePartsPuzzleImages = scene.scenePartsPuzzleImages
      //   .filter(x => x.value !== null)
      //   .find(p => p.value.id === item.id)
      //
      // if (scenePartsPuzzleImages) {
      //   scenePartsPuzzleImages.value.src = src
      // }

    }

    // TODO: Что-то лишнее
    // scene.playerScenePartsPuzzleImages.map(x => {
    //   x.scenePartsPuzzleImages.map(i => {
    //     if (i.value) {
    //       i.value.src = scene.partsPuzzleImages.find(f => f.id === i.value.id).src
    //     }
    //   })
    // })

  }

  getUrl(gameId: string, fileId: string, typeFile: TypeFile): Observable<string> {
    const folderName = `SourceStore/${gameId}/${typeFile.toString()}/${fileId}`
    let ref = this.storage.ref(folderName);
    return ref.getDownloadURL();
  }

  async getMediaFileLinkById(gameId: string, typeFile: TypeFile, fileId: string) {

    const resultLink = await this.fireStore
      .collection<FileLink>(this.fileCollection).doc(fileId)
      .valueChanges({ idField: 'id' })
      .pipe(first())
      .toPromise();

    const folderName = `SourceStore/${gameId}/${typeFile.toString()}/${resultLink.id}`

    const ref = this.storage.ref(folderName);
    const url = await ref.getDownloadURL().toPromise();

    resultLink.url = url

    return resultLink
  }

  getUplPartsPuzzleImages(gameId: string, imagePuzzleId: string, item: PartsPuzzleImage): Observable<any> {

    const folderName = `SourceStore/${gameId}/PuzzleImages/${imagePuzzleId}/${item.id}`
    let ref = this.storage.ref(folderName);
    return ref.getDownloadURL();
  }

  async getMediaFileLink(gameId: string, typeFile: TypeFile): Promise<FileLink[]> {

    const mediaFileList = await this.fireStore
      .collection<FileLink>(this.fileCollection, ref => ref
        .where('gameId', '==', gameId)
        .where('typeFile', '==', typeFile))
      .valueChanges({ idField: 'id' })
      .pipe(first())
      .toPromise();

    const resultLink: FileLink[] = []

    for(let item of mediaFileList) {
      const folderName = `SourceStore/${gameId}/${typeFile.toString()}/${item.id}`

      const ref = this.storage.ref(folderName);
      const url = await ref.getDownloadURL().toPromise();

      const fileLink = new FileLink(item.id, item.nameFile, url)

      resultLink.push(fileLink)
    }

    return resultLink
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

    const path = `SourceStore/${mediaFile.gameId}/${mediaFile.typeFile.toString()}/${mediaFile.id}`
    let ref = this.storage.ref(path);
    await ref.delete().toPromise();

    await this.fireStore.doc<MediaFile>(`${this.fileCollection}/${id}`).delete();

    if (mediaFile.typeFile === TypeFile.PuzzleImages) {

      for (let i = 1; i <= 9; i++) {
        const pathSubFile = `SourceStore/${mediaFile.gameId}/${mediaFile.typeFile.toString()}/${mediaFile.id}/${i}`

        try {
          let refSubFile = this.storage.ref(pathSubFile);
          await refSubFile.delete().toPromise();
        } catch (error) {
          console.error('Ошибка удаления дочерних файлов', error);
          throw error;
        }
      }

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
          nameFile: mediaFile.nameFile,
          typeFile: mediaFile.typeFile.toString()
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
    const folderName = `SourceStore/${mediaFile.gameId}/${mediaFile.typeFile.toString()}/${mediaFile.id}`

    try {
      await this.storage.upload(`${folderName}`, file);
    } catch (error) {
      console.error('Ошибка загрузки файла в хранилище', error);
      throw error;
    }
  }

}
