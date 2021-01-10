<template>
  <el-container class="layout-container">
    <el-aside width="auto">
      <AppAside class="aside-menu" />
    </el-aside>
    <el-container>
      <el-header class="header">
        <div>
          <i class="el-icon-s-fold"></i>
          <span>快报后台管理系统</span>
        </div>
        <el-dropdown>
          <div class="avatar-wrap">
            <img :src="user.photo" class="avatar" alt="" />
            <span>{{user.name}}</span>
            <i class="el-icon-arrow-down el-icon--right"></i>
          </div>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item>设置</el-dropdown-item>
            <el-dropdown-item>退出</el-dropdown-item>
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
import {getUserProfile} from '@/api/user'
export default {
    data(){
        return {
            user:{}
        }
    },
  components: {
    AppAside,
  },
  created () {
    // 组件初始化好，请求获取用户资料
    this.loadUserProfile()
  },
  methods:{
    //   除了登陆接口，其他所有接口都需要授权才能请求使用
    // 或者说，除了登陆接口，其他接口都需要提供你的身份令牌才能获取数据
      loadUserProfile(){
          getUserProfile().then(res=>{
              this.user = res.data.data
          })
      }
  }
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