import {Component, OnDestroy, OnInit} from '@angular/core';
import {StoreRunGameService} from "../services/store-run-game.service";
import {BaseComponent} from "../../base-component/base-component.component";
import {takeUntil} from "rxjs/operators";
import {TypeSceneEnum} from "../../core/models/type-scene.enum";
import {PuzzleRunGame} from "../models/other-models/puzzle-run-game.models";
import {PartsPuzzleImage} from "../../core/models/parts-puzzle-image.model";
import {StateGame} from "../models/other-models/state-game.model";

@Component({
  selector: 'app-puzzle-scene-component',
  templateUrl: './puzzle-scene-component.component.html',
  styleUrls: ['./puzzle-scene-component.component.scss']
})
export class PuzzleSceneComponentComponent extends BaseComponent implements OnInit, OnDestroy {

  // Список изображений для сцены
  imgInPlace1: PartsPuzzleImage[] = [];
  imgInPlace2: PartsPuzzleImage[] = [];
  imgInPlace3: PartsPuzzleImage[] = [];
  imgInPlace4: PartsPuzzleImage[] = [];
  imgInPlace5: PartsPuzzleImage[] = [];
  imgInPlace6: PartsPuzzleImage[] = [];
  imgInPlace7: PartsPuzzleImage[] = [];
  imgInPlace8: PartsPuzzleImage[] = [];
  imgInPlace9: PartsPuzzleImage[] = [];

  scenePartsPuzzleImages: PartsPuzzleImage[][] = [
    this.imgInPlace1,
    this.imgInPlace2,
    this.imgInPlace3,
    this.imgInPlace4,
    this.imgInPlace5,
    this.imgInPlace6,
    this.imgInPlace7,
    this.imgInPlace8,
    this.imgInPlace9,
  ]

   scene: PuzzleRunGame

  constructor(private storeRunGameService: StoreRunGameService) {
    super()
  }

  ngOnInit(): void {

    this.storeRunGameService.stateGame$
      .pipe(
        takeUntil(this.ngUnsubscribe)
      ).subscribe(state => {

      if (state.currentScene.typesScene !== TypeSceneEnum.Puzzle) {
        return
      }
      this.scene = state.currentScene as PuzzleRunGame
      this.setImageInScene(state)
    })
  }

  private setImageInScene(state: StateGame) {

    if (state.imgInPlace1) {

      this.scenePartsPuzzleImages[0].length = 0

      state.imgInPlace1.forEach((img) => {
        this.scenePartsPuzzleImages[0].push(img)
      })
    }
    if (state.imgInPlace2) {

      this.scenePartsPuzzleImages[1].length = 0

      state.imgInPlace2.forEach((img) => {
        this.scenePartsPuzzleImages[1].push(img)
      })
    }
    if (state.imgInPlace3) {

      this.scenePartsPuzzleImages[2].length = 0

      state.imgInPlace3.forEach((img) => {
        this.scenePartsPuzzleImages[2].push(img)
      })
    }
    if (state.imgInPlace4) {

      this.scenePartsPuzzleImages[3].length = 0

      state.imgInPlace4.forEach((img) => {
        this.scenePartsPuzzleImages[3].push(img)
      })
    }
    if (state.imgInPlace5) {

      this.scenePartsPuzzleImages[4].length = 0

      state.imgInPlace5.forEach((img) => {
        this.scenePartsPuzzleImages[4].push(img)
      })
    }
    if (state.imgInPlace6) {

      this.scenePartsPuzzleImages[5].length = 0

      state.imgInPlace6.forEach((img) => {
        this.scenePartsPuzzleImages[5].push(img)
      })
    }
    if (state.imgInPlace7) {

      this.scenePartsPuzzleImages[6].length = 0

      state.imgInPlace7.forEach((img) => {
        this.scenePartsPuzzleImages[6].push(img)
      })
    }
    if (state.imgInPlace8) {

      this.scenePartsPuzzleImages[7].length = 0

      state.imgInPlace8.forEach((img) => {
        this.scenePartsPuzzleImages[7].push(img)
      })
    }
    if (state.imgInPlace9) {

      this.scenePartsPuzzleImages[8].length = 0

      state.imgInPlace9.forEach((img) => {
        this.scenePartsPuzzleImages[8].push(img)
      })
    }
  }

  ngOnDestroy(): void {
    this.unsubscribe()
  }

}
