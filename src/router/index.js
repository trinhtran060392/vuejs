import Vue from 'vue'
import Router from 'vue-router'
import MainLayout from '@/components/layout/MainLayout'
import Dashboard from '@/components/dashboard/Dashboard'
import Profile from '@/components/profile/Profile'
import Category from '@/components/category/Category'
import SubCategory from '@/components/category/SubCategory'
import Channel from '@/components/channel/Channel'
Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      component: MainLayout,
      children: [
        { path: '', component: Dashboard },
        { path: 'profile', component: Profile },
        { path: 'cat/:catId', name: 'category', component: Category, props: true },
        { path: 'subcat/:menuId/:catId', name: 'sub-category', component: SubCategory, props: true },
        { path: 'channels/:channelId', name: 'channel', component: Channel }
      ]
    }
  ]
})
