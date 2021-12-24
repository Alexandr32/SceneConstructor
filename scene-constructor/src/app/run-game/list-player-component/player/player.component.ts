import { Component, Input, OnInit } from '@angular/core';
import { AnswerRunGame } from "src/app/run-game/models/other-models/answer.model";
import { TypeFile } from 'src/app/editor/models/type-file.model';
import { FirestoreService } from 'src/app/editor/services/firestore.service';
import { RunGameService } from 'src/app/run-game/services/run-game.service';
import { Player } from '../../../core/models/player.model';
import { FileService } from 'src/app/core/services/file.service';
import { IBaseSceneRunGame } from '../../models/other-models/base-scene-run-game.model';
import {StateService} from "../../services/state.service";
import {Observable, of, Subject} from "rxjs";
import {map} from "rxjs/operators";

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
    private stateService: StateService,
    private firestoreService: FirestoreService,
    private fileService: FileService) {

  }

  ngOnInit() {

    const runGame$ = this.runGameService.runGame$

    this.player$ = runGame$.pipe(
      map(runGame => {
        this.scenesMap = runGame.scenesMap
        return runGame.players.find(item => item.id === this.playerId)
      })
    )
  }

  async selectAnswer(answer: AnswerRunGame) {
    await this.stateService.saveSelectAnswerStateGame(this.gameId, this.player, answer)
  }
}
