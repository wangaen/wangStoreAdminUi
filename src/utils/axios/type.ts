import { AxiosResponse } from "axios";

export interface ApiReturnBody<T = any> {
  status?: string | number;
  data: T;
  msg?: string;
}

export interface ApiAxiosResponse extends AxiosResponse {
  data: ApiReturnBody;
}
