import {Component, EventEmitter, Input, OnDestroy, OnInit, Output} from '@angular/core';
import {StoreRunGameService} from "../../run-game/services/store-run-game.service";
import {Player} from "../../core/models/player.model";
import {BaseComponent} from "../../base-component/base-component.component";
import {takeUntil} from "rxjs/operators";
import {TypeSceneEnum} from "../../core/models/type-scene.enum";
import {
  PuzzleRunGame,
  SceneForPuzzleControlPlayerRunGame
} from "../../run-game/models/other-models/puzzle-run-game.models";
import {CdkDragDrop} from "@angular/cdk/drag-drop/drag-events";
import {PartsPuzzleImage} from "../../core/models/parts-puzzle-image.model";

@Component({
  selector: 'app-puzzle-controls',
  templateUrl: './puzzle-controls.component.html',
  styleUrls: ['./puzzle-controls.component.scss']
})
export class PuzzleControlsComponent extends BaseComponent implements OnInit, OnDestroy {

  @Input()
  player: Player

  @Output()
  sceneForPuzzleControlPlayerRunGame: EventEmitter<{
    sceneForPuzzleControlPlayerRunGame: SceneForPuzzleControlPlayerRunGame, // Сцена игрока
    event: 'del' | 'add' // Добавить или удалить элемент со сцены,
    numberPosition: number // Номер позиции с 1-9,
    image: PartsPuzzleImage
  }> = new EventEmitter<{
    sceneForPuzzleControlPlayerRunGame: SceneForPuzzleControlPlayerRunGame, // Сцена игрока
    event: 'del' | 'add' // Добавить или удалить элемент со сцены,
    numberPosition: number // Номер позиции с 1-9,
    image: PartsPuzzleImage
  }>()

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

  stateScenePlayer: SceneForPuzzleControlPlayerRunGame

  currentScene: PuzzleRunGame | undefined


  constructor(private storeRunGameService: StoreRunGameService) {
    super()
  }

  ngOnInit(): void {
    this.storeRunGameService.stateGame$
      .pipe(
        takeUntil(this.ngUnsubscribe)
      )
      .subscribe((state) => {

        this.isShowControls = state.currentScene.players.includes(this.player.id)

        if (state.currentScene.typesScene !== TypeSceneEnum.Puzzle) {
          return
        }

        if(state.currentScene.id === this.currentScene?.id) {
          return;
        }

        this.currentScene = state.currentScene as PuzzleRunGame

        this.stateScenePlayer = state.dataForPlayerPartsImages
          .find(i => i.playerId === this.player.id)

        if(!this.stateScenePlayer) {
          return;
        }

        this.stateScenePlayer.imgInPlace1.forEach((img) => {
          this.imgPlace1.push({
            value: img,
            drag: !this.stateScenePlayer.isStopDraggableImgPlace1
          })
        })
        this.stateScenePlayer.imgInPlace2.forEach((img) => {
          this.imgPlace2.push({
            value: img,
            drag: !this.stateScenePlayer.isStopDraggableImgPlace2
          })
        })
        this.stateScenePlayer.imgInPlace3.forEach((img) => {
          this.imgPlace3.push({
            value: img,
            drag: !this.stateScenePlayer.isStopDraggableImgPlace3
          })
        })
        this.stateScenePlayer.imgInPlace4.forEach((img) => {
          this.imgPlace4.push({
            value: img,
            drag: !this.stateScenePlayer.isStopDraggableImgPlace4
          })
        })
        this.stateScenePlayer.imgInPlace5.forEach((img) => {
          this.imgPlace5.push({
            value: img,
            drag: !this.stateScenePlayer.isStopDraggableImgPlace5
          })
        })
        this.stateScenePlayer.imgInPlace6.forEach((img) => {
          this.imgPlace6.push({
            value: img,
            drag: !this.stateScenePlayer.isStopDraggableImgPlace6
          })
        })
        this.stateScenePlayer.imgInPlace7.forEach((img) => {
          this.imgPlace7.push({
            value: img,
            drag: !this.stateScenePlayer.isStopDraggableImgPlace7
          })
        })
        this.stateScenePlayer.imgInPlace8.forEach((img) => {
          this.imgPlace8.push({
            value: img,
            drag: !this.stateScenePlayer.isStopDraggableImgPlace8
          })
        })
        this.stateScenePlayer.imgInPlace9.forEach((img) => {
          this.imgPlace9.push({
            value: img,
            drag: !this.stateScenePlayer.isStopDraggableImgPlace9
          })
        })

        if(this.stateScenePlayer.imgPlace1) {
          this.imgForSelectPlayer1.push({
            value: this.stateScenePlayer.imgPlace1,
            drag: true
          })
        }
        if(this.stateScenePlayer.imgPlace2) {
          this.imgForSelectPlayer2.push({
            value: this.stateScenePlayer.imgPlace2,
            drag: true
          })
        }
        if(this.stateScenePlayer.imgPlace3) {
          this.imgForSelectPlayer3.push({
            value: this.stateScenePlayer.imgPlace3,
            drag: true
          })
        }
        if(this.stateScenePlayer.imgPlace4) {
          this.imgForSelectPlayer4.push({
            value: this.stateScenePlayer.imgPlace4,
            drag: true
          })
        }
        if(this.stateScenePlayer.imgPlace5) {
          this.imgForSelectPlayer5.push({
            value: this.stateScenePlayer.imgPlace5,
            drag: true
          })
        }
        if(this.stateScenePlayer.imgPlace6) {
          this.imgForSelectPlayer6.push({
            value: this.stateScenePlayer.imgPlace6,
            drag: true
          })
        }
        if(this.stateScenePlayer.imgPlace7) {
          this.imgForSelectPlayer7.push({
            value: this.stateScenePlayer.imgPlace7,
            drag: true
          })
        }
        if(this.stateScenePlayer.imgPlace8) {
          this.imgForSelectPlayer8.push({
            value: this.stateScenePlayer.imgPlace8,
            drag: true
          })
        }
        if(this.stateScenePlayer.imgPlace9) {
          this.imgForSelectPlayer9.push({
            value: this.stateScenePlayer.imgPlace9,
            drag: true
          })
        }


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
                            currentPlaceElement: { value: PartsPuzzleImage, drag: boolean }[],
                            number: number) {

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
    this.saveStatePlayer('add', number, currentDragElement.value)
  }

  /**
   * Перемещаем на блок с изображениям для выбора
   * @param event
   * @param currentPlaceElement элемент на который двигают
   * @param number номер в массиве на который двигают
   */
  dropItemsTemplate(event: CdkDragDrop<{ value: PartsPuzzleImage, drag: boolean }[]>,
                    currentPlaceElement: { value: PartsPuzzleImage, drag: boolean }[],
                    number: number) {

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
    this.saveStatePlayer('del', number, currentDragElement.value)
  }

  saveStatePlayer(event: 'del' | 'add', numberPosition: number, image: PartsPuzzleImage) {

    // Кастуем то что на сцене в то что должно уйти в базу

    this.stateScenePlayer.imgInPlace1 = this.imgPlace1.map(i => i.value)
    this.stateScenePlayer.imgInPlace2 = this.imgPlace2.map(i => i.value)
    this.stateScenePlayer.imgInPlace3 = this.imgPlace3.map(i => i.value)
    this.stateScenePlayer.imgInPlace4 = this.imgPlace4.map(i => i.value)
    this.stateScenePlayer.imgInPlace5 = this.imgPlace5.map(i => i.value)
    this.stateScenePlayer.imgInPlace6 = this.imgPlace6.map(i => i.value)
    this.stateScenePlayer.imgInPlace7 = this.imgPlace7.map(i => i.value)
    this.stateScenePlayer.imgInPlace8 = this.imgPlace8.map(i => i.value)
    this.stateScenePlayer.imgInPlace9 = this.imgPlace9.map(i => i.value)

    this.stateScenePlayer.imgPlace1 = this.imgForSelectPlayer1.length > 0 ? this.imgForSelectPlayer1.map(i => i.value)[0] : null
    this.stateScenePlayer.imgPlace2 = this.imgForSelectPlayer2.length > 0 ? this.imgForSelectPlayer2.map(i => i.value)[0] : null
    this.stateScenePlayer.imgPlace3 = this.imgForSelectPlayer3.length > 0 ? this.imgForSelectPlayer3.map(i => i.value)[0] : null
    this.stateScenePlayer.imgPlace4 = this.imgForSelectPlayer4.length > 0 ? this.imgForSelectPlayer4.map(i => i.value)[0] : null
    this.stateScenePlayer.imgPlace5 = this.imgForSelectPlayer5.length > 0 ? this.imgForSelectPlayer5.map(i => i.value)[0] : null
    this.stateScenePlayer.imgPlace6 = this.imgForSelectPlayer6.length > 0 ? this.imgForSelectPlayer6.map(i => i.value)[0] : null
    this.stateScenePlayer.imgPlace7 = this.imgForSelectPlayer7.length > 0 ? this.imgForSelectPlayer7.map(i => i.value)[0] : null
    this.stateScenePlayer.imgPlace8 = this.imgForSelectPlayer8.length > 0 ? this.imgForSelectPlayer8.map(i => i.value)[0] : null
    this.stateScenePlayer.imgPlace9 = this.imgForSelectPlayer9.length > 0 ? this.imgForSelectPlayer9.map(i => i.value)[0] : null


    const value = {
        sceneForPuzzleControlPlayerRunGame: this.stateScenePlayer, // Сцена игрока
        event: event, // Добавить или удалить элемент со сцены,
        numberPosition: numberPosition, // Номер позиции с 1-9,
        image: image
    }

    this.sceneForPuzzleControlPlayerRunGame.emit(value)
  }
}
