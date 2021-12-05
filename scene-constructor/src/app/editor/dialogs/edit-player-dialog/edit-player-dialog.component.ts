import { Component, EventEmitter, Inject, OnInit, Output } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { CropperSettings } from 'ngx-img-cropper';
import { EditImageComponent } from '../edit-image-player/edit-image.component';
import { SelectMediaFileDialogComponent } from '../select-media-file-dialog/select-media-file-dialog.component';
import { FileLink } from 'src/app/core/models/file-link.model.ts';
import { Player } from 'src/app/core/models/player.model';

@Component({
  selector: 'app-edit-player-dialog',
  templateUrl: './edit-player-dialog.component.html',
  styleUrls: ['./edit-player-dialog.component.scss']
})
export class EditPlayerDialogComponent implements OnInit {

  @Output()
  saveEvent = new EventEmitter<Player>();

  imgFile: string;
  imageFileId: string

  form: FormGroup;

  private gameId: string

  constructor(public dialogRef: MatDialogRef<EditPlayerDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { gameId: string, player: Player },
    public dialog: MatDialog) {

    this.gameId = data.gameId

  }

  ngOnInit(): void {

    this.imgFile = this.data.player.imageFile;
    this.imageFileId = this.data.player.imageFileId

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
    this.imageFileId = ''
    this.form.patchValue({
      file: ''
    });
    this.form.get('file').updateValueAndValidity();
  }

  openSelectImageFileDialog() {
    const dialogRef = this.dialog.open(SelectMediaFileDialogComponent, {
      data: { gameId: this.gameId }
    });

    dialogRef.componentInstance.isShowImagesPlayer = true

    dialogRef.componentInstance.selectItem.subscribe((item: FileLink) => {
      this.imgFile = item.url
      this.imageFileId = item.id
    });
  }

  onClickSave() {
    if (this.form.invalid) {
      return;
    }

    this.data.player.name = this.form.value['name'];
    this.data.player.description = this.form.value['description'];
    this.data.player.imageFile = this.imgFile;
    this.data.player.imageFileId = this.imageFileId
    this.imgFile = '';
    this.imageFileId = '';

    this.saveEvent.emit(this.data.player);
    this.dialogRef.close();
  }

  onNoClick(): void {
    this.imgFile = '';
    this.dialogRef.close();
  }
}
