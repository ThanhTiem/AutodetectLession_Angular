import {Component, OnInit} from '@angular/core';
import {ObjectModel} from '../../shared/models/object.model';
import {BucketService} from '../../core/services/bucket/bucket.service';
import {ActivatedRoute, Router} from '@angular/router';
import {MetadataService} from '../../core/services/metadata/metadata.service';
import {ToastrService} from 'ngx-toastr';
import {CommonService} from '../../core/services/common';
import {NgbModalRef} from '@ng-bootstrap/ng-bootstrap';
import {ngxLoadingAnimationTypes} from 'ngx-loading';
import {ApiResultModel} from '../../shared/models/apiresult.model';

@Component({
  selector: 'app-object-search',
  templateUrl: './object-search.component.html',
  styleUrls: ['./object-search.component.scss']
})
export class ObjectSearchComponent implements OnInit {
  tenantId: string;
  bucketName: string;
  searchKey = '';
  objectModels: ObjectModel[] = [];
  public ngxLoadingAnimationTypes = ngxLoadingAnimationTypes;
  itemsPerPage = 20;
  page = 1;
  totalItems = 0;
  currentPage = 1;
  public loading = false;
  btnAccessLevelContent = 'Public';
  accessLevel = 'Private';
  modalReference: NgbModalRef;
  closeResult = '';
  serviceUrl: string;
  bucketCreatedOn: Date;
  includeMetadata: boolean;

  constructor(public bucketService: BucketService, public activatedRoute: ActivatedRoute,
              public metadata: MetadataService,
              public toast: ToastrService, public common: CommonService, private routerService: Router) {
  }

  ngOnInit(): void {
    this.activatedRoute.queryParams.subscribe(data => {
      this.tenantId = data.tenantId;
      this.bucketName = data.bucketName;
      this.bucketCreatedOn = data.bucketCreatedOn;
    });
  }

  SearchObject() {
    this.loading = true;
    console.log(this.includeMetadata);
    let searchMeta: number;
    if (this.includeMetadata) {
      searchMeta = 1;
    } else {
      searchMeta = 0;
    }
    this.bucketService.SearchObject(this.tenantId, this.bucketName, this.searchKey, searchMeta).subscribe(data => {
      this.objectModels = JSON.parse((data as ApiResultModel<string>).data) as ObjectModel[];
      this.loading = false;
      console.log(this.objectModels);
    }, error => {
      this.loading = false;
      console.log(error);
    });
  }

  ObjectDetail(objectName) {
    this.routerService.navigate(['storage/object/detail'],
      {queryParams: {tenantId: this.tenantId, bucketName: this.bucketName, objectName, bucketCreatedOn: this.bucketCreatedOn}});
  }

  refresh(): void {
    window.location.reload();
  }

  pageChange(newPage: number) {
    this.currentPage = newPage;
  }

  parent() {
    this.routerService.navigate(['storage/bucket/detail'],
      {queryParams: {tenantId: this.tenantId, bucketName: this.bucketName, bucketCreatedOn: this.bucketCreatedOn}});
  }
}
