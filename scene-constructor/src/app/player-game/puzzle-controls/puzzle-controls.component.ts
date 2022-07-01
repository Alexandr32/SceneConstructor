import {Component, Input, OnDestroy, OnInit} from '@angular/core';
import {StoreRunGameService} from "../../run-game/services/store-run-game.service";
import {Player} from "../../core/models/player.model";
import {BaseComponent} from "../../base-component/base-component.component";
import {filter, takeUntil} from "rxjs/operators";
import {TypeSceneEnum} from "../../core/models/type-scene.enum";
import {PuzzleRunGame} from "../../run-game/models/other-models/scenes.models";
import {ItemPartsPuzzleImage} from "../../core/models/item-parts-puzzle-image.model";
import {CdkDragDrop} from "@angular/cdk/drag-drop/drag-events";
import {moveItemInArray, transferArrayItem} from "@angular/cdk/drag-drop";

@Component({
  selector: 'app-puzzle-controls',
  templateUrl: './puzzle-controls.component.html',
  styleUrls: ['./puzzle-controls.component.scss']
})
export class PuzzleControlsComponent extends BaseComponent implements OnInit, OnDestroy {

  @Input()
  player: Player

  isShowControls: boolean = false

  //isFirstStart: boolean = true

  // Изображения для выбора (куда выбрано)
  // scenePartsPuzzleImages: {
  //   itemPartsPuzzleImage: ItemPartsPuzzleImage,
  //   draggable: boolean
  // }[]

  // Изображения доступные для выбора
  scenePartsPuzzleImagesForPlayer: { value: ItemPartsPuzzleImage, drag: boolean }[] = []

  //private scene: PuzzleRunGame

  // Выбранный кусок пазла
  //private selectItemPartsPuzzleImage: ItemPartsPuzzleImage

  imgPlace1: { value: ItemPartsPuzzleImage, drag: boolean }[] = [];
  imgPlace2: { value: ItemPartsPuzzleImage, drag: boolean }[] = [];
  imgPlace3: { value: ItemPartsPuzzleImage, drag: boolean }[] = [];
  imgPlace4: { value: ItemPartsPuzzleImage, drag: boolean }[] = [];
  imgPlace5: { value: ItemPartsPuzzleImage, drag: boolean }[] = [];
  imgPlace6: { value: ItemPartsPuzzleImage, drag: boolean }[] = [];
  imgPlace7: { value: ItemPartsPuzzleImage, drag: boolean }[] = [];
  imgPlace8: { value: ItemPartsPuzzleImage, drag: boolean }[] = [];
  imgPlace9: { value: ItemPartsPuzzleImage, drag: boolean }[] = [];

  places: { value: ItemPartsPuzzleImage, drag: boolean }[][] = [
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

  constructor(private storeRunGameService: StoreRunGameService) {
    super()
    //this.clearScenePartsPuzzleImages()
  }

  /*private findImageConstItem() {
    const findImages = this.scene.scenePartsPuzzleImages.filter(x => x.value)

    findImages.forEach(item => {

      const findItem = this.scenePartsPuzzleImages.find(x => x.itemPartsPuzzleImage.number === item.number)

      if (findItem) {
        //this.places[item.number - 1].push(data)

        findItem.draggable = false
        findItem.itemPartsPuzzleImage.value = item.value
      }

    })
  }*/

  ngOnInit(): void {
    this.storeRunGameService.currentScene$
      .pipe(
        takeUntil(this.ngUnsubscribe)
      )
      .subscribe((currentScene) => {

        //this.isFirstStart = false

        this.isShowControls = currentScene.players.includes(this.player.id)

        if (currentScene.typesScene !== TypeSceneEnum.Puzzle) {
          return
        }

        //this.clearScenePartsPuzzleImages()

        const scene = currentScene as PuzzleRunGame

        console.log(scene)

        //this.findImageConstItem()

        const scenePartsPuzzleImages: { playerId: string, scenePartsPuzzleImages: ItemPartsPuzzleImage[] } =
          scene.playerScenePartsPuzzleImages.find(i => i.playerId === this.player.id)

        if (scenePartsPuzzleImages) {
          this.scenePartsPuzzleImagesForPlayer = scenePartsPuzzleImages.scenePartsPuzzleImages
            .filter(img => img.value)
            .map(item => {
              return {
                value: item,
                drag: true
              } as { value: ItemPartsPuzzleImage, drag: boolean }
            })
        }

        // Формируем доступные элементы при старте
        scene.scenePartsPuzzleImages.forEach(item =>  {
          // добавляем на экран
          this.addItemInPlace(item)
        })
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

        // доступные пункты для выбора
        const scenePartsPuzzleImagesForPlayer = this.scenePartsPuzzleImagesForPlayer.map(item => {
          return item.value.value.src
        })

        // Здесь
        // что показано и если оно принадлежит выводим
        state.scenePartsPuzzleImages.forEach(value => {

          if(value.value && scenePartsPuzzleImagesForPlayer.includes(value.value.src)) {
            // добавляем на экран
            //this.addItemInPlace(value)

            // Убираем из доступных для выбора
            //this.removeItemInPlace(value)
          }

          //this.addItemInPlace(value)
        })

        // this.scenePartsPuzzleImages.forEach(value => {
        //   const find = state.scenePartsPuzzleImages
        //     .find(x => x.number === value.itemPartsPuzzleImage.number)
        //
        //   if (!find.value) {
        //     return
        //   }
        //
        //   if (!value.itemPartsPuzzleImage.value) {
        //     return
        //   }
        //
        //   if (find.value.id !== value.itemPartsPuzzleImage.value.id) {
        //     this.scenePartsPuzzleImagesForPlayer.push({ ...value.itemPartsPuzzleImage })
        //     value.itemPartsPuzzleImage.value = null
        //   }
        // })
      })
  }

  // private clearScenePartsPuzzleImages() {
  //   this.scenePartsPuzzleImages = [
  //     { itemPartsPuzzleImage: { number: 1, value: null }, draggable: true },
  //     { itemPartsPuzzleImage: { number: 2, value: null }, draggable: true },
  //     { itemPartsPuzzleImage: { number: 3, value: null }, draggable: true },
  //     { itemPartsPuzzleImage: { number: 4, value: null }, draggable: true },
  //     { itemPartsPuzzleImage: { number: 5, value: null }, draggable: true },
  //     { itemPartsPuzzleImage: { number: 6, value: null }, draggable: true },
  //     { itemPartsPuzzleImage: { number: 7, value: null }, draggable: true },
  //     { itemPartsPuzzleImage: { number: 8, value: null }, draggable: true },
  //     { itemPartsPuzzleImage: { number: 9, value: null }, draggable: true },
  //   ]
  // }

  // async dropClear(event, value: ItemPartsPuzzleImage) {
  //
  //   if (!value) {
  //     return
  //   }
  //
  //   if (value.value) {
  //     return
  //   }
  //
  //   value.value = this.selectItemPartsPuzzleImage.value
  //
  //   const itemPartsPuzzleImage: ItemPartsPuzzleImage = {
  //     number: this.selectItemPartsPuzzleImage.number,
  //     value: null
  //   } as ItemPartsPuzzleImage
  //
  //   await this.storeRunGameService.selectPuzzleImage(itemPartsPuzzleImage)
  //
  //   this.selectItemPartsPuzzleImage.value = null
  // }

  // async drop(event, value: ItemPartsPuzzleImage) {
  //
  //   if (!value) {
  //     return
  //   }
  //
  //   if (value.value) {
  //     return
  //   }
  //
  //   value.value = this.selectItemPartsPuzzleImage.value
  //
  //   await this.storeRunGameService.selectPuzzleImage(value)
  //
  //   this.selectItemPartsPuzzleImage.value = null
  // }

  // Вызывается при старте перетаскивания
  // dragStar(event, value: ItemPartsPuzzleImage) {
  //
  //   this.selectItemPartsPuzzleImage = value
  // }
  //
  // dragOver(event, value: ItemPartsPuzzleImage) {
  //   event.preventDefault()
  // }

  ngOnDestroy(): void {
    this.unsubscribe()
  }

  // Перемещаем на блок с пазлом
  async dropItemInContainer(event: CdkDragDrop<{ value: ItemPartsPuzzleImage, drag: boolean }[]>) {

    //const data = event.container.data[0]
    //this.done.push(data)
    //img.push(data)

    const number = PuzzleControlsComponent.getId(event.container.id)
    console.log(number)
    console.log(event.item.dropContainer.data[0])
    console.log(event.container.data[0])

    if(event.container.data[0]) {
      return
    }

    //debugger
    const value = event.item.dropContainer.data[number - 1]
    value.number = number

    console.log(event)

    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } else {
      transferArrayItem(
        event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex,
      );
    }

    debugger
    this.storeRunGameService.selectPuzzleImage(value)
  }

  // Доступные пункты
  dropItemsTemplate(event: CdkDragDrop<{ value: ItemPartsPuzzleImage, drag: boolean }[]>) {

    //const data = event.container.data[0]
    //this.done.push(data)
    //img.push(data)

    //console.log(event.item.dropContainer.data[0])
    //console.log(event.container.data[0])

    // if(event.container.data[0]) {
    //   return
    // }

    console.log(event)

    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } else {
      transferArrayItem(
        event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex,
      );
    }
  }

  private static getId(key: string): number {

    const map = new Map<string, number>()
    map.set('cdk-drop-list-1', 1)
    map.set('cdk-drop-list-2', 2)
    map.set('cdk-drop-list-3', 3)
    map.set('cdk-drop-list-4', 4)
    map.set('cdk-drop-list-5', 5)
    map.set('cdk-drop-list-6', 6)
    map.set('cdk-drop-list-7', 7)
    map.set('cdk-drop-list-8', 8)
    map.set('cdk-drop-list-9', 9)

    const value = map.get(key)

    if(!value) {
      throw new Error('Не корректное значение')
    }

    return value
  }

  addItemInPlace(item: ItemPartsPuzzleImage) {
    if (!item.value) {
      return
    }

    switch (item.number) {
      case 1: {
        this.imgPlace1.push({value: item, drag: false})
        break
      }
      case 2: {
        this.imgPlace2.push({value: item, drag: false})
        break
      }
      case 3: {
        this.imgPlace3.push({value: item, drag: false})
        break
      }
      case 4: {
        this.imgPlace4.push({value: item, drag: false})
        break
      }
      case 5: {
        this.imgPlace5.push({value: item, drag: false})
        break
      }
      case 6: {
        this.imgPlace6.push({value: item, drag: false})
        break
      }
      case 7: {
        this.imgPlace7.push({value: item, drag: false})
        break
      }
      case 8: {
        this.imgPlace8.push({value: item, drag: false})
        break
      }
      case 9: {
        this.imgPlace9.push({value: item, drag: false})
        break
      }
    }
  }
  removeItemInPlace(item: ItemPartsPuzzleImage) {

    debugger
    if (!item.value) {
      return
    }
    const index: number = this.scenePartsPuzzleImagesForPlayer.findIndex(value => value.value)
    this.scenePartsPuzzleImagesForPlayer.splice(index, 1)
  }
}
