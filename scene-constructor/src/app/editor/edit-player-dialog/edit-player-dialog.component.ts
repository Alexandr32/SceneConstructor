import {Component, EventEmitter, Inject, OnInit, Output} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialog, MatDialogRef} from '@angular/material/dialog';
import {Player} from '../../models/player.model';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {CropperSettings} from 'ngx-img-cropper';
import {EditImageComponent} from '../edit-image-player/edit-image.component';

@Component({
  selector: 'app-edit-player-dialog',
  templateUrl: './edit-player-dialog.component.html',
  styleUrls: ['./edit-player-dialog.component.scss']
})
export class EditPlayerDialogComponent implements OnInit {

  @Output()
  saveEvent = new EventEmitter<Player>();

  imgFile: string;

  form: FormGroup;

  constructor(public dialogRef: MatDialogRef<EditPlayerDialogComponent>,
              @Inject(MAT_DIALOG_DATA) public data: { player: Player },
              public dialog: MatDialog) {

  }

  ngOnInit(): void {

    this.imgFile = this.data.player.imageFile;

    this.form = new FormGroup({
      'name':
        new FormControl(
          this.data.player.name,
          [
            Validators.required
          ]),
      'description':
        new FormControl(
          this.data.player.description,
          [
            Validators.required
          ]),
      'file': new FormControl(this.data.player.imageFile, [Validators.required]),
    });
  }

  onClickDeletedImg(): void {
    this.imgFile = '';
    this.form.patchValue({
      file: ''
    });
    this.form.get('file').updateValueAndValidity();
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
      data: {image: '', cropperSettings}
    });

    dialogRef.componentInstance.saveEvent.subscribe((imgFile: string) => {
      this.imgFile = imgFile;
      this.form.patchValue({
        file: imgFile
      });
    });

    dialogRef.afterClosed().subscribe(() => {
      console.log('closeDialog');
    });
  }

  onClickSave() {
    if (this.form.invalid) {
      return;
    }

    this.data.player.name = this.form.value['name'];
    this.data.player.description = this.form.value['description'];
    this.data.player.imageFile = this.imgFile;
    this.imgFile = '';

    this.saveEvent.emit(this.data.player);
    this.dialogRef.close();
  }

  onNoClick(): void {
    this.imgFile = '';
    this.dialogRef.close();
  }

  // Image Preview
  /*showPreview(event) {
    const file = (event.target as HTMLInputElement).files[0];
    this.form.patchValue({
      file
    });
    this.form.get('file').updateValueAndValidity()
    // File Preview
    const reader = new FileReader();
    reader.onload = () => {
      this.imgFile = reader.result as string;
    }
    reader.readAsDataURL(file)
  }*/
}