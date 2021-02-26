<template>
  <div class="upload-cover">
    <div class="cover-wrap"
         @click="showCoverSelect">
      <img :src="value"
           class="cover-image"
           ref="cover-image">
    </div>

    <!-- 提示框 -->
    <el-dialog title="选择封面"
               :visible.sync="dialogVisible"
               width="75%"
               append-to-body>
      <el-tabs v-model="activeName"
               type="card">
        <!-- 素材库tab -->
        <el-tab-pane label="素材库"
                     name="first">
          <!-- ref有两个作用
                     1.作用到普通html标签上可以获取dom
                     2.作用到组件上可以获取组件 -->
          <ImageList :is-show-add="false"
                     :isShowAction="false"
                     isShowSelected
                     ref="image-list" />
        </el-tab-pane>
        <!-- 上传图片tab -->
        <el-tab-pane label="
                     上传图片"
                     name="second">
          <input ref="file"
                 type="file"
                 @change="onFileChange">
          <img ref='preview-image'
               width="100"
               alt="">
        </el-tab-pane>
      </el-tabs>
      <span slot="footer"
            class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary"
                   @click="onCoverConfirm">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import ImageList from '@/views/image/components/image-list'
import { uploadImage } from '@/api/image'
export default {
  props: ['value'],
  data () {
    return {
      dialogVisible: false,
      activeName: 'first'
    }
  },
  components: {
    ImageList
  },
  methods: {
    // 点击确定
    onCoverConfirm () {
      // 如果tab是上传图片并且fileInput有选择的文件才执行上传图图片的操作
      if (this.activeName === 'second') {
        const file = this.$refs.file.files[0]
        // 如果没有图片
        if (!file) {
          this.$message('请选择文件')
          return
        }
        // 执行上传文件的操作
        const fd = new FormData()
        fd.append('image', file)
        uploadImage(fd).then(res => {
          // 关闭对话框
          this.dialogVisible = false
          // 展示上传的图片
          this.$refs['cover-image'].src = res.data.data.url

          //  将图片地址发送给父组件
          this.$emit('input', res.data.data.url)
        })
      } else if (this.activeName === 'first') {
        // 还有一种组件的通信方式：父组件可以直接访问子组件里的数据
        const imageList = this.$refs['image-list']
        const selected = imageList.selected
        if (selected === null) {
          this.$message('请选择封面图片')
          return
        }
        // 关闭对话框
        this.dialogVisible = false
        // 修改父组件绑定数据
        this.$emit('input', imageList.images[selected].url)
      }
    },
    showCoverSelect () {
      // 展示选择封面的弹窗
      this.dialogVisible = true
    },
    onFileChange () {
      // 获取文件对象
      const file = this.$refs.file.files[0]
      // 图片预览
      const blob = window.URL.createObjectURL(file)
      this.$refs['preview-image'].src = blob
      // 防止用户选择同一个文件不触发change事件
      // this.$refs.file.value = ''
    }
  }
}
</script>

<style scoped lang="less">
.cover-wrap {
  width: 150px;
  height: 120px;
  border: 1px solid #000;
  .cover-image {
    height: 120px;
    max-width: 100%;
  }
}
</style>