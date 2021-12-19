import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  ComponentFactoryResolver,
  ElementRef,
  Input,
  OnInit,
  ViewChild
} from '@angular/core';
import {SceneRunGame} from "../models/other-models/scenes.models";
import {IBaseSceneRunGame} from "../models/other-models/base-scene-run-game.model";
import {RefDirective} from "../../core/directive/ref.directive";
import {VideoComponent} from "./video/video.component";

@Component({
  selector: 'app-answer-scene-component',
  templateUrl: './answer-scene-component.component.html',
  styleUrls: ['./answer-scene-component.component.scss']
})
export class AnswerSceneComponentComponent implements OnInit, AfterViewInit {

  showImage: boolean = false
  showVideo: boolean = false

  @ViewChild(RefDirective) refDirective: RefDirective | undefined;

  private _scene: SceneRunGame

  @Input()
  set scene(value: SceneRunGame | IBaseSceneRunGame | any | undefined) {


    this.showVideo = !!value.videoFile
    this.showImage = !!value.imageFile && !this.showVideo

    setTimeout(() => {

      if(value.videoFile) {

        if(this._scene?.videoFile) {
          if(this._scene.videoFile != value.videoFile) {
            this.createVideo(value.videoFile)
          }
        } else {
          this.createVideo(value.videoFile)
        }

      } else {
        this.refDirective?.containerRef?.clear()
      }

      this._scene = value

    }, 0);
  }

  get scene(): SceneRunGame | IBaseSceneRunGame | any | undefined {
    return this._scene
  }

  constructor(private componentFactoryResolver: ComponentFactoryResolver) { }

  ngOnInit(): void {
  }

  ngAfterViewInit() {
    setTimeout(() => {

      if(this.scene.videoFile) {
        this.createVideo(this.scene.videoFile)
      }

    }, 0);
  }

  private createVideo(srcVideo: string) {

    if(!this.refDirective) {
      return
    }

    this.refDirective.containerRef.clear()
    const componentFactory = this.componentFactoryResolver.resolveComponentFactory(VideoComponent)
    const component = this.refDirective.containerRef.createComponent(componentFactory)
    component.instance.src = srcVideo
    component.instance.play()
  }

}
