import { EventEmitter, Component, Output, Input, OnInit, HostListener, OnDestroy, ElementRef, ViewChild, AfterViewInit, Renderer2 } from '@angular/core';
import { ViwerService } from './services/viewerService/viwer-service';
import { PlayerConfig } from './sunbird-epub-player.interface';
import { EpubPlayerService } from './sunbird-epub-player.service';
import { epubPlayerConstants, telemetryType } from './sunbird-epub.constant';
import { ErrorService, errorCode, errorMessage } from '@project-sunbird/sunbird-player-sdk-v8';
import { UtilService } from './services/utilService/util.service';


@Component({
  selector: 'sunbird-epub-player',
  templateUrl: './sunbird-epub-player.component.html',
  styleUrls: ['./sunbird-epub-player.component.scss']
})
export class EpubPlayerComponent implements OnInit, OnDestroy, AfterViewInit {
  fromConst = epubPlayerConstants;
  @ViewChild('epubPlayer', { static: true }) epubPlayerRef: ElementRef;
  @Input() playerConfig: PlayerConfig;
  @Output() headerActionsEvent: EventEmitter<any> = new EventEmitter<any>();
  @Output() telemetryEvent: EventEmitter<any> = new EventEmitter<any>();
  @Output() playerEvent: EventEmitter<object>;
  private unlistenMouseEnter: () => void;
  private unlistenMouseLeave: () => void;
  public showControls = true;
  showContentError: boolean;
  sideMenuConfig = {
    showShare: true,
    showDownload: true,
    showReplay: false,
    showExit: false,
    showPrint: true
  };
  viewState = this.fromConst.LOADING;
  intervalRef: any;
  progress = 0;
  showEpubViewer: boolean;
  public traceId: string;
  currentPageIndex = 1;
  headerConfiguration = {
    rotation: false,
    goto: false,
    navigation: true,
    zoom: false
  }

  constructor(
    public viwerService: ViwerService,
    private epubPlayerService: EpubPlayerService,
    public errorService: ErrorService,
    public utilService: UtilService,
    private renderer2: Renderer2
  ) {
    this.playerEvent = this.viwerService.playerEvent;
  }

  @HostListener('document:TelemetryEvent', ['$event'])
  onTelemetryEvent(event) {
    this.telemetryEvent.emit(event.detail);
  }

  async ngOnInit() {
    // initializing services
    this.viwerService.initialize(this.playerConfig);
    this.epubPlayerService.initialize(this.playerConfig);

    // check content specific error
    if (!await this.viwerService.isValidEpubSrc(this.viwerService.src)) {
      this.showContentError = true;
      this.viwerService.raiseExceptionLog(errorCode.contentLoadFails, this.currentPageIndex, errorMessage.contentLoadFails, this.traceId, new Error(errorMessage.contentLoadFails));
    };

    // checks online error while loading epub
    if(!navigator.onLine && !this.viwerService.isAvailableLocally){
      this.viwerService.raiseExceptionLog(errorCode.internetConnectivity, this.currentPageIndex , errorMessage.internetConnectivity, this.traceId , new Error(errorMessage.internetConnectivity));
    }

    // checks content compatibility error
    const contentCompabilityLevel = this.playerConfig.metadata['compatibilityLevel'];
    if (contentCompabilityLevel) {
      const checkContentCompatible = this.errorService.checkContentCompatibility(contentCompabilityLevel);
      if (!checkContentCompatible['isCompitable']) {
        this.viwerService.raiseExceptionLog(errorCode.contentCompatibility, this.currentPageIndex , errorCode.contentCompatibility , this.traceId ,  checkContentCompatible['error'])
      }
    }

    this.traceId = this.playerConfig.config['traceId'];
    this.showEpubViewer = true;
    this.sideMenuConfig = { ...this.sideMenuConfig, ...this.playerConfig.config.sideMenu };
    this.getEpubLoadingProgress();
    
  }

  ngAfterViewInit() {
    const epubPlayerElement = this.epubPlayerRef.nativeElement;
    this.unlistenMouseEnter = this.renderer2.listen(epubPlayerElement, 'mouseenter', () => {
      this.showControls = true;
    });

    this.unlistenMouseLeave = this.renderer2.listen(epubPlayerElement, 'mouseleave', () => {
      this.showControls = false;
    });
  }

  headerActions(event) {
    this.headerActionsEvent.emit(event.type);
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
    clearInterval(this.intervalRef);
    this.viewState = this.fromConst.START;
    this.viwerService.raiseStartEvent(event.data);
  }

  onPageChange(event) {
    this.currentPageIndex = this.utilService.getCurrentIndex(event, this.currentPageIndex);
    this.viwerService.raiseHeartBeatEvent(event, telemetryType.INTERACT);
    this.viwerService.raiseHeartBeatEvent(event, telemetryType.IMPRESSION);
  }

  onEpubEnded(event) {
    this.viewState = this.fromConst.END;
    this.showEpubViewer = false;
    event.data.index = this.currentPageIndex;
    this.viwerService.raiseEndEvent(event);
  }

  onEpubLoadFailed(error) {
    this.viewState = this.fromConst.LOADING
    this.viwerService.raiseExceptionLog(errorCode.contentLoadFails,this.currentPageIndex ,  errorMessage.contentLoadFails,this.traceId, error);
  }

  replayContent(event) {
    this.currentPageIndex = 1;
    this.viwerService.raiseHeartBeatEvent(event, telemetryType.INTERACT);
    this.viewState = this.fromConst.START;
    this.ngOnInit();
  }

  exitContent(event) {
    this.viwerService.raiseHeartBeatEvent(event, telemetryType.INTERACT);
  }

  sideBarEvents(event) {
    this.viwerService.raiseHeartBeatEvent(event, telemetryType.INTERACT);
    if (event === 'DOWNLOAD') {
      this.downloadEpub();
    }
  }

  sidebarMenuEvent(event) {
    this.viwerService.raiseHeartBeatEvent(event, telemetryType.INTERACT);
  }

  getEpubLoadingProgress() {
    this.intervalRef = setInterval(() => {
      if (this.progress < 95) {
        this.progress = this.progress + 5;
      }
    }, 10);
  }

  downloadEpub() {
    const a = document.createElement('a');
    a.href = this.viwerService.artifactUrl;
    a.download = this.viwerService.contentName;
    a.target = '_blank';
    document.body.appendChild(a);
    a.click();
    a.remove();
    this.viwerService.raiseHeartBeatEvent('DOWNLOAD');
  }

  @HostListener('window:beforeunload')
  ngOnDestroy() {
    const EndEvent = {
      type: this.fromConst.END,
      data: {
        index: this.currentPageIndex
      }
    }
    this.viwerService.raiseEndEvent(EndEvent);
    this.unlistenMouseEnter();
    this.unlistenMouseLeave();
  }
}
