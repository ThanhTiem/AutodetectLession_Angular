import {Node} from './resource.model';

export class ClusterModel {
  constructor() {
  }
  Id: string = null;
  Name: string;
  Status: StatusEnum ;
  //Type: TypeClusterEnum;
  Type: string;
  CreatedOn: Date;
  UpdatedOn: Date;
  Nodes: Node[];
  IpPublic: string = null;
  TurningOption: number;
  TurningStatus: number;
  PercentStorage: number;
}

export enum TypeClusterEnum {
  Storage = 1,
  Cache = 2,
  App = 3
}


export enum RoleEnum {
  Manager = 1,
  Worker = 2
}

export enum StatusEnum {
  Active = 1,
  Inactive = 2,
  Disable
}

export class ClusterDashboard {
  constructor() {
  }
  ClusterNum: number;
  NodeNum: number;
  StorageTotal: number ;
  RamTotal: number;
  CpuTotal: number;
}


