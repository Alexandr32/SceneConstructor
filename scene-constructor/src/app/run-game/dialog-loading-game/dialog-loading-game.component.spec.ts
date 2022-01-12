import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogLoadingGameComponent } from './dialog-loading-game.component';

describe('DialogLoadingGameComponent', () => {
  let component: DialogLoadingGameComponent;
  let fixture: ComponentFixture<DialogLoadingGameComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DialogLoadingGameComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DialogLoadingGameComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
