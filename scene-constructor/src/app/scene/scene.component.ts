import {Component, ElementRef, Input, OnInit, Output, ViewChild, EventEmitter, ViewChildren, QueryList, AfterViewInit} from '@angular/core';
import {Scene} from '../models/scene.model';
import {Observable, Subject} from 'rxjs';
import {CdkDragDrop} from '@angular/cdk/drag-drop/drag-events';
import {Answer} from '../models/answer.model';

@Component({
  selector: 'app-scene',
  templateUrl: './scene.component.html',
  styleUrls: ['./scene.component.scss']
})
export class SceneComponent implements OnInit {

  @Input()
  scene: Scene

  @Output()
  selectAnswerScene = new EventEmitter<Answer>()

  @Output()
  editScene = new EventEmitter<Scene>()

  @Output()
  deleteScene = new EventEmitter<Scene>()

  dragPosition = {x: 0, y: 0};

  @Output()
  changeDrag = new EventEmitter()

  @ViewChildren("answer", {read: ElementRef})
  answers: QueryList<ElementRef>;

  @Input()
  changeSelectModeEvent$: Subject<boolean>

  @Output()
  selectScene = new EventEmitter<Scene>()

  isSelectMode = false

  constructor(public elementRef:ElementRef) {

  }

  ngOnInit() {
    this.dragPosition = {x: this.scene.coordinate.x, y: this.scene.coordinate.y};

    this.changeSelectModeEvent$.subscribe(isSelectMode => {
      this.isSelectMode = isSelectMode
    })
  }

  ngOnChanges() {
    console.log('ngOnChanges');
  }

  onClickScene() {
    if(this.isSelectMode) {
      console.log('clickScene');
      this.selectScene.next(this.scene)
    }
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

      console.log(this.scene.answers);

      const answer = this.scene.answers.find(item => item.id == id)

      console.log(answer);

      answer.setX(x)
      answer.setY(y)
    })

    this.changeDrag.next()

    //element.stopPropagation()
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

  selectAnswer(event, answer: Answer) {

    console.log('selectAnswer');

    this.changeSelectModeEvent$.next(false)

    this.toggleSelectMode()
    this.selectAnswerScene.next(answer)

    event.stopPropagation()
  }

  /**
   * Вызвать переключение в режим связи вопроса и сцены
   * @private
   */
  private toggleSelectMode() {
    this.changeSelectModeEvent$.next(true)
    //this.isSelectMode = false
  }

  onClickEdit() {
    this.editScene.emit(this.scene)
  }

  onClickDelete() {
    this.deleteScene.emit(this.scene)
  }

  toStringLabel(text: string, maxCount: number) {
    let sliced = text.slice(0,maxCount);
    if (sliced.length < text.length) {
      sliced += '...';
    }
    return sliced
  }

}
