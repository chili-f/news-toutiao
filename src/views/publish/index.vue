<template>
  <div class="publish-container">
    <el-card class="box-card">
      <div slot="header"
           class="clearfix">
        <!-- 面包屑 -->
        <el-breadcrumb separator-class="el-icon-arrow-right">
          <el-breadcrumb-item to="/">首页</el-breadcrumb-item>
          <el-breadcrumb-item>{{$route.query.id?'修改':'发布'}}文章</el-breadcrumb-item>
        </el-breadcrumb>
      </div>
      <el-form ref="publish-form"
               :model="article"
               :rules="formRules"
               label-width="60px">
        <el-form-item label="标题"
                      prop="title">
          <el-input v-model="article.title"></el-input>
        </el-form-item>
        <el-form-item label="内容"
                      prop="content">
          <!-- <el-input type="textarea"
                    v-model="article.content"></el-input> -->
          <el-tiptap lang="zh"
                     height='300'
                     placeholder="请输入文章内容"
                     v-model="article.content"
                     :extensions="extensions">
          </el-tiptap>
        </el-form-item>
        <el-form-item label="封面"
                      prop="">
          <el-radio-group v-model="article.cover.type">
            <el-radio :label="1">单图</el-radio>
            <el-radio :label="3">三图</el-radio>
            <el-radio :label="0">无图</el-radio>
            <el-radio :label="-1">自动</el-radio>
          </el-radio-group>
          <!-- 我们需要把选择的封面图片的地址放到 article.cover.images数组中 -->
          <!-- 当你给事件处理函数传递了自定义参数后，就无法得到原本的那个数据参数了
               
            如果想在时间处理函数自定义传参以后还想得到时间本身的参数，则手动指定$event
          它就代表那个事件本身的参数 -->

          <!-- 在组件上使用v-model
               当你给子组件提供的数据，既要使用还要修改，这个时候我们可以使用v-model简化数据绑定 -->

          <!--  v-model="article.cover.images[index]"   
          这句话相当于给子组件传递了一个名字叫value的数据，默认监听input事件，当事件发生，它会让绑定数据 = 事件参数
                      :value='article.cover.images[index]'
                       @input = 'article.cover.images[index]' = 事件参数
           -->
          <template v-if="article.cover.type > 0">
            <uploadCover :key="index"
                         v-for="(cover,index) in article.cover.type"
                         v-model="article.cover.images[index]" />
          </template>
          <!-- 第一种方法，修改了子组件的属性之后，就不显示了，上面的方法使用v-model改正问题 -->
          <!-- <uploadCover :key="index"
                       v-for="(cover,index) in article.cover.type"
                       :cover-image='article.cover.images[index]'
                       @update-cover="onUpdateCover(index,$event)" /> -->
        </el-form-item>
        <el-form-item label="频道"
                      prop="channel_id">
          <el-select v-model="article.channel_id"
                     placeholder="请选择频道">
            <el-option :label="channel.name"
                       :value="channel.id"
                       v-for="(channel,index) in channels"
                       :key="index"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary"
                     @click="onPublish(false)">{{$route.query.id?'修改':'发布'}}</el-button>
          <el-button @click="onPublish(true)">存入草稿</el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script>
import uploadCover from './components/upload-cover'
import { uploadImage } from '@/api/image.js'
import { getArticleChannels, addArticle, updateArticle, getArticles } from '@/api/article.js'
import {
  ElementTiptap,
  Doc,
  Text,
  Paragraph,
  Heading,
  Bold,
  Underline,
  Image,
  Italic,
  Strike,
  ListItem,
  BulletList,
  OrderedList,
  TodoItem,
  TodoList,
  Fullscreen
} from 'element-tiptap';
import 'element-tiptap/lib/index.css';

export default {
  components: {
    'el-tiptap': ElementTiptap,
    uploadCover
  },
  data () {
    return {
      channels: [],//文章频道列表
      article: {
        title: '',//文章标题
        content: '',//文章的内容
        cover: {//文章封面
          type: 1,//封面类型
          images: []//封面图片的地址//-1-自动 0-无图 3-3张
        },
        channel_id: null//存放频道
      },
      extensions: [
        new Doc(),
        new Text(),
        new Paragraph(),
        new Heading({ level: 3 }),
        new Bold({ bubble: true }), // 在气泡菜单中渲染菜单按钮
        new Underline({ bubble: true, menubar: false }), // 在气泡菜单而不在菜单栏中渲染菜单按钮
        new Italic(),//斜体
        new Image({
          // 默认会把图片生成base64字符串和内容存储在一起，如果需要
          // 自定义图片上传
          uploadRequest (file) {
            const fd = new FormData()
            fd.append('image', file)
            return uploadImage(fd).then(res => {
              return res.data.data.url
            })
          }
        }),
        new Strike(),
        new ListItem(),
        new BulletList(),//无序列表
        new OrderedList(),//有序列表
        new TodoItem(),
        new TodoList(),
        new Fullscreen()
      ],
      formRules: {
        title: [
          { required: true, message: '请输入文章标题', trigger: 'blur' },
          { min: 5, max: 30, message: '长度在 5 到 30 个字符', trigger: 'blur' }
        ],
        content: [
          // { required: true, message: '请输入文章内容', trigger: 'change' }
          {
            validator (rule, value, callback) {
              if (value === '<p></p>') {
                // 验证失败
                callback(new Error('请输入文章内容'))
              } else {
                //  验证通过
                callback()
              }
            }
          },
          { required: true, message: '请输入文章内容', trigger: 'change' }
        ],
        channel_id: [
          { required: true, message: '请输入文章频道' }
        ],
      }
    }
  },
  created () {
    this.loadChannels();

    //由于我们让发布和修改使用的同一个组件
    // 所以这里要判断
    //如果路由参数中有id，则请求展示文章内容
    if (this.$route.query.id) {
      this.loadArticle()
    }
  },
  methods: {
    loadChannels () {
      getArticleChannels().then(res => {
        this.channels = res.data.data.channels
      })
    },
    // 子组件传递过来的值
    onUpdateCover (index, url) {
      this.article.cover.images[index] = url
    },
    // 点击发布按钮
    onPublish (draft) {
      this.$refs['publish-form'].validate((valid) => {
        if (!valid) {
          // 验证失败，停止提交
          return
        } else {
          // 验证通过，提交表单
          const articleId = this.$route.query.id
          // 如果是修改文章，则执行修改操作，否则执行添加操作
          if (articleId) {
            // 执行修改操作
            updateArticle(articleId, this.article, draft).then(res => {
              console.log(res);
              this.$message({
                message: `${draft ? '存入草稿' : '修改'}成功`,
                type: 'success'
              })
              //跳转到内容管理页面
              this.$router.push('/article')
            })
          } else {
            addArticle(this.article, draft).then(res => {
              this.$message({
                message: `${draft ? '存入草稿' : '发布'}成功`,
                type: 'success'
              })
              //跳转到内容管理页面
              this.$router.push('/article')
            })
          }
        }
      });
    },
    // 修改文章：加载文章内容
    loadArticle () {
      getArticles(this.$route.query.id).then(res => {
        this.article = res.data.data
      })
    }
  }
}
</script>

<style>
</style>