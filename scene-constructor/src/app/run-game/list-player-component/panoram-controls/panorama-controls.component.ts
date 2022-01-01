import {Component, EventEmitter, Input, OnInit, Output, ViewEncapsulation} from '@angular/core';
import {Observable} from "rxjs";
import {AnswerRunGame} from "../../models/other-models/answer.model";
import {IBaseSceneRunGame} from "../../models/other-models/base-scene-run-game.model";
import {StateGame} from "../../models/other-models/state-game.model";
import {TypeControls} from "../../models/other-models/type-controls.enum";

@Component({
  selector: 'app-panorama-controls',
  templateUrl: './panorama-controls.component.html',
  styleUrls: ['./panorama-controls.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class PanoramaControlsComponent implements OnInit {

  @Input()
  playerId: string
  @Input()
  currentScene$: Observable<IBaseSceneRunGame>
  @Input()
  stateGame$ :Observable<StateGame>

  @Output()
  selectControls: EventEmitter<TypeControls> = new EventEmitter<TypeControls>()

  @Output()
  selectAnswer: EventEmitter<AnswerRunGame> = new EventEmitter<AnswerRunGame>()

  constructor() { }

  ngOnInit(): void {
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

}
