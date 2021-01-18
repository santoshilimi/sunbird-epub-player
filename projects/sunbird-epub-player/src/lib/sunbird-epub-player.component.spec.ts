import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EpubPlayerComponent } from './sunbird-epub-player.component';

describe('EpubPlayerComponent', () => {
  let component: EpubPlayerComponent;
  let fixture: ComponentFixture<EpubPlayerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EpubPlayerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EpubPlayerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
