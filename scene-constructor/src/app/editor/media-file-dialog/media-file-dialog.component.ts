import { Component, Inject, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { CropperSettings } from 'ngx-img-cropper';
import { MessageDialogComponent } from 'src/app/core/message-dialog/message-dialog.component';
import { base64ToFile, fileToBase64 } from 'src/app/models/base64-to-file.model';
import { FileLink } from 'src/app/models/file-link.model.ts';
import { MediaFile } from 'src/app/models/media-file.model.ts';
import { TypeFile } from 'src/app/models/type-file.model';
import { FirestoreService } from 'src/app/serveces/firestore.service';
import { EditImageComponent } from '../edit-image-player/edit-image.component';

@Component({
  selector: 'app-media-file-dialog',
  templateUrl: './media-file-dialog.component.html',
  styleUrls: ['./media-file-dialog.component.scss']
})
export class MediaFileDialogComponent implements OnInit {

  imagesPlayer: FileLink[] = []
  imagesScene: FileLink[] = []
  videosScene: FileLink[] = []
  imagesPanoramas: FileLink[] = []
  imagePuzzle: FileLink[] = []
  sounds: FileLink[] = []

  imgSceneFile: string = '';

  imgPlayerFile: string;

  videoSources: string[] = [];

  imgPanoramasFile: string = '';

  imgPuzzleFile: string = ''

  soundFile: string = ''
  nameSound: string = ''

  private gameId: string

  constructor(
    public dialog: MatDialog,
    public dialogRef: MatDialogRef<MediaFileDialogComponent>,
    private fireStore: AngularFirestore,
    private firestoreService: FirestoreService,
    @Inject(MAT_DIALOG_DATA) public data: {
      gameId: string
    }) {

    this.gameId = data.gameId

  }

  ngOnInit() {
    this.loadData()
  }

  private async loadData() {
    this.imagesScene = await this.firestoreService.getMediaFileLink(this.gameId, TypeFile.SceneImages)

    this.imagesPlayer = await this.firestoreService.getMediaFileLink(this.gameId, TypeFile.PlayerImages)

    this.imagesPanoramas = await this.firestoreService.getMediaFileLink(this.gameId, TypeFile.PanoramaImages)

    this.imagePuzzle = await this.firestoreService.getMediaFileLink(this.gameId, TypeFile.PuzzleImages)

    this.videosScene = await this.firestoreService.getMediaFileLink(this.gameId, TypeFile.SceneVideos)

    this.sounds = await this.firestoreService.getMediaFileLink(this.gameId, TypeFile.Sound)

    console.log('sounds:', this.sounds);
  }

  async deleteMediaFile(id: string) {
    await this.firestoreService.deleteMediaFile(id)
    this.loadData()
  }

  openImageSceneDialog() {
    const cropperSettings = new CropperSettings();
    cropperSettings.width = 1024;
    cropperSettings.height = 768;
    cropperSettings.croppedWidth = 1024;
    cropperSettings.croppedHeight = 768;
    cropperSettings.canvasWidth = 400;
    cropperSettings.canvasHeight = 300;

    const dialogRef = this.dialog.open(EditImageComponent, {
      data: { image: '', cropperSettings }
    });

    dialogRef.componentInstance.saveEvent.subscribe((imgFile: string) => {
      this.imgSceneFile = imgFile;
    });

    dialogRef.afterClosed().subscribe(() => {
      console.log('closeDialog');
    });
  }

  async openVideoDialog(event) {

    const file: File = event.target.files[0];
    let videoSource: string;
    try {
      videoSource = await this.fileToBase64(file);
    } catch (e) {
      console.log(e);
    }

    this.videoSources = [];
    this.videoSources.push(videoSource);
  }

  async openSoundDialog(event) {

    const file: File = event.target.files[0];
    let soundSource: string;
    try {
      soundSource = await this.fileToBase64(file);
    } catch (e) {
      console.log(e);
    }

    this.soundFile = soundSource
  }

  private fileToBase64 = (file: File): Promise<string> => {
    return new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result.toString());
      reader.onerror = error => reject(error);
    });
  };

  onClickDeletedSceneImg() {
    this.imgSceneFile = '';
  }

  onClickDeletedImgPlayer(): void {
    this.imgPlayerFile = '';
  }

  openDialogEditImagePlayer() {

    const cropperSettings = new CropperSettings();
    cropperSettings.width = 400;
    cropperSettings.height = 550;
    cropperSettings.croppedWidth = 450;
    cropperSettings.croppedHeight = 550;
    cropperSettings.canvasWidth = 400;
    cropperSettings.canvasHeight = 300;

    const dialogRef = this.dialog.open(EditImageComponent, {
      data: { image: '', cropperSettings }
    });

    dialogRef.componentInstance.saveEvent.subscribe((imgFile: string) => {
      this.imgPlayerFile = imgFile;
    });

    dialogRef.afterClosed().subscribe(() => {
      console.log('closeDialog');
    });
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  async onLoadFile() {

    const dialogSave = this.dialog.open(MessageDialogComponent, {
      data: 'Сохранение...'
    });


    if (this.imgPlayerFile) {
      await this.SaveImagePlayer()
    }

    if (this.imgSceneFile) {
      await this.SaveImageScene()
    }
    if (this.imgPanoramasFile) {
      await this.loadImagePanoramas()
    }

    if (this.videoSources.length) {
      await this.loadVideoScene()
    }

    if (this.imgPuzzleFile) {
      await this.SaveImagePuzzle()
    }

    if (this.soundFile) {
      await this.SaveSound()
    }

    dialogSave.close()

    this.loadData()
  }

  private async SaveImagePlayer() {

    const mediaFile = new MediaFile()
    mediaFile.id = this.fireStore.createId()
    mediaFile.gameId = this.gameId
    mediaFile.nameFile = 'Изображение игрока'
    mediaFile.srs = this.imgPlayerFile
    mediaFile.typeFile = TypeFile.PlayerImages

    try {
      await this.firestoreService.saveMediaFile(mediaFile)
    } catch (error) {
      console.log('Ошибка сохранения', error);
    }

    this.imgPlayerFile = ''
  }

  private async SaveImageScene() {

    const mediaFile = new MediaFile()
    mediaFile.id = this.fireStore.createId()
    mediaFile.gameId = this.gameId
    mediaFile.srs = this.imgSceneFile
    mediaFile.nameFile = 'Изображение сцены'
    mediaFile.typeFile = TypeFile.SceneImages

    try {
      await this.firestoreService.saveMediaFile(mediaFile)
    } catch (error) {
      console.log('Ошибка сохранения', error);
    }

    this.imgSceneFile = ''
  }

  private async SaveImagePuzzle() {

    const mediaFile = new MediaFile()
    mediaFile.id = this.fireStore.createId()
    mediaFile.gameId = this.gameId
    mediaFile.srs = this.imgPuzzleFile
    mediaFile.nameFile = 'Изображение головоломки'
    mediaFile.typeFile = TypeFile.PuzzleImages

    try {
      await this.firestoreService.saveMediaFile(mediaFile)
    } catch (error) {
      console.log('Ошибка сохранения', error);
    }

    let parts: Array<{ id: number, src: string }>

    try {
      parts = await this.getPromiseImagePuzzle(this.imgPuzzleFile)
    } catch (error) {
      console.log('Ошибка при нарезке изображений', error);
    }

    try {
      await this.firestoreService.savePuzzleMediaFile(mediaFile, parts)
    } catch (error) {
      console.log('Ошибка при сохранении нарезанных изображений', error);
    }

    this.imgPuzzleFile = ''
  }

  private async SaveSound() {

    const mediaFile = new MediaFile()
    mediaFile.id = this.fireStore.createId()
    mediaFile.gameId = this.gameId
    mediaFile.srs = this.soundFile
    mediaFile.nameFile = this.nameSound ? this.nameSound : "Аудиофайл"
    mediaFile.typeFile = TypeFile.Sound

    try {
      await this.firestoreService.saveMediaFile(mediaFile)
    } catch (error) {
      console.log('Ошибка сохранения', error);
    }

    this.soundFile = ''
    this.nameSound = ''
  }

  private getPromiseImagePuzzle = (imgPuzzleFile: string): Promise<Array<{ id: number, src: string }>> => {

    return new Promise((resolve, reject) => {
      const canvas = document.createElement('canvas')
      const ctx = canvas.getContext('2d')
      const parts: Array<{ id: number, src: string }> = []
      const img = new Image();

      function split() {

        const col = 3 // столбец
        const row = 3; // строка

        const width = img.width / col
        const height = img.height / row;

        const canvas = document.createElement('canvas')
        const ctx = canvas.getContext('2d');

        canvas.width = width;
        canvas.height = height;

        let count = 1

        for (var i = 0; i < row; i++) {
          for (var j = 0; j < col; j++) {

            ctx.drawImage(img, j * width, i * height, width, height, 0, 0, width, height);


            parts.push({ id: count, src: canvas.toDataURL() });

            count++

            resolve(parts)
          }
        }

      }

      img.onload = split;
      img.src = imgPuzzleFile
    })

  }

  private async loadImagePanoramas() {

    const mediaFile = new MediaFile()
    mediaFile.id = this.fireStore.createId()
    mediaFile.gameId = this.gameId
    mediaFile.srs = this.imgPanoramasFile
    mediaFile.nameFile = 'Изображение панорамы'
    mediaFile.typeFile = TypeFile.PanoramaImages

    try {
      await this.firestoreService.saveMediaFile(mediaFile)
    } catch (error) {
      console.log('Ошибка сохранения', error);
    }

    this.imgPanoramasFile = ''
  }

  private async loadVideoScene() {

    const mediaFile = new MediaFile()
    mediaFile.id = this.fireStore.createId()
    mediaFile.gameId = this.gameId
    mediaFile.nameFile = 'Видео'
    mediaFile.srs = this.videoSources[0]
    mediaFile.typeFile = TypeFile.SceneVideos

    try {
      await this.firestoreService.saveMediaFile(mediaFile)
    } catch (error) {
      console.log('Ошибка сохранения', error);
    }

    this.videoSources = []
  }

  async openImagePanoramasDialog(event) {

    const mediaFile: File = event.target.files[0];

    try {

      this.imgPanoramasFile = await fileToBase64(mediaFile)

    } catch (error) {
      console.error('Ошибка преобразования base64', error);
      throw error;
    }
  }

  onClickDeletedPanoramasImg() {
    this.imgPanoramasFile = ''
  }

  onClickDeletedSound() {
    this.soundFile = ''
    this.nameSound = ''
  }

  async openImagePuzzleDialog() {

    const cropperSettings = new CropperSettings();
    cropperSettings.width = 390;
    cropperSettings.height = 390;
    cropperSettings.croppedWidth = 390;
    cropperSettings.croppedHeight = 390;
    cropperSettings.canvasWidth = 390;
    cropperSettings.canvasHeight = 390;

    const dialogRef = this.dialog.open(EditImageComponent, {
      data: { image: '', cropperSettings }
    });

    dialogRef.componentInstance.saveEvent.subscribe((imgFile: string) => {
      this.imgPuzzleFile = imgFile;
    });
  }

  onClickDeletedPuzzleImg() {
    this.imgPuzzleFile = ''
  }



}
