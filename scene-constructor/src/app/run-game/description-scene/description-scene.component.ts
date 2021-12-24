import {Component, Input, OnInit} from '@angular/core';
import {SceneRunGame} from "../models/other-models/scene-run-game";
import {PanoramaRunGame} from "../models/other-models/panorama-run-game";
import {Observable} from "rxjs";
import {StateGame} from "../models/other-models/state-game.model";

@Component({
  selector: 'app-description-scene',
  templateUrl: './description-scene.component.html',
  styleUrls: ['./description-scene.component.scss']
})
export class DescriptionSceneComponent implements OnInit {

  @Input()
  scene: SceneRunGame | PanoramaRunGame

  constructor() { }

  ngOnInit(): void {
  }

}
