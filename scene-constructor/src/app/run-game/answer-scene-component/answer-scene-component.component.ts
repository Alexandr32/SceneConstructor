import {Component, Input, OnInit} from '@angular/core';
import {SceneRunGame} from "../models/other-models/scenes.models";
import {IBaseSceneRunGame} from "../models/other-models/base-scene-run-game.model";

@Component({
  selector: 'app-answer-scene-component',
  templateUrl: './answer-scene-component.component.html',
  styleUrls: ['./answer-scene-component.component.scss']
})
export class AnswerSceneComponentComponent implements OnInit {

  @Input()
  scene: SceneRunGame | undefined

  constructor() { }

  ngOnInit(): void {
  }

}
