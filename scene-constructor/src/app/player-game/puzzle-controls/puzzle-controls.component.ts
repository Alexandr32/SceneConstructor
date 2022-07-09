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
  imgForSelectPlayer1: PartsPuzzleImage[] = [];
  imgForSelectPlayer2: PartsPuzzleImage[] = [];
  imgForSelectPlayer3: PartsPuzzleImage[] = [];
  imgForSelectPlayer4: PartsPuzzleImage[] = [];
  imgForSelectPlayer5: PartsPuzzleImage[] = [];
  imgForSelectPlayer6: PartsPuzzleImage[] = [];
  imgForSelectPlayer7: PartsPuzzleImage[] = [];
  imgForSelectPlayer8: PartsPuzzleImage[] = [];
  imgForSelectPlayer9: PartsPuzzleImage[] = [];

  scenePartsPuzzleImagesForPlayer: PartsPuzzleImage[][] = [
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

        this.imgForSelectPlayer1.push(scenePartsPuzzleImagesForPlayer.imgPlace1)
        this.imgForSelectPlayer2.push(scenePartsPuzzleImagesForPlayer.imgPlace2)
        this.imgForSelectPlayer3.push(scenePartsPuzzleImagesForPlayer.imgPlace3)
        this.imgForSelectPlayer4.push(scenePartsPuzzleImagesForPlayer.imgPlace4)
        this.imgForSelectPlayer5.push(scenePartsPuzzleImagesForPlayer.imgPlace5)
        this.imgForSelectPlayer6.push(scenePartsPuzzleImagesForPlayer.imgPlace6)
        this.imgForSelectPlayer7.push(scenePartsPuzzleImagesForPlayer.imgPlace7)
        this.imgForSelectPlayer8.push(scenePartsPuzzleImagesForPlayer.imgPlace8)
        this.imgForSelectPlayer9.push(scenePartsPuzzleImagesForPlayer.imgPlace9)
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

  // Перемещаем на блок с пазлом
  async dropItemInContainer(event: CdkDragDrop<{ value: PartsPuzzleImage, drag: boolean }[]>) {

    //debugger

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
  //dropItemsTemplate(event: CdkDragDrop<{ value: PartsPuzzleImage, drag: boolean }[]>) {
  dropItemsTemplate(event: CdkDragDrop<PartsPuzzleImage[]>) {

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
}
