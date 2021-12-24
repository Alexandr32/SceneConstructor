import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DescriptionSceneComponent } from './description-scene.component';

describe('DescriptionSceneComponent', () => {
  let component: DescriptionSceneComponent;
  let fixture: ComponentFixture<DescriptionSceneComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DescriptionSceneComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DescriptionSceneComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
