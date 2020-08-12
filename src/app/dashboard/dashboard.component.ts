import {Component, OnInit} from '@angular/core';
import {ViewEncapsulation} from '@angular/core';
import * as Highcharts from 'highcharts';
import {ApiResultModel} from '../shared/models/apiresult.model';
import {ClusterDashboard, ClusterModel, StatusEnum, TypeClusterEnum} from '../shared/models/clusterModel';
import {ClusterService} from '../core/services/Swarm/cluster.service';
import {CommonService} from '../core/services/common';
// import {RegisterEnum, Tenant, TenantDetail} from '../shared/models/tenant.model';
// import {TenantService} from '../core/services/tenant/tenant.service';
import {Router} from '@angular/router';
import {ModalDismissReasons, NgbModal, NgbModalRef} from '@ng-bootstrap/ng-bootstrap';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {ToastrService} from 'ngx-toastr';
import {Subscription} from 'rxjs';
import {ngxLoadingAnimationTypes} from 'ngx-loading';
import {PrometheusStorageModel} from '../shared/models/prometheusStorage.model';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['../app.component.scss', './dashboard.component.scss'],
  encapsulation: ViewEncapsulation.Emulated
})
export class DashboardComponent  {
  highcharts: typeof Highcharts;
  storageOptions: any;
  storageBarOptions: any;
  clusterOptions: any;
  pieOptions: any;
  dashBoard: ClusterDashboard = new ClusterDashboard();
  // tenantRecent: Tenant[];
  // tenantstoragetop: Tenant[];
  clusterstoragetop: ClusterModel[];
  totalRequest = 0;
  currentPageRequest = 1;
  itemsPerPage = 5;
  // listTenantRequest: Tenant[];
  modalReference: NgbModalRef;
  closeResult = '';
  // currentRequest: Tenant;
  public loading = false;
  AcceptFormGroup: FormGroup;
  subscription: Subscription;
  listCluster: ClusterModel[];
  public ngxLoadingAnimationTypes = ngxLoadingAnimationTypes;
  public primaryColour = '#ffffff';
  totalStorage: PrometheusStorageModel;

  constructor(private clusterService: ClusterService, public common: CommonService, private toastr: ToastrService,
              public routerService: Router, private modalService: NgbModal) {
  }

  // ngOnInit() {
  //   this.currentRequest = new Tenant();
  //   this.AcceptFormGroup = new FormGroup({
  //     clusterId: new FormControl(this.currentRequest.ClusterId, Validators.required)
  //   });
  //   this.highcharts = Highcharts;
  //   this.storageOptions = {
  //     chart: {
  //       plotBackgroundColor: null,
  //       plotBorderWidth: null,
  //       plotShadow: false,
  //       type: 'pie'
  //     },
  //     credits: {
  //       enabled: false
  //     },
  //     title: {
  //       text: ''
  //     },
  //     accessibility: {
  //       point: {
  //         valueSuffix: '%'
  //       }
  //     },
  //     tooltip: {
  //       pointFormat: '{series.name}: <b>{point.y} GB</b>; <b>{point.percentage:.1f}%</b>'
  //     },
  //     series: [{
  //       name: 'Space',
  //       colorByPoint: true,
  //       data: [{
  //         name: 'Used space',
  //         color: 'rgb(38, 160, 218)',
  //         y: 100,
  //         sliced: true,
  //         selected: true
  //       }, {
  //         name: 'Free space',
  //         color: 'rgb(172, 172, 172)',
  //         y: 200
  //       }]
  //     }]
  //   };

  //   this.pieOptions = {
  //     chart: {
  //       plotBackgroundColor: null,
  //       plotBorderWidth: 0,
  //       plotShadow: false
  //     },
  //     credits: {
  //       enabled: false
  //     },
  //     title: {
  //       text: '<span style="font-size: 3rem;">21</span><br>request(s)',
  //       align: 'center',
  //       verticalAlign: 'middle',
  //       y: 50
  //     },

  //     accessibility: {
  //       point: {
  //         valueSuffix: '%'
  //       }
  //     },
  //     plotOptions: {
  //       pie: {
  //         colors: [
  //           '#ED561B',
  //           '#DDDF00',
  //           '#24CBE5',
  //           '#64E572',
  //           '#FF9655',
  //           '#FFF263',
  //           '#6AF9C4'
  //         ],
  //         dataLabels: {
  //           enabled: false,
  //           distance: 0,
  //           style: {
  //             fontWeight: 'bold',
  //             color: 'white'
  //           }
  //         },
  //         startAngle: -90,
  //         endAngle: 270,
  //         center: ['50%', '50%'],
  //         size: '100%'
  //       }
  //     },
  //     series: [{
  //       type: 'pie',
  //       name: '',
  //       innerSize: '80%',
  //       color: 'orange',
  //       data: [21]
  //     }]
  //   };

  //   this.getDashboard();
  //   this.getTenantRecent();
  //   this.getListTenantRequest();
  //   this.gettenantstoragetop();
  //   this.getclusterstoragetop();
  //   this.getAllSwarm();
  //   this.gettotalstorage();

  //   this.storageBarOptions = {
  //     chart: {
  //       type: 'bar'
  //     },
  //     credits: {
  //       enabled: false
  //     },
  //     title: {
  //       text: ''
  //     },
  //     xAxis: {
  //       categories: ['Storage']
  //     },
  //     yAxis: {
  //       min: 0,
  //       title: {
  //         text: 'Total storage (GB)'
  //       }
  //     },
  //     legend: {
  //       reversed: true
  //     },
  //     tooltip: {
  //       headerFormat: '<span style="font-size:11px">{series.name}</span><br>',
  //       pointFormat: '<span style="color:{point.color}"></span> <b>{point.y} GB</b>'
  //     },
  //     plotOptions: {
  //       series: {
  //         stacking: 'normal'
  //       }
  //     },
  //     series: [{
  //       name: 'Used space',
  //       color: 'rgb(38, 160, 218)',
  //       data: [350]
  //     },
  //       {
  //         name: 'Free space',
  //         color: 'rgb(172, 172, 172)',
  //         data: [650]
  //       }
  //     ]
  //   };

  //   this.clusterOptions = {
  //     chart: {
  //       type: 'bar'
  //     },
  //     credits: {
  //       enabled: false
  //     },
  //     title: {
  //       text: 'Cluster deployed'
  //     },
  //     xAxis: {
  //       categories: ['Cluster']
  //     },
  //     yAxis: {
  //       min: 0,
  //       title: {
  //         text: 'Total cluster'
  //       }
  //     },
  //     legend: {
  //       reversed: true
  //     },
  //     plotOptions: {
  //       series: {
  //         stacking: 'normal'
  //       }
  //     },
  //     series: [{
  //       name: 'Not Deploy',
  //       color: 'cyan',
  //       data: [3]
  //     },
  //       {
  //         name: 'Deployed',
  //         color: 'blue',
  //         data: [9]
  //       }
  //     ]
  //   };
  // }

  get clusterId() {
    return this.AcceptFormGroup.get('clusterId');
  }

  
}
