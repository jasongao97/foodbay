import Vue from 'vue'
import Router from 'vue-router'

import login from '@/components/login/Login'
import home from '@/components/home/Home'
import canteenList from '@/components/canteen/canteen'
import userList from '@/components/user/user'
import foodList from '@/components/food/food'

Vue.use(Router)
export default new Router({
  routes: [{
    name: 'login',
    path: '/login',
    component: login
  }, {
    path: '/',
    component: home,
    children: [{
      name: 'home',
      path: '',
      component: canteenList
    }, {
      name: 'canteen',
      path: '/canteen',
      component: canteenList
    }, {
        name: 'user',
        path: '/user',
        component: userList
    }, {
        name: 'food',
        path: '/food',
        component: foodList
    }]
  }]
})
