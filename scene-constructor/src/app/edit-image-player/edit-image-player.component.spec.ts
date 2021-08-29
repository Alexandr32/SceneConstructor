import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EditImagePlayerComponent } from './edit-image-player.component';

describe('EditImagePlayerComponent', () => {
  let component: EditImagePlayerComponent;
  let fixture: ComponentFixture<EditImagePlayerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditImagePlayerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditImagePlayerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
