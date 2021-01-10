import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from '../views/login'
import Home from '../views/home'
import Layout from '../views/layout'

Vue.use(VueRouter)

const routes = [
  {
    path: '/login',
    name: 'Login',
    component: Login
  },
  {
    path: '/',
    //命名路由layout有一个默认路由，这个名字没有意义
    //正确的做法是： 如果有默认自路由，就不要给父路由起名字了
    // name: 'layout',
    component: Layout,
    children:[
      {
        path: '',//path为空，会作为默认子路由渲染
        name: 'Home',
        component: Home
      }
    ]
  },
  
]

const router = new VueRouter({
  routes
})

export default router
