import {AfterViewInit, ChangeDetectorRef, Component, Input, OnInit} from '@angular/core';
import {PanoramaRunGame} from "../models/other-models/scenes.models";
import {IBaseSceneRunGame} from "../models/other-models/base-scene-run-game.model";

declare let pannellum: any;

@Component({
  selector: 'app-panorama-scene-component',
  templateUrl: './panorama-scene-component.component.html',
  styleUrls: ['./panorama-scene-component.component.scss']
})
export class PanoramaSceneComponentComponent implements OnInit {

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

  viewer: any

  constructor() {

  }

  showPanorama() {

    // setTimeout костыль для бага с обновлением
    setTimeout(() => {

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

    }, 0)
  }

  ngOnInit() {
    //this.showPanorama()
  }

  top() {
    this.viewer.setPitch(this.viewer.getPitch() + 20);
  }

  topLeft() {
    this.top()
    this.left()
  }

  topRight() {
    this.top()
    this.right()
  }

  center() {
    this.viewer.setPitch(0);
    this.viewer.setYaw(0);
  }

  bottom() {
    this.viewer.setPitch(this.viewer.getPitch() - 20);
  }

  bottomLeft() {
    this.bottom()
    this.left()
  }

  bottomRight() {
    this.bottom()
    this.right()
  }

  left() {
    this.viewer.setYaw(this.viewer.getYaw() - 50);
  }

  right() {
    this.viewer.setYaw(this.viewer.getYaw() + 50);
  }

  ngOnDestroy(): void {
    this.viewer?.destroy()
  }

}