import { Component, Input, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { AnswerRunGame } from "src/app/run-game/models/other-models/answer.model";
import {StateService} from "../services/state.service";
import {StateGame} from "../models/other-models/state-game.model";

@Component({
  selector: 'app-item-answer',
  templateUrl: './item-answer.component.html',
  styleUrls: ['./item-answer.component.scss']
})
export class ItemAnswerComponent implements OnInit {

  @Input()
  answer: AnswerRunGame

  @Input()
  state$: Observable<StateGame>

  @Input()
  players: string[] = []

  // get widthProgressBar(): number {
  //
  //   debugger
  //
  //   if(!this.players) {
  //     return 0
  //   }
  //
  //   if(!this.players.length) {
  //     return 0
  //   }
  //
  //   console.log(this.count / this.players.length * 100)
  //
  //   return this.count / this.players.length * 100
  //
  //   //return this.count * 10
  //   //return this.count * (this.players ? this.players.length : 0)
  // }

  count: number = 0

  constructor() { }

  ngOnInit() {

    this.state$?.subscribe(value => {

      const count = value.answer?.filter(item => item.answerId === this.answer.id)

      if (!count) {
        this.count = 0
      } else {
        this.count = count.length
      }
    })
  }

}
