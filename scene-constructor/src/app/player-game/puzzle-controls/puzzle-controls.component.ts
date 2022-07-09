import {Component, Input, OnDestroy, OnInit} from '@angular/core';
import {StoreRunGameService} from "../../run-game/services/store-run-game.service";
import {Player} from "../../core/models/player.model";
import {BaseComponent} from "../../base-component/base-component.component";
import {filter, takeUntil} from "rxjs/operators";
import {TypeSceneEnum} from "../../core/models/type-scene.enum";
import {PuzzleRunGame} from "../../run-game/models/other-models/puzzle-run-game.models";
import {CdkDragDrop} from "@angular/cdk/drag-drop/drag-events";
import {moveItemInArray, transferArrayItem} from "@angular/cdk/drag-drop";
import {PartsPuzzleImage} from "../../core/models/parts-puzzle-image.model";

@Component({
  selector: 'app-puzzle-controls',
  templateUrl: './puzzle-controls.component.html',
  styleUrls: ['./puzzle-controls.component.scss']
})
export class PuzzleControlsComponent extends BaseComponent implements OnInit, OnDestroy {

  @Input()
  player: Player

  isShowControls: boolean = false

  // Изображения на сцене
  imgPlace1: { value: PartsPuzzleImage, drag: boolean }[] = [];
  imgPlace2: { value: PartsPuzzleImage, drag: boolean }[] = [];
  imgPlace3: { value: PartsPuzzleImage, drag: boolean }[] = [];
  imgPlace4: { value: PartsPuzzleImage, drag: boolean }[] = [];
  imgPlace5: { value: PartsPuzzleImage, drag: boolean }[] = [];
  imgPlace6: { value: PartsPuzzleImage, drag: boolean }[] = [];
  imgPlace7: { value: PartsPuzzleImage, drag: boolean }[] = [];
  imgPlace8: { value: PartsPuzzleImage, drag: boolean }[] = [];
  imgPlace9: { value: PartsPuzzleImage, drag: boolean }[] = [];

  places: { value: PartsPuzzleImage, drag: boolean }[][] = [
    this.imgPlace1,
    this.imgPlace2,
    this.imgPlace3,
    this.imgPlace4,
    this.imgPlace5,
    this.imgPlace6,
    this.imgPlace7,
    this.imgPlace8,
    this.imgPlace9,
  ]

  // Доступные изображения для выбора
  imgForSelectPlayer1: { value: PartsPuzzleImage, drag: boolean }[] = [];
  imgForSelectPlayer2: { value: PartsPuzzleImage, drag: boolean }[] = [];
  imgForSelectPlayer3: { value: PartsPuzzleImage, drag: boolean }[] = [];
  imgForSelectPlayer4: { value: PartsPuzzleImage, drag: boolean }[] = [];
  imgForSelectPlayer5: { value: PartsPuzzleImage, drag: boolean }[] = [];
  imgForSelectPlayer6: { value: PartsPuzzleImage, drag: boolean }[] = [];
  imgForSelectPlayer7: { value: PartsPuzzleImage, drag: boolean }[] = [];
  imgForSelectPlayer8: { value: PartsPuzzleImage, drag: boolean }[] = [];
  imgForSelectPlayer9: { value: PartsPuzzleImage, drag: boolean }[] = [];

  scenePartsPuzzleImagesForPlayer: { value: PartsPuzzleImage, drag: boolean }[][] = [
    this.imgForSelectPlayer1,
    this.imgForSelectPlayer2,
    this.imgForSelectPlayer3,
    this.imgForSelectPlayer4,
    this.imgForSelectPlayer5,
    this.imgForSelectPlayer6,
    this.imgForSelectPlayer7,
    this.imgForSelectPlayer8,
    this.imgForSelectPlayer9,
  ]

  constructor(private storeRunGameService: StoreRunGameService) {
    super()
  }

  ngOnInit(): void {
    this.storeRunGameService.currentScene$
      .pipe(
        takeUntil(this.ngUnsubscribe)
      )
      .subscribe((currentScene) => {

        console.log(1)

        this.isShowControls = currentScene.players.includes(this.player.id)

        if (currentScene.typesScene !== TypeSceneEnum.Puzzle) {
          return
        }

        const scene = currentScene as PuzzleRunGame

        console.log(scene)

        const scenePartsPuzzleImagesForPlayer = scene.dataForPlayerPartsImages
          .find(i => i.playerId === this.player.id)

        if(!scenePartsPuzzleImagesForPlayer) {
          return;
        }

        scenePartsPuzzleImagesForPlayer.imgInPlace1.forEach((img) => {
          this.imgPlace1.push({
            value: img,
            drag: !scenePartsPuzzleImagesForPlayer.isStopDraggableImgPlace1
          })
        })
        scenePartsPuzzleImagesForPlayer.imgInPlace2.forEach((img) => {
          this.imgPlace2.push({
            value: img,
            drag: !scenePartsPuzzleImagesForPlayer.isStopDraggableImgPlace2
          })
        })
        scenePartsPuzzleImagesForPlayer.imgInPlace3.forEach((img) => {
          this.imgPlace3.push({
            value: img,
            drag: !scenePartsPuzzleImagesForPlayer.isStopDraggableImgPlace3
          })
        })
        scenePartsPuzzleImagesForPlayer.imgInPlace4.forEach((img) => {
          this.imgPlace4.push({
            value: img,
            drag: !scenePartsPuzzleImagesForPlayer.isStopDraggableImgPlace4
          })
        })
        scenePartsPuzzleImagesForPlayer.imgInPlace5.forEach((img) => {
          this.imgPlace5.push({
            value: img,
            drag: !scenePartsPuzzleImagesForPlayer.isStopDraggableImgPlace5
          })
        })
        scenePartsPuzzleImagesForPlayer.imgInPlace6.forEach((img) => {
          this.imgPlace6.push({
            value: img,
            drag: !scenePartsPuzzleImagesForPlayer.isStopDraggableImgPlace6
          })
        })
        scenePartsPuzzleImagesForPlayer.imgInPlace7.forEach((img) => {
          this.imgPlace7.push({
            value: img,
            drag: !scenePartsPuzzleImagesForPlayer.isStopDraggableImgPlace7
          })
        })
        scenePartsPuzzleImagesForPlayer.imgInPlace8.forEach((img) => {
          this.imgPlace8.push({
            value: img,
            drag: !scenePartsPuzzleImagesForPlayer.isStopDraggableImgPlace8
          })
        })
        scenePartsPuzzleImagesForPlayer.imgInPlace9.forEach((img) => {
          this.imgPlace9.push({
            value: img,
            drag: !scenePartsPuzzleImagesForPlayer.isStopDraggableImgPlace9
          })
        })

        if(scenePartsPuzzleImagesForPlayer.imgPlace1) {
          this.imgForSelectPlayer1.push({
            value: scenePartsPuzzleImagesForPlayer.imgPlace1,
            drag: true
          })
        }
        if(scenePartsPuzzleImagesForPlayer.imgPlace2) {
          this.imgForSelectPlayer2.push({
            value: scenePartsPuzzleImagesForPlayer.imgPlace2,
            drag: true
          })
        }
        if(scenePartsPuzzleImagesForPlayer.imgPlace3) {
          this.imgForSelectPlayer3.push({
            value: scenePartsPuzzleImagesForPlayer.imgPlace3,
            drag: true
          })
        }
        if(scenePartsPuzzleImagesForPlayer.imgPlace4) {
          this.imgForSelectPlayer4.push({
            value: scenePartsPuzzleImagesForPlayer.imgPlace4,
            drag: true
          })
        }
        if(scenePartsPuzzleImagesForPlayer.imgPlace5) {
          this.imgForSelectPlayer5.push({
            value: scenePartsPuzzleImagesForPlayer.imgPlace5,
            drag: true
          })
        }
        if(scenePartsPuzzleImagesForPlayer.imgPlace6) {
          this.imgForSelectPlayer6.push({
            value: scenePartsPuzzleImagesForPlayer.imgPlace6,
            drag: true
          })
        }
        if(scenePartsPuzzleImagesForPlayer.imgPlace7) {
          this.imgForSelectPlayer7.push({
            value: scenePartsPuzzleImagesForPlayer.imgPlace7,
            drag: true
          })
        }
        if(scenePartsPuzzleImagesForPlayer.imgPlace8) {
          this.imgForSelectPlayer8.push({
            value: scenePartsPuzzleImagesForPlayer.imgPlace8,
            drag: true
          })
        }
        if(scenePartsPuzzleImagesForPlayer.imgPlace9) {
          this.imgForSelectPlayer9.push({
            value: scenePartsPuzzleImagesForPlayer.imgPlace9,
            drag: true
          })
        }


      })

    this.storeRunGameService.stateGame$
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe((state) => {

        if (!state) {
          return
        }

        if (!state.scenePartsPuzzleImages) {
          return
        }

        console.log(state.scenePartsPuzzleImages)
      })
  }

  ngOnDestroy(): void {
    this.unsubscribe()
  }

  /**
   * Перемещаем на блок с пазлом при наведении с доступных на выложеные
   * @param event
   * @param currentPlaceElement элемент на который двигают
   * @param number номер в массиве на который двигают
   */
  async dropItemInContainer(event: CdkDragDrop<{ value: PartsPuzzleImage, drag: boolean }[]>,
                            currentPlaceElement: { value: PartsPuzzleImage, drag: boolean }[]) {

    if(currentPlaceElement.length > 0) {
      return
    }

    // Что двигаем
    const currentDragElement: { value: PartsPuzzleImage, drag: boolean } = event.item.dropContainer.data[0]

    if(currentDragElement.drag === false) {
      return
    }

    // Удаляем элемент с места с которого он перенесен
    this.scenePartsPuzzleImagesForPlayer.forEach((img) => {
     const findItem = img.find(i => i?.value?.id === currentDragElement.value.id)
      if(findItem) {
        img.length = 0
      }
    })

    // Удаляем элемент с вывеженых на сцену (если перенос идет внутри сцены)
    this.places.forEach((img) => {
      const findItem = img.find(i => i?.value?.id === currentDragElement.value.id)
      if(findItem) {
        img.length = 0
      }
    })

    currentPlaceElement.push(currentDragElement)

    // TODO: Вот сюда добавляем сохраниение в БД
    //  здесь учитывать сохранение флага о пермещении

    //this.storeRunGameService.
  }

  /**
   * Перемещаем на блок с изображениям для выбора
   * @param event
   * @param currentPlaceElement элемент на который двигают
   * @param number номер в массиве на который двигают
   */
  dropItemsTemplate(event: CdkDragDrop<{ value: PartsPuzzleImage, drag: boolean }[]>,
                    currentPlaceElement: { value: PartsPuzzleImage, drag: boolean }[]) {

    if(currentPlaceElement.length > 0) {
      return
    }

    // Что двигаем
    const currentDragElement: { value: PartsPuzzleImage, drag: boolean } = event.item.dropContainer.data[0]

    if(currentDragElement.drag === false) {
      return
    }

    // Удаляем элемент с места с которого он перенесен
    this.scenePartsPuzzleImagesForPlayer.forEach((img) => {
      const findItem = img.find(i => i?.value?.id === currentDragElement.value.id)
      if(findItem) {
        img.length = 0
      }
    })

    // Удаляем элемент с вывеженых на сцену (если перенос идет внутри сцены)
    this.places.forEach((img) => {
      const findItem = img.find(i => i?.value?.id === currentDragElement.value.id)
      if(findItem) {
        img.length = 0
      }
    })

    currentPlaceElement.push(currentDragElement)

    // TODO: Вот сюда добавляем сохраниение в БД
    //  здесь учитывать сохранение флага о пермещении
  }
}
