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


  detectLesion(body: any){
    const header = new HttpHeaders({
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': "*",
      'Access-Control-Allow-Methods': 'POST',
      'responseType': 'text'
    });
    return this.http.post<any>(`${this.backEndApiURL}api/yoloPredict`, body);
  }
  // detectLesion(body: any) {
  //   const headers = new HttpHeaders({
  //     'Content-Type': 'application;charset=utf-8',
  //     'Access-Control-Allow-Origin': 'http://127.0.0.1:5000/api/yoloPredict',
  //     // 'Content-Type': 'text', 
  //     // 'dataType': 'json',
  //     // 'responseType': 'text'
  //   });
  //   // const headers = new HttpHeaders().set('Content-Type', 'text/plain; charset=utf-8');
  //   return this.http.post<any>(this.backEndApiURL.concat(Constant.DETECT), body, {headers: headers});
           
    
    // return this.http.post<any>(this.backEndApiURL.concat(Constant.DETECT), body, {dataType});
  // }
 
}
