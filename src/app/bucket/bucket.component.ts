import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {BucketService} from '../core/services/bucket/bucket.service';
import {ActivatedRoute, Router} from '@angular/router';
import {MetadataService} from '../core/services/metadata/metadata.service';
import {ToastrService} from 'ngx-toastr';
import {CommonService} from '../core/services/common';
import {ApiResultModel} from '../shared/models/apiresult.model';
import {ngxLoadingAnimationTypes} from 'ngx-loading';
import {ListObjectsV2Response, ListObjectsV2ResponseDto, ObjectModel, S3Objects} from '../shared/models/object.model';
import {MetadataModel, MetaModel} from '../shared/models/metadata.model';
import {ModalDismissReasons, NgbModal, NgbModalRef} from '@ng-bootstrap/ng-bootstrap';
import {TenantDetail} from '../shared/models/tenant.model';
import {TenantService} from '../core/services/tenant/tenant.service';

@Component({
  selector: 'app-bucket',
  templateUrl: './bucket.component.html',
  styleUrls: ['./bucket.component.scss']
})
export class BucketComponent implements OnInit {
  @ViewChild('closeModal') closeModal: ElementRef;
  tenantId: string;
  bucketName: string;
  fileToUpload: File = null;
  itemsPerPage = 20;
  page = 1;
  totalItems = 0;
  StorageTotal = 0;
  currentPage = 1;
  maxPageCache = 20;
  public loading = false;
  urlUpload = '';
  s3ObjectResult: ListObjectsV2Response;
  ContinuationToken = [''];
  pages = [];
  metadataModel: MetadataModel;
  objectModels: ObjectModel[] = [];
  btnAccessLevelContent = 'Public';
  accessLevel = 'Private';
  modalReference: NgbModalRef;
  closeResult = '';
  serviceUrl: string;
  bucketCreatedOn: Date;

  public ngxLoadingAnimationTypes = ngxLoadingAnimationTypes;

  constructor(public bucketService: BucketService, public activatedRoute: ActivatedRoute,
              public metadata: MetadataService,
              public toast: ToastrService, public common: CommonService,
              private routerService: Router, private modalService: NgbModal, private tenantService: TenantService) {
  }

  ngOnInit(): void {
    this.activatedRoute.queryParams.subscribe(data => {
      this.tenantId = data.tenantId;
      this.bucketName = data.bucketName;
      this.bucketCreatedOn = data.bucketCreatedOn;
      // console.log(this.tenantId, this.bucketName);
    });
    this.GetListS3ObjectPaging(this.currentPage);
    this.GetPolicy(this.tenantId, this.bucketName);
    this.getTenant(this.tenantId);
  }

  handleFileInput(event) {
    if (this.tenantId && this.bucketName) {
      this.loading = true;
      this.fileToUpload = event.target.files.item(0);
      // console.log(this.fileToUpload);
      if (this.fileToUpload) {
        this.PresignedPutObject(this.tenantId, this.bucketName, this.fileToUpload.name);
      }
    } else {
      alert('Bucket is invalid');
    }
  }

  uploadFileToActivity() {
    this.loading = true;
    this.bucketService.postFile(this.tenantId, this.bucketName, this.fileToUpload).subscribe(data => {
      this.loading = false;
      this.toast.success('Upload Object Successful.', 'Successful');
    }, error => {
      this.loading = false;
      this.toast.error('Upload Object error.', 'Error');
      console.log(error);
    });
  }

  PresignedPutObject(tenantId: string, bucketName: string, objectName: string) {
    this.bucketService.PresignedPutObject(tenantId, bucketName, objectName).subscribe(data => {
      this.urlUpload = JSON.parse((data as ApiResultModel<string>).data);
      if (this.urlUpload) {
        this.putFileUrl(this.urlUpload, this.fileToUpload);
      }
    }, error => {
      this.loading = false;
      this.toast.error('Can not get presigned put Object', 'Error');
      console.log(error);
    });
  }

  putFileUrl(url: string, fileUpload: File) {
    this.bucketService.putFileUrl(url, fileUpload).subscribe(data => {
      this.loading = false;
      this.toast.success('Upload Object Successful.', 'Successful');
      this.refresh();
    }, error => {
      this.loading = false;
      this.toast.error('Upload Object Error.', 'Error');
      console.log(error);
    });
  }

  GetListS3ObjectPaging(page: number) {
    if (this.ContinuationToken.length === 1 && sessionStorage.getItem('ContinuationToken')) {
      this.ContinuationToken = JSON.parse(sessionStorage.getItem('ContinuationToken')) as string[];
      // console.log(this.ContinuationToken);
    }
    const key = 'page' + page;
    if (this.pages.indexOf(key) === -1) {
      this.pages.push(key);
    }
    if (typeof (Storage) !== 'undefined') {
      if (sessionStorage.length > this.maxPageCache) {
        sessionStorage.removeItem(this.pages[0]);
        this.pages.splice(0, 1);
        sessionStorage.setItem('TotalItems', this.totalItems.toString());
      }
      if (sessionStorage.getItem(key) === null) {
        const maxkeys = this.itemsPerPage;
        this.loading = true;
        try {
          // console.log(this.ContinuationToken);
          this.bucketService.GetListObjectPagin(this.tenantId, this.bucketName, maxkeys, this.ContinuationToken[page - 1])
            .subscribe(data => {
              // console.log(JSON.parse((data as ApiResultModel<string>).data));
              const repon = JSON.parse((data as ApiResultModel<string>).data) as ListObjectsV2ResponseDto;
              this.s3ObjectResult = repon.ListObjectsV2Response;
              this.totalItems = repon.Totals;
              this.StorageTotal = repon.StorageTotal;
              console.log(repon);
              this.loading = false;
              // sessionStorage.setItem(key, JSON.stringify(this.s3ObjectResult));
              // sessionStorage.setItem('TotalItems', this.totalItems.toString());
              if (this.ContinuationToken.indexOf(this.s3ObjectResult.NextContinuationToken) === -1) {
                this.ContinuationToken.push(this.s3ObjectResult.NextContinuationToken);
                //   sessionStorage.setItem('ContinuationToken', JSON.stringify(this.ContinuationToken));
              }
              // console.log(this.s3ObjectResult.S3Objects.length);
              console.log(this.totalItems);
            }, error => {
              this.loading = false;
              console.log(error);
            });
        } catch (error) {
          throw new Error(error);
        }
      } else {
        this.s3ObjectResult = JSON.parse(sessionStorage.getItem(key)) as ListObjectsV2Response;
      }
    }
  }

  ConvertS3ObjecttoObject(s3Objects: S3Objects): ObjectModel {
    const objectModel: ObjectModel = new ObjectModel();
    objectModel.Key = s3Objects.Key;
    objectModel.ETag = s3Objects.ETag;
    objectModel.LastModified = s3Objects.LastModified;
    objectModel.Size = s3Objects.Size;
    return objectModel;
  }

  pageChange(newPage: number) {
    this.currentPage = newPage;
    this.GetListS3ObjectPaging(this.currentPage);
  }

  GetPolicy(tenantId: string, bucketName: string) {
    this.bucketService.GetBucketPolicy(tenantId, bucketName).subscribe(data => {
      const temp = JSON.parse(JSON.parse((data as ApiResultModel<string>).data));
      if (temp.Statement.includes('The bucket policy does not exist')) {
        this.btnAccessLevelContent = 'Public';
        this.accessLevel = 'Private';
        // console.log('Private');
      } else {
        this.btnAccessLevelContent = 'Private';
        this.accessLevel = 'Public';
        // console.log('Public');
      }
    }, error => {
      this.loading = false;
      this.toast.error('Can not get bucket policy', 'Error');
      console.log(error);
    });
  }

  PublicBucket() {
    this.loading = true;
    this.bucketService.publicBucket(this.tenantId, this.bucketName).subscribe(data => {
      this.toast.success('Public bucket <strong>' + this.bucketName + '</strong> Successful!', 'Successful');
      this.GetPolicy(this.tenantId, this.bucketName);
      this.loading = false;
    }, error => {
      this.loading = false;
      this.toast.error('Can not set bucket policy', 'Error');
      console.log(error);
    });
  }

  privateBucket() {
    this.loading = true;
    this.bucketService.privateBucket(this.tenantId, this.bucketName).subscribe(data => {
      this.toast.success('Private bucket <strong>' + this.bucketName + '</strong> Successful!', 'Successful');
      this.GetPolicy(this.tenantId, this.bucketName);
      this.loading = false;
    }, error => {
      this.loading = false;
      this.toast.error('Can not set bucket policy', 'Error');
      console.log(error);
    });
  }

  AccessLevel() {
    if (this.btnAccessLevelContent === 'Private') {
      this.privateBucket();
    } else {
      this.PublicBucket();
    }
  }

  removeBucket() {
    this.loading = true;
    this.bucketService.RemoveBucket(this.tenantId, this.bucketName).subscribe(data => {
      console.log(data);
      const result = data as ApiResultModel<string>;
      if (result.succeed) {
        this.modalReference.close();
        this.toast.success('Remove bucket ' + this.bucketName + ' successful!', 'Successful');
        this.routerService.navigate(['storage/detail'], {queryParams: {id: this.tenantId}});
      } else {
        this.modalReference.close();
        this.toast.error('Remove bucket ' + this.bucketName + ' error!' + result.errors[0]);
      }
      this.loading = false;
    }, error => {
      this.loading = false;
      this.toast.error('Can not remove bucket', 'Error');
      console.log(error);
    });
  }

  open(content) {
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

  ObjectDetail(objectName) {
    this.routerService.navigate(['storage/object/detail'],
      {queryParams: {tenantId: this.tenantId, bucketName: this.bucketName, objectName, bucketCreatedOn: this.bucketCreatedOn}});
  }

  GetUrlObjectPublic(objectName: string): string {
    const url = this.serviceUrl + '/' + this.bucketName + '/' + objectName;
    return url;
  }

  getTenant(id: string) {
    this.loading = true;
    this.tenantService.getTenant(id).subscribe(data => {
      const tenantDetail = JSON.parse((data as ApiResultModel<string>).data) as TenantDetail;
      if (tenantDetail.Tenant.UrlPublic) {
        this.serviceUrl = tenantDetail.Tenant.UrlPublic.split(';')[0];
      } else {
        this.serviceUrl = tenantDetail.Tenant.Url.split(';')[0];
      }
      this.loading = false;
    }, error => {
      this.loading = false;
      this.toast.error('Can not load service url', 'Error');
      console.log(error);
    });
  }

  openLink(url: string) {
    window.open(url, '_blank');
  }

  refresh(): void {
    window.location.reload();
  }

  SearchObjecs() {
    this.routerService.navigate(['storage/object/search'],
      {queryParams: {tenantId: this.tenantId, bucketName: this.bucketName, bucketCreatedOn: this.bucketCreatedOn}});
  }

  parent() {
    this.routerService.navigate(['storage/detail'], {queryParams: {id: this.tenantId}});
  }
}
