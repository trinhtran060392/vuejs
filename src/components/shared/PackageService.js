import Vue from 'vue'
import Constant from './Constant'

export default new Vue({
  methods: {
    getFullPackages () {
      let url = `${Constant.entryPoint}/api1/contents/fullpackages?offset=0&limit=24&format=long&include=product&include=purchase&include=fpackage`
      return this.$http.get(url)
    },
    getPackageContent () {
      let url = `${Constant.entryPoint}//api1/contents/packages?offset=0&limit=24&format=long&include=product&include=purchase&include=fpackage`
      return this.$http.get(url)
    },
    getServerTime () {
      let url = `${Constant.entryPoint}/api1/purchases/now`
      return this.$http.get(url)
    }
  }
})
