import {AfterViewInit, Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {Answer, Coordinate, Scene} from '../models/scene-model';
import {Observable, of, Subject} from 'rxjs';
import {MatDialog} from '@angular/material/dialog';
import {EditSceneDialogComponent} from '../edit-scene-dialog/edit-scene-dialog.component';

@Component({
  selector: 'app-editor',
  templateUrl: './editor.component.html',
  styleUrls: ['./editor.component.scss']
})
export class EditorComponent implements OnInit, AfterViewInit {

  scenes: Scene[] = [];

  @ViewChild('working', {static: true})
  workingSpace: ElementRef | undefined;

  @ViewChild('canvas', {static: true})
  canvas: ElementRef<HTMLCanvasElement>;
  private ctx: CanvasRenderingContext2D;

  constructor(public dialog: MatDialog) {
    const scene1 = new Scene();
    scene1.id = 1;
    scene1.text = 'Text';
    scene1.title = 'title';
    scene1.coordinate = new Coordinate();

    const answers1 = new Answer(1, 'a', 0,scene1, 2);
    const answers2 = new Answer(2, 'б', 1, scene1,2);
    const answers3 = new Answer(3, 'в', 2, scene1,3);

    scene1.answers = [answers1, answers2, answers3];

    const scene2 = new Scene();
    scene2.id = 2;
    scene2.text = 'Text2';
    scene2.title = 'title2';
    scene2.coordinate = new Coordinate();
    scene2.coordinate.y = 50;
    scene2.coordinate.x = 300;

    const scene3 = new Scene();
    scene3.id = 3;
    scene3.text = 'Text3';
    scene3.title = 'title3';
    scene3.coordinate = new Coordinate();
    scene3.coordinate.y = 150;
    scene3.coordinate.x = 400;

    this.scenes.push(scene1, scene2, scene3);
  }

  ngAfterViewInit(): void {

    this.renderLine()
    console.log('EditorComponent: ngAfterViewInit');
  }

  openEditDialog(scene: Scene): void {

    const dialogRef = this.dialog.open(EditSceneDialogComponent, {
      data: scene
    });

    dialogRef.componentInstance.saveEvent.subscribe(() => {
      this.clearCanvas()
      this.renderLine()
    })

    dialogRef.afterClosed().subscribe(() => {
      console.log('closeDialog');
    });
  }

  /**
   * Перерисовать линии связей
   */
  private renderLine() {
    this.scenes.forEach((item) => {
      const answers = item.answers.filter(answer => answer.sceneId)

      answers.forEach(answer => {
        const coordinateOne = new Coordinate()
        coordinateOne.x = answer.coordinate.x
        coordinateOne.y = answer.coordinate.y

        const scene = this.scenes.find(scene => scene.id == answer.sceneId)
        const coordinateTwo: Coordinate = new Coordinate()
        coordinateTwo.x = scene.coordinate.x + 4
        coordinateTwo.y = scene.coordinate.y + 4

        this.moveZLine(coordinateOne, coordinateTwo)
      })
    })
  }

  onChangeDrag() {

    console.log('onChangeDrag');

    this.clearCanvas();
    this.renderLine()
  }

  ngOnInit() {
    this.ctx = this.canvas.nativeElement.getContext('2d');

    //this.moveZLine(this.scenes[0].coordinate, this.scenes[1].coordinate);
  }

  /**
   * Создает новую сцену
   */
  addNewScene() {

    const newArray: number[] = this.scenes.map(item => item.id)
    let max = Math.max(...newArray)

    const scene = new Scene();
    scene.id = max++;
    scene.text = 'Новая сцена';
    scene.title = 'Новое описание';
    scene.coordinate = new Coordinate();
    scene.coordinate.y = 0;
    scene.coordinate.x = 0;

    this.scenes.push(scene)

    this.renderLine()
  }

  private clearCanvas() {
    this.ctx.clearRect(0, 0, this.canvas.nativeElement.width, this.canvas.nativeElement.height);
  }

  /**
   * Отрисовывает z образную линию
   * @param coordinateOne
   * @param coordinateTwo
   * @private
   */
  private moveZLine(coordinateOne: Coordinate, coordinateTwo: Coordinate) {

    this.moveCircle(coordinateOne);

    const coordinateX2Y1 = new Coordinate();
    coordinateX2Y1.x = 2 / 3 * (coordinateTwo.x);
    coordinateX2Y1.y = coordinateOne.y;

    this.moveLine(coordinateOne, coordinateX2Y1);

    const coordinateX2Y2 = new Coordinate();
    coordinateX2Y2.x = 2 / 3 * (coordinateTwo.x);
    coordinateX2Y2.y = coordinateTwo.y;

    this.moveLine(coordinateX2Y1, coordinateX2Y2);

    this.moveLine(coordinateX2Y2, coordinateTwo);

    this.moveCircle(coordinateTwo);

  }

  /**
   * Рисует точку
   * @param coordinate
   * @private
   */
  private moveCircle(coordinate: Coordinate) {
    this.ctx.beginPath();
    this.ctx.arc(coordinate.x, coordinate.y, 6, 0, 2 * Math.PI);
    this.ctx.fillStyle = 'coral';
    this.ctx.fill();
    this.ctx.closePath();
  }

  /**
   * Открисовывает одну линию
   * @param coordinateOne
   * @param coordinateTwo
   * @private
   */
  private moveLine(coordinateOne: Coordinate, coordinateTwo: Coordinate) {
    this.ctx.beginPath();
    this.ctx.moveTo(coordinateOne.x, coordinateOne.y);
    this.ctx.lineTo(coordinateTwo.x, coordinateTwo.y);
    this.ctx.strokeStyle = 'coral';
    this.ctx.lineWidth = 2;
    this.ctx.stroke();
    this.ctx.closePath();
  }

  selectVariant(scene: Scene) {
    console.log(scene);
  }

}
