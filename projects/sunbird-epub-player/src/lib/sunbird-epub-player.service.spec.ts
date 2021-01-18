import { TestBed } from '@angular/core/testing';

import { EpubPlayerService } from './sunbird-epub-player.service';

describe('EpubPlayerService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: EpubPlayerService = TestBed.get(EpubPlayerService);
    expect(service).toBeTruthy();
  });
});
