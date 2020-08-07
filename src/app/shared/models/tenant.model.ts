import {BucketModel} from './bucket.model';

export class Tenant {
  constructor() {
  }
  Id: string = null;
  Name: string = null;
  Email: string = null;
  UserName: string = null;
  Password: string = null;
  Phone: string = null;
  Status: StatusTenantEnum = StatusTenantEnum.Active;
  Register: RegisterEnum;
  ServiceStatus: ServiceStatus;
  Url: string = null;
  UrlPublic: string = null;
  ClusterId: string  = null;
  CreatedOn: Date;
  UpdateOn: Date;
  UsedStorage: number;
}

export class TenantList {
  constructor() {
  }
  Count: number;
  Tenants: Tenant[];
}

export class Buckets {
  Buckets: BucketModel[];
}

export class TenantDetail {
  constructor() {
  }
  Tenant: Tenant;
  TenantTotal: number;
  Buckets: Buckets;
}

export enum StatusTenantEnum {
  Active = 1,
  Inactive = 2
}

export enum RegisterEnum {
  ReQuest = -1,
  NotRegister = 1,
  Register = 2
}

export enum ServiceStatus {
  Unready = 1,
  Ready = 2
}
