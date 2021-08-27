import {Component, Inject, OnInit, Output, EventEmitter} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialog, MatDialogRef} from '@angular/material/dialog';
import {Scene} from '../models/scene.model';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {CdkDragDrop} from '@angular/cdk/drag-drop/drag-events';
import {v4 as uuidv4} from 'uuid';
import {Answer} from '../models/answer.model';
import {EditorComponent} from '../editor/editor.component';

@Component({
  selector: 'app-edit-scene-dialog',
  templateUrl: './edit-scene-dialog.component.html',
  styleUrls: ['./edit-scene-dialog.component.scss']
})
export class EditSceneDialogComponent implements OnInit {

  @Output()
  saveEvent = new EventEmitter();

  form: FormGroup;

  answers: Answer[] = [];

  constructor(public dialogRef: MatDialogRef<EditSceneDialogComponent>,
              @Inject(MAT_DIALOG_DATA) public data: Scene) {
  }

  ngOnInit(): void {
    this.form = new FormGroup({
      'title':
        new FormControl(
          this.data.title,
          [
            Validators.required
          ]),
      'text':
        new FormControl(
          this.data.text,
          [
            Validators.required
          ])
    });

    this.data.answers.forEach(item => {
      this.addControl(item)
      this.answers.push(item);
    });
  }

  private addControl(answer: Answer) {
    this.form.addControl(`answerId${answer.id}`,
      new FormControl(
        answer.text,
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

    const item = this.data.answers.find(item => item.id == answer.id);
    const index = this.answers.indexOf(item);
    this.answers.splice(index, 1);

    this.updatePosition();
  }

  onClickAddNewAnswer() {

    let id: string = this.getId()

    console.log('this.data:', this.data);

    const positions: number[] = this.answers.map(item => item.position)

    let position: number = this.getPosition(positions)

    let color = EditSceneDialogComponent.getRndColor()
    const answer = new Answer(id, '', position, this.data, color)

    this.addControl(answer)
    this.answers.push(answer)
  }

  private static getRndColor(): string  {
    const r = Math.floor(Math.random() * (256))
    const g = Math.floor(Math.random() * (256))
    const b = Math.floor(Math.random() * (256))
    return '#' + r.toString(16) + g.toString(16) + b.toString(16);
  }

  private getId(): string {
    return uuidv4();
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

  onClick() {
    this.saveEvent.emit();
  }

  onClickSave() {
    if (this.form.invalid) {
      return;
    }

    this.data.title = this.form.value['title'];
    this.data.text = this.form.value['text'];

    this.answers.forEach(item => {
      item.text = this.form.value[`answerId${item.id}`]
    })

    this.data.answers = this.answers;

    this.saveEvent.emit(this.data);
    this.dialogRef.close();
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

}
