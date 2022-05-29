import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { StoreRunGameService } from "../../run-game/services/store-run-game.service";
import { Player } from "../../core/models/player.model";
import { BaseComponent } from "../../base-component/base-component.component";
import { takeUntil } from "rxjs/operators";
import { TypeSceneEnum } from "../../core/models/type-scene.enum";
import { PuzzleRunGame } from "../../run-game/models/other-models/scenes.models";
import { ItemPartsPuzzleImage } from "../../core/models/item-parts-puzzle-image.model";

@Component({
  selector: 'app-puzzle-controls',
  templateUrl: './puzzle-controls.component.html',
  styleUrls: ['./puzzle-controls.component.scss']
})
export class PuzzleControlsComponent extends BaseComponent implements OnInit, OnDestroy {

  @Input()
  player: Player

  isShowControls: boolean = false

  // Изображения для выбора (куда выбрано)
  scenePartsPuzzleImages: {
    itemPartsPuzzleImage: ItemPartsPuzzleImage,
    draggable: boolean
  }[]

  // Изображения доступные для выбора
  scenePartsPuzzleImagesForPlayer: ItemPartsPuzzleImage[] = []

  private scene: PuzzleRunGame

  // Выбранный кусок пазла
  private selectItemPartsPuzzleImage: ItemPartsPuzzleImage

  constructor(private storeRunGameService: StoreRunGameService) {
    super()
    this.clearScenePartsPuzzleImages()
  }

  private findImageConstItem() {
    const findImages = this.scene.scenePartsPuzzleImages.filter(x => x.value)

    findImages.forEach(item => {

      const findItem = this.scenePartsPuzzleImages.find(x => x.itemPartsPuzzleImage.number === item.number)

      if (findItem) {
        findItem.draggable = false
        findItem.itemPartsPuzzleImage.value = item.value
      }

    })
  }

  ngOnInit(): void {
    this.storeRunGameService.currentScene$
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe(currentScene => {
        this.isShowControls = currentScene.players.includes(this.player.id)

        if (currentScene.typesScene !== TypeSceneEnum.Puzzle) {
          return
        }

        this.clearScenePartsPuzzleImages()

        this.scene = currentScene as PuzzleRunGame

        this.findImageConstItem()

        const scenePartsPuzzleImages: { playerId: string, scenePartsPuzzleImages: ItemPartsPuzzleImage[] } =
          this.scene.playerScenePartsPuzzleImages.find(i => i.playerId === this.player.id)

        if (scenePartsPuzzleImages) {
          this.scenePartsPuzzleImagesForPlayer = scenePartsPuzzleImages.scenePartsPuzzleImages
            .filter(img => img.value)
        }
      })

    this.storeRunGameService.stateGame$
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe(state => {

        if (!state) {
          return
        }

        if (!state.scenePartsPuzzleImages) {
          return
        }

        this.scenePartsPuzzleImages.forEach(value => {
          const find = state.scenePartsPuzzleImages
            .find(x => x.number === value.itemPartsPuzzleImage.number)

          if (!find.value) {
            return
          }

          if (!value.itemPartsPuzzleImage.value) {
            return
          }

          if (find.value.id !== value.itemPartsPuzzleImage.value.id) {
            this.scenePartsPuzzleImagesForPlayer.push({ ...value.itemPartsPuzzleImage })
            value.itemPartsPuzzleImage.value = null
          }
        })
      })
  }

  private clearScenePartsPuzzleImages() {
    this.scenePartsPuzzleImages = [
      { itemPartsPuzzleImage: { number: 1, value: null }, draggable: true },
      { itemPartsPuzzleImage: { number: 2, value: null }, draggable: true },
      { itemPartsPuzzleImage: { number: 3, value: null }, draggable: true },
      { itemPartsPuzzleImage: { number: 4, value: null }, draggable: true },
      { itemPartsPuzzleImage: { number: 5, value: null }, draggable: true },
      { itemPartsPuzzleImage: { number: 6, value: null }, draggable: true },
      { itemPartsPuzzleImage: { number: 7, value: null }, draggable: true },
      { itemPartsPuzzleImage: { number: 8, value: null }, draggable: true },
      { itemPartsPuzzleImage: { number: 9, value: null }, draggable: true },
    ]
  }

  async dropClear(event, value: ItemPartsPuzzleImage) {

    if (!value) {
      return
    }

    if (value.value) {
      return
    }

    value.value = this.selectItemPartsPuzzleImage.value

    const itemPartsPuzzleImage: ItemPartsPuzzleImage = {
      number: this.selectItemPartsPuzzleImage.number,
      value: null
    } as ItemPartsPuzzleImage

    await this.storeRunGameService.selectPuzzleImage(itemPartsPuzzleImage)

    this.selectItemPartsPuzzleImage.value = null
  }

  async drop(event, value: ItemPartsPuzzleImage) {

    if (!value) {
      return
    }

    if (value.value) {
      return
    }

    value.value = this.selectItemPartsPuzzleImage.value

    await this.storeRunGameService.selectPuzzleImage(value)

    this.selectItemPartsPuzzleImage.value = null
  }

  // Вызывается при старте перетаскивания
  dragStar(event, value: ItemPartsPuzzleImage) {

    this.selectItemPartsPuzzleImage = value
  }

  dragOver(event, value: ItemPartsPuzzleImage) {
    event.preventDefault()
  }

  ngOnDestroy(): void {
    this.unsubscribe()
  }

}
