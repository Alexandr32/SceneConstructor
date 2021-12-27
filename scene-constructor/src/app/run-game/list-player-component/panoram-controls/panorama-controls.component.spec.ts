import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PanoramaControlsComponent } from './panorama-controls.component';

describe('PanoramControlsComponent', () => {
  let component: PanoramaControlsComponent;
  let fixture: ComponentFixture<PanoramaControlsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PanoramaControlsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PanoramaControlsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
