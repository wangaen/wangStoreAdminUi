import axios from "@/utils/axios/index";

export interface LoginFormType {
  username: string;
  password: string;
  type: 1 | 2;
}

export const adminLoginApi = (params: LoginFormType) => axios.post("/admin/login", params);

export const storeLoginApi = (params: LoginFormType) => axios.post("/admin/login", params);
