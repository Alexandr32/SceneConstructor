import {Component, Input, OnDestroy, OnInit} from '@angular/core';
import {AnswerRunGame} from "src/app/run-game/models/other-models/answer.model";
import {Player} from '../../core/models/player.model';
import {IBaseSceneRunGame} from '../../run-game/models/other-models/base-scene-run-game.model';
import {takeUntil} from "rxjs/operators";
import {StateGame} from "../../run-game/models/other-models/state-game.model";
import {TypeControls} from "../../run-game/models/other-models/type-controls.enum";
import {StoreRunGameService} from "../../run-game/services/store-run-game.service";
import {BaseComponent} from "../../base-component/base-component.component";
import {StateService} from "../../run-game/services/state.service";
import {SceneForPuzzleControlPlayerRunGame} from "../../run-game/models/other-models/puzzle-run-game.models";
import {PartsPuzzleImage} from "../../core/models/parts-puzzle-image.model";


@Component({
  selector: 'app-player',
  templateUrl: './player.component.html',
  styleUrls: ['./player.component.scss']
})
export class PlayerComponent extends BaseComponent implements OnInit, OnDestroy {

  @Input()
  player: Player

  @Input()
  showImage: boolean = false

  stateGame: StateGame

  constructor(
    private storeRunGameService: StoreRunGameService,
    private stateService: StateService
  ) {
    super()
  }

  ngOnDestroy(): void {
    this.unsubscribe()
  }

  ngOnInit() {
    this.storeRunGameService.stateGame$
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe((stateGame) => {
        this.stateGame = stateGame
      })
  }

  async selectPuzzle(value: {
    sceneForPuzzleControlPlayerRunGame: SceneForPuzzleControlPlayerRunGame, // Сцена игрока
    event: 'del' | 'add' // Добавить или удалить элемент со сцены,
    numberPosition: number // Номер позиции с 1-9,
    image: PartsPuzzleImage
  }) {
    await this.stateService.selectPuzzle(value)
  }

  async selectAnswer(answer: AnswerRunGame) {
    await this.stateService.saveSelectAnswerStateGame(this.player, answer)
  }

  async selectControls(typeControls: TypeControls) {
    await this.stateService.saveSelectTypeControls(typeControls)
  }
}
