// 基于axios 封装的请求模块
import axios from 'axios'
import JSONbig from 'json-bigint'
import router from '@/router'
// 非组件中的使用方法
import { Message } from 'element-ui'
// 创建一个axios实例，说白了就是复制了一个axios
// 我们通过这个实例去发请求，把需要的配置给这个实例
const request = axios.create({
  baseURL: 'http://api-toutiao-web.itheima.net',// 请求的基础路径
  // 定制后端返回的原始数据的处理
  //  参数data就是后端返回的原始数据（未经处理的json格式的数据）
  transformResponse: [function (data) {
    // axios默认是在内部使用JSON.parse来转换处理原始数据的

    // 后端返回的数据可能不是一个标准的 JSON格式字符串
    // 如果不是的话，那么JSONbig.parse就会报错
    // 所以我们使用try catch捕获异常，处理异常的发生=
    try {
      // 如果转换成功，则直接把结果返回
      return JSONbig.parse(data)
    } catch (err) {
      console.log('转换失败', err)
      // 如果转换失败了，则进入这里
      // 我们在这里把数据原封不动的直接返回给请求使用
      return data
    }
  }]
})

// 请求拦截器
request.interceptors.request.use(
  //所有请求会经过这里
  //config 是当前请求相关的配置信息对象
  //config是可以修改的
  function (config) {
    // console.log(config)
    // 然后我们就可以在允许请求出去之前定制统一业务能力处理
    //例如：统一设置token
    // 拿到的是json格式的字符串，要转换为对象格式
    const user = JSON.parse(window.localStorage.getItem('user'))
    //如果有登陆用户信息，则统一设置 token  
    if (user) {
      config.headers.Authorization = `Bearer ${user.token}`
    }

    // 当这里return config 之后请求才会真正的发出去
    return config;
  },
  //所有请求失败会经过这里
  function (error) {
    return Promise.reject(error);
  });
// 响应拦截器   当伪造了数据就会进入这里
request.interceptors.response.use(function (response) {
  // 响应成功进入这里
  // response 是响应数据
  // 注意：一定要把响应结果return 否则真正发请求的位置拿不到数据
  return response;
}, function (error) {
  const { status } = error.response
  // 任何超出2xx的响应码都会经过这里  响应码异常
  if (status === 401) {
    // 提示信息
    Message.error('登录状态无效，请重新登录')
    // 跳转到登录页面
    router.push('/login')
    // 清除本地存储   删除无效的数据
    window.localStorage.removeItem('user')
  } else if (status === 400) {
    Message.error('请求参数错误，请检查请求参数')
  } else if (status === 403) {//403没有权限
    Message.error('没有操作权限')
  } else if (status >= 500) {//服务端错误
    Message.error('服务端内部异常，请稍后重试')
  }
  return Promise.reject(error);
});

// 导出请求方法
export default request

// 谁要使用谁就加载这个request模块
// import request from 'request.js'
