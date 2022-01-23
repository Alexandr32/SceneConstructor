import { TestBed } from '@angular/core/testing';

import { AuthenticationEditorService } from './authentication-editor-service.service';

describe('AuthenticationServiceService', () => {
  let service: AuthenticationEditorService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AuthenticationEditorService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
