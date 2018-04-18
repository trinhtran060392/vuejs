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
      let queryStr = `?client_id=${clientId}&auto_renewal=${product.auto_renewal}&ts=${ts}&unit=${product.unit}&product_type=${product.product_type}&entry_path=""&content_id=${product.content_id}&product_category=${product.product_category}&rental_period=${product.rental_period}&product_name=${product.product_name}&product_id=${product.product_id}&hash=${hash}&nonce=${nonce}&amount=${product.amount}&promotion_id=${product.promotion_id}`
      let url = `${Constant.entryPoint}/api1/purchases/create${queryStr}`
      return this.$http.post(url, product)
    },
    pay (product, purchaseObj) {
      let paymentMethod = 'wallet'
      let queryStr = `?sale_code=${product.sale_code}&${paymentMethod}=${product.amount}&coupon_tx_id=${product.coupon_tx_id}&currency=${product.currency}&product_id=${product.product_id}&product_name=${product.product_name}&product_type=${product.product_type}&product_category=${product.product_category}&purchase_id=${purchaseObj.id}`
      let url = `${Constant.entryPoint}/api1/payments/create${queryStr}`
      return this.$http.post(url)
    }
  }
})
