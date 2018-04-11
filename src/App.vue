<template>
  <div id="app">
    <router-view/>
  </div>
</template>

<script>

import Vue from 'vue'
import Vuetify from 'vuetify'
import VueCarousel from 'vue-carousel'
import VueResource from 'vue-resource'
import Constant from './components/shared/Constant'
import VueLocalStorage from 'vue-localstorage'
import Ulti from './components/shared/Ulti'
import Auth from './components/authentication/Auth'
import store from './store'
import 'video.js/dist/video-js.css'
import Fingerprint from 'fingerprintjs2'
import router from './router'

import './assets/style/main.scss'

Vue.use(Vuetify, {
  theme: {
    primary: '#ffcc05',
    secondary: '#b0bec5',
    accent: '#8c9eff',
    error: '#b71c1c'
  }
})
Vue.use(VueCarousel)
Vue.use(VueResource)
Vue.use(VueLocalStorage)

const fpInstance = new Fingerprint()

export default {
  name: 'app',
  created () {
    console.log('init app')
    let accountInfo = Ulti.getCurrentAccount()
    console.log(accountInfo)
    if (accountInfo && accountInfo.accessToken && accountInfo.accessToken !== Constant.guestToken) {
      console.log('account is ready to save on local')
      Auth.checkToken().then((response) => {
        console.log('token is valid')
        store.dispatch('setTokenStatus', true)
        store.dispatch('setStatus', true)
      }, (error) => {
        console.log('token is not valid', error)
        // try to renew token
        Auth.refreshToken().then((response) => {
          console.log('refresh token ok', response)
          Ulti.saveAccountInfo(response.data)
          store.dispatch('setTokenStatus', true)
          store.dispatch('setStatus', true)
        }, (refreshTokenError) => {
          // refresh error so we clear local data and set guest token
          let temp = {}
          this.$localStorage.remove('accountInfo')
          temp.access_token = Constant.guestToken
          Ulti.saveAccountInfo(temp)
          store.dispatch('setTokenStatus', true)
          store.dispatch('setStatus', false)
          console.log(refreshTokenError)
        })
      })
    } else {
      let temp = {}
      temp.access_token = Constant.guestToken
      Ulti.saveAccountInfo(temp)
      store.dispatch('setTokenStatus', true)
      store.dispatch('setStatus', false)
      console.log('account info is not saved or guest token is saved')
    }
    fpInstance.get((result) => {
      this.$localStorage.set('deviceUid', result)
    })
  }
}

Vue.http.interceptors.push((request, next) => {
  let isAuthenticated = Ulti.isLoggedIn()
  let accountInfo
  let token = `Bearer `
  if (isAuthenticated) {
    accountInfo = Ulti.getCurrentAccount()
    token += accountInfo.accessToken
  } else {
    if (request.headers.map.Authorization) {
      token = request.headers.map.Authorization[0]
    } else {
      token += Constant.guestToken
    }
  }
  request.headers.set('Authorization', token)
  request.headers.set('Content-Type', 'application/json')
  next((response) => {
    if (response.body.error) {
      let temp = response.body.error
      if (temp.code === 'C0201' || temp.code === 'C0202' || temp.code === 'C0203') {
        console.log('you are kicked out')
        let temp = {}
        temp.access_token = Constant.guestToken
        Ulti.saveAccountInfo(temp)
        store.dispatch('setTokenStatus', true)
        store.dispatch('setStatus', false)
        store.dispatch('showLoginDialog', true)
        router.push('/')
      }
    }
  })
})
</script>
