import { Component, Inject, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { CropperSettings } from 'ngx-img-cropper';
import { MessageDialogComponent } from 'src/app/core/message-dialog/message-dialog.component';
import { base64ToFile, fileToBase64 } from 'src/app/models/base64-to-file.model';
import { FileLink } from 'src/app/models/file-link.model.ts';
import { MediaFile } from 'src/app/models/media-file.model.ts';
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

  imgSceneFile: string = '';

  imgPlayerFile: string;

  videoSources: string[] = [];

  imgPanoramasFile: string = '';

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
    this.imagesScene = await this.firestoreService.getMediaFileLink(this.gameId, 'SceneImages')

    this.imagesPlayer = await this.firestoreService.getMediaFileLink(this.gameId, 'PlayerImages')

    this.imagesPanoramas = await this.firestoreService.getMediaFileLink(this.gameId, 'PanoramaImages')

    this.videosScene = await this.firestoreService.getMediaFileLink(this.gameId, 'SceneVideos')
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
      await this.loadImagePlayer()
    }

    if (this.imgSceneFile) {
      await this.loadImageScene()
    }
    if (this.imgPanoramasFile) {
      await this.loadImagePanoramas()
    }

    if (this.videoSources.length) {
      await this.loadVideoScene()
    }

    dialogSave.close()

    this.loadData()
  }

  private async loadImagePlayer() {

    const mediaFile = new MediaFile()
    mediaFile.id = this.fireStore.createId()
    mediaFile.gameId = this.gameId
    mediaFile.srs = this.imgPlayerFile
    mediaFile.typeFile = 'PlayerImages'

    try {
      await this.firestoreService.saveMediaFile(mediaFile)
    } catch (error) {
      console.log('Ошибка сохранения', error);
    }

    this.imgPlayerFile = ''
  }

  private async loadImageScene() {

    const mediaFile = new MediaFile()
    mediaFile.id = this.fireStore.createId()
    mediaFile.gameId = this.gameId
    mediaFile.srs = this.imgSceneFile
    mediaFile.typeFile = "SceneImages"

    try {
      await this.firestoreService.saveMediaFile(mediaFile)
    } catch (error) {
      console.log('Ошибка сохранения', error);
    }

    this.imgSceneFile = ''
  }

  private async loadImagePanoramas() {

    const mediaFile = new MediaFile()
    mediaFile.id = this.fireStore.createId()
    mediaFile.gameId = this.gameId
    mediaFile.srs = this.imgPanoramasFile
    mediaFile.typeFile = 'PanoramaImages'

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
    mediaFile.srs = this.videoSources[0]
    mediaFile.typeFile = 'SceneVideos'

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

}
