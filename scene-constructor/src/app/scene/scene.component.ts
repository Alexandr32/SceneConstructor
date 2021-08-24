import {Component, ElementRef, Input, OnInit, Output, ViewChild, EventEmitter} from '@angular/core';
import {Coordinate, Scene} from '../models/scene-model';
import {Observable, Subject} from 'rxjs';
import {CdkDragDrop} from '@angular/cdk/drag-drop/drag-events';

@Component({
  selector: 'app-scene',
  templateUrl: './scene.component.html',
  styleUrls: ['./scene.component.scss']
})
export class SceneComponent implements OnInit {

  @Input()
  scene: Scene

  @Output()
  selectVariantScene = new EventEmitter<Scene>()

  dragPosition = {x: 0, y: 0};

  @ViewChild("SceneElement", {static: false})
  sceneElement: ElementRef|undefined;

  constructor(public elementRef:ElementRef) {

  }

  ngOnInit() {

    this.dragPosition = {x: this.scene.coordinate.x, y: this.scene.coordinate.y};
  }

  onCdkDragDropped(event) {
    console.log(event)
    const element = event.source.getRootElement();
    const boundingClientRect = element.getBoundingClientRect();
    const parentPosition = this.getPosition(element);
    const x = boundingClientRect.x - parentPosition.left
    const y = boundingClientRect.y - parentPosition.top

    this.scene.coordinate.x = x
    this.scene.coordinate.y = y

    console.log('x: ' + (boundingClientRect.x - parentPosition.left), 'y: ' +
      (boundingClientRect.y - parentPosition.top));
  }

  onClick(event) {

  }

  getPosition(el) {
    let x = 0;
    let y = 0;
    while(el && !isNaN(el.offsetLeft) && !isNaN(el.offsetTop)) {
      x += el.offsetLeft - el.scrollLeft;
      y += el.offsetTop - el.scrollTop;
      el = el.offsetParent;
    }
    return { top: y, left: x };
  }

  selectVariant() {
    this.selectVariantScene.next(this.scene)
  }

}
