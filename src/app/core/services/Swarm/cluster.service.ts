import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {CommonService} from '../common';
import {ClusterModel} from '../../../shared/models/clusterModel';
import {environment} from '../../../../environments/environment';
import {Constant} from '../../Constant';


@Injectable({
  providedIn: 'root'
})
export class ClusterService {
  backEndApiURL = environment.backEndApiURL;
  constructor(private http: HttpClient) { }

  addSwarm(data: ClusterModel) {
    const options = CommonService.getOption();
    return this.http.post(this.backEndApiURL.concat(Constant.CREATE_SWARM), data, options);
  }

  getAllSwarm() {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });
    return this.http.get(this.backEndApiURL.concat(Constant.GET_ALL_CLUSTER), {headers});
  }

  getAllStorage() {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });
    const params = {type: 'storage'};
    return this.http.get(this.backEndApiURL.concat(Constant.GET_LIST_SWARM) + 'storage', {headers});
  }

  getSwarm(swarmId: string) {
    return this.http.get(`${this.backEndApiURL}${Constant.GET_SWARM}${swarmId}`);
  }

  getDashboard() {
    const options = CommonService.getOption();
    return this.http.get(`${this.backEndApiURL}${Constant.GET_CLUSTER_DASHBOARD}`);
  }

  updateCluster(data: ClusterModel) {
    const options = CommonService.getOption();
    return this.http.put(this.backEndApiURL.concat(Constant.UPDATE_CLUSTER), data, options);
  }

  deleteCluster(clusterId: string) {
    const options = CommonService.getOption();
    return this.http.delete(`${this.backEndApiURL}${Constant.DELETE_CLUSTER}${clusterId}`, options);
  }

  getTatalStorage() {
    const header = new HttpHeaders({
      'Content-Type': 'application/json'
    });
    return this.http.get(this.backEndApiURL.concat(Constant.TOTALSTORAGE), {headers: header});
  }
  detectLesion1(body: any){
    const token = localStorage.getItem('access_token');
    // const options = CommonService.getOption();
    // const header = new HttpHeaders({
    //   'Content-Type': 'application/json',
    //   'Access-Control-Allow-Origin': "*",
    //   'Access-Control-Allow-Methods': 'POST'
    // });
    return this.http.post<any>(`${this.backEndApiURL}api/yolo_predict?token=${token}`, body);
  }
  detectLesion(body: any) {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json;charset=utf-8',
      'Access-Control-Allow-Origin': 'http://127.0.0.1:5000/api/yolo_predict',
      // 'Content-Type': 'text' 
    });
    // const headers = new HttpHeaders().set('Content-Type', 'text/plain; charset=utf-8');
    return this.http.post<any>(this.backEndApiURL.concat(Constant.DETECT), body, {headers});
  }
}
