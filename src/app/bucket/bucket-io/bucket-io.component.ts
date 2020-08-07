import {Component, OnInit} from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {ngxLoadingAnimationTypes} from 'ngx-loading';
import {AccessLevel, BucketModel} from '../../shared/models/bucket.model';
import {ActivatedRoute, Router} from '@angular/router';
import {BucketService} from '../../core/services/bucket/bucket.service';
import {ApiResultModel} from '../../shared/models/apiresult.model';
import {Subscription} from 'rxjs';
import {ToastrService} from 'ngx-toastr';
import {ListObjectsV2Response, ListObjectsV2ResponseDto} from '../../shared/models/object.model';
import {Tenant} from '../../shared/models/tenant.model';

@Component({
  selector: 'app-bucket-io',
  templateUrl: './bucket-io.component.html',
  styleUrls: ['./bucket-io.component.scss']
})
export class BucketIoComponent implements OnInit {
  subscription: Subscription;
  bucketFormGroup: FormGroup;
  public ngxLoadingAnimationTypes = ngxLoadingAnimationTypes;
  public loading = false;
  editBucket: BucketModel;
  accessLevel = AccessLevel;
  tenantId = '';
  itemsPerPage = 50;


  constructor(private activatedRoute: ActivatedRoute, private bucketService: BucketService,
              private toastr: ToastrService, private routerService: Router) {
  }

  ngOnInit(): void {
    this.editBucket = new BucketModel();
    this.editBucket.AccessLevel = AccessLevel.Private;
    this.activatedRoute.queryParams.subscribe(data => {
      this.tenantId = data.tenantId;
      // console.log(this.tenantId);
    });
    this.bucketFormGroup = new FormGroup({
      'Name': new FormControl(this.editBucket.Name, [Validators.required, Validators.minLength(3), Validators.maxLength(63),
        Validators.pattern('[a-z0-9-]+')]),
      'AccessLevel': new FormControl(this.editBucket.AccessLevel, [Validators.required]),
    });
  }

  get Name() {
    return this.bucketFormGroup.get('Name');
  }

  get AccessLevel() {
    return this.bucketFormGroup.get('AccessLevel');
  }

  MakeBucket() {
    if (this.tenantId) {
      this.loading = true;
      const bucket = this.bucketFormGroup.value as BucketModel;
      // console.log(bucket);
      this.subscription = this.bucketService.MakeBucket(this.tenantId, bucket.Name, bucket.AccessLevel).subscribe(result => {
        this.loading = false;
        const apiResult = result as ApiResultModel<string>;
        if (apiResult.succeed) {
          this.toastr.success('Create Bucket Successful', 'Successful');
          this.routerService.navigate(['storage/bucket/detail'],
             {queryParams: {tenantId: this.tenantId, bucketName: bucket.Name, bucketCreatedOn: Date.now()}});
          // this.routerService.navigate(['storage/detail'], {queryParams: {id: this.tenantId}});
        } else {
          if (apiResult.errors[0]?.includes('already')) {
            this.toastr.warning(apiResult.errors[0].split('=')[1]);
          } else {
            this.toastr.warning(apiResult.errors[0]);
          }
        }
      }, err => {
        this.loading = false;
        const message = (err.error as ApiResultModel<string>);
        console.log(err);
        this.toastr.error(message.errors[0], 'Error');
      });
    } else {
      alert('Storage Service is invalid, required Tenant create bucket');
    }
  }

  Cancel() {
    this.routerService.navigate(['storage/detail'], {queryParams: {id: this.tenantId}});
  }

}
