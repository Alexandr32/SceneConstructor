import {Component, Inject, OnInit, Output, EventEmitter} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
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
  saveEvent = new EventEmitter()

  form: FormGroup

  answers: Answer[] = []

  constructor(public dialogRef: MatDialogRef<EditSceneDialogComponent>,
              @Inject(MAT_DIALOG_DATA) public data: Scene) { }

  ngOnInit(): void {
    this.form = new FormGroup({
      "title":
        new FormControl(
          this.data.title,
          [
            Validators.required
          ]),
      "text":
        new FormControl(
          this.data.text,
          [
            Validators.required
          ])
    });

    this.data.answers.forEach(item => {
      this.answers.push(item)
    })
  }

  drop(event: CdkDragDrop<string[]>) {
    //moveItemInArray(this.movies, event.previousIndex, event.currentIndex);
  }

  editAnswer(answer: Answer) {

  }

  deleteAnswer(answer: Answer) {
    const item = this.data.answers.find(item => item.id == answer.id)
    const index = this.answers.indexOf(item)
    console.log('index:', index);
    this.answers.splice(index, 1)
  }


  onClick() {
    this.saveEvent.emit()
  }

  onClickSave() {
    if (this.form.invalid) {
      return
    }

    this.data.title = this.form.value['title']
    this.data.text = this.form.value['text']

    this.data.answers = this.answers

    this.saveEvent.emit(this.data)
    this.dialogRef.close();
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

}
