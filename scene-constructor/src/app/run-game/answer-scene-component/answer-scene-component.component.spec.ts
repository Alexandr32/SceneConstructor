import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AnswerSceneComponentComponent } from './answer-scene-component.component';

describe('AnswerSceneComponentComponent', () => {
  let component: AnswerSceneComponentComponent;
  let fixture: ComponentFixture<AnswerSceneComponentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AnswerSceneComponentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AnswerSceneComponentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
