import Vue from 'vue'
import Router from 'vue-router'
import MainLayout from '@/components/MainLayout'
import Dashboard from '@/components/Dashboard'
import LoginView from '@/components/LoginView'
import ProjectView from '@/components/ProjectView'
import ResultImageView from '@/components/ResultImageView'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      component: MainLayout,
      children: [
        { path: '', component: Dashboard },
        { path: 'project/:projectId', name: 'project', component: ProjectView, props: true }
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
