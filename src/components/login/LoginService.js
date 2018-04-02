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
    }
  }
})
