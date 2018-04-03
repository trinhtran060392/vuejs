import Vue from 'vue'

import Constant from '../shared/Constant'
import Ulti from '../shared/Ulti'

export default new Vue({
  methods: {
    getCats () {
      const url = `${Constant.entryPoint}/api1/contents/menus?child=all&version=Web_Live`
      return this.$http.get(url, {
        headers: {
          'Content-Type': 'application/json'
        }
      })
    },
    getCatContent (categoryId, limit) {
      let limitResult
      if (!limit) limitResult = 10
      else limitResult = limit
      const url = `${Constant.entryPoint}/api1/contents/categories/${categoryId}/programs?until=now&include=product&popular=false&fortmat=long&limit=${limitResult}`
      return new Promise((resolve, reject) => {
        this.$http.get(url).then((response) => {
          let data = response.body.data
          let result = []
          for (let i = 0; i < data.length; i++) {
            let vod = Ulti.transformLiteVod(data[i])
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
