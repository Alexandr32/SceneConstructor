import {Component, EventEmitter, Inject, OnInit, Output} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {Player} from '../models/player.model';
import {FormControl, FormGroup, Validators} from '@angular/forms';

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
              @Inject(MAT_DIALOG_DATA) public player: Player) {
  }

  ngOnInit(): void {

    this.imgFile = this.player.imgFile

    this.form = new FormGroup({
      'name':
        new FormControl(
          this.player.name,
          [
            Validators.required
          ]),
      'description':
        new FormControl(
          this.player.description,
          [
            Validators.required
          ]),
      'file': new FormControl(this.player.imgFile, [Validators.required]),
    });
  }

  onClickDeletedImg(): void {
    this.imgFile = ''
    this.form.patchValue({
      file: ''
    });
    this.form.get('file').updateValueAndValidity()
  }

  onClickSave() {
    if (this.form.invalid) {
      return;
    }

    this.player.name = this.form.value['name']
    this.player.description = this.form.value['description']
    this.player.imgFile = this.imgFile

    this.saveEvent.emit(this.player);
    this.dialogRef.close();
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  // Image Preview
  showPreview(event) {
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
  }
}
