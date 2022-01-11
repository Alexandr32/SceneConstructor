import { TestBed } from '@angular/core/testing';

import { SettingsRunGameService } from './settings-run-game.service';

describe('SettingsRunGameService', () => {
  let service: SettingsRunGameService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SettingsRunGameService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
