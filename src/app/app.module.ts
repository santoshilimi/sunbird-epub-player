import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { SunbirdEpubPlayerModule } from 'sunbird-epub-player';
import { CommonModule } from '@angular/common';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    CommonModule,
    SunbirdEpubPlayerModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
