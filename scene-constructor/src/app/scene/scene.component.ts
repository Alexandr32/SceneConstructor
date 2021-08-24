import {Component, ElementRef, Input, OnInit, Output, ViewChild, EventEmitter, ViewChildren, QueryList, AfterViewInit} from '@angular/core';
import {Coordinate, Scene} from '../models/scene-model';
import {Observable, Subject} from 'rxjs';
import {CdkDragDrop} from '@angular/cdk/drag-drop/drag-events';

@Component({
  selector: 'app-scene',
  templateUrl: './scene.component.html',
  styleUrls: ['./scene.component.scss']
})
export class SceneComponent implements OnInit, AfterViewInit {

  @Input()
  scene: Scene

  @Output()
  selectVariantScene = new EventEmitter<Scene>()

  dragPosition = {x: 0, y: 0};

  @Output()
  changeDrag = new EventEmitter()

  @ViewChildren("answer")
  answers: QueryList<ElementRef>;

  constructor(public elementRef:ElementRef) {

  }

  ngOnInit() {
    this.dragPosition = {x: this.scene.coordinate.x, y: this.scene.coordinate.y};
  }

  ngAfterViewInit(): void {
    this.answers.forEach((element: ElementRef) => {

      const answer = this.scene.answers.find(item => item.text ==  element.nativeElement.innerText)
      const coordinate = new Coordinate()
      coordinate.x = element.nativeElement.offsetLeft
      coordinate.y = element.nativeElement.offsetTop

      answer.coordinate = coordinate

      console.log(element.nativeElement.offsetLeft, element.nativeElement.offsetTop, element)

      /*item.nativeElement.getBoundingClientRect();
      console.log('item', item.nativeElement.offsetLeft);
      console.log('item', item.nativeElement.offsetParent);*/
    });

    console.log('SceneComponent: ngAfterViewInit');
  }

  onCdkDragDropped(event) {
    console.log(event)

    const element = event.source.getRootElement();
    /*const boundingClientRect = element.getBoundingClientRect();
    const parentPosition = this.getPosition(element);

    console.log('left', boundingClientRect.x);
    console.log('top', boundingClientRect.y);

    const x = boundingClientRect.x - parentPosition.left
    const y = boundingClientRect.y - parentPosition.top*/

    const {x, y} = this.getCoordinate(element)

    this.scene.coordinate.x = x
    this.scene.coordinate.y = y

    this.changeDrag.next()
  }



  onClick(event) {

  }

  getCoordinate(element) {
    const boundingClientRect = element.getBoundingClientRect();
    const parentPosition = this.getPosition(element);

    //console.log('left', boundingClientRect.x);
    //console.log('top', boundingClientRect.y);
    console.log('x: ' + (boundingClientRect.x - parentPosition.left), 'y: ' +
      (boundingClientRect.y - parentPosition.top));

    const x = boundingClientRect.x - parentPosition.left
    const y = boundingClientRect.y - parentPosition.top

    return {
      x, y
    }
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
