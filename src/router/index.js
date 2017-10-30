import Vue from 'vue'
import Router from 'vue-router'
import HelloWorld from '@/components/HelloWorld'
import TodoItem from '@/components/TodoItem'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'Hello',
      component: HelloWorld
    }, {

      path: 'todo',
      name: 'Hello.Todo',
      component: TodoItem
    }
  ]
})
