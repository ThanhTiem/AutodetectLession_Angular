export class ObjectModel {
  constructor() {
  }
  Key: string = null;
  Size: string;
  ETag: string = null;
  IsDir: boolean;
  LastModified: Date = null;
  LastModifiedDateTime: Date = null;
  TenantId: string;
  MetaData: string;
  Id: string;
  Link:string;
  CreatedOn: string;
  UpdatedOn: string;
}


export interface StorageClass {
  Value: string;
}

export interface S3Objects {
  ETag: string;
  BucketName: string;
  Key: string;
  LastModified: Date;
  Owner: any;
  Size: string;
  StorageClass: StorageClass;
}


export interface ListObjectsV2Response {
  IsTruncated: boolean;
  S3Objects: S3Objects[];
  Name: string;
  Prefix: string;
  MaxKeys: number;
  CommonPrefixes: any[];
  Delimiter: string;
  Encoding?: any;
  KeyCount: number;
  ContinuationToken: string;
  NextContinuationToken?: any;
  StartAfter?: any;
  ResponseMetadata: any;
  ContentLength: number;
  HttpStatusCode: number;
}

export interface ListObjectsV2ResponseDto {
  Totals: number;
  StorageTotal: number;
  ListObjectsV2Response: ListObjectsV2Response;
}
