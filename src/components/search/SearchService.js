import Vue from 'vue'
import Constant from '../shared/Constant'
import Ulti from '../shared/Ulti'

export default new Vue({
  methods: {
    get (text, offset, limit) {
      let url = `${Constant.entryPoint}/api1/search/search?q=${text}&region=OTT&vsuppress=series:1&cat=movie,vgroup,tvshow,channel&offset=${offset}&limit=${limit}&input_route=pop&filter=vgroup%3Aseries`
      return new Promise((resolve, reject) => {
        this.$http.get(url).then((response) => {
          let data = response.body
          let result = Ulti.addImgUrl(data)
          resolve(result)
        })
      })
    }
  }
})
