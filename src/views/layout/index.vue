<template>
  <el-container class="layout-container">
    <el-aside width="auto">
      <AppAside :is-collapse="isCollapse" class="aside-menu" />
    </el-aside>
    <el-container>
      <el-header class="header">
        <div>
          <!-- class样式处理
               {
                 css类名：布尔值
               }
               true: 作用类名
               false：不作用类名
           -->
          <i
            :class="{
              'el-icon-s-fold': isCollapse,
              'el-icon-s-unfold': !isCollapse,
            }"
            @click="isCollapse = !isCollapse"
          ></i>
          <span>快报后台管理系统</span>
        </div>
        <el-dropdown>
          <div class="avatar-wrap">
            <img :src="user.photo" class="avatar" alt="" />
            <span>{{ user.name }}</span>
            <i class="el-icon-arrow-down el-icon--right"></i>
          </div>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item>设置</el-dropdown-item>
            <!-- 组件默认是不识别原声事件的，除非内部做了处理 -->
            <el-dropdown-item @click.native="onLogout">退出</el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
      </el-header>
      <el-main>
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
import AppAside from "./components/aside";
import { getUserProfile } from "@/api/user";
export default {
  data() {
    return {
      user: {}, //当前登陆的用户信息
      isCollapse: false, //侧边菜单栏的展开状态
    };
  },
  components: {
    AppAside,
  },
  created() {
    // 组件初始化好，请求获取用户资料
    this.loadUserProfile();
  },
  methods: {
    //   除了登陆接口，其他所有接口都需要授权才能请求使用
    // 或者说，除了登陆接口，其他接口都需要提供你的身份令牌才能获取数据
    loadUserProfile() {
      getUserProfile().then((res) => {
        this.user = res.data.data;
      });
    },
    // 退出登陆
    onLogout() {
      this.$confirm("确定退出吗?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          this.$message({
            type: "success",
            message: "退出成功!",
          });
          // 把用户的登陆状态清楚
          window.localStorage.removeItem("user");
          //跳转到登陆页面
          this.$router.push("/login");
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消退出",
          });
        });
    },
  },
};
</script>

<style>
.layout-container {
  position: fixed;
  left: 0;
  top: 0;
  right: 0;
  bottom: 0;
}
.header {
  height: 6px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid #ccc;
}
.avatar-wrap {
  display: flex;
  align-items: center;
}
.avatar {
  width: 40px;
  height: 40px;
  margin-right: 10px;
  border-radius: 50%;
}

.el-aside {
  padding: 0 10px;
  background-color: #002033;
}

.aside-menu {
  height: 100%;
}

.el-main {
  background-color: #e9eef3;
  color: #333;
}
</style>