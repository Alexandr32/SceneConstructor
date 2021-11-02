import { Component, EventEmitter, Inject, OnInit, Output } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Answer } from 'src/app/models/answer.model';
import { FileLink } from 'src/app/models/file-link.model.ts';
import { Player } from 'src/app/models/player.model';
import { Panorama, Scene } from 'src/app/models/scene.model';
import { SelectMediaFileDialogComponent } from '../select-media-file-dialog/select-media-file-dialog.component';

@Component({
  selector: 'app-edit-panorama-dialog',
  templateUrl: './edit-panorama-dialog.component.html',
  styleUrls: ['./edit-panorama-dialog.component.scss']
})
export class EditPanoramaDialogComponent implements OnInit {

  validData: boolean = true

  @Output()
  saveEvent = new EventEmitter();

  form: FormGroup = new FormGroup({})

  formPanorama: FormGroup = new FormGroup({})

  imgFile: string;
  imageFileId: string

  answers: Answer[] = [];

  soundFileLink: FileLink

  gameId: string

  constructor(public dialogRef: MatDialogRef<EditPanoramaDialogComponent>,
    private fireStore: AngularFirestore,
    @Inject(MAT_DIALOG_DATA) public data: {
      gameId: string,
      scene: Panorama,
      players: Player[]
    },
    public dialog: MatDialog) {

    this.gameId = data.gameId
  }

  ngOnInit() {

    this.data.scene.isTimer = true

    this.formPanorama.addControl('isTimer',
      new FormControl(
        this.data.scene.isTimer
      ));

    this.formPanorama.addControl('times',
      new FormControl(
        { value: this.data.scene.times, disabled: true }, [Validators.required, Validators.min(0)]
      ));

    this.disableIsTimer(this.data.scene.isTimer)

    if (this.data.scene.imageFile) {
      this.imgFile = this.data.scene.imageFile;
      this.imageFileId = this.data.scene.imageFileId
    }

    if (this.data.scene.soundFileLink) {
      this.soundFileLink = this.data.scene.soundFileLink
    }

    this.data.scene.answers.forEach(item => {
      this.answers.push(item);
    });

    this.formPanorama.valueChanges.subscribe(value => {
      this.validData = this.formPanorama.valid
    })

    this.formPanorama.controls['isTimer']
      .valueChanges
      .subscribe((isTimer: boolean) => {

        this.disableIsTimer(isTimer)

      })
  }

  disableIsTimer(isTimer: boolean) {
    if (isTimer) {
      this.formPanorama.controls['times'].enable({ emitEvent: false })
    } else {
      this.formPanorama.controls['times'].disable({ emitEvent: false })
    }
  }

  onClickSave() {
    if (this.form.invalid) {
      return;
    }

    this.data.scene.answers = this.answers;
    this.data.scene.imageFileId = this.imageFileId;
    this.data.scene.imageFile = this.imgFile;

    this.saveEvent.emit(this.data);
    this.dialogRef.close();
  }

  openSelectImageFileDialog() {
    const dialogRef = this.dialog.open(SelectMediaFileDialogComponent, {
      data: { gameId: this.gameId }
    });

    dialogRef.componentInstance.isShowImagesPanoramas = true

    dialogRef.componentInstance.selectItem.subscribe((item: FileLink) => {
      this.imgFile = item.url
      this.imageFileId = item.id
    });
  }

  onClickDeletedImg() {
    this.imgFile = '';
    this.imageFileId = ''
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  changeTextAnswer(answer: Answer, event: { target: { value: string; }; }) {
    const value = event.target.value
    answer.text = value

    if (value) {
      this.validData = true
    } else {
      this.validData = false
    }
  }

}
