// 全局通信
// 作用：可以让任何组件之间相互通信
import Vue from 'vue'

export default new Vue()

// 假设a组件要给b组件发送数据

// b组件要注册通信的事件
// a要发布通信的事件