import Vue from 'vue'

import Constant from '../shared/Constant'

export default new Vue({
  methods: {
    getShows () {
      const url = `${Constant.entryPoint}/users`
      return this.$http.get(url, {
        headers: {
          'Content-Type': 'application/json'
        }
      })
    }
  }
})
