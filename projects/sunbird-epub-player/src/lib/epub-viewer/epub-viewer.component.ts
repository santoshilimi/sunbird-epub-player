import { AfterViewInit, ViewChild, Component, ElementRef, Input, EventEmitter, Output, OnInit, OnDestroy } from '@angular/core';
import Epub from 'epubjs';
import { ViwerService } from '../services/viewerService/viwer-service';
import { epubPlayerConstants as fromConst } from '../sunbird-epub.constant';
@Component({
  selector: 'epub-viewer',
  templateUrl: './epub-viewer.component.html',
  styleUrls: ['./epub-viewer.component.css']
})
export class EpubViewerComponent implements OnInit, AfterViewInit, OnDestroy {
  eBook: any;
  rendition: any;
  lastSection: any;
  scrolled: boolean
  @ViewChild('epubViewer', { static: true }) epubViewer: ElementRef;
  @Input() epubSrc: string;
  @Input() identifier: string;
  @Input() actions = new EventEmitter<any>();
  @Output() viewerEvent = new EventEmitter<any>();
  idForRendition: any;
  epubBlob: Object;
  
  constructor(
    public viwerService: ViwerService
  ){}
  ngOnInit() {
    this.idForRendition = `${this.identifier}-content`;
  }
  async ngAfterViewInit() {
    try {
      if (!this.viwerService.isAvailableLocally) {
        this.epubBlob = await this.viwerService.isValidEpubSrc(this.epubSrc);
        this.eBook = Epub(this.epubBlob);
      } else if(this.viwerService.isAvailableLocally) {
        this.eBook = Epub(this.epubSrc);
      }
      this.rendition = this.eBook.renderTo(this.idForRendition, {
        flow: "paginated",
        width: this.epubViewer.nativeElement.offsetWidth,
        height: this.epubViewer.nativeElement.offsetHeight
      });
      this.rendition.display();
      this.rendition.on("layout", (layout) => {
        if (this.eBook.navigation.length > 2) {
          this.rendition.spread("none");
          this.rendition.flow("scrolled");
          this.scrolled = true
        } else {
          this.rendition.spread("auto");
          this.scrolled = false;
        }
      });

      this.rendition.on('displayError', (error) => {
        this.viewerEvent.emit({
          type: fromConst.ERROR,
          err: error || fromConst.UNABLE_TO_FETCH_URL_ONLINE
        })
      })

      const spine = await this.eBook.loaded.spine;

      this.lastSection = spine.last();
      if (!this.scrolled) {

      }
      this.viewerEvent.emit({
        type: fromConst.EPUBLOADED,
        data: spine
      });

      this.actions.subscribe((type) => {
        const data = this.rendition.location.start;
        if (this.scrolled && data.href === this.lastSection.href) {
          this.viewerEvent.emit({
            type: fromConst.END,
            data: {
              percentage: 100
            }
          })
        } else {
          if (this.rendition.location.atEnd || (spine.length === 1 && (this.rendition.location.end.displayed.page + 1 >= this.rendition.location.end.displayed.total))) {
            this.viewerEvent.emit({
              type: fromConst.END,
              data: {
                percentage: 100
              }
            })
          }
        }
        if (type === fromConst.NEXT) {
          this.rendition.next();
          this.viewerEvent.emit({
            type: fromConst.PAGECHANGE,
            data: data,
            interaction: fromConst.NEXT
          })
        }
        if (type === fromConst.PREVIOUS) {
          this.rendition.prev();
          this.viewerEvent.emit({
            type: fromConst.PAGECHANGE,
            data: data,
            interaction: fromConst.PREVIOUS
          })
        }
      })
    } catch (error) {
      this.viewerEvent.emit({
        type: fromConst.ERROR,
        err: error || fromConst.UNABLE_TO_FETCH_URL_ONLINE
      })
    }
  }

  ngOnDestroy() {
    this.eBook && this.eBook.destroy();
  }
}