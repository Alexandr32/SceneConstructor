import {Component, Input, OnInit} from '@angular/core';
import {PuzzleRunGame} from "../models/other-models/scenes.models";
import {IBaseSceneRunGame} from "../models/other-models/base-scene-run-game.model";
import {SceneRunGame} from "../models/other-models/scene-run-game";

@Component({
  selector: 'app-background-scene',
  templateUrl: './background-scene.component.html',
  styleUrls: ['./background-scene.component.scss']
})
export class BackgroundSceneComponent implements OnInit {

  showImage: boolean = false
  showVideo: boolean = false

  videoFile: string

  private _scene: SceneRunGame | PuzzleRunGame

  @Input()
  set scene(value: SceneRunGame | PuzzleRunGame | any | undefined) {

    this.showVideo = !!value.videoFile
    this.showImage = !!value.imageFile && !this.showVideo

    this.videoFile = value.videoFile

    this._scene = value
  }

  get scene(): SceneRunGame | PuzzleRunGame | IBaseSceneRunGame | any | undefined {
    return this._scene
  }

  constructor() { }

  ngOnInit(): void {
  }

}
