import {Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {ServicetypeService} from '../core/services/servicetype/servicetype.service';
import {ApiResultModel} from '../shared/models/apiresult.model';
import {TenantDetail} from '../shared/models/tenant.model';
import {ServicetypeModel} from '../shared/models/servicetype.model';

@Component({
  selector: 'app-service-list',
  templateUrl: './service-list.component.html',
  styleUrls: ['./service-list.component.scss']
})
export class ServiceListComponent implements OnInit {
  listService :  ServicetypeModel[];
  searchString: string;

  constructor(public routerService: Router, private serviceType: ServicetypeService) {
  }

  ngOnInit(): void {
    this.getAllServiceType();
  }

  CreateService(id: string) {
    console.log(id);
    switch (id) {
      case '1':
        this.routerService.navigate(['storage/create'], {queryParams: {}});
        break;
    }
  }

  getAllServiceType() {
    this.serviceType.getAllServiceType().subscribe(data => {
      const temp = JSON.parse((data as ApiResultModel<string>).data) as ServicetypeModel[];
      if (temp?.length > 0) {
        this.listService = temp;
      }
      // console.log(temp);
    }, error => {
      console.log(error);
    });
  }

  refresh(): void {
    window.location.reload();
  }

  close() {
    this.routerService.navigate(['dashboard'], {queryParams: {}});
  }
}
