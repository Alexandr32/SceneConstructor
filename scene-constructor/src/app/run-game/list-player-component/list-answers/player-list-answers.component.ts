import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {combineLatest, Observable} from "rxjs";
import {AnswerRunGame} from "../../models/other-models/answer.model";
import {map} from "rxjs/operators";
import {IBaseSceneRunGame} from "../../models/other-models/base-scene-run-game.model";
import {StateGame} from "../../models/other-models/state-game.model";

@Component({
  selector: 'app-player-list-answers',
  templateUrl: './player-list-answers.component.html',
  styleUrls: ['./player-list-answers.component.scss']
})
export class PlayerListAnswersComponent implements OnInit {

  @Input()
  playerId: string
  @Input()
  currentScene$: Observable<IBaseSceneRunGame>
  @Input()
  stateGame$ :Observable<StateGame>

  answers$: Observable<AnswerRunGame[]>

  @Output()
  selectAnswer: EventEmitter<AnswerRunGame> = new EventEmitter<AnswerRunGame>()

  constructor() { }

  ngOnInit(): void {

    this.answers$ = combineLatest(this.currentScene$, this.stateGame$,
      (currentScene, stateGame) =>
        ({currentScene, stateGame}))
      .pipe(
        map(pair => {

          //debugger

          if(!pair.currentScene.players.includes(this.playerId)) {
            return []
          }

          const selectAnswer = pair.stateGame.answer?.find(a => a.playerId === this.playerId)

          if(selectAnswer) {
            return []
          }

          return pair.currentScene.answers
        })
      )

    // this.answers$ = combineLatest(this.currentScene$, this.stateGame$, (currentScene, stateGame) => ({currentScene, stateGame}))
    //   .pipe(
    //     map(pair => {
    //
    //       //debugger
    //
    //       if(!pair.currentScene.players.includes(this.playerId)) {
    //         return []
    //       }
    //
    //       const selectAnswer = pair.stateGame.answer?.find(a => a.playerId === this.playerId)
    //
    //       if(selectAnswer) {
    //         return []
    //       }
    //
    //       return pair.currentScene.answers
    //     })
    //   )
  }

  async selectedAnswer(answer: AnswerRunGame) {
    this.selectAnswer.emit(answer)
  }

}
