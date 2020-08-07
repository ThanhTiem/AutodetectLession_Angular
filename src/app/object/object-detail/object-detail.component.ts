import {Component, OnInit} from '@angular/core';
import {MetadataService} from '../../core/services/metadata/metadata.service';
import {ToastrService} from 'ngx-toastr';
import {ApiResultModel} from '../../shared/models/apiresult.model';
import {ActivatedRoute, Router} from '@angular/router';
import {MetadataApi, MetadataModel, MetaModel} from '../../shared/models/metadata.model';
import {BucketService} from '../../core/services/bucket/bucket.service';
import {ObjectModel} from '../../shared/models/object.model';
import {CommonService} from '../../core/services/common';
import {Guid} from 'guid-typescript';
import {ModalDismissReasons, NgbModal, NgbModalRef} from '@ng-bootstrap/ng-bootstrap';
import {ngxLoadingAnimationTypes} from 'ngx-loading';

@Component({
  selector: 'app-object-detail',
  templateUrl: './object-detail.component.html',
  styleUrls: ['./object-detail.component.scss']
})
export class ObjectDetailComponent implements OnInit {
  tenantId: string;
  bucketName: string;
  objectName: string;
  public ngxLoadingAnimationTypes = ngxLoadingAnimationTypes;
  public loading = false;
  metaData: MetadataModel;
  keys = [];
  currentObject: ObjectModel;
  modalReference: NgbModalRef;
  closeResult = '';
  bucketCreatedOn: Date;
  editmetadata = false;
  currentindex = -1;
  confirm = false;
  accessPolicy = 'Private';
  constructor(public metadataServie: MetadataService, public toast: ToastrService, public activatedRoute: ActivatedRoute,
              public bucketService: BucketService, public common: CommonService,
              private routerService: Router, private modalService: NgbModal) {
  }

  ngOnInit(): void {
    this.metaData = new MetadataModel();
    this.metaData.Data = [];
    this.activatedRoute.queryParams.subscribe(data => {
      this.tenantId = data.tenantId;
      this.bucketName = data.bucketName;
      this.objectName = data.objectName;
      this.bucketCreatedOn = data.bucketCreatedOn;
    });
    if (this.objectName && this.bucketName && this.tenantId) {
      this.ObjectInfo();
      this.getMetadata();
    }
    this.GetPolicy(this.tenantId, this.bucketName);
  }

  ObjectInfo() {
    this.loading = true;
    this.bucketService.ObjectInfo(this.tenantId, this.bucketName, this.objectName).subscribe(data => {
      this.loading = false;
      this.currentObject = JSON.parse((data as ApiResultModel<string>).data) as ObjectModel;
      // console.log(this.currentObject);
    }, error => {
      this.loading = false;
      this.toast.error('load object info error', 'Message');
    });
  }

  getMetadata() {
    this.loading = true;
    this.metadataServie.getMetadata(this.tenantId, this.bucketName, this.objectName).subscribe(data => {
      this.loading = false;
      const temp = JSON.parse((data as ApiResultModel<string>).data) as MetadataApi[];
      // console.log(temp);
      if (temp.length > 0) {
        this.metaData.ObjectName = temp[0].ObjectName;
        this.metaData.BucketName = temp[0].BucketName;
        this.metaData.Id = temp[0].Id;
        this.metaData.TenantId = temp[0].TenantId;
        this.metaData.CreatedOn = temp[0].CreatedOn;
        this.metaData.UpdatedOn = temp[0].UpdatedOn;
        this.metaData.Data = [];
        this.keys = Object.keys(temp[0].Data);
        this.keys.forEach(key => {
          const meta = new MetaModel();
          meta.Key = key;
          meta.Value = temp[0].Data[key];
          this.metaData.Data.push(meta);
        });
        // console.log(this.metaData);
      }
    }, error => {
      this.loading = false;
      this.toast.error('load metadata error', 'Message');
    });
  }

  DownloadFileToActivity(objectName: string) {
    this.bucketService.DownloadObject(this.tenantId, this.bucketName, objectName).subscribe(data => {
      const urldownload = JSON.parse((data as ApiResultModel<string>).data);
      // console.log(urldownload);
      window.open(urldownload, '_blank');
    }, error => {
      console.log(error);
    });
  }

  AddMetadata() {
    let meta: MetaModel;
    meta = new MetaModel();
    this.metaData.Data.push(meta);
    this.editmetadata = true;
    this.currentindex = this.metaData.Data.length - 1;
  }

  AddOrUpdateMetadata() {
    this.loading = true;
    const metaDataApi = new MetadataApi();
    let dataKey = this.metaData.Data;
    let inValidMeta = false;
    for (let i = 0; i < dataKey.length; i++) {
      if(dataKey[i].Key == undefined){
        inValidMeta = true;
        break;
      }
      if(dataKey[i].Key == ''){
        inValidMeta = true;
        break;
      }
      if(dataKey[i].Value == undefined){
        inValidMeta = true;
        break;
      }
      if(dataKey[i].Value == ''){
        inValidMeta = true;
        break;
      }
    }
    const data = this.arrayToObject(this.metaData.Data);
    metaDataApi.Data = data;
    if(inValidMeta){
      this.toast.error('Vui lòng kiểm tra lại. Key và Value của thẻ không được để trống.', 'Message');
      this.loading = false;
    }else{
      if (this.metaData.Id) {
        metaDataApi.TenantId = this.metaData.TenantId;
        metaDataApi.Id = this.metaData.Id;
        metaDataApi.BucketName = this.metaData.BucketName;
        metaDataApi.ObjectName = this.metaData.ObjectName;
        metaDataApi.CreatedOn = this.metaData.CreatedOn;
        metaDataApi.UpdatedOn = new Date();
        this.metadataServie.UpdateMetadata(metaDataApi).subscribe(rep => {
          this.loading = false;
          this.editmetadata = false;
          const temp = JSON.parse((rep as ApiResultModel<string>).data);
          this.toast.success('save metadata success', 'Message');
          // console.log('Update', temp);
        }, error => {
          this.loading = false;
          this.editmetadata = false;
          this.toast.error('save metadata error', 'Message');
        });
      } else {
        metaDataApi.Id = Guid.create().toString();
        metaDataApi.TenantId = this.tenantId;
        metaDataApi.BucketName = this.bucketName;
        metaDataApi.ObjectName = this.objectName;
        metaDataApi.CreatedOn = new Date();
        metaDataApi.UpdatedOn = new Date();
        this.metadataServie.AddMetadata(metaDataApi).subscribe(rep => {
          this.loading = false;
          this.editmetadata = false;
          const temp = JSON.parse((rep as ApiResultModel<string>).data);
          this.toast.success('save metadata success', 'Message');
          // console.log(temp);
        }, error => {
          this.loading = false;
          this.editmetadata = false;
          this.toast.error('save metadata error', 'Message');
        });
      }
    }
  }

  arrayToObject(arr: MetaModel[]) {
    const rv = {};
    for (let i = 0; i < arr.length; ++i) {
      if (arr[i] !== undefined) {
        rv[arr[i].Key] = arr[i].Value;
      }
    }
    return rv;
  }

  RemoveObject() {
    this.loading = true;
    this.modalReference.close();
    this.bucketService.RemoveObject(this.tenantId, this.bucketName, this.objectName).subscribe(data => {
      // console.log(data);
      this.toast.success('Object ' + this.objectName + ' has been mark as deleted.', 'Successful');
      this.routerService.navigate(['storage/bucket/detail'], {queryParams: {tenantId: this.tenantId, bucketName: this.bucketName,bucketCreatedOn: this.bucketCreatedOn}});
      this.loading = false;
    }, error => {
      this.loading = false;
      this.toast.error('Can not remove object', 'Error');
      console.log(error);
    });
  }

  open(content, index: number) {
    this.currentindex = index;
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

  parent(contentConfirm) {
    if (this.editmetadata) {
        this.open(contentConfirm, 0);
    } else {
      this.routerService.navigate(['storage/bucket/detail'],
        {queryParams: {tenantId: this.tenantId, bucketName: this.bucketName, bucketCreatedOn: this.bucketCreatedOn}});
    }
  }

  DeleteMetaData() {
    this.metaData.Data.splice(this.currentindex, 1);
    this.modalReference.close();
    this.AddOrUpdateMetadata();
    this.editmetadata = false;
  }

  editMeta(index: number) {
    this.editmetadata = true;
    this.currentindex = index;
  }
  confirmBack() {
    console.log('confirm');
      this.routerService.navigate(['storage/bucket/detail'],
        {queryParams: {tenantId: this.tenantId, bucketName: this.bucketName, bucketCreatedOn: this.bucketCreatedOn}});
      this.modalReference.close();
  }
  GetPolicy(tenantId: string, bucketName: string) {
    this.bucketService.GetBucketPolicy(tenantId, bucketName).subscribe(data => {
      const temp = JSON.parse(JSON.parse((data as ApiResultModel<string>).data));
      if (temp.Statement.includes('The bucket policy does not exist')) {

        this.accessPolicy = 'Private';
        // console.log('Private');
      } else {
        this.accessPolicy = 'Public';
        // console.log('Public');
      }
    }, error => {
      this.loading = false;
      this.toast.error('Can not get bucket policy', 'Error');
      console.log(error);
    });
  }
}
