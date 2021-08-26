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

  @Output()
  editScene = new EventEmitter<Scene>()

  dragPosition = {x: 0, y: 0};

  @Output()
  changeDrag = new EventEmitter()

  @ViewChildren("answer", {read: ElementRef})
  answers: QueryList<ElementRef>;

  constructor(public elementRef:ElementRef) {

  }

  ngOnInit() {
    this.dragPosition = {x: this.scene.coordinate.x, y: this.scene.coordinate.y};
  }

  ngAfterViewInit(): void {

    //this.initAnswersElement(this.answers)

    //this.answers.reset([])

    /*this.answers.changes.subscribe((elements) => {

      this.initAnswersElement(elements)
    })*/

    //console.log('SceneComponent: ngAfterViewInit');
  }

  ngOnChanges() {
    console.log('ngOnChanges');
  }

  private initAnswersElement(elements: QueryList<ElementRef>) {
    elements.forEach((elementRef: ElementRef) => {

      //elementRef.nativeElement.clear

      const id = elementRef.nativeElement.id
      const answer = this.scene.answers.find(item => item.id == id)

      // ------------------

      //const {x, y} = this.getCoordinate(elementRef.nativeElement)

      //console.log('!!!', elementRef.nativeElement.source.getRootElement().offsetTop, elementRef.nativeElement.screenY);

      // ------------------

      const coordinate = new Coordinate()
      coordinate.x = elementRef.nativeElement.offsetLeft
      coordinate.y = elementRef.nativeElement.offsetTop

      const startCoordinate = new Coordinate()
      startCoordinate.x = elementRef.nativeElement.offsetLeft
      startCoordinate.y = elementRef.nativeElement.offsetTop

      //answer.startCoordinate = startCoordinate
      //answer.coordinate = coordinate

      console.log(elementRef.nativeElement.offsetLeft, elementRef.nativeElement.offsetTop, elementRef)
    });
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
    this.answers.forEach((elementRef) => {

      const id = elementRef.nativeElement.id

      const answer = this.scene.answers.find(item => item.id == id)
      answer.setX(x)
      answer.setY(y)
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

  selectVariant(event) {

    console.log(event);


    //this.selectVariantScene.next(this.scene)
  }

  onClickEdit() {
    this.editScene.emit(this.scene)
  }

}
