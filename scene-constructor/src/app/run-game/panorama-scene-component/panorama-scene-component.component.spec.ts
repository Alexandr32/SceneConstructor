import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PanoramaSceneComponentComponent } from './panorama-scene-component.component';

describe('PanoramaSceneComponentComponent', () => {
  let component: PanoramaSceneComponentComponent;
  let fixture: ComponentFixture<PanoramaSceneComponentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PanoramaSceneComponentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PanoramaSceneComponentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
