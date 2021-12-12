import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MainRunGameComponentComponent } from './main-run-game-component.component';

describe('MainRunGameComponentComponent', () => {
  let component: MainRunGameComponentComponent;
  let fixture: ComponentFixture<MainRunGameComponentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MainRunGameComponentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MainRunGameComponentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
