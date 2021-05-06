import { Injectable } from '@angular/core';
import { UtilService } from './services/utilService/util.service';
import { CsTelemetryModule } from '@project-sunbird/client-services/telemetry';
import { PlayerConfig } from './sunbird-epub-player.interface';


@Injectable({
  providedIn: 'root'
})
export class EpubPlayerService {

  private contentSessionId: string;
  private playSessionId: string;
  private telemetryObject: any;
  private context;
  public config;
  public channel: string;
  public pdata: string;
  public sid: string;
  public uid: string;
  public rollup: string;


  constructor(private utilService: UtilService) {
    this.contentSessionId = this.utilService.uniqueId();
  }

  public initialize({ context, config, metadata }: PlayerConfig) {
    this.context = context;
    this.config = config;
    this.playSessionId = this.utilService.uniqueId();
    this.channel =  this.context.channel;
    this.pdata = this.context.pdata;
    this.sid =  this.context.sid;
    this.uid = this.context.uid;
    this.rollup = this.context.rollup;

    if (!CsTelemetryModule.instance.isInitialised) {
      CsTelemetryModule.instance.init({});
      const telemetryConfig: any =  {
        config: {
          pdata: context.pdata,
          env: 'ContentPlayer',
          channel: context.channel,
          did: context.did,
          authtoken: context.authToken || '',
          uid: context.uid || '',
          sid: context.sid,
          batchsize: 20,
          mode: context.mode,
          host: context.host || '',
          endpoint: context.endpoint || '/data/v3/telemetry',
          tags: context.tags,
          cdata: [{ id: this.contentSessionId, type: 'ContentSession' },
          { id: this.playSessionId, type: 'PlaySession' }],
        },
        userOrgDetails: {}
      };
      if(context.dispatcher) {
        telemetryConfig.config.dispatcher = context.dispatcher
      }
      CsTelemetryModule.instance.telemetryService.initTelemetry(telemetryConfig);
    }

    this.telemetryObject = {
      id: metadata.identifier,
      type: 'Content',
      ver: metadata.pkgVersion + '' || '1.0',
      rollup: context.objectRollup || {}
    };
  }

  public start(duration) {
    CsTelemetryModule.instance.telemetryService.raiseStartTelemetry(
      {
        options: this.getEventOptions(),
        edata: { type: 'content', mode: 'play', pageid: '', duration: Number((duration / 1e3).toFixed(2)) }
      }
    );

  }

  public interact(id, currentPage) {
    CsTelemetryModule.instance.telemetryService.raiseInteractTelemetry({
      options: this.getEventOptions(),
      edata: { type: 'TOUCH', subtype: '', id, pageid: currentPage + '' }
    });
  }

  public impression(currentPage) {
    CsTelemetryModule.instance.telemetryService.raiseImpressionTelemetry({
      options: this.getEventOptions(),
      edata: { type: 'workflow', subtype: '', pageid: currentPage + '', uri: '' }
    });
  }

  public end(duration, percentage, curentPage, endpageseen) {
    const durationSec = Number((duration / 1e3).toFixed(2));
    CsTelemetryModule.instance.telemetryService.raiseEndTelemetry({
      edata: {
        type: 'content',
        mode: 'play',
        pageid: 'sunbird-player-Endpage',
        summary: [
          {
            progress: percentage
          },
          {
            totallength: (percentage ===100 ? curentPage: 1)
          },
          {
            visitedlength: curentPage
          },
          {
            visitedcontentend: (percentage === 100)
          },
          {
            totalseekedlength: 0
          },
          {
            endpageseen
          }
        ],
        duration: durationSec
      },
      options: this.getEventOptions()
    });

  }

  public error(error: Error, pageid , eData?: { err: string, errtype: string } ) {
    CsTelemetryModule.instance.telemetryService.raiseErrorTelemetry({
      edata: {
        err: error || 'LOAD',
        errtype: error || 'content',
        stacktrace: (error && error.toString()) || '',
        pageid : pageid || '',
        object: '',
        plugin: 'epubjs'
      }
    });
  }

  private getEventOptions() {
    return ({
      object: this.telemetryObject,
      context: {
        channel: this.channel,
        pdata: this.pdata,
        env: 'ContentPlayer',
        sid: this.sid,
        uid: this.uid,
        cdata: [{ id: this.contentSessionId, type: 'ContentSession' },
        { id: this.playSessionId, type: 'PlaySession' }],
        rollup: this.rollup || {}
      }
    });
  }
}
