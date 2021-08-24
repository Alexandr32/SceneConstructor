import {Component, Input, OnInit} from '@angular/core';
import { Coordinate } from '../models/scene-model';

@Component({
  selector: 'app-svg-line',
  templateUrl: './svg-line.component.svg',
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

  getPointXOne(): number {

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

    if(this.pointTwo.x <= this.pointTwo.x) {
      return this.pointTwo.x
    }

    return this.pointTwo.x
  }

  getPointYTwo(): number {

    if(this.pointTwo.y <= this.pointTwo.y) {
      return this.pointTwo.y
    }

    return this.pointTwo.y
  }

  getWidth(): number {
    return Math.abs(this.pointTwo.x)
  }

  getHeight(): number {
    return Math.abs(this.pointTwo.y)
  }

}
