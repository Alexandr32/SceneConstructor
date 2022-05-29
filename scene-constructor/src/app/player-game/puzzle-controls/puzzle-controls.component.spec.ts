import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PuzzleControlsComponent } from './puzzle-controls.component';

describe('PuzzleControlsComponent', () => {
  let component: PuzzleControlsComponent;
  let fixture: ComponentFixture<PuzzleControlsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PuzzleControlsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PuzzleControlsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
