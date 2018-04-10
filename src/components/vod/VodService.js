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
    },
    relateVods (vodId) {
      let url = `${Constant.entryPoint}/so-web-app/so/recommend?frmt=json&dp=VT_PHONE_016_VODINFO_AR_VOD&pc=1&cust=&program_id=${vodId}&hot_max=15`
      return new Promise((resolve, reject) => {
        this.$http.get(url).then((response) => {
          let result = response.body
          if (result.dp.status !== 'NoScenarioResult') {
            let programIds = ''
            let items = result.dp.itemList.items
            for (let i = 0; i < items.length; i++) {
              let temp = items[i]
              programIds = programIds + temp.basisInfo.basisList[0].value + ','
            }
            let resultUrl = `${Constant.entryPoint}/api1/contents/programs?id=${programIds}&format=long&include=product`
            this.$http.get(resultUrl).then((response) => {
              let output = []
              for (let i = 0; i < response.body.data.length; i++) {
                let temp = response.body.data[i]
                let liteVod = Ulti.transformLiteVod(temp)
                output.push(liteVod)
              }
              resolve(output)
            })
          }
        }, (error) => {
          reject(error)
        })
      })
    },
    getVodURL (vodId, productId) {
      let url = `${Constant.entryPoint}/api1/watches/fvod/prepare?access_token=${Constant.guestToken}&id=${vodId}&product_id=${productId}&service_provider=${Constant.webPC}`
      return this.$http.get(url)
    },
    getEpsForSeriesVod (epId) {
      let url = `${Constant.entryPoint}/api1/contents/programs/series?id=${epId}&format=long&until=now`
      return new Promise((resolve, reject) => {
        this.$http.get(url).then((response) => {
          let output = []
          for (let i = 0; i < response.body.data.length; i++) {
            let temp = response.body.data[i]
            let liteVod = Ulti.transformLiteVod(temp)
            output.push(liteVod)
          }
          resolve(output)
        })
      })
    }
  }
})
