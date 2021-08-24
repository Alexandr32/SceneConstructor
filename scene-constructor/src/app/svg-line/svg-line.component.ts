import {Component, Input, OnInit} from '@angular/core';
import { Coordinate } from '../models/scene-model';

@Component({
  selector: 'app-svg-line',
  templateUrl: './svg-line.component.html',
  styleUrls: ['./svg-line.component.scss']
})
export class SvgLineComponent implements OnInit {

  @Input()
  pointOne: Coordinate = new Coordinate()

  @Input()
  pointTwo: Coordinate = new Coordinate()

  constructor() { }

  ngOnInit(): void {
  }

  getStartX() {
    if(this.pointOne.x <= this.pointTwo.x) {
      return this.pointOne.x
    } else {
      return this.pointTwo.x
    }
  }

  getStartPointX() {
    if(this.pointOne.x <= this.pointTwo.x) {
      return 0
    } else {
      return 0
    }
  }

  getStartPointY() {
    if(this.pointOne.x <= this.pointTwo.x) {
      return 0
    } else {
      return this.getHeight()
    }
  }

  getEndPointX() {
    if(this.pointOne.x <= this.pointTwo.x) {
      return this.getWidth()
    } else {
      return this.getWidth()
    }
  }

  getEndPointY() {
    if(this.pointOne.x <= this.pointTwo.x) {
      return this.getHeight()
    } else {
      return 0
    }
  }

  /*getPointXOne(): number {

    if(this.pointOne.x <= this.pointTwo.x) {
      return this.pointOne.x
    }

    return this.pointTwo.x
  }

  getPointYOne(): number {

    if(this.pointOne.y <= this.pointTwo.y) {
      return this.pointOne.y
    }

    return this.pointTwo.y
  }

  getPointXTwo(): number {

    if(this.pointTwo.x >= this.pointOne.x) {
      return this.pointTwo.x
    }

    return this.pointOne.x
  }

  getPointYTwo(): number {

    if(this.pointTwo.y >= this.pointOne.y) {
      return this.pointTwo.y
    }

    return this.pointOne.y
  }*/

  getWidth(): number {
    return Math.abs(Math.abs(this.pointOne.x) - Math.abs(this.pointTwo.x))
  }

  getHeight(): number {
    return Math.abs(Math.abs(this.pointOne.y) - Math.abs(this.pointTwo.y))
  }

}
