<template>
  <div class="Header">
    <div class="left_part">
      <a href="javascript:;" @click="toggleCollapsed">
        <el-icon :size="20">
          <expand v-if="collapsed" />
          <fold v-else />
        </el-icon>
      </a>
      <Breadcrumb class="breadcrumb-name" />
    </div>
    <div class="right_part">
      <span class="quanping" @click="fullChange"
        ><el-icon :size="16"><FullScreen v-if="isFull" /><BottomLeft v-else /></el-icon
        >{{ isFull ? "全屏" : "还原" }}</span
      >
      <el-dropdown>
        <span class="el-dropdown-link user-info-area">
          <span class="user-name">system</span>
          <el-icon class="icon-down"><arrow-down-bold /></el-icon>
        </span>
        <template #dropdown>
          <el-dropdown-menu>
            <el-dropdown-item
              @click="clickMenuItem(item)"
              v-for="(item, index) in menuOptions"
              :key="index"
              >{{ item.label }}</el-dropdown-item
            >
          </el-dropdown-menu>
        </template>
      </el-dropdown>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { useRouter } from "vue-router";
import { computed, ref, onBeforeUnmount, onMounted } from "vue";
import screenfull from "screenfull";
import { ElMessage } from "element-plus/es";
import Breadcrumb from "./Breadcrumb.vue";
import common from "@/store/modules/common";
import { removeToken } from "@/utils/token/index";

const props = defineProps({
  appWidth: {
    type: Number,
    default: 0,
  },
});

const menuOptions = [
  {
    label: "退出登录",
    routeName: "Logout",
    icon: "poweroff",
  },
];
const collapsed = computed({
  get() {
    return common.collapsed;
  },
  set(val: boolean) {
    common.toggleCollapsed(val);
  },
});

const router = useRouter();
const clickMenuItem = (item: { routeName: string }) => {
  if (item.routeName === "Logout") {
    removeToken();
    ElMessage.success("已成功退出");
    router.push({ name: "Login" });
  }
};

const toggleCollapsed = () => {
  collapsed.value = !collapsed.value;
  if (props.appWidth <= 768) {
    common.changeIsAside(!collapsed.value);
  }
};

//  全屏状态
const isFull = ref(true);

// 点击icon切换全屏事件
const fullChange = () => {
  // 判断当前浏览器是否支持全屏
  if (screenfull.isEnabled) {
    isFull.value = !isFull.value;
    screenfull.toggle();
  } else {
    ElMessage.warning("当前浏览器不支持全屏");
  }
};

const resizeChange = () => {
  isFull.value = !screenfull.isFullscreen;
};

onMounted(() => {
  // 监听窗口大小变化（全屏改变）事件
  window.addEventListener("resize", resizeChange);
});

onBeforeUnmount(() => {
  //  注销
  window.removeEventListener("resize", resizeChange);
});
</script>
<style lang="scss" scoped>
.Header {
  height: 64px;
  display: flex;
  box-sizing: border-box;
  padding: 0 20px;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid #e4e7ed;
  z-index: 1000;
  .left_part {
    display: flex;
    align-items: center;
    a {
      margin-right: 10px;
    }
  }
  .right_part {
    align-items: center;
    display: flex;
  }
  .user-name {
    vertical-align: 5px;
    margin-right: 5px;
  }
  .user-info-area {
    cursor: pointer;
    .icon-box {
      width: 20px;
      height: 20px;
      background-color: #eee;
      border-radius: 10px;
    }
    .icon-down {
      vertical-align: 2px;
    }
  }
  .quanping {
    display: flex;
    justify-content: center;
    align-items: center;
    margin-right: 20px;
    cursor: pointer;
    padding-bottom: 5px;
    &:hover {
      color: #4090c0;
    }
    .el-icon {
      margin-right: 5px;
      vertical-align: middle;
    }
  }
}
</style>
<style>
.el-popper {
  z-index: 3000 !important;
}
</style>
