import {Component, ElementRef, Input, OnInit, ViewChild} from '@angular/core';
import {Subject} from 'rxjs';
import {ListObjectsV2ResponseDto, ObjectModel} from '../shared/models/object.model';
import {BucketService} from '../core/services/bucket/bucket.service';
import {ActivatedRoute, Router} from '@angular/router';
import {ngxLoadingAnimationTypes} from 'ngx-loading';
import {NgxPaginationModule} from 'ngx-pagination';
import {ListObjectsV2Response, S3Objects} from '../shared/models/object.model';
import {ToastrService} from 'ngx-toastr';
import {CommonService} from '../core/services/common';
import {MetadataService} from '../core/services/metadata/metadata.service';
import {MetadataModel, MetaModel} from '../shared/models/metadata.model';
import {Node} from '../shared/models/resource.model';

@Component({
  selector: 'app-object',
  templateUrl: './object.component.html',
  styleUrls: ['./object.component.css']
})
export class ObjectComponent implements OnInit {
  config: any;
  @Input() tenantId: string;
  @Input() bucketName: string;
  dtOptions: DataTables.Settings = {};
  dtTrigger: Subject<any> = new Subject();
  objectModels: ObjectModel[] = [];
  s3ObjectResult: ListObjectsV2Response;
  ListObjectsV2Response: ListObjectsV2ResponseDto;
  @ViewChild('closeModal') closeModal: ElementRef;
  itemsPerPage = 50;
  totalItems = 0;
  currentPage = 1;
  maxPageCache = 20;
  public loading = false;
  public ngxLoadingAnimationTypes = ngxLoadingAnimationTypes;
  fileToUpload: File = null;
  ContinuationToken = [''];
  pages = [];
  searchKey = '';
  metadataModel: MetadataModel;

  constructor(public bucketService: BucketService, public activatedRoute: ActivatedRoute,
              public metadata: MetadataService,
              public toast: ToastrService, public common: CommonService) {
    this.config = {
      currentPage: 1,
      itemsPerPage: 10,
      totalItems: 0
    };
  }

  pageChange(newPage: number) {
    this.currentPage = newPage;
    this.GetListS3ObjectPaging(this.currentPage);
  }

  ngOnInit(): void {
    this.dtOptions = {
      pagingType: 'full_numbers',
      pageLength: 10,
      processing: true
    };
    this.activatedRoute.queryParams.subscribe(data => {
      this.tenantId = data.tenantId;
      this.bucketName = data.bucketName;
    });
    this.totalItems = Number(sessionStorage.getItem('TotalItems'));
    // console.log(this.currentPage);
    // console.log(this.totalItems);
    // this.GetTotalOfObject(this.tenantId, this.bucketName);
    this.GetListS3ObjectPaging(this.currentPage);
  }

  GetTotalOfObject(tenantId: string, bucketName: string) {
    if (sessionStorage.getItem('TotalItems') === null) {
      this.loading = true;
      try {
        this.bucketService.GetListObject(tenantId, bucketName).subscribe(data => {
          // tslint:disable-next-line:radix
          this.totalItems = parseInt(data);
          // console.log(this.totalItems);
          sessionStorage.setItem('TotalItems', JSON.stringify(data));
          this.loading = false;
          if (this.objectModels.length >= 1) {
            this.dtTrigger.next();
          }
        }, error => {
          this.loading = false;
          console.log(error);
        });
      } catch (error) {
        throw new Error(error);
      }
    } else {
      // tslint:disable-next-line:radix
      this.totalItems = parseInt(sessionStorage.getItem('TotalItems'));
    }
  }

  RemoveObject(object: ObjectModel) {
    try {
      this.loading = true;
      this.bucketService.RemoveObject(this.tenantId, this.bucketName, object.Key).subscribe(data => {
        // console.log(data);
        const index = this.objectModels.indexOf(object);
        this.objectModels.splice(index, 1);
        this.loading = false;
      }, error => {
        console.log(error);
      });
    } catch (error) {
      throw new Error(error);
    }
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
              this.s3ObjectResult = (data as ListObjectsV2ResponseDto).ListObjectsV2Response;
              this.totalItems = (data as ListObjectsV2ResponseDto).Totals;
              this.loading = false;
              sessionStorage.setItem(key, JSON.stringify(this.s3ObjectResult));
              sessionStorage.setItem('TotalItems', this.totalItems.toString());
              if (this.ContinuationToken.indexOf(this.s3ObjectResult.NextContinuationToken) === -1) {
                this.ContinuationToken.push(this.s3ObjectResult.NextContinuationToken);
                sessionStorage.setItem('ContinuationToken', JSON.stringify(this.ContinuationToken));
              }
              // console.log(this.ContinuationToken);
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

  handleFileInput(event) {
    this.fileToUpload = event.target.files.item(0);
    // console.log(this.fileToUpload);
    if (this.fileToUpload) {
      this.uploadFileToActivity();
    }
  }

  uploadFileToActivity() {
    this.loading = true;
    this.bucketService.postFile(this.tenantId, this.bucketName, this.fileToUpload).subscribe(data => {
      this.loading = false;
      this.toast.success('Upload Object Successful.', 'Successful');
    }, error => {
      this.loading = false;
      this.toast.error('Upload Object error!', 'Error');
      console.log(error);
    });
  }

  AddMetadata() {
    let meta: MetaModel;
    meta = new MetaModel();
    // console.log(this.metadataModel);
    this.metadataModel.Data.push(meta);
  }

  UpdateMetadata() {
    // console.log('updata', this.metadataModel);
    this.metadata.AddMetadata(this.metadataModel).subscribe(
      rep => console.log(rep),
      error => {
        this.toast.error('Update metadata error.', 'Error');
      },
      () => {
        this.closeModal.nativeElement.click();
        this.toast.success('Update metadata success.', 'Success');
      },
    );
  }

  GetMetadata(objectName: string) {
    // console.log('metadata', objectName);
    this.metadata.getMetadata(this.tenantId, this.bucketName, objectName).subscribe(
      data => {
        const temp = data as MetadataModel[];
        // console.log(data);
        if (temp.length) {
          this.metadataModel = temp[0];
        } else {
          this.metadataModel = new MetadataModel();
          this.metadataModel.TenantId = this.tenantId;
          this.metadataModel.BucketName = this.bucketName;
          this.metadataModel.ObjectName = objectName;
          this.metadataModel.Data = null;
        }
      },
      error => console.log(error),
      () => console.log('done')
    );
  }
}
