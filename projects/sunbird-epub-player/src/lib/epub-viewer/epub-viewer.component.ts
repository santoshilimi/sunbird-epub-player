import { AfterViewInit, ViewChild, Component, ElementRef, Input, EventEmitter, Output, OnInit } from '@angular/core';
import Epub from 'epubjs';
import { epubPlayerConstants as fromConst } from '../sunbird-epub.constant';


@Component({
  selector: 'epub-viewer',
  templateUrl: './epub-viewer.component.html',
  styleUrls: ['./epub-viewer.component.css']
})
export class EpubViewerComponent implements  OnInit , AfterViewInit {

  eBook: any;
  rendition: any;
  displayed: any;
  lastIndex: any;
  @ViewChild('epubViewer', { static: true }) epubViewer: ElementRef;
  @Input() epubSrc: string;
  @Input() identifier: string;
  @Input() actions = new EventEmitter<any>();
  @Output() viewerEvent = new EventEmitter<any>();
  idForRendition: any;

  ngOnInit(){
    this.idForRendition =  `${this.identifier}-content`;
  }

  ngAfterViewInit() {
    this.eBook = Epub(this.epubSrc);
    this.eBook.open(this.epubSrc).then(async (res) => {
      this.rendition = this.eBook.renderTo(this.idForRendition, {
        method: "continuous", flow: "scrolled-continuous", width: "100%", height: "100%"
      });
      this.rendition.display();
      this.displayed = this.rendition.display();
      this.viewerEvent.emit({
        type: fromConst.EPUBLOADED,
        data: await this.getEpubSpine()
      });
    })
      .catch((error) => {
        this.viewerEvent.emit({
          type: fromConst.ERROR,
          err: error === null ? fromConst.UNABLE_TO_FETCH_URL_ONLINE : error
        })
      })
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

  }

  async getEpubSpine() {
    return new Promise((resolve, reject) => {
      this.eBook.loaded.spine.then((res) => {
        this.lastIndex = res.items[res.items.length - 1].index;
        resolve(res);
      })
    })
  }

}
