import axios from "@/utils/axios/index";

export interface LoginFormType {
  username: string;
  password: string;
  type: 1 | 2;
  id: string;
  verifyCode: string;
}

export const adminLoginApi = (params: LoginFormType) => axios.post("/admin/login", params);

export const storeLoginApi = (params: LoginFormType) => axios.post("/admin/login", params);

export const getCaptchaCode = () => axios.get("/captcha/get");

export const verifyCaptchaCode = (params: { id: string; verifyCode: string }) =>
  axios.get("/captcha/verify", { params });
