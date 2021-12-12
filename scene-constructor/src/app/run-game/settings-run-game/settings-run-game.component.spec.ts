import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SettingsRunGameComponent } from './settings-run-game.component';

describe('SettingsRunGameComponent', () => {
  let component: SettingsRunGameComponent;
  let fixture: ComponentFixture<SettingsRunGameComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SettingsRunGameComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SettingsRunGameComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
