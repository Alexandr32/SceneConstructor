import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PlayerListAnswersComponent } from './player-list-answers.component';

describe('ListAnswersComponent', () => {
  let component: PlayerListAnswersComponent;
  let fixture: ComponentFixture<PlayerListAnswersComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PlayerListAnswersComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PlayerListAnswersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
