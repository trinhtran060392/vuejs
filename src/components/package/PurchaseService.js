import Vue from 'vue'
import Constant from '../shared/Constant'
import Ulti from '../shared/Ulti'
import CryptoJS from 'crypto-js'

export default new Vue({
  methods: {
    create (product) {
      let clientId = Constant.clientId
      let accountInfo = Ulti.getCurrentAccount()
      let tokenSecret = accountInfo.tokenSecret
      let nonce = ''
      for (let i = 0; i < 6; i++) {
        nonce += [1, 2, 3, 4, 5, 6, 7, 8, 9][Math.floor(Math.random() * 9)]
      }
      let ts = (new Date()).getTime()
      let hash = encodeURIComponent(CryptoJS.enc.Base64.stringify(CryptoJS.HmacSHA1(clientId + product.product_id + ts + nonce, tokenSecret)))
      product.ts = ts
      product.hash = hash
      product.client_id = clientId
      product.nonce = nonce
      let url = Constant.entryPoint + '/api1/purchases/create'
      return this.$http.post(url, product)
    }
  }
})
