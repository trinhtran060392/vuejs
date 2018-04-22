import Vue from 'vue'
import Constant from '../shared/Constant'

export default new Vue({
  methods: {
    getHistory () {
      let url = `${Constant.entryPoint}/api1/payments/wallet/inquire_topup_history`
      return this.$http.get(url)
    },
    singleList () {
      let url = `${Constant.entryPoint}/api1/me/purchases/list?offset=0&limit=24&product_category=vod&product_category=channel&product_category=ott&product_category=catchup&product_category=npvr&product_category=full&product_type=single&include_hidden=false&include=product&include=purchase`
      return this.$http.get(url)
    },
    list () {
      let url = `${Constant.entryPoint}/api1/me/purchases/list?offset=0&limit=24&product_category=vod&product_category=channel&product_category=ott&product_category=catchup&product_category=npvr&product_category=full&product_type=subscription,package,fpackage&include_hidden=false&include=product&include=purchase`
      return this.$http.get(url)
    },
    wallet () {
      let url = `${Constant.entryPoint}/api1/payments/wallet/inquire_wallet`
      return this.$http.get(url)
    },
    payment () {
      let url = `${Constant.entryPoint}/api1/payments/wallet/inquire_topup_method`
      return this.$http.get(url)
    }
  }
})
