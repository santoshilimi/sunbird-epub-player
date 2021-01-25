import {  EventEmitter ,Component, Output, Input, OnInit } from '@angular/core';
import { PlayerConfig } from './sunbird-epub-player.interface';

@Component({
  selector: 'sunbird-epub-player',
  templateUrl: './sunbird-epub-player.component.html',
  styles: []
})
export class EpubPlayerComponent implements OnInit {
  @Input() playerConfig: PlayerConfig;
  epubSrc: String;
  @Output() headerActionsEvent : EventEmitter<any> = new EventEmitter<any>();

  constructor() { }

  ngOnInit() {
    this.epubSrc = this.playerConfig.metadata.streamingUrl;
  }

  headerActions(event){
    this.headerActionsEvent.emit(event.type);
  }
}
