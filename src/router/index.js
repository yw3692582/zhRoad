import Vue from 'vue'
import Router from 'vue-router'
import Layout from '@/components/Layout'
// import Main from '../views/Main.vue'
// import Users from '../views/Users.vue'
// import Registered from '../views/Registered.vue'
// import Equipment from '../views/Equipment.vue'
// import White from '../views/White.vue'
// import Warning from '../views/Warning.vue'
Vue.use(Router)
// 解决重复点击链接的报错
const originalPush = Router.prototype.push
Router.prototype.push = function push(location) {
  return originalPush.call(this, location).catch(err => err)
}

const router = new Router({
  mode: 'history',
  // mode:'hash',
  routes: [
    //   {
    // 	path: '/',
    // 	name: 'White',
    // 	component: White
    // },
    {
      path: '/layout',
      name: 'Layout',
      component: Layout,
      children: [{
          path: '/main',
          name: 'Main',
          // component: Main
          component: (resolve) => require(['../views/Main.vue'], resolve)
        },
        {
          path: '/users',
          name: 'Users',
          // component: Users
          component: (resolve) => require(['../views/Users.vue'], resolve)
        },
        {
          path: '/registered',
          name: 'Registered',
          // component: Registered
          component: (resolve) => require(['../views/Registered.vue'], resolve)
        },
        {
          path: '/equipment',
          name: 'Equipment',
          // component: Equipment
          component: (resolve) => require(['../views/Equipment.vue'], resolve)
        },
        {
          path: '/warning',
          name: 'Warning',
          // component: Warning
          component: (resolve) => require(['../views/Warning.vue'], resolve)
        },
        {
          path: '/status',
          name: 'Status',
          // component: Warning
          component: (resolve) => require(['../views/Status.vue'], resolve)
        },
        {
          path: '/statistical',
          name: 'Statistical',
          // component: Warning
          component: (resolve) => require(['../views/Statistical.vue'], resolve)
        },
        {
          path: '/createEqu',
          name: 'CreateEqu',
          // component: Warning
          component: (resolve) => require(['../views/CreateEqu.vue'], resolve)
        },
        {
					path: '/monitor',
					name: 'Monitor',
					// component: Warning
					component:(resolve)=>require(['../views/Monitor.vue'],resolve)
				},
      ]
    },
    {
      path: '*',
      component: (resolve) => require(['../views/404.vue'], resolve)
    },
  ]
})

export default router;
