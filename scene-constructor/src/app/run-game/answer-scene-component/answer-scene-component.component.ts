import {AfterViewInit, Component, ComponentFactoryResolver, ElementRef, Input, OnInit, ViewChild} from '@angular/core';
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


  @ViewChild(RefDirective) refDirective: RefDirective;


  @ViewChild(VideoComponent, {static: false})
  private videoComponent: VideoComponent|undefined;

  //@ViewChild('videoPlayer') videoComponent: VideoComponent;

  //file = "https://firebasestorage.googleapis.com/v0/b/webgame-a64c1.appspot.com/o/SourceStore%2F5zFV2tQfho84n4QTag9A%2FSceneVideos%2F5mwWy76bQYIAD4sn3TkZ?alt=media&token=36a483e6-f7fc-4b21-91da-ab8c70874513"

  private _scene: SceneRunGame | IBaseSceneRunGame | any | undefined

  @Input()
  set scene(value: SceneRunGame | IBaseSceneRunGame | any | undefined) {
    this._scene = value

    //this.videoComponent.src = this._scene.videoFile
    //this.videoComponent.play()

    if(this.refDirective) {
      this.refDirective?.containerRef?.clear()
      const componentFactory = this.componentFactoryResolver.resolveComponentFactory(VideoComponent)
      const component = this.refDirective.containerRef.createComponent(componentFactory)
      component.instance.src = this.scene.videoFile
      component.instance.play()
    }

  }

  get scene(): SceneRunGame | IBaseSceneRunGame | any | undefined {
    return this._scene
  }

  constructor(private componentFactoryResolver: ComponentFactoryResolver) { }

  ngOnInit(): void {
    console.log('ngOnInit', 'AnswerSceneComponentComponent')

    // console.log('refDirective', this.refDirective)
    //
    // const componentFactory = this.componentFactoryResolver.resolveComponentFactory(VideoComponent)
    // //componentFactory.create(VideoComponent)
    //
    // const component = this.refDirective.containerRef.createComponent(componentFactory)
    // component.instance.src = this.scene.videoFile
  }

  ngAfterViewInit() {
    console.log('ngAfterViewInit', this.scene)
    //console.log('refDirective', this.refDirective)

    setTimeout(() => {
      const componentFactory = this.componentFactoryResolver.resolveComponentFactory(VideoComponent)

      console.log(this.scene.videoFile)

      const component = this.refDirective.containerRef.createComponent(componentFactory)
      component.instance.src = this.scene.videoFile
      component.instance.play()
    }, 0);

  }

}
