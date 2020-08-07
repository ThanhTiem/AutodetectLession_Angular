import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {ClusterModel, RoleEnum, StatusEnum, TypeClusterEnum} from '../../shared/models/clusterModel';
import {Node, TurningEnum} from '../../shared/models/resource.model';
import {ClusterService} from '../../core/services/Swarm/cluster.service';
import {Guid} from 'guid-typescript';
import {ToastrService} from 'ngx-toastr';
import {ActivatedRoute, Router} from '@angular/router';
import {ApiResultModel} from '../../shared/models/apiresult.model';
import {ngxLoadingAnimationTypes} from 'ngx-loading';
import {Tenant} from '../../shared/models/tenant.model';
import {TenantService} from '../../core/services/tenant/tenant.service';
import {NgForm} from '@angular/forms';
import {ServicetypeModel} from '../../shared/models/servicetype.model';
import {ServicetypeService} from '../../core/services/servicetype/servicetype.service';
@Component({
  selector: 'app-cluster-io',
  templateUrl: './cluster-io.component.html',
  styleUrls: ['./cluster-io.component.scss']
})
export class ClusterIoComponent implements OnInit {
  title = 'Create Cluster';
  editSwarm: ClusterModel;
  clusterId: string;
  editNode: Node;
  roleEnum = RoleEnum;
  statusEnum = StatusEnum;
  //typeClusterEnum = TypeClusterEnum;
  typeClusterEnum:string;
  listTypeCluster: any;
  turningstatus = TurningEnum;
  editMode = false;
  btnNodeContent = 'Add';
  btnSaveContent = 'Save';
  public ngxLoadingAnimationTypes = ngxLoadingAnimationTypes;
  public loading = false;
  listService: Tenant[];
  listServiceType :  ServicetypeModel[];
  public showEditNode = false;
  turning: boolean;
  @ViewChild('nameField') name: ElementRef;
  @ViewChild('formNode') formNode: NgForm;

  constructor(private swarmService: ClusterService, private toast: ToastrService,
              public routerService: Router, public activatedRoute: ActivatedRoute, private tenantService: TenantService,private serviceType: ServicetypeService) {
  }

  ngOnInit(): void {
    this.activatedRoute.queryParams.subscribe(data => {
      this.clusterId = data.id;
    });
    this.editSwarm = new ClusterModel();
    this.editSwarm.Nodes = [];
    this.editSwarm.Status = StatusEnum.Inactive;
    //this.editSwarm.Type = TypeClusterEnum.Storage;
    this.editSwarm.Type = "storage";
    if (this.clusterId) {
      this.btnSaveContent = 'Save';
      this.title = 'Edit Cluster';
      this.editMode = true;
      this.getSwarm(this.clusterId);
      this.getAllTenantOfCluster(this.clusterId);
    } else {
      this.btnSaveContent = 'Save';
      this.title = 'Create Cluster';
      this.editMode = false;
    }
    this.editNode = new Node();
    this.editNode.Role = RoleEnum.Manager;
    this.editNode.Status = StatusEnum.Active;
    this.editNode.TurningStatus = TurningEnum.Turning;
    //this.getListTypeCluster();
    this.getAllServiceType();
  }

  getSwarm(clusterId: string) {
    try {
      this.swarmService.getSwarm(clusterId).subscribe(data => {
        this.editSwarm = JSON.parse((data as ApiResultModel<string>).data) as ClusterModel;
        // console.log(this.editSwarm);
      });
    } catch (error) {
      throw new Error(error);
    }
  }

  getAllTenantOfCluster(clusterId: string) {
    try {
      this.tenantService.getAllTenantOfCluster(clusterId).subscribe(data => {
        this.listService = JSON.parse((data as ApiResultModel<string>).data) as Tenant[];
      });
    } catch (error) {
      throw new Error(error);
    }
  }

  addSwarm() {
    this.loading = true;
    // console.log(this.turning);
    if (this.editMode) {
      try {
        this.editSwarm.Status = Number(this.editSwarm.Status);
        //this.editSwarm.Type = Number(this.editSwarm.Type);
        this.editSwarm.Type = this.editSwarm.Type;
        this.editSwarm.TurningOption = this.turning ? 1 : 2;
        this.editSwarm.Name = this.editSwarm.Name.trim();
        console.log(this.editSwarm);
        this.swarmService.updateCluster(this.editSwarm).subscribe(data => {
            this.toast.success('Edit cluster successful.', 'Successful');
            // this.editSwarm = new ClusterModel();
            // this.editSwarm.Nodes = [];
            //this.routerService.navigate(['cluster/detail/'+this.editSwarm.Id]);
            this.routerService.navigate(['cluster/detail'], {queryParams: {id: this.editSwarm.Id}});
            this.loading = false;
          }, error => {
            this.loading = false;
            this.toast.error('Add cluster error. ' + error.error.lastResult.errors[0], 'Error');
          },
          () => {
            this.loading = false;
            console.log('done');
          }
        );
      } catch (error) {
        this.loading = false;
        throw new Error(error);
      }
    } else {
      try {
        this.editSwarm.Id = Guid.create().toString();
        this.editSwarm.Status = Number(this.editSwarm.Status);
        this.editSwarm.Name = this.editSwarm.Name.trim();
        //this.editSwarm.Type = Number(this.editSwarm.Type);
        this.editSwarm.Type = this.editSwarm.Type;
        this.editSwarm.TurningOption = this.turning ? 1 : 2;
        console.log(this.editSwarm);
        this.swarmService.addSwarm(this.editSwarm).subscribe(data => {
            this.editSwarm = new ClusterModel();
            this.editSwarm.Nodes = [];
            this.loading = false;
            this.toast.success('Add cluster successful.', 'Successful');
            this.routerService.navigate(['cluster']);
          }, error => {
            this.loading = false;
            this.toast.error('Add cluster error. ' + error.error.lastResult.errors[0], 'Error');
          },
          () => console.log('done')
        );
      } catch (error) {
        this.loading = false;
        throw new Error(error);
      }
    }
  }

  addNode(form) {
    if (this.editNode.HostName && this.editNode.Storage
      && this.editNode.IpAddress && this.editNode.Ram &&
      this.editNode.Cpu && this.editNode.Role && this.editNode.UserName && this.editNode.Status) {
      if (this.editNode.Id) {
        this.editNode.Status = Number(this.editNode.Status);
        this.editNode.Role = Number(this.editNode.Role);
        this.editNode.TurningStatus = Number(this.editNode.TurningStatus);
        const updateNode = this.editSwarm.Nodes.find(x => x.Id === this.editNode.Id);
        const index = this.editSwarm.Nodes.indexOf(updateNode);
        this.editSwarm.Nodes[index] = this.editNode;
      } else {
        if (this.editMode && this.listService.length > 0) {
          alert('This cluster has serives, can not add node');
        } else {
          this.editNode.Id = Guid.create().toString();
          this.editNode.UserName = this.editNode.UserName.trim();
          this.editNode.Status = Number(this.editNode.Status);
          this.editNode.Role = Number(this.editNode.Role);
          this.editNode.TurningStatus = Number(this.editNode.TurningStatus);
          this.editSwarm.Nodes.push(this.editNode);
        }
      }
    }
    this.editNode = new Node();
    this.btnNodeContent = 'Add';
    this.showEditNode = false;
    this.ResetForm(form);
  }

  showEdit() {
    this.showEditNode = true;
    const temp = {
      UserName: '',
      HostName: '',
      Password: null,
      IpAddress: null,
      Cpu: null,
      Ram: null,
      Storage: null,
      TurningStatus: TurningEnum.Turning,
      Role: RoleEnum.Manager,
      Status: StatusEnum.Active
    } as Node;
    if (this.editSwarm.Nodes?.length > 0) {
      const lastNode = this.editSwarm.Nodes[this.editSwarm.Nodes.length - 1];
      temp.UserName = lastNode.UserName;
      temp.Password = lastNode.Password;
      temp.Storage = lastNode.Storage;
      const hostIP = lastNode.IpAddress.split('.')[lastNode.IpAddress.split('.').length - 1];
      const netIP = lastNode.IpAddress.split('.').slice(0, lastNode.IpAddress.split('.').length - 1);
      netIP.push((Number(hostIP) + 1).toString());
      temp.IpAddress = netIP.join('.');
      temp.HostName = lastNode.HostName + '-' + (this.editSwarm.Nodes.length + 1);
      temp.Cpu = lastNode.Cpu;
      temp.Ram = lastNode.Ram;
      temp.TurningStatus = lastNode.TurningStatus;
      temp.Status = lastNode.Status;
      temp.Role = RoleEnum.Worker;
    }
    this.btnNodeContent = 'Add';
    this.editNode = temp;
    console.log(this.editNode);
  }


  remove(index: number) {
    if (this.editSwarm.Nodes[index].Id === this.editNode.Id) {
      this.editNode = new Node();
      this.btnNodeContent = 'Add';
    }
    this.editSwarm.Nodes.splice(index, 1);
  }

  edit(index: number) {
    this.btnNodeContent = 'Update';
    this.showEditNode = true;
    this.editNode = JSON.parse(JSON.stringify(this.editSwarm.Nodes[index]));
    // console.log(this.editNode);
    this.name.nativeElement.focus();
  }

  ResetForm(form) {
    const temp = {
      UserName: '',
      HostName: '',
      Password: null,
      IpAddress: null,
      Cpu: null,
      Ram: null,
      Storage: null,
      TurningStatus: TurningEnum.Turning,
      Role: RoleEnum.Worker,
      Status: StatusEnum.Active
    } as Node;
    form.resetForm();
    this.btnNodeContent = 'Add';
    this.formNode.setValue(temp);
  }

  Close(form) {
    form.resetForm();
    this.editNode = new Node();
    this.btnNodeContent = 'Add';
    this.showEditNode = false;
    this.editNode.TurningStatus = TurningEnum.Turning;
    this.editNode.Role = RoleEnum.Worker;
    this.editNode.Status = StatusEnum.Active;
  }

  parent() {
    if (this.editMode) {
      this.routerService.navigate(['cluster/detail'], {queryParams: {id: this.clusterId}});
    } else {
      this.routerService.navigate(['cluster'], {queryParams: {}});
    }
  }

  refresh(): void {
    window.location.reload();
  }

  getListTypeCluster() {
    this.listTypeCluster = {
      Storage: 'storage',
      Cache: 'cache',
      App: 'app'
    };
  }
  getAllServiceType() {
    this.serviceType.getAllServiceType().subscribe(data => {
      const temp = JSON.parse((data as ApiResultModel<string>).data) as ServicetypeModel[];
      if (temp?.length > 0) {
        this.listServiceType = temp;
      }
       console.log(this.listServiceType);
    }, error => {
      console.log(error);
    });
  }
}
