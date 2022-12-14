<script lang="ts" setup>
import { ElMessage, ElLoading } from "element-plus/es";
import { onMounted, reactive, ref } from "vue";
import { useRouter } from "vue-router";
import type { FormInstance, FormRules } from "element-plus";
import { adminLoginApi, getCaptchaCode, LoginFormType, verifyCaptchaCode } from "@/api/login";
import { ApiReturnBody } from "@/utils/axios/type";
import { setToken } from "@/utils/token";
import Icon from "@/components/common/Icon.vue";

const loginForm = reactive<LoginFormType>({
  username: "",
  password: "",
  type: 1,
  id: "",
  verifyCode: "",
});

const activeTab = ref(1);
const tabChange = (num: 1 | 2) => {
  activeTab.value = num;
  loginForm.type = num;
};

const verifyCodeImg = ref("");
const getVerifyCode = async () => {
  const res: ApiReturnBody = await getCaptchaCode();
  if (res.status === "ok") {
    loginForm.id = res.data.id;
    verifyCodeImg.value = res.data.verifyCode;
  }
};
const verifyCaptcha = async (): Promise<boolean> => {
  const res: ApiReturnBody = await verifyCaptchaCode(loginForm);
  if (res.status === "ok") {
    return true;
  }
  return false;
};
onMounted(() => getVerifyCode());

const router = useRouter();
const ruleFormRef = ref<FormInstance>();
const toLogin = async () => {
  await ruleFormRef.value?.validate(async (valid) => {
    if (valid) {
      const res1 = await verifyCaptcha();
      if (!res1) {
        ElMessage.warning("验证码错误");
        return;
      }
      const res2: ApiReturnBody<{ token: string }> = await adminLoginApi(loginForm);
      if (res2.status === "ok") {
        ElMessage.success("登录成功");
        setToken(res2.data.token);
        const loadingFull = ElLoading.service({
          lock: true,
          text: "正在进行初始化...",
          spinner: "el-icon-loading",
          background: "rgba(0, 0, 0, 0.7)",
        });
        setTimeout(() => {
          router.push("/home");
          loadingFull.close();
          ElMessage.closeAll();
        }, 400);
      } else {
        ElMessage.warning(res2.msg);
      }
    }
  });
};

const rules = reactive<FormRules>({
  username: [{ required: true, message: "请输入用户名", trigger: "blur" }],
  password: [{ required: true, message: "请输入密码", trigger: "blur" }],
  verifyCode: [{ required: true, message: "请输入验证码", trigger: "blur" }],
});
</script>

<template>
  <img src="@/assets/images/background.png" alt="" class="bg-xhr-img" />
  <div class="login-wrap">
    <div class="login_pane">
      <img src="@/assets/images/logo.png" alt="" class="logo-img" />
      <div class="login-tab">
        <span :class="{ 'active-tab': activeTab === 1 }" @click="tabChange(1)">管理员登录</span>
        <span :class="{ 'active-tab': activeTab === 2 }" @click="tabChange(2)">商家登录</span>
      </div>
      <div class="login-form">
        <p class="title">欢迎登录</p>
        <el-form
          :model="loginForm"
          ref="ruleFormRef"
          :rules="rules"
          label-width="0px"
          :size="'large'"
        >
          <el-form-item label="" prop="username">
            <el-icon :color="'#0099ff'" :size="22"><Avatar /></el-icon>
            <el-input v-model="loginForm.username" placeholder="请输入用户名" />
          </el-form-item>
          <el-form-item label="" prop="password">
            <el-icon :color="'#0099ff'" :size="22"><Lock /></el-icon>
            <el-input v-model="loginForm.password" placeholder="请输入密码" show-password />
          </el-form-item>
          <el-form-item label="" prop="verifyCode">
            <Icon :name="'icon-yanzhengma'" width="22px" height="22px" :color="'#0099ff'"></Icon>
            <el-input
              v-model="loginForm.verifyCode"
              placeholder="请输入验证码"
              @keypress.enter="toLogin"
              class="verify-code"
            />
            <img
              :src="verifyCodeImg"
              alt=""
              class="verify-img"
              @click="getVerifyCode"
              title="验证码"
            />
          </el-form-item>
          <el-button type="primary" @click="toLogin" round class="login_button">登录</el-button>
        </el-form>
      </div>
      <div class="login-form-bgc"></div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.bg-xhr-img {
  height: 100vh;
  width: 100vw;
  position: fixed;
  left: 0;
  top: 100px;
  z-index: -1;
}
// 0-1200px 样式
@media screen and (max-width: 1200px) {
  .title {
    display: none;
  }
  .bg-xhr-img {
    display: none;
  }
  .login-form-bgc {
    display: none;
  }
}
// 1200px - 100vw 样式
@media screen and (min-width: 1200px) {
  .title {
    display: block;
  }
  .bg-xhr-img {
    display: block;
  }
  .login_pane {
    width: 100vw !important;
    height: 100vh !important;
    position: relative;
  }
  .logo-img {
    left: 100px;
    top: 0;
    position: absolute;
  }
  .login-tab {
    right: 15%;
    top: 0;
    position: absolute;
    height: 100px;
    width: 400px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 0px !important;
    span {
      font-size: 24px !important;
    }
  }
  .login-form {
    right: 15%;
    top: 25%;
    position: absolute;
    height: 205px;
    width: 400px;
    padding: 20px;
    box-sizing: border-box;
  }
  .login-form-bgc {
    right: 15%;
    border-radius: 10px;
    top: 25%;
    position: absolute;
    height: 310px;
    width: 400px;
    z-index: -1;
    background-color: #fff;
    opacity: 0.7;
  }
}
.login-wrap {
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
}
.login_pane {
  display: flex;
  flex-direction: column;
  justify-content: center;
  height: 350px;
  width: 320px;
  border-radius: 5px;
  .login_button {
    width: 100%;
  }
}
.login-tab {
  font-size: 18px;
  margin-bottom: 20px;
  display: flex;
  justify-content: space-between;
  color: #999;
  span {
    font-size: inherit;
    display: inline-block;
    cursor: pointer;
    &:hover {
      color: #79bbff;
      border-color: #79bbff;
    }
  }
  .active-tab {
    color: #0099ff;
    font-weight: 1000;
    border-bottom: 2px solid #0099ff;
  }
}
:deep(.el-form-item__content) {
  display: flex;
  flex-wrap: nowrap;
  .el-icon,
  .icon {
    margin-right: 10px;
  }
}
.title {
  height: 50px;
  line-height: 50px;
  text-align: center;
  font-size: 24px;
  font-weight: 1000;
  color: #888;
  letter-spacing: 10px;
}
.verify-code {
  width: calc(100% - 32px - 90px);
}
.verify-img {
  border-radius: 5px;
  margin-left: 10px;
  cursor: pointer;
}
</style>
