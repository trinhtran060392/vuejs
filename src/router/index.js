import Vue from 'vue'
import Router from 'vue-router'
import MainLayout from '@/components/MainLayout'
import HelloWorld from '@/components/HelloWorld'
import LoginView from '@/components/LoginView'
import ProjectView from '@/components/ProjectView'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      component: MainLayout,
      children: [
        { path: '', component: HelloWorld },
        { path: 'project/:projectId', name: 'project', component: ProjectView, props: true }
      ]
    }, {
      path: '/login',
      component: LoginView
    }
  ]
})
