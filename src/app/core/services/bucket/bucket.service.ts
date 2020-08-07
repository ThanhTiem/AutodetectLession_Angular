import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {CommonService} from '../common';
import {environment} from '../../../../environments/environment';
import {Constant} from '../../Constant';
import {AccessLevel} from '../../../shared/models/bucket.model';
import {Guid} from 'guid-typescript';

@Injectable({
  providedIn: 'root'
})
export class BucketService {
  backEndApiURL = environment.backEndApiURL;

  constructor(private http: HttpClient) {
  }

  getListBucketOfTenant(id: string) {
    const options = CommonService.getOption();
    return this.http.get(this.backEndApiURL.concat(Constant.LIST_BUCKETS), {params: {id}});
  }

  publicBucket(tenantId: string, bucketName: string) {
    const params = {
      tenantId,
      bucketName
    };
    return this.http.post(this.backEndApiURL.concat(Constant.PUBLIC), null,{responseType: 'text', params});
  }

  GetBucketPolicy(tenantId: string, bucketName: string) {
    const header = new HttpHeaders({
      'Content-Type': 'application/json'
    });
    const params = {
      tenantId,
      bucketName
    };
    return this.http.get(this.backEndApiURL.concat(Constant.GET_POLICY), {headers: header, params});
  }

  privateBucket(tenantId: string, bucketName: string) {
    const params = {
      tenantId,
      bucketName
    };
    return this.http.post(this.backEndApiURL.concat(Constant.PRIVATE), null,{responseType: 'text', params});
  }

  GetListObject(tenantId: string, bucketName: string) {
    const params = {tenantId, bucketName};
    return this.http.get(this.backEndApiURL.concat(Constant.LIST_OBJECTS), {responseType: 'text', params});
  }

  MakeBucket(tenantId: string, bucketName: string, accessType: AccessLevel = AccessLevel.Private) {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });
    // const params = `?id=${tenantId}&bucketName=${bucketName}`;
    const params = {tenantId, bucketName, accessType: accessType.toString()};
    const urlPost = `${this.backEndApiURL}${Constant.MAKE_BUCKET}`;
    return this.http.post(urlPost, null, {headers, params});
  }

  RemoveBucket(tenantId: string, bucketName: string) {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });
    const params = {tenantId, bucketName};
    return this.http.delete(this.backEndApiURL.concat(Constant.REMOVE_BUCKET), {headers, params});
  }

  RemoveObject(tenantId: string, bucketName: string, objectName: string) {
    const header = new HttpHeaders({
      'Content-Type': 'application/json'
    });
    const params = {tenantId, bucketName, objectName};
    return this.http.delete(this.backEndApiURL.concat(Constant.REMOVE_OBJECT), {headers: header, params});
  }

  GetListObjectPagin(tenantId: string, bucketName: string, maxkeys: number, continuationToken: string) {
    const header = new HttpHeaders({
      'Content-Type': 'application/json'
    });
    const params = {tenantId: tenantId, bucketName, maxkeys: maxkeys.toString(), continuationToken};
    return this.http.get(this.backEndApiURL.concat(Constant.OBJECTS_PAGINATION), {headers: header, params});
  }

  postFile(tenantId: string, bucketName: string, fileToUpload: File) {
    const endpoint = this.backEndApiURL.concat(Constant.PUT_OBJECT);
    const formData: FormData = new FormData();
    formData.append('tenantId', tenantId);
    formData.append('bucketName', bucketName);
    formData.append('fileKey', fileToUpload, fileToUpload.name);
    return this.http.post(endpoint, formData);
  }

  DownloadObject(tenantId: string, bucketName: string, objectName: string) {
    const header = new HttpHeaders({
      'Content-Type': 'application/json'
    });
    const params = {tenantId, bucketName, objectName};
    return this.http.get(this.backEndApiURL.concat(Constant.DOWNLOAD_OBJECT), {headers: header, params});
  }

  SearchObject(tenantId: string, bucketName: string, searchKey: string, searchMeta: number) {
    const header = new HttpHeaders({
      'Content-Type': 'application/json'
    });
    const params = {tenantId, bucketName, searchKey, searchMeta: searchMeta.toString()};
    return this.http.get(this.backEndApiURL.concat(Constant.SEARCH_OBJECT), {headers: header, params});
  }

  putFileUrl(url: string, fileToUpload: File) {
    const header = new HttpHeaders({
      'Content-Type': fileToUpload.type
    });
    return this.http.put(url, fileToUpload, {headers: header});
  }
  PresignedPutObject(tenantId: string, bucketName: string, objectName: string) {
    const header = new HttpHeaders({
      'Content-Type': 'application/json'
    });
    const params = {tenantId, bucketName, objectName};
    return this.http.get(this.backEndApiURL.concat(Constant.PRESIGNED_PUT_OBJECT), {headers: header, params});
  }

  ListBucketOfTenant(tenantId: string) {
    /*
    const header = new HttpHeaders({
      'Content-Type': 'application/json'
    });
    */
    //const params = {tenantId: tenantId};
    //return this.http.get(this.backEndApiURL.concat(Constant.LIST_BUCKET_OF_TENANT), {headers: header, params});
    return this.http.get(`${this.backEndApiURL.concat(Constant.LIST_BUCKET_OF_TENANT)}${tenantId}`);
  }

  ObjectInfo(tenantId: string, bucketName: string, objectName: string) {
    const header = new HttpHeaders({
      'Content-Type': 'application/json'
    });
    const params = {tenantId, bucketName, objectName};
    return this.http.get(this.backEndApiURL.concat(Constant.OBJECT_INFO), {headers: header, params});
  }
}

