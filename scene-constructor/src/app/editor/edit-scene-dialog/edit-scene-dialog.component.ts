import { Component, EventEmitter, Inject, OnInit, Output } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { Scene } from '../../models/scene.model';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { CdkDragDrop } from '@angular/cdk/drag-drop/drag-events';
import { Answer } from '../../models/answer.model';
import { Player } from '../../models/player.model';
import { CropperSettings } from 'ngx-img-cropper';
import { EditImageComponent } from '../edit-image-player/edit-image.component';
import { AngularFirestore } from '@angular/fire/firestore';
import { TypeFile } from '../../models/type-file.model';
import { SelectMediaFileDialogComponent } from '../select-media-file-dialog/select-media-file-dialog.component';
import { FileLink } from 'src/app/models/file-link.model.ts';
import { MediaFile } from 'src/app/models/media-file.model.ts';
import { getTypesScene, TypeScene } from 'src/app/models/type-scene.enum';

@Component({
  selector: 'app-edit-scene-dialog',
  templateUrl: './edit-scene-dialog.component.html',
  styleUrls: ['./edit-scene-dialog.component.scss']
})
export class EditSceneDialogComponent implements OnInit {

  typesScene = getTypesScene()
  selectTypeScene: TypeScene = this.typesScene[0]
  nameTypeScene = this.selectTypeScene.name

  @Output()
  saveEvent = new EventEmitter();

  form: FormGroup;

  imgFile: string;
  imageFileId: string

  videoSources: string[] = [];
  videoFileId: string

  answers: Answer[] = [];
  players: { player: Player, isSelect: boolean }[] = [];

  soundFileLink: FileLink

  gameId: string

  constructor(public dialogRef: MatDialogRef<EditSceneDialogComponent>,
    private fireStore: AngularFirestore,
    @Inject(MAT_DIALOG_DATA) public data: {
      gameId: string,
      scene: Scene,
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

    if (this.data.scene.typesScene) {

      const selectTypeScene = this.typesScene.find(item => item.type === this.data.scene.typesScene)
      this.selectTypeScene = selectTypeScene
      this.nameTypeScene = this.selectTypeScene.name
    }

    this.form = new FormGroup({
      'title':
        new FormControl(
          this.data.scene.title,
          [
            Validators.required
          ]),
      'text':
        new FormControl(
          this.data.scene.text,
          [
            Validators.required
          ]),
      'isStartGame':
        new FormControl(
          this.data.scene.isStartGame
        ),
      'color':
        new FormControl(
          this.data.scene.color
        ),
    });

    this.data.players.forEach((item) => {

      const isSelect = this.data.scene.players.includes(item.id);

      this.addControl(`playerId${item.id}`, isSelect);
      this.players.push({ player: item, isSelect: isSelect });
    });

    this.data.scene.answers.forEach(item => {
      this.addControl(`answerId${item.id}`, item.text);
      this.answers.push(item);
    });
  }

  private addControl(id: string, value: string | boolean) {
    this.form.addControl(id,
      new FormControl(
        value,
        [
          Validators.required
        ]));
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

    this.addControl(`answerId${answer.id}`, answer.text);
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

    this.data.scene.title = this.form.value['title'];
    this.data.scene.text = this.form.value['text'];
    this.data.scene.color = this.form.value['color'];
    this.data.scene.isStartGame = this.form.value['isStartGame'];

    this.data.scene.typesScene = this.selectTypeScene.type


    this.answers.forEach(item => {
      item.text = this.form.value[`answerId${item.id}`];
    });

    const player = this.players.filter(item => {
      return this.form.value[`playerId${item.player.id}`];
    }).map(item => {
      return item.player.id;
    });

    this.data.scene.soundFileLink = this.soundFileLink

    this.data.scene.answers = this.answers;
    this.data.scene.imageFileId = this.imageFileId;
    this.data.scene.imageFile = this.imgFile;

    this.data.scene.videoFileId = this.videoFileId
    if (this.videoFileId) {
      this.data.scene.videoFile = this.videoSources[0];
    } else {
      this.data.scene.videoFile = ''
    }


    this.data.scene.players = player;

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
    this.form.patchValue({
      file: ''
    });
    this.form.get('file').updateValueAndValidity();
  }

  onClickDeletedVideo() {
    this.videoFileId = ''
    this.videoSources = []
  }

}
