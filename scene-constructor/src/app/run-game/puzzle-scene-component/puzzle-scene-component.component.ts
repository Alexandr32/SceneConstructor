import {Component, Input, OnInit} from '@angular/core';
import {PuzzleRunGame} from "../models/other-models/scenes.models";
import {IBaseSceneRunGame} from "../models/other-models/base-scene-run-game.model";

@Component({
  selector: 'app-puzzle-scene-component',
  templateUrl: './puzzle-scene-component.component.html',
  styleUrls: ['./puzzle-scene-component.component.scss']
})
export class PuzzleSceneComponentComponent implements OnInit {

  @Input()
  scene: PuzzleRunGame | IBaseSceneRunGame | any | undefined

  constructor() { }

  ngOnInit(): void {
  }

}
