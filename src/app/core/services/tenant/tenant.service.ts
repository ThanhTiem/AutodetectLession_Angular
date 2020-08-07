import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {CommonService} from '../common';
import {Tenant} from '../../../shared/models/tenant.model';
import {environment} from '../../../../environments/environment';
import {Constant} from '../../Constant';

@Injectable({
  providedIn: 'root'
})
export class TenantService {
  backEndApiURL = environment.backEndApiURL;

  constructor(private http: HttpClient) {
  }

  addTenant(d: Tenant) {
    const options = CommonService.getOption();
    return this.http.post(this.backEndApiURL.concat(Constant.CREATE_TENANT), d, options);
  }

  getTenant(id: string) {
    const options = CommonService.getOption();
    return this.http.get(this.backEndApiURL.concat(Constant.GET_TENANT, id));
  }

  getAllTenant() {
    const options = CommonService.getOption();
    return this.http.get(this.backEndApiURL.concat(Constant.GET_TENANT_ALL));
  }

  getAllTenantPagin(index: number, limit: number) {
    const params = {index: index.toString(), limit: limit.toString()};
    return this.http.get(this.backEndApiURL.concat(Constant.GET_TENANT_PAGINATION), {params});
  }

  updateTenant(d: Tenant) {
    const options = CommonService.getOption();
    return this.http.put(this.backEndApiURL.concat(Constant.EDIT_TENANT), d, options);
  }

  getServerManagerAvailable() {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });
    return this.http.get(this.backEndApiURL.concat(Constant.GET_LIST_SWARM) + 'storage', {headers});
  }

  deleteTenant(id: string) {
    const options = CommonService.getOption();
    return this.http.delete(`${this.backEndApiURL}${Constant.DELETE_TENANT}${id}`, options);
  }

  getAllTenantOfCluster(clusterId: string) {
    return this.http.get(`${this.backEndApiURL}${Constant.GET_TENANT_CLUSTER}`, {params: {clusterId: clusterId}});
  }

  getTenantRecent(count: number) {
    const header = new HttpHeaders({
      'Content-Type': 'application/json'
    });
    const params = {count: count.toString()};
    return this.http.get(this.backEndApiURL.concat(Constant.TENANTRECENT), {headers: header, params});
  }

  getAllTenantRequest() {
    const header = new HttpHeaders({
      'Content-Type': 'application/json'
    });
    return this.http.get(this.backEndApiURL.concat(Constant.GET_TENANT_REQUEST), {headers: header});
  }

  gettenantstoragetop(count: number) {
    const header = new HttpHeaders({
      'Content-Type': 'application/json'
    });
    const params = {count: count.toString()};
    return this.http.get(this.backEndApiURL.concat(Constant.TENANTSTORAGETOP), {headers: header, params});
  }

  getclusterstoragetop(count: number) {
    const header = new HttpHeaders({
      'Content-Type': 'application/json'
    });
    const params = {count: count.toString()};
    return this.http.get(this.backEndApiURL.concat(Constant.CLUSTERSTORAGETOP), {headers: header, params});
  }
}
