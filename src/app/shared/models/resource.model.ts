import {StatusEnum} from './clusterModel';

export class Node {
  constructor() {
  }
  Id: string = null;
  HostName: string = null;
  IpAddress: string = null;
  UserName: string = null;
  Password: string = null;
  ListPortUsed: number[];
  Role: number;
  Cpu: number;
  Ram: number;
  Storage: number;
  Status: StatusEnum;
  TurningStatus: TurningEnum;
  TurningResult: string;
}

export enum TurningEnum {
  Turning = 1,
  NotTurning = 2
}
