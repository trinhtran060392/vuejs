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
    },
    getCatContentByOffset (categoryId, offset, limit) {
      const url = `${Constant.entryPoint}/api1/contents/categories/${categoryId}/programs?until=now&include=product&popular=false&fortmat=long&limit=${limit}&offset=${offset}`
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
    },
    getBanners () {
      let url = `${Constant.entryPoint}/api1/contents/campaigns/campaigns?pid=package.campaign://OTT.MAIN.PROMO.WEB`
      return this.$http.get(url)
    },
    getResumeList () {
      let url = `${Constant.entryPoint}/api1/watches/resume_list?type=vod&offset=0&limit=10`
      return this.$http.get(url)
    }
  }
})
