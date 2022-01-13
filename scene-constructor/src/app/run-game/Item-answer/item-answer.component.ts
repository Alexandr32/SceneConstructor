import {Component, Input, OnDestroy, OnInit} from '@angular/core';
import { Observable } from 'rxjs';
import { AnswerRunGame } from "src/app/run-game/models/other-models/answer.model";
import {StateGame} from "../models/other-models/state-game.model";
import {takeUntil} from "rxjs/operators";
import {BaseComponent} from "../../base-component/base-component.component";

@Component({
  selector: 'app-item-answer',
  templateUrl: './item-answer.component.html',
  styleUrls: ['./item-answer.component.scss']
})
export class ItemAnswerComponent extends BaseComponent implements OnInit, OnDestroy {

  @Input()
  answer: AnswerRunGame

  @Input()
  state$: Observable<StateGame>

  @Input()
  players: string[] = []

  count: number = 0

  constructor() { super() }

  ngOnInit() {

    this.state$?.pipe(takeUntil(this.ngUnsubscribe)).subscribe(value => {
      const count = value.answer?.filter(item => item.answerId === this.answer.id)

      if (!count) {
        this.count = 0
      } else {
        this.count = count.length
      }
    })
  }

  ngOnDestroy(): void {
    this.unsubscribe()
  }

}
