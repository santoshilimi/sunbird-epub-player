import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import  { SunbirdEpubPlayerModule } from 'sunbird-epub-player'

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    SunbirdEpubPlayerModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
