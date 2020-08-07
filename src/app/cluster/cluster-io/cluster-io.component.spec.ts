import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ClusterIoComponent } from './cluster-io.component';

describe('ClusterIoComponent', () => {
  let component: ClusterIoComponent;
  let fixture: ComponentFixture<ClusterIoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ClusterIoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ClusterIoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
