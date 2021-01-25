import { NgModule } from '@angular/core';
import { EpubPlayerComponent } from './sunbird-epub-player.component';
import { EpubViewerComponent } from './epub-viewer/epub-viewer.component';
import { SunbirdPlayerSdkModule  } from '@project-sunbird/sunbird-player-sdk-v8';




@NgModule({
  declarations: [EpubPlayerComponent, EpubViewerComponent],
  imports: [
    SunbirdPlayerSdkModule
  ],
  exports: [EpubPlayerComponent]
})
export class SunbirdEpubPlayerModule { }
