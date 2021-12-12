import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ListPlayerComponentComponent } from './list-player-component.component';

describe('ListPlayerComponentComponent', () => {
  let component: ListPlayerComponentComponent;
  let fixture: ComponentFixture<ListPlayerComponentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ListPlayerComponentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListPlayerComponentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
