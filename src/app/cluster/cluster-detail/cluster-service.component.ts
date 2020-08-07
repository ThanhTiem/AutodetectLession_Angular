import {Component, OnInit} from '@angular/core';
import {ApiResultModel} from '../../shared/models/apiresult.model';
import {ClusterModel, StatusEnum} from '../../shared/models/clusterModel';
import {ClusterService} from '../../core/services/Swarm/cluster.service';
import {ActivatedRoute, Router} from '@angular/router';
import {CommonService} from '../../core/services/common';
import {TenantService} from '../../core/services/tenant/tenant.service';
import {StatusTenantEnum, Tenant} from '../../shared/models/tenant.model';
import {ServiceStatus} from '../../shared/models/tenant.model';
import {ModalDismissReasons, NgbModal, NgbModalRef} from '@ng-bootstrap/ng-bootstrap';
import {isInteractiveElement} from 'codelyzer/util/isInteractiveElement';

@Component({
  selector: 'app-cluster-service',
  templateUrl: './cluster-service.component.html',
  styleUrls: ['./cluster-service.component.scss']
})
export class ClusterServiceComponent implements OnInit {
  listService: Tenant[];
  page = 1;
  itemsPerPage = 10;
  cluster: ClusterModel;
  clusterId: string;
  showPass = false;
  hostName: string;
  totalCPU: number;
  totalRAM: number;
  totalStorage: number;
  totalService = 0;
  totalServiceActive = 0;
  totalServiceInActive = 0;
  modalReference: NgbModalRef;
  closeResult = '';
  searchString = '';
  totalItems = 0;
  currentPage = 1;
  constructor(private swarmService: ClusterService, public activatedRoute: ActivatedRoute, private tenantService: TenantService,
              public common: CommonService, private routerService: Router, private modalService: NgbModal) {
  }

  ngOnInit(): void {
    this.listService = [];
    this.activatedRoute.queryParams.subscribe(data => {
      this.clusterId = data.id;
    });
    if (this.clusterId) {
      this.getSwarm(this.clusterId);
      this.getAllTenantOfCluster((this.clusterId));
    }
  }

  getSwarm(clusterId: string) {
    try {
      this.swarmService.getSwarm(clusterId).subscribe(data => {
        this.cluster = JSON.parse((data as ApiResultModel<string>).data) as ClusterModel;
        this.totalInfoCluster(this.cluster);
      });
    } catch (error) {
      throw new Error(error);
    }
  }

  togglePass(host: string) {
    this.hostName = host;
    this.showPass = !this.showPass;
  }

  totalInfoCluster(cluster: ClusterModel) {
    this.totalCPU = 0;
    this.totalRAM = 0;
    this.totalStorage = 0;
    if (cluster) {
      if (cluster.Nodes) {
        cluster.Nodes.forEach(node => {
          this.totalCPU += node.Cpu;
          this.totalRAM += node.Ram;
          this.totalStorage += node.Storage;
        });
      }
    }
  }

  getTotalService() {
    this.totalService = this.listService.length;
    /*
    this.totalServiceActive = this.listService.filter(x => x.Status === StatusTenantEnum.Active).length;
    this.totalServiceInActive = this.listService.filter(x => x.Status === StatusTenantEnum.Inactive).length;
    */
   this.totalServiceActive = this.listService.filter(x => x.ServiceStatus === ServiceStatus.Ready).length;
   this.totalServiceInActive = this.listService.filter(x => x.ServiceStatus === ServiceStatus.Unready).length;
  }

  getAllTenantOfCluster(clusterId: string) {
    try {
      this.tenantService.getAllTenantOfCluster(clusterId).subscribe(data => {
        // console.log(data);
        this.listService = JSON.parse((data as ApiResultModel<string>).data) as Tenant[];
        this.totalItems = this.listService.length;
        this.getTotalService();
      });
    } catch (error) {
      throw new Error(error);
    }
  }

  EditCluster(clusterId: string) {
    this.routerService.navigate(['cluster/clusterio'], {queryParams: {id: clusterId}});
  }

  open(content, clusterId: string) {
    this.modalReference = this.modalService.open(content);
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

  removeCluster(content, clusterId: string) {
    // console.log(clusterId);
    try {
      this.swarmService.deleteCluster(clusterId).subscribe(data => {
        this.modalReference.close();
        this.routerService.navigate(['cluster'], {queryParams: {}});
      });
    } catch (error) {
      throw new Error(error);
    }
  }

  pageChange(newPage: number) {
    this.currentPage = newPage;
  }

  getTenantDetail(id: string) {
    this.routerService.navigate(['storage/detail'], {queryParams: {id: id}});
  }

  CreateService() {
    this.routerService.navigate(['storage/create'], {queryParams: {}});
  }

  parent() {
    this.routerService.navigate(['cluster'], {queryParams: {}});
  }

  refresh(): void {
    window.location.reload();
  }
}
