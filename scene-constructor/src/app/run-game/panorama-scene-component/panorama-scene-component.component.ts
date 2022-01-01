import {AfterViewInit, ChangeDetectorRef, Component, Input, OnInit} from '@angular/core';
import {IBaseSceneRunGame} from "../models/other-models/base-scene-run-game.model";
import {PanoramaRunGame} from "../models/other-models/panorama-run-game";
import {Observable, timer} from "rxjs";
import {StateGame} from "../models/other-models/state-game.model";
import {TypeControls} from "../models/other-models/type-controls.enum";
import {debounce} from "rxjs/operators";

declare let pannellum: any;

@Component({
  selector: 'app-panorama-scene-component',
  templateUrl: './panorama-scene-component.component.html',
  styleUrls: ['./panorama-scene-component.component.scss']
})
export class PanoramaSceneComponentComponent implements OnInit, AfterViewInit {

  private _scene: PanoramaRunGame | IBaseSceneRunGame | any | undefined

  // редактор кода не умеет определять что PanoramaRunGame реализует IBaseSceneRunGame
  // any, позволяет исправить это
  @Input()
  set scene(value: PanoramaRunGame | IBaseSceneRunGame | any | undefined) {
    this._scene = value
    this.showPanorama()
  }

  get scene(): PanoramaRunGame | IBaseSceneRunGame | any | undefined {
    return this._scene
  }

  @Input()
  state$: Observable<StateGame>

  viewer: any

  private typesControls: Map<TypeControls, () => void> = new Map<TypeControls, () => () => void>();

  constructor() {
    this.typesControls.set(TypeControls.top, this.top)
    this.typesControls.set(TypeControls.topLeft, this.topLeft)
    this.typesControls.set(TypeControls.topRight, this.topRight)
    this.typesControls.set(TypeControls.center, this.center)
    this.typesControls.set(TypeControls.bottom, this.bottom)
    this.typesControls.set(TypeControls.bottomLeft, this.bottomLeft)
    this.typesControls.set(TypeControls.bottomRight, this.bottomRight)
    this.typesControls.set(TypeControls.left, this.left)
    this.typesControls.set(TypeControls.right, this.right)
  }

  showPanorama() {

    if(this.viewer) {
      this.viewer?.destroy()
    }

    this.viewer = pannellum.viewer('panoramaContainer', {
      "type": "equirectangular",
      "panorama": this.scene?.imageFile,
      "autoLoad": true,
      "autoRotate": true,
      'showFullscreenCtrl': false,
      'autoRotateInactivityDelay': 1,
      'minYaw': -160,
      'maxYaw': 160,
      'hfov': 160,
      'minPitch': -80,
      'maxPitch': 80,
      'showZoomCtrl': false,
      'keyboardZoom': false,
      'mouseZoom': false,
      'showControls': false,
      'dynamic': false
    });
  }

  ngOnInit() {


  }

  ngAfterViewInit(): void {
    this.state$
      .subscribe(state => {

        console.log(this._scene)
        console.log(state)

      // top,
      //   topLeft,
      //   topRight,
      //   center,
      //   bottom,
      //   bottomLeft,
      //   bottomRight,
      //   left,
      //   right

      // switch (state.typeControls) {
      //   case constant_expr2: {
      //     // операторы;
      //     break;
      //   }
      // }

      //this.left()

        const action = this.typesControls.get(state.typeControls)
        if(action) {
          action()
        }


      // setTimeout(() => {
      //   const action = this.typesControls.get(state.typeControls)
      //   action()
      // }, 0)
    })
  }

  top = () => {
    this.viewer?.setPitch(this.viewer.getPitch() + 20);
  }

  topLeft = () => {
    this.top()
    this.left()
  }

  topRight = () => {
    this.top()
    this.right()
  }

  center = () => {
    this.viewer?.setPitch(0);
    this.viewer?.setYaw(0);
  }

  bottom = () => {
    this.viewer?.setPitch(this.viewer?.getPitch() - 20);
  }

  bottomLeft = () => {
    this.bottom()
    this.left()
  }

  bottomRight = () => {
    this.bottom()
    this.right()
  }

  left = () => {
    this.viewer?.setYaw(this.viewer.getYaw() - 50);
  }

  right = () => {
    this.viewer?.setYaw(this.viewer.getYaw() + 50);
  }

  ngOnDestroy(): void {
    this.viewer?.destroy()
  }

}
