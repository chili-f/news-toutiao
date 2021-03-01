<template>
  <div class="login-container">
    <div class="login-head"></div>
    <!-- 配置from表单验证
    1. 必须给el-form组件绑定model为表单数据对象
    2. 给需要验证的表单项，绑定prop属性
      注意：prop属性需要指定表单对象中的数据名称
    3. 通过el-form组件的rules属性配置验证规则
    4. 手动触发表单验证
        1. 给el-form设置ref 起个名字
        2. 通过ref获取el-from组件，调用组件的validate方法进行验证
     -->
    <el-form
      ref="login-form"
      :model="user"
      :rules="formRules"
      class="login-form"
    >
      <el-form-item prop="mobile">
        <el-input v-model="user.mobile" placeholder="请输入手机号"></el-input>
      </el-form-item>
      <el-form-item prop="code">
        <el-input v-model="user.code" placeholder="请输入验证码"></el-input>
      </el-form-item>
      <el-form-item prop="agree">
        <el-checkbox v-model="user.agree"
          >我已阅读并同意用户协议和项目条款</el-checkbox
        >
      </el-form-item>

      <el-form-item>
        <el-button
          type="primary"
          @click="onLogin"
          style="width: 100%"
          :loading="loginLoading"
          >登录</el-button
        >
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import { login } from "@/api/user";
export default {
  name: "LoginIndex",
  data() {
    return {
      user: {
        mobile: "13911111111", // 手机号
        code: "246810", // 验证码
        agree: false, // 是否同意协议的选中状态
      },

      loginLoading: false, // 登录的loading
      formRules: {
        // 要验证的数据名称，验证规则[]
        mobile: [
          { required: true, message: "手机号不能为空", trigger: "change" },
          {
            pattern: /^[1][3,4,5,7,8,9][0-9]{9}$/,
            message: "请输入正确的号码格式",
            trigger: "change",
          },
        ],
        code: [
          { required: true, message: "验证码不能为空", trigger: "change" },
          { pattern: /^\d{6}$/, message: "请输入正确的验证码格式" },
        ],
        agree: [
          // 自定义验证规则
          // 验证通过：callback()
          // 验证失败：callback(new Error('错误消息'))
          {
            validator: (rule, value, callback) => {
              if (value) {
                callback();
              } else {
                callback(new Error("请同意用户协议"));
              }
            },
            trigger: "change",
          },
        ],
      }, // 表单验证规则
    };
  },
  methods: {
    onLogin() {
      // 获取表单数据(根据接口要求绑定数据)
      // const user = this.user
      // 表单验证
      // validate方法是异步的
      this.$refs["login-form"].validate((valid) => {
        // 如果表单验证失败，停止提交
        if (!valid) {
          return;
        }
        // 如果表单验证通过，请求登录
        this.login();
      });
    },
    login() {
      // 验证通过，提交登录
      // 开启登录中loading
      this.loginLoading = true;
      login(this.user)
        .then((res) => {
          // 登录成功
          this.$message.success("登陆成功");
          // 关闭loading
          this.loginLoading = false;
          // 将接口返回的用户相关数据放到本地存储，方便应用数据共享
          // 本地存储只能存字符串，
          // 如果要存储对象、数组类型的数据，要把他们转换成json格式字符串
          window.localStorage.setItem('user',JSON.stringify(res.data.data))
          // 跳转到首页
          this.$router.push('/')
        })
        .catch((err) => {
          // 登录失败
          this.$message.error("登陆失败,手机号或验证码错误");
          // 关闭loading
          this.loginLoading = false;
        });
      // 处理后端响应结果
      //     成功：xxx
      //     失败：xxx
    },
  },
};
</script>

<style scope lang='less'>
.login-container {
  position: fixed;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background: url("./bg.jpg") no-repeat;
  background-size: cover;
  .login-head {
    min-width: 300px;
    height: 57px;
    margin-bottom: 30px;
    background: url("./logo.png") no-repeat;
  }
  .login-form {
    background-color: #fff;
    padding: 50px;
    min-width: 300px;
  }
}
</style>
