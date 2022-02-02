import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EpubViewerComponent } from './epub-viewer.component';

describe('EpubViewerComponent', () => {
  let component: EpubViewerComponent;
  let fixture: ComponentFixture<EpubViewerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EpubViewerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EpubViewerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  xit('should create', () => {
    expect(component).toBeTruthy();
  });
});
