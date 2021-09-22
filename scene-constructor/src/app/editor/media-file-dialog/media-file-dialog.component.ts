import { Component, Inject, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { CropperSettings } from 'ngx-img-cropper';
import { EditImageComponent } from '../edit-image-player/edit-image.component';

@Component({
  selector: 'app-media-file-dialog',
  templateUrl: './media-file-dialog.component.html',
  styleUrls: ['./media-file-dialog.component.scss']
})
export class MediaFileDialogComponent implements OnInit {

  imgFile: string = '';

  videoSources: string[] = [];

  constructor(public dialog: MatDialog,
    public dialogRef: MatDialogRef<MediaFileDialogComponent>,
    private fireStore: AngularFirestore,
    @Inject(MAT_DIALOG_DATA) public data: {}) { }

  ngOnInit() {
  }

  openImageDialog() {
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
      this.imgFile = imgFile;
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

  onClickDeletedImg() {
    this.imgFile = '';
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  onClickSave() {

  }

}
