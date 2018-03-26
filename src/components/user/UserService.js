import Vue from 'vue'

import Constant from '../shared/Constant'

export default new Vue({
  methods: {
    getUser (id) {
      const url = `${Constant.entryPoint}/users/${id}`
      return this.$http.get(url, {
        headers: {
          'Content-Type': 'application/json'
        }
      })
    }
  }
})
