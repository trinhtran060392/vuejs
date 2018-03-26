import Vue from 'vue'
import Router from 'vue-router'
import MainLayout from '@/components/MainLayout'
import Dashboard from '@/components/dashboard/Dashboard'
import LoginView from '@/components/LoginView'
import User from '@/components/user/User'
import ResultImageView from '@/components/ResultImageView'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      component: MainLayout,
      children: [
        { path: '', component: Dashboard },
        { path: 'users/:userId', name: 'user', component: User, props: true }
      ]
    }, {
      path: '/login',
      component: LoginView
    }, {
      path: '/result',
      component: ResultImageView
    }
  ]
})
