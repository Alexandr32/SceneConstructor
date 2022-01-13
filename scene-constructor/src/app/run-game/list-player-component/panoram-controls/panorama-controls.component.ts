import {Component, EventEmitter, Input, OnDestroy, OnInit, Output, ViewEncapsulation} from '@angular/core';
import {AnswerRunGame} from "../../models/other-models/answer.model";
import {TypeControls} from "../../models/other-models/type-controls.enum";
import {Player} from "../../../core/models/player.model";
import {StoreRunGameService} from "../../services/store-run-game.service";
import {BaseComponent} from "../../../base-component/base-component.component";
import {takeUntil} from "rxjs/operators";

@Component({
  selector: 'app-panorama-controls',
  templateUrl: './panorama-controls.component.html',
  styleUrls: ['./panorama-controls.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class PanoramaControlsComponent extends BaseComponent implements OnInit, OnDestroy {

  @Input()
  player: Player

  isShowControls: boolean = false

  @Output()
  selectControls: EventEmitter<TypeControls> = new EventEmitter<TypeControls>()

  @Output()
  selectAnswer: EventEmitter<AnswerRunGame> = new EventEmitter<AnswerRunGame>()

  constructor(private storeRunGameService: StoreRunGameService) {
    super()
  }

  ngOnInit(): void {
    this.storeRunGameService.currentScene$
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe(currentScene => {
        this.isShowControls = currentScene.players.includes(this.player.id)
      })
  }

  top() {
    this.selectControls.emit(TypeControls.top)
  }

  topLeft() {
    this.selectControls.emit(TypeControls.topLeft)
  }

  topRight() {
    this.selectControls.emit(TypeControls.topRight)
  }

  center() {
    this.selectControls.emit(TypeControls.center)
  }

  bottom() {
    this.selectControls.emit(TypeControls.bottom)
  }

  bottomLeft() {
    this.selectControls.emit(TypeControls.bottomLeft)
  }

  bottomRight() {
    this.selectControls.emit(TypeControls.bottomRight)
  }

  left() {
    this.selectControls.emit(TypeControls.left)
  }

  right() {
    this.selectControls.emit(TypeControls.right)
  }

  ngOnDestroy(): void {
    this.unsubscribe()
  }

}
