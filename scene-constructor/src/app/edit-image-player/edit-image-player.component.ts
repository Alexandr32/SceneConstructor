import {Component, EventEmitter, Inject, OnInit, Output} from '@angular/core';
import {CropperSettings} from 'ngx-img-cropper';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {Player} from '../models/player.model';

@Component({
  selector: 'app-edit-image-player',
  templateUrl: './edit-image-player.component.html',
  styleUrls: ['./edit-image-player.component.scss']
})
export class EditImagePlayerComponent implements OnInit {

  data: any;
  cropperSettings: CropperSettings;

  @Output()
  saveEvent = new EventEmitter<String>();

  constructor(public dialogRef: MatDialogRef<EditImagePlayerComponent>,
              @Inject(MAT_DIALOG_DATA) public img: String) {
    this.cropperSettings = new CropperSettings();
    this.cropperSettings.width = 400;
    this.cropperSettings.height = 550;
    this.cropperSettings.croppedWidth = 450;
    this.cropperSettings.croppedHeight = 550;
    this.cropperSettings.canvasWidth = 400;
    this.cropperSettings.canvasHeight = 300;

    this.data = {};
  }

  ngOnInit(): void {
  }

  onClickSave() {
    this.saveEvent.emit(this.data.image)
    this.dialogRef.close()
  }

  onNoClick(): void {
    this.dialogRef.close()
  }
}
