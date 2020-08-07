import {Component, OnInit} from '@angular/core';
import {ViewEncapsulation} from '@angular/core';
import * as Highcharts from 'highcharts';
import {ApiResultModel} from '../shared/models/apiresult.model';
import {ClusterDashboard, ClusterModel, StatusEnum, TypeClusterEnum} from '../shared/models/clusterModel';
import {ClusterService} from '../core/services/Swarm/cluster.service';
import {CommonService} from '../core/services/common';
import {RegisterEnum, Tenant, TenantDetail} from '../shared/models/tenant.model';
import {TenantService} from '../core/services/tenant/tenant.service';
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
  tenantRecent: Tenant[];
  tenantstoragetop: Tenant[];
  clusterstoragetop: ClusterModel[];
  totalRequest = 0;
  currentPageRequest = 1;
  itemsPerPage = 5;
  listTenantRequest: Tenant[];
  modalReference: NgbModalRef;
  closeResult = '';
  currentRequest: Tenant;
  public loading = false;
  AcceptFormGroup: FormGroup;
  subscription: Subscription;
  listCluster: ClusterModel[];
  public ngxLoadingAnimationTypes = ngxLoadingAnimationTypes;
  public primaryColour = '#ffffff';
  totalStorage: PrometheusStorageModel;

  constructor(private clusterService: ClusterService, public common: CommonService, private toastr: ToastrService,
              private tenantService: TenantService, public routerService: Router, private modalService: NgbModal) {
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

  open(content, tenantRequest: Tenant) {
    this.modalReference = this.modalService.open(content);
    this.currentRequest = tenantRequest;
    this.modalReference.result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
  }

  private getDismissReason(reason: any): string {
    if (reason === ModalDismissReasons.ESC) {
      return 'by pressing ESC';
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return 'by clicking on a backdrop';
    } else {
      return `with: ${reason}`;
    }
  }

  getDashboard() {
    try {
      this.clusterService.getDashboard().subscribe(data => {
        this.dashBoard = JSON.parse((data as ApiResultModel<string>).data) as ClusterDashboard;
      });
    } catch (error) {
      throw new Error(error);
    }
  }

  gettotalstorage() {
    try {
      this.clusterService.getTatalStorage().subscribe(data => {
        this.totalStorage = JSON.parse((data as ApiResultModel<string>).data) as PrometheusStorageModel;
        console.log(this.totalStorage);
        const used = +(this.totalStorage?.UsedStorage / 1073741824).toFixed(2);
        const free = +((this.totalStorage?.TotalStorage - this.totalStorage?.UsedStorage) / 1073741824).toFixed(2);
        console.log(used, free);
        this.storageOptions = {
          chart: {
            plotBackgroundColor: null,
            plotBorderWidth: null,
            plotShadow: false,
            type: 'pie'
          },
          credits: {
            enabled: false
          },
          title: {
            text: ''
          },
          accessibility: {
            point: {
              valueSuffix: '%'
            }
          },
          tooltip: {
            pointFormat: '{series.name}: <b>{point.y} GB</b>; <b>{point.percentage:.1f}%</b>'
          },
          series: [{
            name: 'Space',
            colorByPoint: true,
            data: [{
              name: 'Used space',
              color: 'rgb(38, 160, 218)',
              y: used,
              sliced: true,
              selected: true
            }, {
              name: 'Free space',
              color: 'rgb(172, 172, 172)',
              y: free
            }]
          }]
        };
      });
    } catch (error) {
      throw new Error(error);
    }
  }

  getTenantRecent() {
    this.tenantService.getTenantRecent(5).subscribe(data => {
      // console.log(data);
      this.tenantRecent = JSON.parse((data as ApiResultModel<string>).data) as Tenant[];
    }, error => {
      console.log(error);
    });
  }

  getTenantDetail(id: string) {
    this.routerService.navigate(['storage/detail'], {queryParams: {id: id}});
  }

  getClusterDetail(id: string) {
    this.routerService.navigate(['cluster/detail'], {queryParams: {id: id}});
  }

  getListTenantRequest() {
    try {
      this.tenantService.getAllTenantRequest().subscribe(data => {
        this.listTenantRequest = JSON.parse((data as ApiResultModel<string>).data) as Tenant[];
        this.totalRequest = this.listTenantRequest.length;
        this.pieOptions = {
          chart: {
            plotBackgroundColor: null,
            plotBorderWidth: 0,
            plotShadow: false
          },
          credits: {
            enabled: false
          },
          title: {
            text: '<span style="font-size: 3rem;">' + this.totalRequest + '</span><br>Request(s)',
            align: 'center',
            verticalAlign: 'middle',
            y: 50
          },

          accessibility: {
            point: {
              valueSuffix: '%'
            }
          },
          plotOptions: {
            pie: {
              colors: [
                '#ED561B',
                '#DDDF00',
                '#24CBE5',
                '#64E572',
                '#FF9655',
                '#FFF263',
                '#6AF9C4'
              ],
              dataLabels: {
                enabled: false,
                distance: 0,
                style: {
                  fontWeight: 'bold',
                  color: 'white'
                }
              },
              startAngle: -90,
              endAngle: 270,
              center: ['50%', '50%'],
              size: '100%'
            }
          },
          series: [{
            type: 'pie',
            name: '',
            innerSize: '80%',
            data: [['Requests', this.totalRequest]]
          }]
        };
      });
    } catch (error) {
      throw new Error(error);
    }
  }

  gettenantstoragetop() {
    try {
      this.tenantService.gettenantstoragetop(5).subscribe(data => {
        this.tenantstoragetop = JSON.parse((data as ApiResultModel<string>).data) as Tenant[];
        // console.log(this.tenantstoragetop);
      });
    } catch (error) {
      throw new Error(error);
    }
  }

  getclusterstoragetop() {
    try {
      this.tenantService.getclusterstoragetop(5).subscribe(data => {
        this.clusterstoragetop = JSON.parse((data as ApiResultModel<string>).data) as ClusterModel[];
         console.log(this.clusterstoragetop);
      });
    } catch (error) {
      throw new Error(error);
    }
  }

  pageChangeRequest(newPage: number) {
    this.currentPageRequest = newPage;
  }

  getAllSwarm() {
    try {
      this.clusterService.getAllSwarm().subscribe(data => {
        this.listCluster = JSON.parse((data as ApiResultModel<string>).data) as ClusterModel[];
        const choseCluster = {
          Id: null, Name: '--- Choose cluster ---',
          Status: StatusEnum.Active,
          //Type: TypeClusterEnum.Storage
          Type: "storage"
        } as ClusterModel;
        this.listCluster.splice(0, 0, choseCluster);
        //this.listCluster = this.listCluster.filter(item => item.Status === StatusEnum.Active && item.Type === TypeClusterEnum.Storage);
        this.listCluster = this.listCluster.filter(item => item.Status === StatusEnum.Active && item.Type === "storage");
      });
    } catch (error) {
      throw new Error(error);
    }
  }

  createService() {
    this.loading = true;
    const cluster = this.AcceptFormGroup.value;
    this.currentRequest.ClusterId = cluster.clusterId;
    this.currentRequest.Register = RegisterEnum.ReQuest;
    this.modalReference.close();
    this.subscription = this.tenantService.addTenant(this.currentRequest).subscribe(result => {
      this.loading = false;
      const apiResult = result as ApiResultModel<string>;
      // console.log(apiResult);
      if (apiResult.succeed) {
        const newTenant = JSON.parse((result as ApiResultModel<string>).data) as Tenant;
        this.toastr.success('Create service Successful', 'Successful');
        this.routerService.navigate(['storage/detail'], {queryParams: {id: newTenant.Id}});
      }
    }, err => {
      this.loading = false;
      const message = (err.error as ApiResultModel<string>);
      console.log(err);
      //this.toastr.error('Create service error!', 'Error');
      if (message?.errors?.length > 0) {
        if (message?.errors[0] === 'ServiceUserNameExits') {
          this.toastr.error('Service Name Exits!', 'Error');
        } else {
          this.toastr.error(message?.errors[0], 'Error');
        }
      }
    });
  }

  rejectRequest() {
    const index = this.listTenantRequest.indexOf(this.currentRequest);
    this.tenantService.deleteTenant(this.currentRequest.Id).subscribe(result => {
      const apiResult = result as ApiResultModel<string>;
      this.modalReference.close();
      if (apiResult.succeed) {
        if (index > -1) {
          this.listTenantRequest.splice(index, 1);
        }
        this.toastr.success('Reject request successfull!', 'Successful');
        this.getListTenantRequest();
      }
    }, error => {
      console.log(error);
      this.toastr.error('Reject request error!', 'Error');
    });
  }

  refresh(): void {
    window.location.reload();
  }
}
