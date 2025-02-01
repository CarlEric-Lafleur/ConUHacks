import { TestBed } from '@angular/core/testing';

import { UserCommunicationService } from './user-communication.service';

describe('UserCommunicationService', () => {
  let service: UserCommunicationService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(UserCommunicationService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
