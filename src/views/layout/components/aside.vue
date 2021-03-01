<template>
  <!-- 
    el-menu-item 的 index 不能重复  确保唯一即可
 -->
  <el-menu :default-active="$route.path"
           background-color="#002033"
           text-color="#fff"
           active-text-color="#ffd04b"
           router
           :collapse="isCollapse">
    <el-menu-item index="/">
      <i class="el-icon-s-home"></i>
      <span slot="title">首页</span>
    </el-menu-item>
    <el-menu-item index="/article">
      <i class="el-icon-s-marketing"></i>
      <span slot="title">内容管理</span>
    </el-menu-item>
    <el-menu-item index="/image">
      <i class="el-icon-picture"></i>
      <span slot="title">素材管理</span>
    </el-menu-item>
    <el-menu-item index="/publish">
      <i class="el-icon-s-promotion"></i>
      <span slot="title">发布文章</span>
    </el-menu-item>
    <el-menu-item index="/comment">
      <i class="el-icon-chat-square"></i>
      <span slot="title">评论管理</span>
    </el-menu-item>
    <el-menu-item index="/fans">
      <i class="el-icon-thumb"></i>
      <span slot="title">粉丝管理</span>
    </el-menu-item>
    <el-menu-item index="/settings">
      <i class="el-icon-user-solid"></i>
      <span slot="title">个人设置</span>
    </el-menu-item>
  </el-menu>
</template>

<script>
export default {
  props: ['is-collapse'],
  data () {
    return {
      // isCollapse: false,
    };
  },
  mounted () {
    this.$parent.runTime = new Date()
  },
  methods: {

  },
};
</script>

<style>
.el-menu {
  border: none !important;
}
</style>