import {Component, Input, OnInit} from '@angular/core';
import {AnswerRunGame} from "src/app/run-game/models/other-models/answer.model";
import {RunGameService} from 'src/app/run-game/services/run-game.service';
import {Player} from '../../../core/models/player.model';
import {IBaseSceneRunGame} from '../../models/other-models/base-scene-run-game.model';
import {StateService} from "../../services/state.service";
import {Observable, Subject} from "rxjs";
import {map} from "rxjs/operators";
import {combineLatest} from 'rxjs';
import {StateRunGameService} from "../../services/state-run-game.service";
import {StateGame} from "../../models/other-models/state-game.model";

@Component({
  selector: 'app-player',
  templateUrl: './player.component.html',
  styleUrls: ['./player.component.scss']
})
export class PlayerComponent implements OnInit {

  @Input()
  playerId: string

  @Input()
  gameId: string

  player$: Observable<Player>
  private player: Player

  currentScene$: Observable<IBaseSceneRunGame>
  stateGame$ :Observable<StateGame>

  constructor(
    private stateRunGameService: StateRunGameService,
    private stateService: StateService
  ) {

  }

  ngOnInit() {
    this.player$ = this.stateRunGameService.players$.pipe(
      map(x => {
        const player = x.find(player => player.id === this.playerId)
        this.player = player
        return player
      })
    )

    this.currentScene$ = this.stateRunGameService.currentScene$

    this.stateGame$ = this.stateRunGameService.stateGame$
  }

  async selectAnswer(answer: AnswerRunGame) {
    await this.stateService.saveSelectAnswerStateGame(this.gameId, this.player, answer)
  }
}
