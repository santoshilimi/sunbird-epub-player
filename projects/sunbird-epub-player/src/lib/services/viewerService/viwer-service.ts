import { Injectable, EventEmitter } from '@angular/core';
import { PlayerConfig } from '../../sunbird-epub-player.interface';
import { EpubPlayerService } from '../../sunbird-epub-player.service';
import { UtilService } from '../utilService/util.service';
import { telemetryType } from '../../sunbird-epub.constant';

@Injectable({
  providedIn: 'root'
})
export class ViwerService {

  public currentIndex = 0;
  public totalNumberOfPages = 0;
  public epubPlayerStartTime: number;
  public epubLastPageTime: number;
  public endPageSeen = false;
  public timeSpent = '0:0';
  private version = '1.0';
  public playerEvent = new EventEmitter<any>();
  public contentName: string;
  public loadingProgress: number;
  public showDownloadPopup: boolean;
  public src: string;
  public userName: string;
  private metaData: any;
  constructor(
    private utilService: UtilService,
    private epubPlayerService: EpubPlayerService
  ) { }

  initialize({ context, config, metadata }: PlayerConfig) {
    this.epubPlayerStartTime = this.epubLastPageTime = new Date().getTime();
    this.totalNumberOfPages = 0;
    this.currentIndex = 0;
    this.contentName = metadata.name;
    if (metadata.isAvailableLocally) {
      const basePath = (metadata.streamingUrl) ? (metadata.streamingUrl) : (metadata.basePath || metadata.baseDir)
      this.src = `${basePath}/${metadata.artifactUrl}`;
    } else {
      this.src = metadata.streamingUrl || metadata.artifactUrl;
    }
    if (context.userData) {
      const { userData: { firstName, lastName } } = context;
      this.userName = firstName === lastName ? firstName : `${firstName} ${lastName}`;
    }
    this.metaData = {
      pagesVisited: [],
      totalPages: 0,
      duration: [],
      zoom: [],
      rotation: []
    };
    // this.loadingProgress = 0;
    this.showDownloadPopup = false;
    this.endPageSeen = false;
  }

  raiseStartEvent(event) {
    this.currentIndex = event.items[0].index,
      this.metaData.totalPages = event.items.length;
    this.totalNumberOfPages = event.items.length;
    console.warn(this.totalNumberOfPages);
    const duration = new Date().getTime() - this.epubPlayerStartTime;
    const startEvent = {
      eid: 'START',
      ver: this.version,
      edata: {
        type: 'START',
        currentPage: this.currentIndex,
        duration
      },
      metaData: this.metaData
    };
    this.playerEvent.emit(startEvent);
    this.epubLastPageTime = this.epubPlayerStartTime = new Date().getTime();
    this.epubPlayerService.start(duration);
  }

  raiseHeartBeatEvent(event, teleType?) {
    console.log(event);
    if (event.data) {
      this.currentIndex = event.data.index;
    }
    const eventType = event.type? event.type : event;
    const heartBeatEvent = {
      eid: 'HEARTBEAT',
      ver: this.version,
      edata: {
        eventType,
        currentPage: this.currentIndex
      },
      metaData: this.metaData
    };
    this.playerEvent.emit(heartBeatEvent);
    if (telemetryType.IMPRESSION === teleType) {
      this.epubPlayerService.impression(this.currentIndex);
    }
    if (telemetryType.INTERACT === teleType) {
      this.epubPlayerService.interact(eventType.toLowerCase(), this.currentIndex);
    }
  }

  raiseEndEvent(event) {
    this.currentIndex = event.data.index;
    const duration = new Date().getTime() - this.epubPlayerStartTime;
    const endEvent = {
      eid: 'END',
      ver: this.version,
      edata: {
        type: 'END',
        currentPage: event.data.index,
        totalPages: this.totalNumberOfPages,
        duration
      },
      metaData: this.metaData
    };
    this.playerEvent.emit(endEvent);
    const visitedlength = this.currentIndex;
    this.timeSpent = this.utilService.getTimeSpentText(this.epubPlayerStartTime);
    this.epubPlayerService.end(duration,
      this.currentIndex, this.totalNumberOfPages, visitedlength, this.endPageSeen);
  }


  raiseErrorEvent(error: Error, type?: string) {
    const errorEvent = {
      eid: 'ERROR',
      ver: this.version,
      edata: {
        type: type || 'ERROR',
        stacktrace: error ? error.toString() : ''
      },
      metaData: this.metaData
    };
    this.playerEvent.emit(errorEvent);
    if (!type) {
    this.epubPlayerService.error(error);
    }
  }

  raiseExceptionLog(errorCode: string , errorType: string , stacktrace , traceId ) {
    const exceptionLogEvent = {
      eid: "ERROR",
      edata: {
          err: errorCode,
          errtype: errorType,
          requestid: traceId || '',
          stacktrace: stacktrace || '',
      }
    }
    this.playerEvent.emit(exceptionLogEvent)
    this.epubPlayerService.error(stacktrace, { err: errorCode, errtype: errorType });
  }
}
