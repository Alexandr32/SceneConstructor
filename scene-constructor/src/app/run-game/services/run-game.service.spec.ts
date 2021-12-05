import { TestBed, async, inject } from '@angular/core/testing';
import { RunGameService } from './run-game.service';

describe('Service: RunGame.service.ts', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [RunGameService]
    });
  });

  it('should ...', inject([RunGameService], (service: RunGameService) => {
    expect(service).toBeTruthy();
  }));
});
