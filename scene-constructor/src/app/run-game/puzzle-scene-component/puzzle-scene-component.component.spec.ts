import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PuzzleSceneComponentComponent } from './puzzle-scene-component.component';

describe('PuzzleSceneComponentComponent', () => {
  let component: PuzzleSceneComponentComponent;
  let fixture: ComponentFixture<PuzzleSceneComponentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PuzzleSceneComponentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PuzzleSceneComponentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
