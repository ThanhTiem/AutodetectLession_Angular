import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {environment} from '../../../../environments/environment';
import {CommonService} from '../common';
import {Constant} from '../../Constant';
import {MetadataApi, MetadataModel} from '../../../shared/models/metadata.model';

@Injectable({
  providedIn: 'root'
})
export class MetadataService {
  backEndApiURL = environment.backEndApiURL;

  constructor(private http: HttpClient) {
  }

  getMetadata(tenantId: string, bucketName: string, objectName: string) {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });
    return this.http.get(this.backEndApiURL.concat(Constant.GET_METADATA), {headers, params: {tenantId, bucketName, objectName}});
  }

  AddMetadata(metadataModel: MetadataApi) {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });
    return this.http.post(this.backEndApiURL.concat(Constant.ADD_METADATA), metadataModel, {headers});
  }

  UpdateMetadata(metadataModel: MetadataApi) {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });
    return this.http.post(this.backEndApiURL.concat(Constant.UPDATE_METADATA), metadataModel, {headers});
  }
}
