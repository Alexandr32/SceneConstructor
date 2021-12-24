import {
  AfterViewInit,
  Component,
  Input,
  OnInit
} from '@angular/core';
import {IBaseSceneRunGame} from "../models/other-models/base-scene-run-game.model";
import {SceneRunGame} from "../models/other-models/scene-run-game";

@Component({
  selector: 'app-answer-scene-component',
  templateUrl: './answer-scene-component.component.html',
  styleUrls: ['./answer-scene-component.component.scss']
})
export class AnswerSceneComponentComponent implements OnInit, AfterViewInit {

  showImage: boolean = false
  showVideo: boolean = false

  videoFile: string

  private _scene: SceneRunGame

  @Input()
  set scene(value: SceneRunGame | IBaseSceneRunGame | any | undefined) {


    this.showVideo = !!value.videoFile
    this.showImage = !!value.imageFile && !this.showVideo

    this.videoFile = value.videoFile

    this._scene = value
  }

  get scene(): SceneRunGame | IBaseSceneRunGame | any | undefined {
    return this._scene
  }

  constructor() { }

  ngOnInit(): void {
  }

  ngAfterViewInit() {
  }

}
