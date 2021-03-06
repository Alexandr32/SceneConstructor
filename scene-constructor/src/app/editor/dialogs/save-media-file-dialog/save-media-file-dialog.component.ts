import { Component, Inject, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { CropperSettings } from 'ngx-img-cropper';
import { MessageDialogComponent } from 'src/app/core/message-dialog/message-dialog.component';
import { fileToBase64 } from 'src/app/editor/models/base64-to-file.model';
import { FileLink } from 'src/app/core/models/file-link.model.ts';
import { MediaFile } from 'src/app/editor/models/media-file.model.ts';
import { PartsPuzzleImage } from 'src/app/core/models/parts-puzzle-image.model';
import { TypeFile } from 'src/app/editor/models/type-file.model';
import { FirestoreService } from 'src/app/editor/services/firestore.service';
import { EditImageComponent } from '../edit-image-player/edit-image.component';
import { FileService } from 'src/app/core/services/file.service';
import {AngularFirestore} from "@angular/fire/compat/firestore";

@Component({
  selector: 'app-media-file-dialog',
  templateUrl: './save-media-file-dialog.component.html',
  styleUrls: ['./save-media-file-dialog.component.scss']
})
export class SaveMediaFileDialogComponent implements OnInit {

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
    public dialogRef: MatDialogRef<SaveMediaFileDialogComponent>,
    private fireStore: AngularFirestore,
    private firestoreService: FirestoreService,
    private fileService: FileService,
    @Inject(MAT_DIALOG_DATA) public data: {
      gameId: string
    }) {

    this.gameId = data.gameId

  }

  ngOnInit() {
    this.loadData()
  }

  private async loadData() {
    this.imagesScene = await this.fileService.getMediaFileLink(this.gameId, TypeFile.SceneImages)

    this.imagesPlayer = await this.fileService.getMediaFileLink(this.gameId, TypeFile.PlayerImages)

    this.imagesPanoramas = await this.fileService.getMediaFileLink(this.gameId, TypeFile.PanoramaImages)

    this.imagePuzzle = await this.fileService.getMediaFileLink(this.gameId, TypeFile.PuzzleImages)

    this.videosScene = await this.fileService.getMediaFileLink(this.gameId, TypeFile.SceneVideos)

    this.sounds = await this.fileService.getMediaFileLink(this.gameId, TypeFile.Sound)
  }

  async deleteMediaFile(id: string) {
    await this.fileService.deleteMediaFile(id)
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
      data: '????????????????????...'
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
    mediaFile.nameFile = '?????????????????????? ????????????'
    mediaFile.srs = this.imgPlayerFile
    mediaFile.typeFile = TypeFile.PlayerImages

    try {
      await this.fileService.saveMediaFile(mediaFile)
    } catch (error) {
      console.log('???????????? ????????????????????', error);
    }

    this.imgPlayerFile = ''
  }

  private async SaveImageScene() {

    const mediaFile = new MediaFile()
    mediaFile.id = this.fireStore.createId()
    mediaFile.gameId = this.gameId
    mediaFile.srs = this.imgSceneFile
    mediaFile.nameFile = '?????????????????????? ??????????'
    mediaFile.typeFile = TypeFile.SceneImages

    try {
      await this.fileService.saveMediaFile(mediaFile)
    } catch (error) {
      console.log('???????????? ????????????????????', error);
    }

    this.imgSceneFile = ''
  }

  private async SaveImagePuzzle() {

    const mediaFile = new MediaFile()
    mediaFile.id = this.fireStore.createId()
    mediaFile.gameId = this.gameId
    mediaFile.srs = this.imgPuzzleFile
    mediaFile.nameFile = '?????????????????????? ??????????????????????'
    mediaFile.typeFile = TypeFile.PuzzleImages

    try {
      await this.fileService.saveMediaFile(mediaFile)
    } catch (error) {
      console.log('???????????? ????????????????????', error);
    }

    let parts: Array<PartsPuzzleImage>

    try {
      parts = await this.getPromiseImagePuzzle(this.imgPuzzleFile)
    } catch (error) {
      console.log('???????????? ?????? ?????????????? ??????????????????????', error);
    }

    try {
      await this.firestoreService.savePuzzleMediaFile(mediaFile, parts)
    } catch (error) {
      console.log('???????????? ?????? ???????????????????? ???????????????????? ??????????????????????', error);
    }

    this.imgPuzzleFile = ''
  }

  private async SaveSound() {

    const mediaFile = new MediaFile()
    mediaFile.id = this.fireStore.createId()
    mediaFile.gameId = this.gameId
    mediaFile.srs = this.soundFile
    mediaFile.nameFile = this.nameSound ? this.nameSound : "??????????????????"
    mediaFile.typeFile = TypeFile.Sound

    try {
      await this.fileService.saveMediaFile(mediaFile)
    } catch (error) {
      console.log('???????????? ????????????????????', error);
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

        const col = 3 // ??????????????
        const row = 3; // ????????????

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
    mediaFile.nameFile = '?????????????????????? ????????????????'
    mediaFile.typeFile = TypeFile.PanoramaImages

    try {
      await this.fileService.saveMediaFile(mediaFile)
    } catch (error) {
      console.log('???????????? ????????????????????', error);
    }

    this.imgPanoramasFile = ''
  }

  private async loadVideoScene() {

    const mediaFile = new MediaFile()
    mediaFile.id = this.fireStore.createId()
    mediaFile.gameId = this.gameId
    mediaFile.nameFile = '??????????'
    mediaFile.srs = this.videoSources[0]
    mediaFile.typeFile = TypeFile.SceneVideos

    try {
      await this.fileService.saveMediaFile(mediaFile)
    } catch (error) {
      console.log('???????????? ????????????????????', error);
    }

    this.videoSources = []
  }

  async openImagePanoramasDialog(event) {

    const mediaFile: File = event.target.files[0];

    try {

      this.imgPanoramasFile = await fileToBase64(mediaFile)

    } catch (error) {
      console.error('???????????? ???????????????????????????? base64', error);
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
