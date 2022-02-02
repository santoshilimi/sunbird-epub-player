import { TestBed } from '@angular/core/testing';

import { UtilService } from './util.service';

describe('UtilService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: UtilService = TestBed.get(UtilService);
    expect(service).toBeTruthy();
  });

  it('should return unique id', () => {
    const service: UtilService = TestBed.get(UtilService);
    const id = service.uniqueId();
    expect(id).toBeDefined();
  });

  it('should return time spent text', () => {
    const service: UtilService = TestBed.get(UtilService);
    const time = service.getTimeSpentText(10);
    expect(time).toBeDefined();
  });

  it('should return current index when next', () => {
    const service: UtilService = TestBed.get(UtilService);
    const event = {
        interaction: 'NEXT'
      };
    const currentPageIndex = 1;
    const response = service.getCurrentIndex(event , currentPageIndex);
    expect(response).toBe(2);
  });

  xit('should return current index when previous', () => {
    const service: UtilService = TestBed.get(UtilService);
    const event = {
        interaction: 'PREVIOUS'
      };
    const currentPageIndex = 1;
    const response = service.getCurrentIndex(event , currentPageIndex);
    expect(response).toBe(0);
  });

});
