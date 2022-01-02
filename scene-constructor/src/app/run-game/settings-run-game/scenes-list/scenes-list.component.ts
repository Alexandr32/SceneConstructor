import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {IBaseSceneRunGame} from "../../models/other-models/base-scene-run-game.model";
import {Observable} from "rxjs";
import {RunGame} from "../../models/other-models/run-game.model";

@Component({
  selector: 'app-scenes-list',
  templateUrl: './scenes-list.component.html',
  styleUrls: ['./scenes-list.component.scss'],
})
export class ScenesListComponent implements OnInit {

  @Input()
  scenes: IBaseSceneRunGame[] = []

  @Output()
  selectedScene: EventEmitter<IBaseSceneRunGame> = new EventEmitter<IBaseSceneRunGame>()

  constructor() { }

  ngOnInit(): void {

  }

  select(scene: IBaseSceneRunGame) {
    this.selectedScene.emit(scene)
  }

}
