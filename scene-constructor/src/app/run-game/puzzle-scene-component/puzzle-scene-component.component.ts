import {Component, OnDestroy, OnInit} from '@angular/core';
import {StoreRunGameService} from "../services/store-run-game.service";
import {BaseComponent} from "../../base-component/base-component.component";
import {takeUntil} from "rxjs/operators";
import {ItemPartsPuzzleImage} from "../../core/models/item-parts-puzzle-image.model";
import {TypeSceneEnum} from "../../core/models/type-scene.enum";
import {PuzzleRunGame} from "../models/other-models/scenes.models";

@Component({
  selector: 'app-puzzle-scene-component',
  templateUrl: './puzzle-scene-component.component.html',
  styleUrls: ['./puzzle-scene-component.component.scss']
})
export class PuzzleSceneComponentComponent extends BaseComponent implements OnInit, OnDestroy {

  scenePartsPuzzleImages: ItemPartsPuzzleImage[] = []

  scene: PuzzleRunGame

  findItemScenePartsPuzzleImages: ItemPartsPuzzleImage[] = []

  constructor(private storeRunGameService: StoreRunGameService) {
    super()
  }

  ngOnInit(): void {

    this.storeRunGameService.currentScene$
      .pipe(
        takeUntil(this.ngUnsubscribe)
      ).subscribe(currentScene => {

      if (currentScene.typesScene !== TypeSceneEnum.Puzzle) {
        return
      }

      this.scene = currentScene as PuzzleRunGame
      this.findItemScenePartsPuzzleImages = this.scene.scenePartsPuzzleImages.filter(f => f.value)

    })

    this.storeRunGameService.stateGame$
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe(item => {

        if (!item.scenePartsPuzzleImages) {
          return
        }

        this.scenePartsPuzzleImages = item.scenePartsPuzzleImages

        this.findItemScenePartsPuzzleImages.forEach(item => {
          const findItem: ItemPartsPuzzleImage | undefined = this.scenePartsPuzzleImages.find(x => x.number === item.number)
          if (findItem) {
            findItem.value = item.value
          }

        })

      })
  }

  ngOnDestroy(): void {
    super.unsubscribe()
  }

}
