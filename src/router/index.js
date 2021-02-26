import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from '../views/login'
import Home from '../views/home'
import Layout from '../views/layout'
import Article from '../views/article'
import Publish from '../views/publish'
import Image from '../views/image'
import Comment from '../views/comment'
import Settings from '../views/settings'

Vue.use(VueRouter)

const routes = [
  {
    path: '/login',
    name: 'login',
    component: Login
  },
  {
    path: '/',
    //命名路由layout有一个默认路由，这个名字没有意义
    //正确的做法是： 如果有默认自路由，就不要给父路由起名字了
    // name: 'layout',
    component: Layout,
    children: [
      {
        path: '',//path为空，会作为默认子路由渲染
        name: 'home',
        component: Home
      },
      {
        path: '/article',//内容管理
        name: 'article',
        component: Article
      },
      {
        path: '/publish',//内容管理
        name: 'publish',
        component: Publish
      },
      {
        path: '/image',//内容管理
        name: 'image',
        component: Image
      },
      {
        path: '/comment',//内容管理
        name: 'comment',
        component: Comment
      },
      {
        path: '/settings',//内容管理
        name: 'settings',
        component: Settings
      }
    ]
  },

]

const router = new VueRouter({
  routes
})
// 说白类，所有页面的导航都会经过这里   拦截页面的
// 守卫：三个参数
// to: 要去的路由页面信息
// from:  来自那里的路由信息
// next: 放行方法
router.beforeEach((to, from, next) => {
  //如果要访问的页面不是login，校验登陆状态
  //如果没有登陆，则跳转到登陆页面
  //如果登陆来，则允许通过
  // 允许通过next()

  const user = JSON.parse(window.localStorage.getItem('user'))
  //校验非登陆页面的登陆状态
  if (to.path != '/login') {
    if (user) {
      //已登陆，可以通过
      next()
    } else {
      //没有登陆跳转到登陆页面
      next('/login')
    }
  } else {
    //登陆页面放行
    next()
  }
})

export default router
