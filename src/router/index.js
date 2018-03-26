import Vue from 'vue'
import Router from 'vue-router'
import MainLayout from '@/components/layout/MainLayout'
import Dashboard from '@/components/dashboard/Dashboard'
import Profile from '@/components/profile/Profile'
import User from '@/components/user/User'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      component: MainLayout,
      children: [
        { path: '', component: Dashboard },
        { path: 'users/:userId', name: 'user', component: User, props: true },
        { path: 'profile', component: Profile }
      ]
    }
  ]
})
