export class ApiResultModel<T> {
  constructor() {
  }
  errors: string[];
  succeed: boolean;
  failed: boolean;
  data: T;
  functionName: string;
}
