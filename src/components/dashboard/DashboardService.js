import Vue from 'vue'

import Constant from '../shared/Constant'

export default new Vue({
  methods: {
    getCats () {
      const url = `${Constant.entryPoint}/api1/contents/menus?child=all&version=Web_Live&access_token=00536aefb1f78bca51f8b3fde6f643c5`
      return this.$http.get(url, {
        headers: {
          'Content-Type': 'application/json'
        }
      })
    },
    getCatContent (categoryId) {
      const url = `${Constant.entryPoint}/api1/contents/categories/${categoryId}/programs?until=now&include=product&include=multilang&popular=false&fortmat=long`
      return this.$http.get(url, {
        headers: {
          'Content-Type': 'application/json'
        }
      })
    }
  }
})
