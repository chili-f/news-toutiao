<template>
  <div class="comment-container">
    <el-card class="box-card">
      <div slot="header"
           class="clearfix">
        <!-- 面包屑 -->
        <el-breadcrumb separator-class="el-icon-arrow-right">
          <el-breadcrumb-item to="/">首页</el-breadcrumb-item>
          <el-breadcrumb-item>评论管理</el-breadcrumb-item>
        </el-breadcrumb>
      </div>
      <!-- 表格 -->
      <!-- 
        1、把数据绑定给表格的data
        2、设置表格列
        3、给表格绑定要传染的数据字段
      -->
      <el-table :data="articles"
                style="width: 100%"
                stripe
                class="table-list">
        <el-table-column prop="title"
                         label="标题">
        </el-table-column>
        <el-table-column prop="total_comment_count"
                         label="总评论数">
        </el-table-column>
        <el-table-column prop="fans_comment_count"
                         label="粉丝评论数">
        </el-table-column>
        <el-table-column prop="comment_status"
                         label="评论状态">
          <template slot-scope="scope">
            {{scope.row.comment_status ? '正常' :'关闭'}}
          </template>
        </el-table-column>
        <el-table-column prop="name"
                         label="操作">
          <template slot-scope="scope">
            <el-switch v-model="scope.row.comment_status "
                       active-color="#13ce66"
                       inactive-color="#ff4949"
                       @change="onStatusChange(scope.row)"
                       :disabled="scope.row.statusDisabled">
            </el-switch>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页 -->
      <!-- 
          绑定页码
          绑定每页大小 
          current-page  控制激活的页码，初始肯定是第一页
          page-sizes   控制可选的每页大小
      -->
      <el-pagination background
                     @size-change="handleSizeChange"
                     @current-change="handleCurrentChange"
                     :current-page.sync="page"
                     :page-sizes="[10, 20,30,40]"
                     :page-size.sync="pageSize"
                     layout="total, sizes, prev, pager, next, jumper"
                     :total="totalCount" />
    </el-card>
  </div>
</template>

<script>
import { getArticle, updateCommentStatus } from '@/api/article'
export default {
  name: 'CommentIndex',
  data () {
    return {
      articles: [],//文章数据列表
      totalCount: 0,//总数据条数
      pageSize: 10,
      page: 1//当前激活的页码
    }
  },
  created () {
    this.loadArticles()
  },
  methods: {
    // 获取表格的数据
    loadArticles (page = 1) {
      // 让分页组件激活的页码和请求数据的页码保持一致
      this.page = page
      getArticle({
        response_type: 'comment',
        page,
        per_page: this.pageSize
      }).then(res => {
        const { results } = res.data.data;
        // 给默认的数据中添加状态的禁用按钮
        results.forEach(article => {
          article.statusDisabled = false;
        })
        this.articles = results;
        console.log(res);
        this.totalCount = res.data.data.total_count
      })
    },
    // 当点击操作按钮之后触发
    onStatusChange (article) {
      // 禁用开关
      article.statusDisabled = true
      // 获取到点击的那条数据
      updateCommentStatus(article.id.toString(), article.comment_status).then(res => {
        // 启用开关
        article.statusDisabled = false
        this.$message({
          type: 'success',
          message: article.comment_status ? '开启文章评论状态' : '关闭文章评论状态'
        })
      })
      // 调用接口
    },
    handleSizeChange (page) {
      // 每页数据改变
      this.loadArticles(page)
    },
    handleCurrentChange (page) {
      // 页码改变，加载指定页码的数据
      this.loadArticles(page)
    }
  }
}
</script>

<style>
.table-list {
  margin-bottom: 30px;
}
</style>