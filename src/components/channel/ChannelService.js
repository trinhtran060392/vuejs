import Vue from 'vue'
import CryptoJS from 'crypto-js'
import Ulti from '../shared/Ulti'
import Constant from '../shared/Constant'

export default new Vue({
  methods: {
    list (limit) {
      const url = `${Constant.entryPoint}/api1/contents/channels?region=OTT&child=all&offset=0&limit=${limit}`
      return this.$http.get(url)
    },
    get (channelId) {
      const url = `${Constant.entryPoint}/api1/contents/channels/${channelId}/?region=OTT&limit=1&format=long&include=product&include=multilang&include=purchase&include=fpackage`
      return new Promise((resolve, reject) => {
        this.$http.get(url).then((response) => {
          let result = Ulti.transformVod(response.body)
          resolve(result)
        }, (error) => {
          reject(error)
        })
      })
    },
    prepare (channel, ts) {
      let deviceId = Ulti.getDeviceid()
      let clientId = Constant.clientId
      let appSecret = Constant.appSecret
      let currentAccount = Ulti.getCurrentAccount()
      let hash = CryptoJS.enc.Base64.stringify(CryptoJS.HmacSHA1(clientId + deviceId + currentAccount.id + ts, appSecret))
      let param = {
        hash: hash,
        ts: ts,
        version: 1,
        regionId: 'GUEST',
        assetId: channel.channel.pid,
        filename: `${channel.channel.pid}.m3u8`,
        manifestType: 'HLS',
        bwProfile: 4,
        serviceProvider: 'WebApps',
        userId: currentAccount.id
      }
      let url = `${Constant.entryPoint}/api1/watches/handheld/live/preparetoken?access_token=${currentAccount.accessToken}&hash=${hash}&ts=${ts}&client_id=${clientId}&service_provider=WebPC&bw_profile=4`
      return this.$http.post(url, param)
    }
  }
})
