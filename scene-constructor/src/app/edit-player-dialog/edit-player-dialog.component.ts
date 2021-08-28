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
      'file': new FormControl('', [Validators.required]),
      'imgSrc': new FormControl(this.imgFile, [Validators.required])
    });
  }

  onClickSave() {
    if (this.form.invalid) {
      return;
    }

    this.player.name = this.form.value['name'];
    this.player.description = this.form.value['description'];

    this.saveEvent.emit(this.player);
    this.dialogRef.close();
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  onImageChange(e) {
    const reader = new FileReader();

    if (e.target.files && e.target.files.length) {
      const [file] = e.target.files;
      reader.readAsDataURL(file);

      reader.onload = () => {
        this.imgFile = reader.result as string;
        this.form.patchValue({
          imgSrc: reader.result
        });

        console.log(this.imgFile);

      };
    }
  }
}
