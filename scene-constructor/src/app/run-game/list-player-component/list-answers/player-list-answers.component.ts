import {Component, EventEmitter, Input, OnDestroy, OnInit, Output} from '@angular/core';
import {combineLatest, Observable} from "rxjs";
import {AnswerRunGame} from "../../models/other-models/answer.model";
import {map, takeUntil} from "rxjs/operators";
import {Player} from "../../../core/models/player.model";
import {StoreRunGameService} from "../../services/store-run-game.service";
import {BaseComponent} from "../../../base-component/base-component.component";

@Component({
  selector: 'app-player-list-answers',
  templateUrl: './player-list-answers.component.html',
  styleUrls: ['./player-list-answers.component.scss']
})
export class PlayerListAnswersComponent extends BaseComponent implements OnInit, OnDestroy {

  @Input()
  player: Player

  answers$: Observable<AnswerRunGame[]>

  @Output()
  selectAnswer: EventEmitter<AnswerRunGame> = new EventEmitter<AnswerRunGame>()

  constructor(private storeRunGameService: StoreRunGameService) {
    super()
  }

  ngOnInit(): void {

    const currentScene$ = this.storeRunGameService.currentScene$
    const stateGame$ = this.storeRunGameService.stateGame$

    this.answers$ = combineLatest(currentScene$, stateGame$,
      (currentScene, stateGame) =>
        ({currentScene, stateGame}))
      .pipe(
        takeUntil(this.ngUnsubscribe),
        map(pair => {

          if(!pair.currentScene.players.includes(this.player.id)) {
            return []
          }

          const selectAnswer = pair.stateGame.answer?.find(a => a.playerId === this.player.id)

          if(selectAnswer) {
            return []
          }

          return pair.currentScene.answers
        })
      )
  }

  async selectedAnswer(answer: AnswerRunGame) {
    this.selectAnswer.emit(answer)
  }

  ngOnDestroy(): void {
    this.unsubscribe()
  }

}
