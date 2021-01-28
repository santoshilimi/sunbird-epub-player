import { EventEmitter, Component, Output, Input, OnInit, HostListener, AfterViewInit } from '@angular/core';
import { ViwerService } from './services/viewerService/viwer-service';
import { PlayerConfig } from './sunbird-epub-player.interface';
import { EpubPlayerService } from './sunbird-epub-player.service';
import { epubPlayerConstants, telemetryType } from './sunbird-epub.constant';
import { ErrorService, errorCode, errorMessage } from '@project-sunbird/sunbird-player-sdk-v8';


@Component({
  selector: 'sunbird-epub-player',
  templateUrl: './sunbird-epub-player.component.html',
  styleUrls: ['./sunbird-epub-player.component.scss']
})
export class EpubPlayerComponent implements OnInit, AfterViewInit {
  fromConst = epubPlayerConstants;
  @Input() playerConfig: PlayerConfig;
  @Output() headerActionsEvent: EventEmitter<any> = new EventEmitter<any>();
  @Output() telemetryEvent: EventEmitter<any> = new EventEmitter<any>();
  @Output() playerEvent: EventEmitter<object>;

  viewState = this.fromConst.LOADING;
  showEpubViewer = false;
  public traceId: string;
  headerConfiguration = {
    rotation: false,
    goto: false,
    navigation: true,
    zoom: false
  }

  constructor(
    public viwerService: ViwerService,
    private epubPlayerService: EpubPlayerService,
    public errorService: ErrorService
  ) {
    this.playerEvent = this.viwerService.playerEvent;
  }

  @HostListener('document:TelemetryEvent', ['$event'])
  onTelemetryEvent(event) {
    this.telemetryEvent.emit(event.detail);
  }

  ngOnInit() {
    this.traceId = this.playerConfig.config['traceId'];
    this.errorService.getInternetConnectivityError.subscribe(event => {
      this.viwerService.raiseExceptionLog(errorCode.internetConnectivity, errorMessage.internetConnectivity, event['error'], this.traceId)
    });

    const contentCompabilityLevel = this.playerConfig.metadata['compatibilityLevel'];
    if (contentCompabilityLevel) {
      const checkContentCompatible = this.errorService.checkContentCompatibility(contentCompabilityLevel);
      if (!checkContentCompatible['isCompitable']) {
        this.viwerService.raiseErrorEvent(checkContentCompatible['error'], 'compatibility-error');
        this.viwerService.raiseExceptionLog(errorCode.contentCompatibility, errorMessage.contentCompatibility, checkContentCompatible['error'], this.traceId)
      }
    }
    this.epubPlayerService.initialize(this.playerConfig);
    this.viwerService.initialize(this.playerConfig);
    this.viewState = this.fromConst.START;
  }

  headerActions(event) {
    this.headerActionsEvent.emit(event.type);
  }

  ngAfterViewInit() {
    this.viewState = this.fromConst.START;
  }

  viewerEvent(event) {
    if (event.type === this.fromConst.EPUBLOADED) {
      this.onEpubLoaded(event)
    }
    if (event.type === this.fromConst.PAGECHANGE) {
      this.onPageChange(event);
    } if (event.type === this.fromConst.END) {
      this.onEpubEnded(event);
    } if (event.type === this.fromConst.ERROR) {
      this.onEpubLoadFailed(event)
    }
  }

  onEpubLoaded(event) {
    this.showEpubViewer = true;
    this.viwerService.raiseStartEvent(event.data);
  }

  onPageChange(event) {
    this.viwerService.raiseHeartBeatEvent(event, telemetryType.INTERACT);
    this.viwerService.raiseHeartBeatEvent(event, telemetryType.IMPRESSION);
  }

  onEpubEnded(event) {
    this.viewState = this.fromConst.END;
    this.viwerService.raiseEndEvent(event);
  }

  onEpubLoadFailed(error) {
    this.viewState = this.fromConst.LOADING
    this.viwerService.raiseErrorEvent(error);
    this.viwerService.raiseExceptionLog(errorCode.contentLoadFails, errorMessage.contentLoadFails, error, this.traceId);
    this.viwerService.raiseExceptionLog(errorCode.contentLoadFails, errorMessage.contentLoadFails, error, this.traceId);
  }

  replayContent(event) {
    this.viwerService.raiseHeartBeatEvent(event, telemetryType.INTERACT);
    this.ngOnInit();
  }

  sideBarEvents(event) {
    this.viwerService.raiseHeartBeatEvent(event, telemetryType.INTERACT);
  }

  sidebarMenuEvent(event) {
    this.viwerService.raiseHeartBeatEvent(event, telemetryType.INTERACT);
  }
}
