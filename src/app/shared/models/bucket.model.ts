export class BucketModel {
  constructor() {
  }

  Id: string = null;
  Name: string = null;
  CreationDate: string = null;
  CreationDateDateTime: string = null;
  AccessLevel: AccessLevel;
}

export class ApiBucketList {
  Owner: string = null;
  Buckets: BucketModel[];
}

export class Principal {
  AWS: string[];
}

export class Statement {
  Effect: string;
  Principal: Principal;
  Action: string[];
  Resource: string[];
}

export class Policy {
  Version: string;
  Statement: Statement[];
}
export enum AccessLevel {
  Private = 1,
  Public = 2
}






