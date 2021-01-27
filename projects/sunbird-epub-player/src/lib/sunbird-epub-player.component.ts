import { EventEmitter, Component, Output, Input, OnInit, HostListener } from '@angular/core';
import { ViwerService } from './services/viewerService/viwer-service';
import { PlayerConfig } from './sunbird-epub-player.interface';
import { EpubPlayerService } from './sunbird-epub-player.service';
import { epubPlayerConstants , telemetryType } from './sunbird-epub.constant';

@Component({
  selector: 'sunbird-epub-player',
  templateUrl: './sunbird-epub-player.component.html',
  styles: []
})
export class EpubPlayerComponent implements OnInit {
  fromConst =  epubPlayerConstants;
  @Input() playerConfig: PlayerConfig;
  @Output() headerActionsEvent: EventEmitter<any> = new EventEmitter<any>();
  @Output() telemetryEvent: EventEmitter<any> = new EventEmitter<any>();
  @Output() playerEvent: EventEmitter<object>;

  viewState = this.fromConst.LOADING;

  constructor(
    public viwerService: ViwerService,
    private epubPlayerService: EpubPlayerService
  ) {
    this.playerEvent = this.viwerService.playerEvent;
  }

  @HostListener('document:TelemetryEvent', ['$event'])
  onTelemetryEvent(event) {
    this.telemetryEvent.emit(event.detail);
  }

  ngOnInit() {
    this.epubPlayerService.initialize(this.playerConfig);
    this.viwerService.initialize(this.playerConfig);
    this.viewState = this.fromConst.START;
  }

  headerActions(event) {
    this.headerActionsEvent.emit(event.type);
  }

  viewerEvent(event) {
    switch (event.type) {
      case this.fromConst.EPUBLOADED:
        this.onEpubLoaded(event)
        break;
      case this.fromConst.PAGECHANGE:
        this.onPageChange(event);
        break;
      case this.fromConst.END:
        this.onEpubEnded(event);
    }
  }

  onEpubLoaded(event) {
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

  replayContent(event){
    this.viwerService.raiseHeartBeatEvent(event, telemetryType.INTERACT);
     this.ngOnInit();
  }

  sideBarEvents(event){
    this.viwerService.raiseHeartBeatEvent(event, telemetryType.INTERACT);
  }

  sidebarMenuEvent(event){
    this.viwerService.raiseHeartBeatEvent(event, telemetryType.INTERACT);
  }
}
