import { AxiosResponse } from "axios";

export interface ApiReturnBody<T = any> {
  data: T;
  status?: string | number;
  msg?: string;
}

export interface ApiAxiosResponse extends AxiosResponse<ApiReturnBody> {
  data: ApiReturnBody;
}
