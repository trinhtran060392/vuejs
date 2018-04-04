import Vue from 'vue'
import Constant from '../shared/Constant'
import Ulti from '../shared/Ulti'
import CryptoJS from 'crypto-js'

export default new Vue({
  methods: {
    login (user) {
      let url = `${Constant.entryPoint}/ott/accounts/login`
      let obj = {
        client_id: Constant.clientId,
        id: user.phone,
        password: CryptoJS.enc.Base64.stringify(CryptoJS.HmacSHA1(user.phone + user.password, user.password)),
        device: {
          id: user.phone,
          model: Ulti.getDeviceModel(),
          model_no: Ulti.getDeviceModelNumber(),
          type: Ulti.getTypeDevice()
        }
      }
      return this.$http.post(url, obj, {
        headers: {
          'Content-Type': 'application/json'
        }
      })
    },
    checkExpiredToken (response, request) {
      // this.kickDevice()
      return new Promise((resolve, reject) => {
        // If token is expired, refresh token, resubmit original request & resolve response for original request
        console.log(response)
        if (response.status === 401) {
          this.refreshToken(this, request).then((response) => {
            resolve(response)
          })
        }
        // Otherwise just resolve the current response
        resolve(response)
      })
    },
    refreshToken (context, request) {
      return new Promise((resolve, reject) => {
        // Refresh token
        let account = Ulti.getCurrentAccount()
        console.log(account)
        let param = {
          'refresh_token': account.refresh_token,
          'client_id': Constant.clientId,
          'hash': CryptoJS.enc.Base64.stringify(CryptoJS.HmacSHA1(account.refresh_token + Constant.clientId, Constant.appSecret))
        }
        let url = `${Constant.entryPoint}/ott/accounts/delegation`
        this.$http.post(url, param).then((response) => {
          // Store refreshed token
          localStorage.setItem('id_token', response.data.token)
          // Resubmit original request and resolve the response (probably shouldn't be the responsibility of the Auth service...)
          Vue.http(request).then((newResponse) => {
            resolve(newResponse)
          })
        }, (error) => {
          reject(error)
        })
      })
    },
    kickDevice () {
      let url = `${Constant.entryPoint}/ott/accounts/devices/switch`
      let obj = {}
      obj.devices = ['a9bb46901905008e3e5b6bed21816fcf']
      return this.$http.post(url, obj)
    },
    info () {
      let url = `${Constant.entryPoint}/ott/accounts/show?include=device`
      return this.$http.get(url)
    },
    getAccountUse () {
      let url = `${Constant.entryPoint}/ott/accounts/show?include=device`
      return this.$http.get(url, {
        headers: {
          'Authorization': `Bearer ${this.token}`
        }
      })
    },
    getPackageDevice () {
      let url = `${Constant.entryPoint}/api1/me/purchases/list?offset=0&limit=24&product_category=vod
      &product_category=channel&product_category=ott&product_category=catchup&product_category=npvr
      &product_category=full&product_type=subscription,package,fpackage&include_hidden=false&include=product
      &include=multilang&include=purchase&include=fpackage`
      return this.$http.get(url, {
        headers: {
          'Authorization': `Bearer ${this.token}`
        }
      })
    }
  }
})
