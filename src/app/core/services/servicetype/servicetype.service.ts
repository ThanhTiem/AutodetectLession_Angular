import { Injectable } from '@angular/core';
import {environment} from '../../../../environments/environment';
import {CommonService} from '../common';
import {Constant} from '../../Constant';
import {HttpClient, HttpHeaders} from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ServicetypeService {
  backEndApiURL = environment.backEndApiURL;
  constructor(private http: HttpClient) { }

  getAllServiceType() {
    const header = new HttpHeaders({
      'Content-Type': 'application/json'
    });
    return this.http.get(this.backEndApiURL.concat(Constant.GETSERVICETYPE), {headers: header});
  }
}
