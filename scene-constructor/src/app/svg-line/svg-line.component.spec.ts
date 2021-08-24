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
    expect(component.getPointXOne()).toBe(0)
    expect(component.getPointYOne()).toBe(0)
    expect(component.getPointXTwo()).toBe(10)
    expect(component.getPointYTwo()).toBe(10)
  });

  it('точки на оборот', () => {
    // Arrange
    let component: SvgLineComponent = new SvgLineComponent()
    // Act
    const pointOne: Coordinate = new Coordinate()
    pointOne.x = 10
    pointOne.y = 10
    const pointTwo: Coordinate = new Coordinate()
    pointTwo.x = 0
    pointTwo.y = 0

    component.pointOne = pointOne
    component.pointTwo = pointTwo

    // Assert
    const height = component.getHeight()
    expect(height).toBe(10)
    const width = component.getHeight()
    expect(width).toBe(10)
    const pointXOne = component.getPointXOne()
    expect(pointXOne).toBe(0)
    const pointYOne = component.getPointYOne()
    expect(pointYOne).toBe(0)
    const pointXTwo = component.getPointXTwo()
    expect(pointXTwo).toBe(10)
    const pointYTwo = component.getPointYTwo()
    expect(pointYTwo).toBe(10)
  });

});
