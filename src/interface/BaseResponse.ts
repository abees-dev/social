export interface IBaseResponse<T = any> {
  status: number;
  message: string;
  data: T;
}
