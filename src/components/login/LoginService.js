import Vue from 'vue'
import Constant from '../shared/Constant'
import Ulti from '../shared/Ulti'
import CryptoJS from 'crypto-js'

export default new Vue({
  data: {
    token: ''
  },
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
      return this.$http.post(url, obj)
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
