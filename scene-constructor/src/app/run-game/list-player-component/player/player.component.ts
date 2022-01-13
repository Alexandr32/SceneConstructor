import {Component, Input, OnDestroy, OnInit} from '@angular/core';
import {AnswerRunGame} from "src/app/run-game/models/other-models/answer.model";
import {Player} from '../../../core/models/player.model';
import {IBaseSceneRunGame} from '../../models/other-models/base-scene-run-game.model';
import {takeUntil} from "rxjs/operators";
import {StateGame} from "../../models/other-models/state-game.model";
import {TypeControls} from "../../models/other-models/type-controls.enum";
import {StoreRunGameService} from "../../services/store-run-game.service";
import {BaseComponent} from "../../../base-component/base-component.component";

@Component({
  selector: 'app-player',
  templateUrl: './player.component.html',
  styleUrls: ['./player.component.scss']
})
export class PlayerComponent extends BaseComponent implements OnInit, OnDestroy {

  @Input()
  player: Player

  currentScene: IBaseSceneRunGame
  stateGame: StateGame

  constructor(
    private storeRunGameService: StoreRunGameService
  ) {
    super()
  }

  ngOnDestroy(): void {
    this.unsubscribe()
  }

  ngOnInit() {

    this.storeRunGameService.currentScene$
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe(currentScene => {
        this.currentScene = currentScene
      })
  }

  async selectAnswer(answer: AnswerRunGame) {
    await this.storeRunGameService.saveSelectAnswerStateGame(this.player, answer)
  }

  async selectControls(typeControls: TypeControls) {
    await this.storeRunGameService.saveSelectTypeControls(typeControls)
  }
}
