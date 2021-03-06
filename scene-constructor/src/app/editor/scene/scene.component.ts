import {
  Component,
  ElementRef,
  Input,
  OnInit,
  Output,
  EventEmitter,
  ViewChildren,
  QueryList,
  OnDestroy
} from '@angular/core';
import {Subject} from 'rxjs';
import {Answer} from '../models/answer.model';
import {Player} from '../../core/models/player.model';
import {getTypesScene, TypeScene} from 'src/app/core/models/type-scene.enum';
import {IBaseEditScene} from "../models/base-edit-scene.model";
import {BaseComponent} from "../../base-component/base-component.component";

@Component({
  selector: 'app-scene',
  templateUrl: './scene.component.html',
  styleUrls: ['./scene.component.scss']
})
export class SceneComponent extends BaseComponent implements OnInit, OnDestroy {

  typeScene: TypeScene

  @Input()
  scene: IBaseEditScene;

  @Input()
  players: Player[];

  @Output()
  selectAnswerScene = new EventEmitter<Answer>();

  @Output()
  editScene = new EventEmitter<IBaseEditScene>();

  @Output()
  deleteScene = new EventEmitter<IBaseEditScene>();

  dragPosition = {x: 0, y: 0};

  @Output()
  changeDrag = new EventEmitter<void>();

  @ViewChildren('answer', {read: ElementRef})
  answers: QueryList<ElementRef>;

  @Input()
  changeSelectModeEvent$: Subject<boolean>;

  @Output()
  selectScene = new EventEmitter<IBaseEditScene>();

  isSelectMode = false;

  @Input()
  startScene$: Subject<IBaseEditScene> = new Subject<IBaseEditScene>()

  @Input()
  startDebugModeScene$: Subject<IBaseEditScene> = new Subject<IBaseEditScene>()

  constructor(public elementRef: ElementRef) {
    super()
  }

  ngOnDestroy(): void {
    this.unsubscribe()
  }

  ngOnInit() {

    this.typeScene = getTypesScene().find(item => item.type === this.scene.typesScene)

    this.dragPosition = {x: this.scene.coordinate.x, y: this.scene.coordinate.y};

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

    const {x, y} = this.getCoordinate(element);

    this.scene.coordinate.x = x;
    this.scene.coordinate.y = y;

    // ???????????????? ???????????????????? ?? ???????????????? ????-????
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
    return {top: y, left: x};
  }

  selectAnswer(event, answer: Answer) {

    this.changeSelectModeEvent$.next(false);

    this.toggleSelectMode();
    this.selectAnswerScene.next(answer);

    event.stopPropagation();
  }

  /**
   * ?????????????? ???????????????????????? ?? ?????????? ?????????? ?????????????? ?? ??????????
   * @private
   */
  private toggleSelectMode() {
    this.changeSelectModeEvent$.next(true);
  }

  onClickEdit() {
    this.editScene.emit(this.scene);
  }

  /**
   * ?????????????????? ??????????
   */
  onClickRunScene() {
    this.startScene$.next(this.scene)
  }

  startRunSceneDebugMode() {
    this.startDebugModeScene$.next(this.scene)
  }

  getNamePlayer(id: string): string {
    return this.players.find(item => item.id == id).name;
  }

  onClickDelete() {
    this.deleteScene.emit(this.scene);
  }
}
