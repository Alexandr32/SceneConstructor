import { Component, EventEmitter, Inject, OnInit, Output } from '@angular/core';
import { CropperSettings } from 'ngx-img-cropper';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-edit-image',
  templateUrl: './edit-image.component.html',
  styleUrls: ['./edit-image.component.scss']
})
export class EditImageComponent implements OnInit {

  dataImage: any;
  cropperSettings: CropperSettings;

  @Output()
  saveEvent = new EventEmitter<String>();

  constructor(public dialogRef: MatDialogRef<EditImageComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { image: String, cropperSettings: CropperSettings }) {
    this.cropperSettings = data.cropperSettings;
    this.dataImage = {};
  }

  ngOnInit(): void {
  }

  onClickSave() {
    this.saveEvent.emit(this.dataImage.image)
    this.dataImage.image = ''
    this.dialogRef.close()
  }

  onNoClick(): void {
    this.dialogRef.close()
  }
}
