import { Component, Input, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { AnswerRunGame } from "src/app/run-game/models/other-models/answer.model";

@Component({
  selector: 'app-item-answer',
  templateUrl: './item-answer.component.html',
  styleUrls: ['./item-answer.component.scss']
})
export class ItemAnswerComponent implements OnInit {

  @Input()
  answer: AnswerRunGame

  @Input()
  answers$: Observable<{ id: string, value: string }[]>

  count: number = 0

  constructor() { }

  ngOnInit() {

    this.answers$?.subscribe(value => {

      const count = value.filter(item => item.value === this.answer.id)

      if (!count) {
        this.count = 0
      } else {
        this.count = count.length
      }
      console.log(count);
    })
  }

}
