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
    this.answers.forEach((element: ElementRef, index) => {

      const answer = this.scene.answers[index]

      const coordinate = new Coordinate()
      coordinate.x = element.nativeElement.offsetLeft
      coordinate.y = element.nativeElement.offsetTop

      const startCoordinate = new Coordinate()
      startCoordinate.x = element.nativeElement.offsetLeft
      startCoordinate.y = element.nativeElement.offsetTop

      answer.startCoordinate = startCoordinate
      answer.coordinate = coordinate

      console.log(element.nativeElement.offsetLeft, element.nativeElement.offsetTop, element)
    });

    console.log('SceneComponent: ngAfterViewInit');
  }

  onClick(event) {

  }

  onCdkDragDropped(event) {
    console.log('event', event)

    const element = event.source.getRootElement();

    const {x, y} = this.getCoordinate(element)

    console.log(x, y);

    this.scene.coordinate.x = x
    this.scene.coordinate.y = y

    // Изменяем координаты у дочерних эл-ов
    this.answers.forEach((item, index) => {

      const answer = this.scene.answers[index]
      console.log('startCoordinate', answer.startCoordinate);
      answer.coordinate.x = answer.startCoordinate.x + x
      answer.coordinate.y = answer.startCoordinate.y + y
    })

    this.changeDrag.next()
  }

  private getCoordinate(element) {
    const boundingClientRect = element.getBoundingClientRect();
    const parentPosition = this.getPosition(element);

    const x = boundingClientRect.x - parentPosition.left
    const y = boundingClientRect.y - parentPosition.top + window.scrollY

    return {
      x, y
    }
  }

  private getPosition(el) {
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
