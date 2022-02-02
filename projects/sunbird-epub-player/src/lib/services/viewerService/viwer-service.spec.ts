import { TestBed } from '@angular/core/testing';
import { EpubPlayerService } from '../../sunbird-epub-player.service';
import { UtilService } from '../utilService/util.service';
import { ViwerService } from './viwer-service';
import { mockData } from './viwer-service.spec.data';

describe('ViewerService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [UtilService, EpubPlayerService]
    });
  });

  it('should be created', () => {
    const service: ViwerService = TestBed.get(ViwerService);
    expect(service).toBeTruthy();
  });

  xit('should initialize player config', () => {
    const service = TestBed.get(ViwerService);
    service.initialize(mockData.playerConfig);
    expect(service.src).toEqual(mockData.playerConfig.metadata.artifactUrl);
    expect(service.endPageSeen).toBeFalsy();
  });

  xit('should raise Start event ', () => {
    const service = TestBed.get(ViwerService);
    const sunbirdEpubPlayerService = TestBed.get(EpubPlayerService);
    spyOn(sunbirdEpubPlayerService, 'initialize').and.callThrough();
    spyOn(sunbirdEpubPlayerService, 'start');
    spyOn(service.playerEvent, 'emit');
    sunbirdEpubPlayerService.initialize(mockData.playerConfig);
    service.initialize(mockData.playerConfig);
    service.raiseStartEvent(mockData.spineEvent);
    expect(service.playerEvent.emit).toHaveBeenCalled();
    expect(sunbirdEpubPlayerService.initialize).toHaveBeenCalled();
    expect(sunbirdEpubPlayerService.start).toHaveBeenCalled();
  });

  xit('should raise End event ', () => {
    const service = TestBed.get(ViwerService);
    const sunbirdEpubPlayerService = TestBed.get(EpubPlayerService);
    spyOn(sunbirdEpubPlayerService, 'initialize').and.callThrough();
    spyOn(sunbirdEpubPlayerService, 'end');
    spyOn(service.playerEvent, 'emit');
    sunbirdEpubPlayerService.initialize(mockData.playerConfig);
    service.initialize(mockData.playerConfig);
    service.totalNumberOfPages = 68;
    service.raiseEndEvent(mockData.endEvent);
    expect(service.playerEvent.emit).toHaveBeenCalled();
    expect(sunbirdEpubPlayerService.initialize).toHaveBeenCalled();
    expect(sunbirdEpubPlayerService.end).toHaveBeenCalled();
  });

  xit('should raise interact event', () => {
    const service = TestBed.get(ViwerService);
    const sunbirdEpubPlayerService = TestBed.get(EpubPlayerService);
    spyOn(sunbirdEpubPlayerService, 'initialize').and.callThrough();
    spyOn(sunbirdEpubPlayerService, 'interact').and.callThrough();
    sunbirdEpubPlayerService.initialize(mockData.playerConfig);
    service.initialize(mockData.playerConfig);
    service.raiseHeartBeatEvent(mockData.heartBeatEvent , 'INTERACT');
    expect(sunbirdEpubPlayerService.initialize).toHaveBeenCalled();
    expect(sunbirdEpubPlayerService.interact).toHaveBeenCalled();
  });

  xit('should raise impression event', () => {
    const service = TestBed.get(ViwerService);
    const sunbirdEpubPlayerService = TestBed.get(EpubPlayerService);
    spyOn(sunbirdEpubPlayerService, 'initialize').and.callThrough();
    spyOn(sunbirdEpubPlayerService, 'impression').and.callThrough();
    sunbirdEpubPlayerService.initialize(mockData.playerConfig);
    service.initialize(mockData.playerConfig);
    service.raiseHeartBeatEvent(mockData.heartBeatEvent , 'IMPRESSION');
    expect(sunbirdEpubPlayerService.initialize).toHaveBeenCalled();
    expect(sunbirdEpubPlayerService.impression).toHaveBeenCalled();
  });


  xit('should raise Error event', () => {
    const service = TestBed.get(ViwerService);
    const sunbirdEpubPlayerService = TestBed.get(EpubPlayerService);
    spyOn(sunbirdEpubPlayerService, 'initialize').and.callThrough();
    spyOn(sunbirdEpubPlayerService, 'error');
    spyOn(service.playerEvent, 'emit');
    sunbirdEpubPlayerService.initialize(mockData.playerConfig);
    service.initialize(mockData.playerConfig);
    service.raiseErrorEvent('');
    expect(service.playerEvent.emit).toHaveBeenCalled();
    expect(sunbirdEpubPlayerService.error).toHaveBeenCalled();
  });

});
