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

}
