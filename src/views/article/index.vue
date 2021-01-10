<template>
  <div class="article-container">
    <el-card class="filter-card">
      <div slot="header" class="clearfix">
        <!-- 面包屑 -->
        <el-breadcrumb separator-class="el-icon-arrow-right">
          <el-breadcrumb-item to="/">首页</el-breadcrumb-item>
          <el-breadcrumb-item>内容管理</el-breadcrumb-item>
        </el-breadcrumb>
      </div>
      <!-- 数据筛选表单 -->
      <el-form ref="form" :model="form" label-width="40px" size="mini">
        <el-form-item label="状态">
          <el-radio-group v-model="form.resource">
            <el-radio label="全部"></el-radio>
            <el-radio label="草稿"></el-radio>
            <el-radio label="待审核"></el-radio>
            <el-radio label="审核通过"></el-radio>
            <el-radio label="审核失败"></el-radio>
            <el-radio label="已删除"></el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="频道">
          <el-select v-model="form.region" placeholder="请选择频道">
            <el-option label="区域一" value="shanghai"></el-option>
            <el-option label="区域二" value="beijing"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="日期">
          <el-date-picker
            v-model="form.date1"
            type="datetimerange"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            :default-time="['12:00:00']"
          >
          </el-date-picker>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="onSubmit">筛选</el-button>
        </el-form-item>
      </el-form>
    </el-card>

    <el-card>
      <div slot="header" class="clearfix">根据筛选条件查询到 2234 条结果：</div>
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
      <el-table
        stripe
        :data="articles"
        style="width: 100%"
        class="list-table"
        size="mini"
      >
        <el-table-column prop="" label="封面"> 
            <template slot-scope="scope">
                <!-- 错误写法 -->
              <!-- <img class="article-cover" :src="scope.row.cover.images[0] || 'no-cover.jpeg'" /> -->
              <img class="article-cover" v-if='scope.row.cover.images[0]' :src="scope.row.cover.images[0]" />
              <img class="article-cover" v-else src="no-cover.jpg'" alt='替换图片'/>
            
            </template>
        </el-table-column>
        <el-table-column prop="title" label="标题"> </el-table-column>
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
        <el-table-column prop="pubdate" label="发布时间"> </el-table-column>
        <el-table-column label="操作">
          <!--  如果需要自定义表格列模版，则把需要自定义的内容放到 template里面-->
          <template>
            <el-button
              size="mini"
              type="primary"
              circle
              icon="el-icon-edit"
            ></el-button>
            <el-button
              size="mini"
              type="danger"
              icon="el-icon-delete"
              circle
            ></el-button>
          </template>
        </el-table-column>
      </el-table>

      <!-- 列表分页 -->
      <el-pagination layout="prev, pager, next" :total="1000"> </el-pagination>
    </el-card>
  </div>
</template>

<script>
import { getArticle } from "@/api/article";
export default {
  data() {
    return {
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
        {status:0, text: "草稿" , type:"info"},
        {status:1, text: "待审核" , type:""},
        {status:2, text: "审核通过" , type:"success"},
        {status:3, text: "审核失败", type:"warning"},
        {status:4, text: "已删除" , type:"danger"}
      ],
    };
  },
  created() {
    this.loadArticles();
  },
  methods: {
    loadArticles() {
      getArticle().then((res) => {
        this.articles = res.data.data.results;
        console.log(this.articles);
      });
    },
    onSubmit() {
      console.log("submit");
    },
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
    width: 100px;
    height: 80px;
    /* background-size: cover; */
}
</style>