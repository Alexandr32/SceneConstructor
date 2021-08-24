import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SvgLineComponent } from './svg-line.component';
import {Input} from '@angular/core';
import {Coordinate} from '../models/scene-model';

describe('SvgLineComponent', () => {

  it('из нуля вниз', () => {
    // Arrange
    let component: SvgLineComponent = new SvgLineComponent()
    // Act
    const pointOne: Coordinate = new Coordinate()
    pointOne.x = 0
    pointOne.y = 0
    const pointTwo: Coordinate = new Coordinate()
    pointTwo.x = 10
    pointTwo.y = 10

    component.pointOne = pointOne
    component.pointTwo = pointTwo

    // Assert
    expect(component.getHeight()).toBe(10)
    expect(component.getWidth()).toBe(10)




  });

});
