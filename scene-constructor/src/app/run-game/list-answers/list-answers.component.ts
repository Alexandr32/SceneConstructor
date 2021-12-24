import {Component, Input, OnInit} from '@angular/core';
import {SceneRunGame} from "../models/other-models/scene-run-game";
import {PanoramaRunGame} from "../models/other-models/panorama-run-game";

@Component({
  selector: 'app-list-answers',
  templateUrl: './list-answers.component.html',
  styleUrls: ['./list-answers.component.scss']
})
export class ListAnswersComponent implements OnInit {

  @Input()
  scene: SceneRunGame | PanoramaRunGame

  constructor() { }

  ngOnInit(): void {
  }

}
