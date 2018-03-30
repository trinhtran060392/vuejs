import Vue from 'vue'
import Constant from '../shared/Constant'

export default new Vue({
  methods: {
    list (limit) {
      const url = `${Constant.entryPoint}/api1/contents/channels?region=OTT&child=all&offset=0&limit=${limit}`
      return this.$http.get(url)
    }
  }
})
