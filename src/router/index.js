import Vue from 'vue'
import Router from 'vue-router'
import index from '@/components/index'
import drag from '@/components/drag' 
import Gantt from '@/components/Gantt'  
import GanttOrderNo from '@/components/GanttOrderNo'  
import login from '@/components/login'
import kanban from '@/components/kanban'
import schedule from '@/components/schedule'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'index',
      component: index , 
      redirect: '/drag' 

    },
    {
      path:'/drag',
      component: drag,
      name:'drag',
      meta: {
        keepAlive: true, //此组件被缓存
      },
      component: resolve => require(['@/components/drag'], resolve)
    },
    {
      path:'/Gantt',
      component: Gantt,
      name:'Gantt'
    } ,
    {
      path:'/GanttOrderNo',
      component: GanttOrderNo,
      name:'GanttOrderNo'
    } ,
    {
      path: '/',
      name: 'login',
      component: login
    },
    {
      path: '/kanban',
      name: 'kanban',
      component: kanban
    },
    {
      path: '/schedule',
      name: 'schedule',
      component: schedule
    }
  ]
})
