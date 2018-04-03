import Vue from 'vue'
import Ulti from '../shared/Ulti'

import Constant from '../shared/Constant'

export default new Vue({
  methods: {
    get (vodId) {
      let url = `${Constant.entryPoint}/api1/contents/programs/${vodId}?include=product&include=purchase&include=fpackage&format=long`
      return new Promise((resolve, reject) => {
        this.$http.get(url).then((response) => {
          let data = response.body
          console.log(response.body)
          let result = Ulti.transformVod(data)
          resolve(result)
        }, (error) => {
          reject(error)
        })
      })
    }
  }
})
