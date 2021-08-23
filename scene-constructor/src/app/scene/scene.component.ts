import {Component, ElementRef, Input, OnInit, Output, ViewChild} from '@angular/core';
import { Scene } from '../models/scene-model'

@Component({
  selector: 'app-scene',
  templateUrl: './scene.component.html',
  styleUrls: ['./scene.component.scss']
})
export class SceneComponent implements OnInit {

  @ViewChild("Scene", {static: false})
  nameParagraph: ElementRef|undefined;

  @Input()
  scene: Scene

  positionX: number = 10
  positionY: number = 10

  positionStartX: number = 0
  positionStartY: number = 0

  positionEndX: number = 0
  positionEndY: number = 0

  constructor() { }

  ngOnInit() {
  }

  onDragStart(event) {

    this.positionStartX = event.offsetX
    this.positionStartY = event.offsetY

    console.log('onDragStart:', event);
    //console.log('left:', event.left);

    //return false;
  }

  onDrag(event) {
    this.moveTo(event)
  }

  onDragend(event) {
    this.moveTo(event)
    return false;
  }

  moveTo(event) {
    this.positionEndX = event.offsetX
    this.positionEndY = event.offsetY

    const x = this.positionEndX - this.positionStartX
    const y = this.positionEndY - this.positionStartY

    //console.log(x);
    //console.log(y);

    this.positionStartX = 0
    this.positionStartY = 0

    this.positionEndX = 0
    this.positionEndY = 0

    this.positionX += x
    this.positionY += y
  }

  onmousedown(event) {
    console.log(event);
  }

}
