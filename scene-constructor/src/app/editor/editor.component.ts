import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {Coordinate, Scene} from '../models/scene-model';
import {Observable, of, Subject} from 'rxjs';

@Component({
  selector: 'app-editor',
  templateUrl: './editor.component.html',
  styleUrls: ['./editor.component.scss']
})
export class EditorComponent implements OnInit {

  scenes: Scene[] = [];

  @ViewChild('working', {static: true})
  workingSpace: ElementRef|undefined;

  @ViewChild('canvas', {static: true})
  canvas: ElementRef<HTMLCanvasElement>;
  private ctx: CanvasRenderingContext2D;

  constructor() {
    const scene1 = new Scene();
    scene1.id = 1;
    scene1.text = 'Text';
    scene1.title = 'title';
    scene1.coordinate = new Coordinate();

    const scene2 = new Scene();
    scene2.id = 2;
    scene2.text = 'Text2';
    scene2.title = 'title2';
    scene2.coordinate = new Coordinate();
    scene2.coordinate.y = 50;
    scene2.coordinate.x = 300;

    this.scenes.push(scene1, scene2);
  }

  onChangeDrag() {

    console.log('onChangeDrag');

    this.clearCanvas()

    this.moveZLine(this.scenes[0].coordinate, this.scenes[1].coordinate)
  }

  ngOnInit() {
    this.ctx = this.canvas.nativeElement.getContext('2d');

    this.moveZLine(this.scenes[0].coordinate, this.scenes[1].coordinate)
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

    const coordinateX2Y1 = new Coordinate()
    coordinateX2Y1.x = 2 / 3  * coordinateTwo.x
    coordinateX2Y1.y = coordinateOne.y

    this.moveLine(coordinateOne, coordinateX2Y1)

    const coordinateX2Y2 = new Coordinate()
    coordinateX2Y2.x = 2 / 3 * coordinateTwo.x
    coordinateX2Y2.y = coordinateTwo.y

    this.moveLine(coordinateX2Y1, coordinateX2Y2)

    this.moveLine(coordinateX2Y2, coordinateTwo)

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
    this.ctx.closePath()
  }

  selectVariant(scene: Scene) {
    console.log(scene);
  }

}
