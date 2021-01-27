import { TestBed } from '@angular/core/testing';

import { ViwerService } from './viwer-service';

describe('ViwerServiceService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ViwerService = TestBed.get(ViwerService);
    expect(service).toBeTruthy();
  });
});
