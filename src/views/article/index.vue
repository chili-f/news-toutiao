<template>
  <div class="article-container">
    <el-card class="filter-card">
      <div slot="header"
           class="clearfix">
        <!-- 面包屑 -->
        <el-breadcrumb separator-class="el-icon-arrow-right">
          <el-breadcrumb-item to="/">首页</el-breadcrumb-item>
          <el-breadcrumb-item>内容管理</el-breadcrumb-item>
        </el-breadcrumb>
      </div>
      <!-- 数据筛选表单 -->
      <el-form ref="form"
               :model="form"
               label-width="40px"
               size="mini"
               v-loading="loading">
        <el-form-item label="状态">
          <!-- el-radio默认把label作为文本和选中之后的value值 -->
          <el-radio-group v-model="status">
            <el-radio :label="null">全部</el-radio>
            <el-radio :label="0">草稿</el-radio>
            <el-radio :label="1">待审核</el-radio>
            <el-radio :label="2">审核通过</el-radio>
            <el-radio :label="3">审核失败</el-radio>
            <el-radio :label="4">已删除</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="频道">
          <el-select v-model="channelId"
                     placeholder="请选择频道">
            <el-option label="全部"
                       :value="null"></el-option>
            <el-option :label="channel.name"
                       :value="channel.id"
                       v-for="(channel,index) in channels"
                       :key="index"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="日期">
          <el-date-picker v-model="rangeDate"
                          type="datetimerange"
                          start-placeholder="开始日期"
                          end-placeholder="结束日期"
                          :default-time="['12:00:00']"
                          format='yyyy-MM-dd'
                          value-format="yyyy-MM-dd">
          </el-date-picker>
        </el-form-item>
        <el-form-item>
          <!-- button按钮的click事件有一个默认的参数，
          当你每页指定参数的时候，它会默认传递一个没用的参数 -->
          <el-button type="primary"
                     :disabled="loading"
                     @click="loadArticles()">查询
          </el-button>
        </el-form-item>
      </el-form>
    </el-card>

    <el-card>
      <div slot="header"
           class="clearfix">根据筛选条件查询到 {{total}} 条结果：
      </div>
      <!-- 表格 数据列表 -->
      <!-- 
          tab 表格组件
          1、把需要展示的数组列表数据绑定给table组件的data属性
             注意：不用v-for遍历，它自己会遍历
          2、设置表格列 ： el-table-column
             width可以设置表格列的宽度  label设置列的标题
             prop用来设定要渲染的列表项数据字段
          3、 表格列默认只能渲染普通文本，如果需要展示其他内容，例如：放过按钮、图片，那就需要自定义表格列模版
       -->
      <el-table stripe
                :data="articles"
                style="width: 100%"
                class="list-table"
                size="mini"
                v-loading="loading">
        <el-table-column prop=""
                         label="封面">
          <template slot-scope="scope">
            <!-- 错误写法 -->
            <!-- <img class="article-cover" :src="scope.row.cover.images[0] || 'no-cover.jpeg'" /> -->
            <img class="article-cover"
                 v-if='scope.row.cover.images[0]'
                 :src="scope.row.cover.images[0]" />
            <img class="article-cover"
                 v-else
                 src="./no-cover.jpg"
                 alt='替换图片' />
          </template>
        </el-table-column>
        <el-table-column prop="title"
                         label="标题"> </el-table-column>
        <el-table-column label="状态">
          <!-- 如果需要在自定义模版中使用当前遍历项，就在template上声明slot-scope='scope' -->
          <template slot-scope="scope">
            <el-tag :type="articleStatus[scope.row.status].type">{{articleStatus[scope.row.status].text}}</el-tag>
            <!-- <el-tag>{{scope.row.status}}</el-tag>  2 -->
            <!--  <el-tag v-else-if="scope.row.status === 1">待审核</el-tag>
            <el-tag v-else-if="scope.row.status === 2">审核通过</el-tag>
            <el-tag v-else-if="scope.row.status === 3">审核失败</el-tag>
            <el-tag v-else-if="scope.row.status === 4">已删除</el-tag> -->
          </template>
        </el-table-column>
        <el-table-column prop="pubdate"
                         label="发布时间"> </el-table-column>
        <el-table-column label="操作">
          <!--  如果需要自定义表格列模版，则把需要自定义的内容放到 template里面-->
          <template slot-scope="scope">
            <el-button size="mini"
                       type="primary"
                       circle
                       icon="el-icon-edit"
                       @click="$router.push('/publish?id='+scope.row.id)"></el-button>
            <el-button size="mini"
                       type="danger"
                       icon="el-icon-delete"
                       circle
                       @click="onDeleteArticle(scope.row.id)"></el-button>
          </template>
        </el-table-column>
      </el-table>

      <!-- 列表分页 -->
      <!-- total 用来设定总数据的条数
      它默认按照10条每页计算页码 -->
      <el-pagination layout="prev, pager, next"
                     :total="total"
                     :current-page.sync="page"
                     @current-change="onCurrentChange"
                     :page-size="pageSize"
                     :disabled="loading"> </el-pagination>
    </el-card>
  </div>
</template>

<script>
import { getArticle, deleteArticle, getArticleChannels } from "@/api/article";
export default {
  data () {
    return {
      // 表格数据加载中...
      loading: true,
      form: {
        name: "",
        region: "",
        date1: "",
        date2: "",
        delivery: false,
        type: [],
        resource: "",
        desc: "",
      },
      articles: [], //文章数据列表
      articleStatus: [
        { status: 0, text: "草稿", type: "info" },
        { status: 1, text: "待审核", type: "" },
        { status: 2, text: "审核通过", type: "success" },
        { status: 3, text: "审核失败", type: "warning" },
        { status: 4, text: "已删除", type: "danger" }
      ],
      // 总数据条数
      total: 0,
      // 每页的大小
      pageSize: 10,
      // 查询文章的状态，不传就是全部
      status: null,
      // 文章频道列表
      channels: [],
      // 查询文章的频道
      channelId: null,
      // 筛选的范围日期
      rangeDate: null,
      page: 1
    };
  },
  created () {
    // 表示第一次传递的数据为1
    this.loadArticles(1);
    this.loadChannels();
  },
  methods: {
    // 点击删除
    onDeleteArticle (articleId) {
      // 找到数据接口
      // 封装请求方法
      // 删除请求调用
      // 处理响应结果
      // console.log(articleId);
      // console.log(articleId.toString());
      this.$confirm("确定删除吗?", "删除提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          deleteArticle(articleId).then(res => {
            // 删除成功，更新当前页的文章列表数据
            this.loadArticles(this.page)
          })
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除",
          });
        });

    },
    // 获取频道接口
    loadChannels () {
      getArticleChannels().then((res) => {
        this.channels = res.data.data.channels
      })
    },
    // 获取接口数据
    loadArticles (page = 1) {
      // 请求开始加载中的loading
      this.loading = true
      getArticle({
        page,
        per_page: this.pageSize,
        status: this.status,
        channel_id: this.channelId,
        // 开始日期
        begin_pubdate: this.rangeDate ? this.rangeDate[0] : null,
        // 截止日期
        end_pubdate: this.rangeDate ? this.rangeDate[1] : null,
      }).then((res) => {
        this.articles = res.data.data.results
        this.total = res.data.data.total_count

        // 关闭加载中的loading
        this.loading = false
      });
    },
    // 点击页码,页码改变触发
    onCurrentChange (page) {
      this.loadArticles(page)
    }
  },
};
</script>

<style>
.filter-card {
  margin-bottom: 30px;
}
.list-table {
  margin-bottom: 20px;
}
.article-cover {
  width: 70px;
  height: 70px;
  /* background-size: cover; */
}
</style>