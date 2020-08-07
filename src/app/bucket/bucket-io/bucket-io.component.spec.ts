import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BucketIoComponent } from './bucket-io.component';

describe('BucketIoComponent', () => {
  let component: BucketIoComponent;
  let fixture: ComponentFixture<BucketIoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BucketIoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BucketIoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
