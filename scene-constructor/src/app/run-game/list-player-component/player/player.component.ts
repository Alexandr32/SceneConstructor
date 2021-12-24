import { Component, Input, OnInit } from '@angular/core';
import { AnswerRunGame } from "src/app/run-game/models/other-models/answer.model";
import { RunGameService } from 'src/app/run-game/services/run-game.service';
import { Player } from '../../../core/models/player.model';
import { IBaseSceneRunGame } from '../../models/other-models/base-scene-run-game.model';
import {StateService} from "../../services/state.service";
import {Observable} from "rxjs";
import {map} from "rxjs/operators";
import { combineLatest } from 'rxjs';

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

  private scenesMap: Map<string, IBaseSceneRunGame>

  player$: Observable<Player>
  private player: Player

  answers$: Observable<AnswerRunGame[]>

  constructor(
    private runGameService: RunGameService,
    private stateService: StateService) {

  }

  ngOnInit() {

    const runGame$ = this.runGameService.runGame$

    this.player$ = runGame$.pipe(
      map(runGame => {
        this.scenesMap = runGame.scenesMap
        this.player = runGame.players.find(item => item.id === this.playerId)
        return this.player
      })
    )

    const state$ = this.stateService.getStateGame(this.gameId)

    this.answers$ = combineLatest(this.player$, state$, (player, state) => ({player, state}))
      .pipe(
        map(pair => {

          const findAnswer = pair.state.answer?.find(a => a.playerId === pair.player.id)

          if(!findAnswer) {
            return this.scenesMap.get(pair.state.currentSceneId).answers
          }

          return []
        })
      )

  }

  async selectAnswer(answer: AnswerRunGame) {
    await this.stateService.saveSelectAnswerStateGame(this.gameId, this.player, answer)
  }
}
