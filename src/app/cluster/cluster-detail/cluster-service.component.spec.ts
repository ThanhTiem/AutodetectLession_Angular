import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ClusterServiceComponent } from './cluster-service.component';

describe('ClusterServiceComponent', () => {
  let component: ClusterServiceComponent;
  let fixture: ComponentFixture<ClusterServiceComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ClusterServiceComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ClusterServiceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
