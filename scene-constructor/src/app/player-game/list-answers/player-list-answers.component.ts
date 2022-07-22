import {Component, EventEmitter, Input, OnDestroy, OnInit, Output} from '@angular/core';
import {AnswerRunGame} from "../../run-game/models/other-models/answer.model";
import {takeUntil} from "rxjs/operators";
import {Player} from "../../core/models/player.model";
import {StoreRunGameService} from "../../run-game/services/store-run-game.service";
import {BaseComponent} from "../../base-component/base-component.component";

@Component({
  selector: 'app-player-list-answers',
  templateUrl: './player-list-answers.component.html',
  styleUrls: ['./player-list-answers.component.scss']
})
export class PlayerListAnswersComponent extends BaseComponent implements OnInit, OnDestroy {

  @Input()
  player: Player

  answers: AnswerRunGame[]

  @Output()
  selectAnswer: EventEmitter<AnswerRunGame> = new EventEmitter<AnswerRunGame>()

  constructor(private storeRunGameService: StoreRunGameService) {
    super()
  }

  ngOnInit(): void {

    const stateGame$ = this.storeRunGameService.stateGame$
    stateGame$
      .pipe(
        takeUntil(this.ngUnsubscribe),
      )
      .subscribe((state) => {

        const selectAnswer = state.answer?.find(a => a.playerId === this.player.id)

        if (selectAnswer) {
          this.answers = []
          return
        }

        if (state.currentScene.players.includes(this.player.id)) {
          this.answers = state?.currentScene?.answers
        } else {
          this.answers = []
        }
      })
  }

  async selectedAnswer(answer: AnswerRunGame) {
    this.selectAnswer.emit(answer)
  }

  ngOnDestroy(): void {
    this.unsubscribe()
  }

}
