import {AfterViewInit, Component, OnInit} from '@angular/core';
import {Observable, Subscription} from "rxjs";
import {TypeControls} from "../models/other-models/type-controls.enum";
import {StoreRunGameService} from "../services/store-run-game.service";
import {TypeSceneEnum} from "../../core/models/type-scene.enum";
import {PanoramaRunGame} from "../models/other-models/panorama-run-game";
import {StateGame} from "../models/other-models/state-game.model";
import {BaseComponent} from "../../base-component/base-component.component";
import {takeUntil} from "rxjs/operators";

declare let pannellum: any;

@Component({
  selector: 'app-panorama-scene-component',
  templateUrl: './panorama-scene-component.component.html',
  styleUrls: ['./panorama-scene-component.component.scss']
})
export class PanoramaSceneComponentComponent extends BaseComponent implements OnInit, AfterViewInit {


  //Костыль считает сколько ответов чтобы камера не дергалась при ответе пропустить сцену
  private countAnswer: number = 0
  state$: Observable<StateGame> = this.storeRunGameService.stateGame$

  scene: PanoramaRunGame

  viewer: any

  private typesControls: Map<TypeControls, () => void> = new Map<TypeControls, () => () => void>();

  constructor(private storeRunGameService: StoreRunGameService) {
    super()
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

    if (this.viewer) {
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

    this.storeRunGameService.currentScene$
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe((currentScene) => {

        if (currentScene.typesScene !== TypeSceneEnum.Panorama) {
          return
        }

        this.scene = (currentScene as PanoramaRunGame)
        this.showPanorama()
      })

    this.storeRunGameService.stateGame$
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe(state => {

        //Костыль считает сколько ответов чтобы камера не дергалась при ответе пропустить сцену
        if(state.answer) {
          if(state.answer.length !== this.countAnswer) {
            this.countAnswer = state.answer.length
            return
          }
        }

        const action = this.typesControls.get(state.typeControls)
        if (action) {
          action()
        }
      })

  }

  ngAfterViewInit(): void {

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
    super.unsubscribe()
    this.viewer?.destroy()
  }

}
