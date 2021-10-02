import { Component, ElementRef, Input, OnInit, Output, EventEmitter, ViewChildren, QueryList } from '@angular/core';
import { Scene } from '../../models/scene.model';
import { Subject } from 'rxjs';
import { Answer } from '../../models/answer.model';
import { Player } from '../../models/player.model';

@Component({
  selector: 'app-scene',
  templateUrl: './scene.component.html',
  styleUrls: ['./scene.component.scss']
})
export class SceneComponent implements OnInit {

  @Input()
  scene: Scene;

  @Input()
  players: Player[];

  @Output()
  selectAnswerScene = new EventEmitter<Answer>();

  @Output()
  editScene = new EventEmitter<Scene>();

  @Output()
  deleteScene = new EventEmitter<Scene>();

  dragPosition = { x: 0, y: 0 };

  @Output()
  changeDrag = new EventEmitter();

  @ViewChildren('answer', { read: ElementRef })
  answers: QueryList<ElementRef>;

  @Input()
  changeSelectModeEvent$: Subject<boolean>;

  @Output()
  selectScene = new EventEmitter<Scene>();

  isSelectMode = false;

  @Input()
  startScene$: Subject<Scene> = new Subject<Scene>()

  constructor(public elementRef: ElementRef) {

  }

  ngOnInit() {
    this.dragPosition = { x: this.scene.coordinate.x, y: this.scene.coordinate.y };

    this.changeSelectModeEvent$.subscribe(isSelectMode => {
      this.isSelectMode = isSelectMode;
    });
  }

  onClickScene() {
    if (this.isSelectMode) {
      console.log('clickScene');
      this.selectScene.next(this.scene);
    }
  }

  onClick(event) {

  }

  onCdkDragDropped(event) {

    const element = event.source.getRootElement();

    const { x, y } = this.getCoordinate(element);

    this.scene.coordinate.x = x;
    this.scene.coordinate.y = y;

    // Изменяем координаты у дочерних эл-ов
    this.answers.forEach((elementRef) => {

      const id = elementRef.nativeElement.id;

      const answer = this.scene.answers.find(item => item.id == id);

      answer.setX(x);
      answer.setY(y);
    });

    this.changeDrag.next();
  }

  private getCoordinate(element) {
    const boundingClientRect = element.getBoundingClientRect();
    const parentPosition = this.getPosition(element);

    const x = boundingClientRect.x - parentPosition.left;
    const y = boundingClientRect.y - parentPosition.top + window.scrollY;

    return {
      x, y
    };
  }

  private getPosition(el) {
    let x = 0;
    let y = 0;
    while (el && !isNaN(el.offsetLeft) && !isNaN(el.offsetTop)) {
      x += el.offsetLeft - el.scrollLeft;
      y += el.offsetTop - el.scrollTop;
      el = el.offsetParent;
    }
    return { top: y, left: x };
  }

  selectAnswer(event, answer: Answer) {

    console.log('selectAnswer');

    this.changeSelectModeEvent$.next(false);

    this.toggleSelectMode();
    this.selectAnswerScene.next(answer);

    event.stopPropagation();
  }

  /**
   * Вызвать переключение в режим связи вопроса и сцены
   * @private
   */
  private toggleSelectMode() {
    this.changeSelectModeEvent$.next(true);
  }

  onClickEdit() {
    this.editScene.emit(this.scene);
  }

  /**
   * Запустить сцену
   */
  onClickRunScene() {
    this.startScene$.next(this.scene)
    //this.editScene.emit(this.scene);
  }

  getNamePlayer(id: string): string {
    return this.players.find(item => item.id == id).name;
  }

  onClickDelete() {
    this.deleteScene.emit(this.scene);
  }

  toStringLabel(text: string, maxCount: number) {
    let sliced = text.slice(0, maxCount);
    if (sliced.length < text.length) {
      sliced += '...';
    }
    return sliced;
  }

}
