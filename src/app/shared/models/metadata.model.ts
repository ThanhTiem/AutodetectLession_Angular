export class MetadataModel {
  constructor() {
  }

  Id: string;
  BucketName: string;
  TenantId: string;
  ObjectName: string = null;
  Data: MetaModel[];
  CreatedOn: Date;
  UpdatedOn: Date;
}

export class MetaModel {
  Key: string;
  Value: string;
}

export class MetadataApi {
  constructor() {
  }

  Id: string;
  BucketName: string;
  TenantId: string;
  ObjectName: string = null;
  Data: Object;
  CreatedOn: Date;
  UpdatedOn: Date;
}

