import { Component, EventEmitter, Inject, OnInit, Output } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { CdkDragDrop } from '@angular/cdk/drag-drop/drag-events';
import { CropperSettings } from 'ngx-img-cropper';
import { EditImageComponent } from '../edit-image-player/edit-image.component';
import { SelectMediaFileDialogComponent } from '../select-media-file-dialog/select-media-file-dialog.component';
import { FileLink } from 'src/app/core/models/file-link.model.ts';
import { MediaFile } from 'src/app/editor/models/media-file.model.ts';
import { getTypesScene, TypeScene } from 'src/app/core/models/type-scene.enum';
import { Answer } from 'src/app/editor/models/answer.model';
import { Player } from 'src/app/core/models/player.model';
import {SceneEditScene} from "../../models/scene-edit-scene";
import {AngularFirestore} from "@angular/fire/compat/firestore";

@Component({
  selector: 'app-edit-scene-dialog',
  templateUrl: './edit-scene-dialog.component.html',
  styleUrls: ['./edit-scene-dialog.component.scss']
})
export class EditSceneDialogComponent implements OnInit {

  validData: boolean = true

  @Output()
  saveEvent = new EventEmitter();

  form: FormGroup = new FormGroup({})

  formAnswer: FormGroup = new FormGroup({})

  imgFile: string;
  imageFileId: string

  videoSources: string[] = [];
  videoFileId: string

  answers: Answer[] = [];

  soundFileLink: FileLink

  gameId: string

  constructor(public dialogRef: MatDialogRef<EditSceneDialogComponent>,
    private fireStore: AngularFirestore,
    @Inject(MAT_DIALOG_DATA) public data: {
      gameId: string,
      scene: SceneEditScene,
      players: Player[]
    },
    public dialog: MatDialog) {

    this.gameId = data.gameId
  }

  ngOnInit(): void {

    if (this.data.scene.imageFile) {
      this.videoSources.push(this.data.scene.videoFile);
      this.videoFileId = this.data.scene.videoFileId
    }

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
  }

  /**
   * Перемещение элементов
   * @param event
   */
  drop(event: CdkDragDrop<Answer[]>) {

    const previousIndex = event.previousIndex;
    const currentIndex = event.currentIndex;

    const currentAnswers = this.answers.find(item => item.position == previousIndex);
    const nextAnswers = this.answers.find(item => item.position == currentIndex);

    currentAnswers.position = currentIndex;
    nextAnswers.position = previousIndex;

    this.answers = this.answers.sort((a, b) => {
      if (a.position > b.position) {
        return 1;
      }
      if (a.position < b.position) {
        return -1;
      }
      return 0;
    });
  }

  deleteAnswer(answer: Answer) {

    console.log(answer);

    const item = this.data.scene.answers.find(item => item.id == answer.id);
    const index = this.answers.indexOf(item);
    this.answers.splice(index, 1);

    this.updatePosition();
  }

  onClickAddNewAnswer() {

    if (this.answers.length >= 4) {
      return;
    }

    let id: string = this.fireStore.createId();

    const positions: number[] = this.answers.map(item => item.position);

    let position: number = this.getPosition(positions);

    const answer = new Answer(id, '', position, this.data.scene);

    this.answers.push(answer);
  }

  private getPosition(positions: number[]): number {
    let position = 0;
    if (positions.length != 0) {
      position = Math.max(...positions) + 1;
    }
    return position;
  }

  /**
   * Обновляет позицию элемента в списке
   * @private
   */
  private updatePosition() {
    this.answers.forEach((value, index) => {
      console.log('index:', index);
      value.position = index;//+ 1
    });
  }

  onClickSave() {
    if (this.form.invalid) {
      return;
    }

    this.data.scene.answers = this.answers;
    this.data.scene.imageFileId = this.imageFileId;
    this.data.scene.imageFile = this.imgFile;

    this.data.scene.videoFileId = this.videoFileId
    if (this.videoFileId) {
      this.data.scene.videoFile = this.videoSources[0];
    } else {
      this.data.scene.videoFile = ''
    }

    this.saveEvent.emit(this.data);
    this.dialogRef.close();
  }

  toggleVideo() {
    //this.videoPlayer.nativeElement.play()
  }

  openSelectImageFileDialog() {
    const dialogRef = this.dialog.open(SelectMediaFileDialogComponent, {
      data: { gameId: this.gameId }
    });

    dialogRef.componentInstance.isShowImagesScene = true

    dialogRef.componentInstance.selectItem.subscribe((item: FileLink) => {
      this.imgFile = item.url
      this.imageFileId = item.id
    });
  }

  openSelectVideoFileDialog() {
    const dialogRef = this.dialog.open(SelectMediaFileDialogComponent, {
      data: { gameId: this.gameId }
    });

    dialogRef.componentInstance.isShowVideosScene = true

    dialogRef.componentInstance.selectItem.subscribe((item: FileLink) => {
      this.videoSources = []
      this.videoSources.push(item.url)
      this.videoFileId = item.id
    });
  }

  onClickDeletedImg() {
    this.imgFile = '';
    this.imageFileId = ''
  }

  onClickDeletedVideo() {
    this.videoFileId = ''
    this.videoSources = []
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  changeTextAnswer(answer: Answer, event: { target: { value: string; } | any; }) {
    const value = event.target.value
    answer.text = value

    if (value) {
      this.validData = true
    } else {
      this.validData = false
    }
  }
}
