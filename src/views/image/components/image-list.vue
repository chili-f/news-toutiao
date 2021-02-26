<template>
  <div class="image-list">
    <div class="action-head">
      <!-- 该组件不建议使用点击事件，用change事件去监听:label中的数据 -->
      <el-radio-group v-model="collect"
                      size="mini"
                      @change="onCollection">
        <el-radio-button :label="false">全部</el-radio-button>
        <el-radio-button :label="true">收藏</el-radio-button>
      </el-radio-group>
      <!-- 上传素材按钮 -->
      <el-button v-if="isShowAdd"
                 size="mini"
                 type="success"
                 @click="dialogUploadVisible=true">上传素材</el-button>
    </div>
    <!-- 素材列表 -->
    <el-row :gutter="10"
            style="position:relative">
      <el-col class="img-item"
              :xs='12'
              :sm="6"
              :md="6"
              :lg="4"
              v-for="(img,index) in images"
              :key="index"
              @click.native="selected = index">
        <el-image style="height: 200px"
                  :src="img.url"></el-image>
        <div v-if="isShowSelected&&selected === index"
             class="selected">
        </div>
        <div class="box"
             v-if="isShowAction">
          <!-- 
              class 样式绑定
              {
                css类名：布尔值
              }
              true: 作用类名
              false：不作用类名
             -->
          <el-button type="warning"
                     :icon="img.is_collected?'el-icon-star-on':'el-icon-star-off'"
                     circle
                     size="small"
                     @click="onCollect(img)"
                     :loading='img.loading'></el-button>
          <!-- <i :class="{
              'el-icon-star-on':img.is_collected,
              'el-icon-star-off':!img.is_collected
            }"
               @click="onCollect(img)"></i> -->
          <el-button type="danger"
                     icon="el-icon-delete"
                     circle
                     size="small"
                     :loading="img.loading"
                     @click="onDelete(img)"></el-button>
        </div>
      </el-col>
    </el-row>
    <!-- 分页 -->
    <!-- 数据分页，页码不会变化 -->
    <el-pagination background
                   layout="prev, pager, next"
                   :total="total"
                   :current-page.sync="page"
                   @current-change="onCurrentChange">
    </el-pagination>

    <!-- 弹出框 -->
    <!-- 绑定append-to-body可以让弹出框显示在所有元素的最上层，直接显示在body的节点上 -->
    <el-dialog title="收货地址"
               :visible.sync="dialogUploadVisible"
               :append-to-body="true">
      <!-- 拖拽上传图片
        upload 组件 本身就支持请求提交上传操作，说白了就是使用它不用自己去发请求，它就会自己发
        请求方法：默认就是POST
        请求路径：action 必须写完整的路径
        请求头：headers
       -->
      <el-upload class="upload-demo"
                 drag
                 action="http://api-toutiao-web.itheima.net/mp/v1_0/user/images"
                 :headers="uploadHeaders"
                 name="image"
                 multiple
                 :on-success="onUploadSuccess">
        <i class="el-icon-upload"></i>
        <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
        <div class="el-upload__tip"
             slot="tip">只能上传jpg/png文件，且不超过500kb</div>
      </el-upload>
    </el-dialog>
  </div>
</template>

<script>
import { getImages, collectImage, deleteImage } from '@/api/image'
export default {
  name: 'ImageList',
  props: {
    // 是都展示按钮
    isShowAdd: {
      type: Boolean,//是布尔值
      default: true//默认值
    },
    // 是否展示图片下面的操作
    isShowAction: {
      type: Boolean,//是布尔值
      default: true//默认值显示
    },
    // 是否展示
    isShowSelected: {
      type: Boolean,//是布尔值
      default: false//默认值显示
    }
  },
  data () {
    const user = JSON.parse(window.localStorage.getItem('user'))
    return {
      selected: null,//选中的
      collect: false,//默认查询全部数据列表
      images: [],//图片素材列表
      dialogUploadVisible: false,//弹出层
      uploadHeaders: {
        Authorization: `Bearer ${user.token}`
      },
      // 总数据条数
      total: 0,
      // 每页的大小
      pageSize: 20,
      page: 1,//当前页码
    }
  },
  mounted () {
    // 页面初始化加载第一页数据
    this.loadImages(1)
  },
  methods: {
    loadImages (page, collect) {
      getImages({
        collect: this.collect,
        page,
        per_page: 10
      }).then(res => {
        const results = res.data.data.results
        results.forEach(img => {
          // img对象本来就没有loading数据
          // 我们这里收到的往里面添加该数据时用来控制每个收藏的loading状态
          img.loading = false
        })

        // 把results里面的数据给images列表
        this.images = results
        // 数据总条数
        this.total = res.data.data.total_count
      })
    },
    onCollection (val) {
      this.loadImages(1, val)
    },
    onUploadSuccess () {
      // 关闭对话框
      this.dialogUploadVisible = false
      // 更新素材列表
      this.loadImages(this.page)

      this.$message({
        type: 'success',
        message: '上传成功'
      })
    },
    // 点击页码,页码改变触发
    onCurrentChange (page) {
      this.loadImages(page)
    },
    // 点击收藏
    onCollect (img) {
      // 展示loading
      img.loading = true
      collectImage(img.id, !img.is_collected).then(res => {
        //更新视图
        img.is_collected = !img.is_collected
        // 关闭 loading
        img.loading = false
      })
      // 已收藏，取消收藏
      // if (img.is_collected) {
      //   collectImage(img.id, false)
      // } else {
      //   // 没有收藏，添加收藏
      //   collectImage(img.id, true)
      // }
    },
    // 删除图片
    onDelete (img) {
      img.loading = true
      deleteImage(img.id).then(res => {
        // 重新加载数据列表
        this.loadImages(this.page)
        img.loading = false
      })
    }
  }
}
</script>

<style>
.action-head {
  padding-bottom: 20px;
  display: flex;
  justify-content: space-between;
}
.img-item {
  position: relative;
}
.box {
  display: flex;
  justify-content: space-evenly;
  align-items: center;
  position: absolute;
  bottom: 4px;
  right: 5px;
  left: 5px;
  height: 40px;
  background-color: rgba(204, 204, 204, 0.5);
}
.box i {
  font-size: 10px;
  color: #fff;
}
.selected {
  position: absolute;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
  z-index: 1;
  background: url("../dui.png") no-repeat;
  background-size: cover;
}
</style>