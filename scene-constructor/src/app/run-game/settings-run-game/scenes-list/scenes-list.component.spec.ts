import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ScenesListComponent } from './scenes-list.component';

describe('ScenesListComponent', () => {
  let component: ScenesListComponent;
  let fixture: ComponentFixture<ScenesListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ScenesListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ScenesListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
