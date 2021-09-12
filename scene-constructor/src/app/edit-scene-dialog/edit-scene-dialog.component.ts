import {Component, Inject, OnInit, Output, EventEmitter} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialog, MatDialogRef} from '@angular/material/dialog';
import {Scene} from '../models/scene.model';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {CdkDragDrop} from '@angular/cdk/drag-drop/drag-events';
import {v4 as uuidv4} from 'uuid';
import {Answer} from '../models/answer.model';
import {Player} from '../models/player.model';
import {CropperSettings} from 'ngx-img-cropper';
import {EditImageComponent} from '../edit-image-player/edit-image.component';
import {AngularFirestore} from '@angular/fire/firestore';

@Component({
  selector: 'app-edit-scene-dialog',
  templateUrl: './edit-scene-dialog.component.html',
  styleUrls: ['./edit-scene-dialog.component.scss']
})
export class EditSceneDialogComponent implements OnInit {

  @Output()
  saveEvent = new EventEmitter();

  form: FormGroup;

  imgFile: string;

  answers: Answer[] = [];
  players: { player: Player, isSelect: boolean }[] = [];

  constructor(public dialogRef: MatDialogRef<EditSceneDialogComponent>,
              private fireStore: AngularFirestore,
              @Inject(MAT_DIALOG_DATA) public data: { scene: Scene,
                players: Player[]},
              public dialog: MatDialog) {
  }

  ngOnInit(): void {

    this.imgFile = this.data.scene.imgFile

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
      'file': new FormControl(this.data.scene.imgFile, [Validators.required]),
    });

    console.log('this.data.players:', this.data.players);
    console.log('this.data.scene.players:', this.data.scene.players);

    this.data.players.forEach((item) => {

      const isSelect = this.data.scene.players.includes(item.id)

      this.addControl(`playerId${item.id}`, isSelect)
      this.players.push({player: item, isSelect: isSelect})
    })

    this.data.scene.answers.forEach(item => {
      this.addControl(`answerId${item.id}`, item.text)
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

    const previousIndex = event.previousIndex
    const currentIndex = event.currentIndex

    const currentAnswers = this.answers.find(item => item.position == previousIndex)
    const nextAnswers = this.answers.find(item => item.position == currentIndex)

    currentAnswers.position = currentIndex
    nextAnswers.position = previousIndex

    this.answers = this.answers.sort((a, b) => {
      if (a.position > b.position) {
        return 1;
      }
      if (a.position < b.position) {
        return -1;
      }
      return 0;
    })
  }

  deleteAnswer(answer: Answer) {

    console.log(answer);

    const item = this.data.scene.answers.find(item => item.id == answer.id);
    const index = this.answers.indexOf(item);
    this.answers.splice(index, 1);

    this.updatePosition();
  }

  onClickAddNewAnswer() {

    if(this.answers.length >= 4) {
      return
    }

    let id: string = this.fireStore.createId()

    const positions: number[] = this.answers.map(item => item.position)

    let position: number = this.getPosition(positions)

    let color = EditSceneDialogComponent.getRndColor()
    const answer = new Answer(id, '', position, this.data.scene, color)

    this.addControl(`answerId${answer.id}`, answer.text)
    this.answers.push(answer)
  }

  private static getRndColor(): string  {
    const r = Math.floor(Math.random() * (256))
    const g = Math.floor(Math.random() * (256))
    const b = Math.floor(Math.random() * (256))
    return '#' + r.toString(16) + g.toString(16) + b.toString(16);
  }

  private getPosition(positions: number[]): number {
    let position = 0
    if(positions.length != 0) {
      position = Math.max(...positions) + 1
    }
    return position
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

    this.answers.forEach(item => {
      item.text = this.form.value[`answerId${item.id}`]
    })

    const player = this.players.filter(item => {
      return this.form.value[`playerId${item.player.id}`]
    }).map(item => {
      return item.player.id
    })

    this.data.scene.answers = this.answers;

    this.data.scene.imgFile = this.imgFile

    this.data.scene.players = player;

    this.saveEvent.emit(this.data);
    this.dialogRef.close();
  }

  onNoClick(): void {
    this.dialogRef.close();
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
      data: {image: '', cropperSettings}
    });

    dialogRef.componentInstance.saveEvent.subscribe((imgFile: string) => {
      this.imgFile = imgFile
      this.form.patchValue({
        file: imgFile
      });
    })

    dialogRef.afterClosed().subscribe(() => {
      console.log('closeDialog');
    });
  }

  onClickDeletedImg() {
    this.imgFile = ''
    this.form.patchValue({
      file: ''
    });
    this.form.get('file').updateValueAndValidity()
  }

}
