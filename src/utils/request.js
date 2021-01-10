// 基于axios 封装的请求模块
import axios from 'axios'
// 创建一个axios实例，说白了就是复制了一个axios
// 我们通过这个实例去发请求，把需要的配置给这个实例
const request = axios.create({
  baseURL: 'http://api-toutiao-web.itheima.net'// 请求的基础路径
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
// 响应拦截器

// 导出请求方法
export default request

// 谁要使用谁就加载这个request模块
// import request from 'request.js'
