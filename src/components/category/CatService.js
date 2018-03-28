import Vue from 'vue'

import Constant from '../shared/Constant'
import Ulti from '../shared/Ulti'

export default new Vue({
  methods: {
    getMenuContent (menuId) {
      const url = `${Constant.entryPoint}/api1/contents/categories/${menuId}/categoies?until=now&include=product&popular=false&fortmat=long&limit=10`
      return new Promise((resolve, reject) => {
        this.$http.get(url).then((response) => {
          let data = response.body.data
          let result = []
          for (let i = 0; i < data.length; i++) {
            let vod = Ulti.transformVod(data[i])
            result.push(vod)
          }
          resolve(result)
        }, (error) => {
          reject(error)
        })
      })
    }
  }
})
