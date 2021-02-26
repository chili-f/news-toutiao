<template>
  <div class="settings-container">
    <el-card class="box-card">
      <div slot="header"
           class="clearfix">
        <!-- 面包屑 -->
        <el-breadcrumb separator-class="el-icon-arrow-right">
          <el-breadcrumb-item to="/">首页</el-breadcrumb-item>
          <el-breadcrumb-item>个人设置</el-breadcrumb-item>
        </el-breadcrumb>
      </div>
      <el-row>
        <el-col :span="15">
          <el-form ref="form"
                   :model="user"
                   label-width="70px">
            <el-form-item label="编号">
              {{user.id}}
            </el-form-item>
            <el-form-item label="手机">
              {{user.mobile}}
            </el-form-item>
            <el-form-item label="媒体名称">
              <el-input v-model="user.name"></el-input>
            </el-form-item>
            <el-form-item label="媒体介绍">
              <el-input type="textarea"
                        v-model="user.intro"></el-input>
            </el-form-item>
            <el-form-item label="邮箱">
              <el-input v-model="user.email"></el-input>
            </el-form-item>
            <el-form-item>
              <el-button type="primary"
                         @click="onUpdateUser"
                         :loading='updataprofilelOading'>保存</el-button>
              <el-button>取消</el-button>
            </el-form-item>
          </el-form>
        </el-col>
        <el-col :span="4"
                :offset="3">

          <!-- <p @click="$refs.file.click()">点击修改头像</p> -->
          <!-- ref='file' -->
          <label for="file">
            <el-avatar shape="square"
                       :size="150"
                       fit="cover"
                       :src="user.photo"></el-avatar>
            <p>点击修改头像</p>
          </label>
          <input ref='file'
                 id="file"
                 type="file"
                 hidden
                 @change="onFileChange">
        </el-col>
      </el-row>

    </el-card>

    <!-- 修改图像 -->
    <el-dialog title="提示"
               :visible.sync="dialogVisible"
               append-to-body
               width="30%"
               @opened="onDialogOpend"
               @closed="onDialogClosed">
      <div class="preview-image-wrap">
        <img class="preview-image"
             :src="previewImage"
             ref="preview-image">
      </div>
      <span slot="footer"
            class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary"
                   @click="dialogVisible = false">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { getUserProfile, updateUserProfile } from '@/api/user'
import 'cropperjs/dist/cropper.css'
import Cropper from 'cropperjs'
import globalBus from '@/utils/global-bus.js'

export default {
  name: 'SettingsIndex',
  data () {
    return {
      user: {
        email: '',
        id: null,
        intro: '',
        mobile: '',
        name: '',
        photo: ''
      },//用户资料
      dialogVisible: false, //控制上传图片裁切预览的显示状态
      previewImage: '', //预览图片
      cropper: null, //裁切器实例
      updataprofilelOading: false//更新基本信息的loading状态
    }
  },
  created () {
    this.loadUser()
  },
  methods: {
    // 点击保存按钮
    onUpdateUser () {
      // 验证通过提交表单
      this.updataprofilelOading = true
      const { name, intro, email } = this.user
      updateUserProfile({
        name,
        intro,
        email
      }).then(res => {
        this.$message({
          type: 'success',
          message: '保存成功'
        })
        this.updataprofilelOading = false
        // 发布通知，用户信息已修改
        globalBus.$emit('update-user', this.user)
      })
    },
    // 点击图片切换触发
    onFileChange () {
      // 1.处理图片预览
      const file = this.$refs.file
      const blobData = window.URL.createObjectURL(file.files[0])
      this.previewImage = blobData;
      this.dialogVisible = true

      // 解决选择相同文件不触发change事件问题
      this.$refs.file.value = ''
    },
    // 把代码写在弹出层完全显示的状态
    onDialogOpend () {
      // 图片裁切器必须基于img进行初始化，注意：img必须是可见状态，才能正常完成初始化
      // 获取图片的dom节点
      const image = this.$refs['preview-image']
      // 初始化裁截器
      // 第一次初始化好了之后，如果预览裁切器的图片发生了变化，裁切器默认不会更新
      // 如果需要预览图片发生变化更新裁切器：
      //    方法一： 裁切器的.replace方法
      //    方法二： 销毁裁切器，重新初始化
      this.cropper = new Cropper(image, {
        aspectRatio: 16 / 9,
        crop (event) {
          console.log(event.detail.x);
          console.log(event.detail.y);
          console.log(event.detail.width);
          console.log(event.detail.height);
          console.log(event.detail.rotate);
          console.log(event.detail.scaleX);
          console.log(event.detail.scaleY);
        },
      });
    },
    // 当对话框彻底关闭，要进行销毁切切器
    onDialogClosed () {
      // this.cropper.destory()
      if (this.cropper) {
        this.cropper.replace()
        return
      }
      this.cropper = new Cropper(image, {
        aspectRatio: 16 / 9,
        crop (event) {
          console.log(event.detail.x);
          console.log(event.detail.y);
          console.log(event.detail.width);
          console.log(event.detail.height);
          console.log(event.detail.rotate);
          console.log(event.detail.scaleX);
          console.log(event.detail.scaleY);
        },
      });
    },
    // 加载页面就获取数据
    loadUser () {
      getUserProfile().then(res => {
        this.user = res.data.data
      })
    },
    onSubmit () {
      console.log('submit!');
    }
  }
}
</script>

<style scope lang='less'>
.preview-image-wrap {
  .preview-image {
    display: block;
    max-width: 100%;
    height: 200px;
  }
}
</style>