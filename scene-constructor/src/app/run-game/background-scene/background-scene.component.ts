import {AfterViewInit, Component, Input, OnDestroy, OnInit} from '@angular/core';
import {Observable} from "rxjs";
import {StateGame} from "../models/other-models/state-game.model";
import {StoreRunGameService} from "../services/store-run-game.service";
import {TypeSceneEnum} from "../../core/models/type-scene.enum";
import {SceneRunGame} from "../models/other-models/scene-run-game";
import {PuzzleRunGame} from "../models/other-models/scenes.models";
import {BaseComponent} from "../../base-component/base-component.component";
import {takeUntil} from "rxjs/operators";

@Component({
  selector: 'app-background-scene',
  templateUrl: './background-scene.component.html',
  styleUrls: ['./background-scene.component.scss']
})
export class BackgroundSceneComponent extends BaseComponent implements OnInit, AfterViewInit, OnDestroy {

  showImage: boolean = false
  showVideo: boolean = false

  videoFile: string

  scene: SceneRunGame | PuzzleRunGame

  @Input()
  state$: Observable<StateGame> = this.storeRunGameService.stateGame$

  constructor(private storeRunGameService: StoreRunGameService) {
    super()
  }

  ngOnInit(): void {

    this.storeRunGameService.currentScene$
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe(currentScene => {

        if (currentScene.typesScene === TypeSceneEnum.Panorama) {
          return
        }

        this.scene = currentScene as SceneRunGame | PuzzleRunGame

        this.showVideo = !!this.scene.videoFile
        this.showImage = !!this.scene.imageFile && !this.showVideo
        this.videoFile = this.scene.videoFile
      })
  }

  ngAfterViewInit(): void {

  }

  ngOnDestroy(): void {
    this.unsubscribe()
  }

}
