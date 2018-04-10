import Vue from 'vue'
import Router from 'vue-router'
import MainLayout from '@/components/layout/MainLayout'
import Dashboard from '@/components/dashboard/Dashboard'
import Profile from '@/components/profile/Profile'
import Category from '@/components/category/Category'
import SubCategory from '@/components/category/SubCategory'
import Channel from '@/components/channel/Channel'
import VodDetail from '@/components/vod/VodDetail'
import History from '@/components/profile/History'
import ThePlayer from '@/components/player/ThePlayer'
import Search from '@/components/search/Search'
import Ulti from '../components/shared/Ulti'
import store from '../store'
Vue.use(Router)

const router = new Router({
  routes: [
    {
      path: '/',
      component: MainLayout,
      children: [
        { path: '', component: Dashboard },
        { path: 'cat/:catId', name: 'category', component: Category, props: true },
        { path: 'subcat/:catId', name: 'sub-category', component: SubCategory, props: true },
        { path: 'channels/:channelId', name: 'channel', component: Channel },
        { path: 'account', name: 'account', component: Profile, meta: { requiresAuth: true, leftMenu: true } },
        { path: 'vod/:vodId', name: 'detail', component: VodDetail },
        { path: 'history', name: 'history', component: History, meta: { requiresAuth: true, leftMenu: true } },
        { path: 'play/:videoId', name: 'play', component: ThePlayer },
        { path: 'search', name: 'search', component: Search }
      ]
    }
  ]
})

router.beforeEach((to, from, next) => {
  if (to.meta.requiresAuth) {
    // this route requires auth, check if logged in
    // if not, redirect to login page.
    let isAuthenticated = Ulti.isLoggedIn()
    console.log(isAuthenticated)
    if (!isAuthenticated) {
      next({
        path: '/'
      })
      store.dispatch('setIsInSettingPage', false)
    } else {
      next()
    }
  } else {
    next() // make sure to always call next()!
  }
  if (to.meta.leftMenu && Ulti.isLoggedIn()) {
    console.log(to, from)
    store.dispatch('setIsInSettingPage', true)
    console.log('has left menu')
  } else {
    store.dispatch('setIsInSettingPage', false)
    console.log('has not left menu')
  }
})

export default router
