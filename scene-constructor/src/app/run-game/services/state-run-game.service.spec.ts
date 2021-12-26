import { TestBed } from '@angular/core/testing';

import { StateRunGameService } from './state-run-game.service';

describe('StateRunGameService', () => {
  let service: StateRunGameService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(StateRunGameService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
