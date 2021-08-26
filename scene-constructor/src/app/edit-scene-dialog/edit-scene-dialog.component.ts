import {Component, Inject, OnInit, Output, EventEmitter} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialog, MatDialogRef} from '@angular/material/dialog';
import {Answer, Scene} from '../models/scene-model';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {CdkDragDrop} from '@angular/cdk/drag-drop/drag-events';

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

  drop(event: CdkDragDrop<string[]>) {
    //moveItemInArray(this.movies, event.previousIndex, event.currentIndex);
  }

  deleteAnswer(answer: Answer) {

    console.log(answer);

    const item = this.data.answers.find(item => item.id == answer.id);
    const index = this.answers.indexOf(item);
    this.answers.splice(index, 1);

    this.updatePosition();
  }

  onClickNewAnswer() {

    const ids: number[] = this.answers.map(item => item.id)
    let id = Math.max(...ids) + 1
    const positions: number[] = this.answers.map(item => item.position)
    const position = Math.max(...positions) + 1

    const answer = new Answer(id, '', position, this.data)

    this.addControl(answer)
    this.answers.push(answer)
    
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
