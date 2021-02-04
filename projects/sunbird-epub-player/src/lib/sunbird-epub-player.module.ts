import { NgModule } from '@angular/core';
import { EpubPlayerComponent } from './sunbird-epub-player.component';
import { EpubViewerComponent } from './epub-viewer/epub-viewer.component';
import { SunbirdPlayerSdkModule  } from '@project-sunbird/sunbird-player-sdk';
import { CommonModule } from '@angular/common';




@NgModule({
  declarations: [EpubPlayerComponent, EpubViewerComponent],
  imports: [
    CommonModule,
    SunbirdPlayerSdkModule
  ],
  exports: [EpubPlayerComponent]
})
export class SunbirdEpubPlayerModule { }
