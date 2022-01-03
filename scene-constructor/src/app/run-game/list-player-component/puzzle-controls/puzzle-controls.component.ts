import {Component, Input, OnDestroy, OnInit} from '@angular/core';
import {StoreRunGameService} from "../../services/store-run-game.service";
import {Player} from "../../../core/models/player.model";
import {BaseComponent} from "../../../base-component/base-component.component";
import {takeUntil} from "rxjs/operators";
import {TypeSceneEnum} from "../../../core/models/type-scene.enum";
import {PuzzleRunGame} from "../../models/other-models/scenes.models";
import {ItemPartsPuzzleImage} from "../../../core/models/item-parts-puzzle-image.model";

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
  scenePartsPuzzleImages: ItemPartsPuzzleImage[] = [
    {number: 1, value: null},
    {number: 2, value: null},
    {number: 3, value: null},
    {number: 4, value: null},
    {number: 5, value: null},
    {number: 6, value: null},
    {number: 7, value: null},
    {number: 8, value: null},
    {number: 9, value: null},
  ]

  // Изображения доступные для выбора
  scenePartsPuzzleImagesForPlayer: ItemPartsPuzzleImage[] = []

  // Выбранный кусок пазла
  private selectItemPartsPuzzleImage: ItemPartsPuzzleImage

  constructor(private storeRunGameService: StoreRunGameService) {
    super()
  }

  ngOnInit(): void {
    this.storeRunGameService.currentScene$
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe(currentScene => {
        this.isShowControls = currentScene.players.includes(this.player.id)

        if (currentScene.typesScene !== TypeSceneEnum.Puzzle) {
          return
        }

        const scene = currentScene as PuzzleRunGame

        const scenePartsPuzzleImages: { playerId: string, scenePartsPuzzleImages: ItemPartsPuzzleImage[] } =
          scene.playerScenePartsPuzzleImages.find(i => i.playerId === this.player.id)

        if (scenePartsPuzzleImages) {
          this.scenePartsPuzzleImagesForPlayer = scenePartsPuzzleImages.scenePartsPuzzleImages
            .filter(img => img.value)
        }
      })
  }

  drop(event, value: ItemPartsPuzzleImage) {

    console.log('drop:', value)

    if(!value) {
      return
    }

    if (value.value) {
      return
    }

    value.value = this.selectItemPartsPuzzleImage.value
    this.selectItemPartsPuzzleImage.value = null

  }

  // Вызывается при старте перетаскивания
  dragStar(event, value: ItemPartsPuzzleImage) {

    console.log('dragStar:', value)

    this.selectItemPartsPuzzleImage = value
  }

  dragOver(event, value: ItemPartsPuzzleImage) {
    event.preventDefault()
  }

  ngOnDestroy(): void {
    super.unsubscribe()
  }

}
