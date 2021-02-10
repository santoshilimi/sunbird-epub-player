import { AfterViewInit, ViewChild, Component, ElementRef, Input, EventEmitter, Output, OnInit, OnDestroy } from '@angular/core';
import Epub from 'epubjs';
import { epubPlayerConstants as fromConst } from '../sunbird-epub.constant';
@Component({
  selector: 'epub-viewer',
  templateUrl: './epub-viewer.component.html',
  styleUrls: ['./epub-viewer.component.css']
})
export class EpubViewerComponent implements OnInit, AfterViewInit, OnDestroy {
  eBook: any;
  rendition: any;
  lastIndex: any;
  @ViewChild('epubViewer', { static: true }) epubViewer: ElementRef;
  @Input() epubSrc: string;
  @Input() identifier: string;
  @Input() actions = new EventEmitter<any>();
  @Output() viewerEvent = new EventEmitter<any>();
  idForRendition: any;
  ngOnInit() {
    this.idForRendition = `${this.identifier}-content`;
  }
  async ngAfterViewInit() {
    try {
      this.eBook = Epub(this.epubSrc);
      this.rendition = this.eBook.renderTo(this.idForRendition, {
        method: "continuous", flow: "scrolled-continuous", width: "100%", height: "100%"
      });
      await this.rendition.display();
      const spine = await this.eBook.loaded.spine;
      this.lastIndex = spine.items[spine.items.length - 1].index;
      this.viewerEvent.emit({
        type: fromConst.EPUBLOADED,
        data: spine
      });
      this.actions.subscribe((type) => {
        const data = this.rendition.location.start;
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