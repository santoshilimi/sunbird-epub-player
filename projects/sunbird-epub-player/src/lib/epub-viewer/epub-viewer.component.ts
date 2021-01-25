import { AfterViewInit, ViewChild, Component, ElementRef, Input, OnInit, EventEmitter } from '@angular/core';
import Epub from 'epubjs';


@Component({
  selector: 'epub-viewer',
  templateUrl: './epub-viewer.component.html',
  styleUrls: ['./epub-viewer.component.css']
})
export class EpubViewerComponent implements OnInit, AfterViewInit {

  eBook: any;
  rendition: any;
  displayed: any;
  @ViewChild('epubViewer', { static: true }) epubViewer: ElementRef;
  @Input() epubSrc: string;
  @Input() actions = new EventEmitter<any>();


  constructor() { }

  ngOnInit() {
  }

  ngAfterViewInit() {
    this.eBook = Epub(this.epubSrc);
    this.rendition = this.eBook.renderTo("area", {
      method: "continuous", flow: "scrolled-continuous", width: "100%", fullsize: true
    });
    this.rendition.display();
    this.displayed = this.rendition.display();

    this.actions.subscribe((type) => {
      if (type === 'NEXT') {
        this.rendition.next();
      }
      if (type === 'PREVIOUS') {
        this.rendition.prev();
      }
    })
  }

}
