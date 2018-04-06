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
      this.$localStorage.set('deviceUdid', result)
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

<style lang="scss">
  @import "src/assets/style/main.scss";
  #app {
    font-family: 'Avenir', Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-align: center;
    color: $white;
  }
  body {
    background-color: $dark;
    .title-text {
      color: $yellow;
    }
    .navigation-drawer {
      padding: 0;
      .list {
        height: 100%;
      }
    }
  }
  .application.theme--dark {
    background-color: transparent;
  }
  .application .theme--dark.footer, .theme--dark .footer {
    height: auto !important;
    background-color: transparent;
    position: relative;
  }
  .application .theme--dark.list, .theme--dark .list {
    background-color: $dark;
  }
  .application.theme--dark a:hover {
    color: $yellow;
  }
  .theme--dark .btn:hover {
      color: $yellow;
  }
  .vod-content {
    padding: 20px 10px;
    height: 220px;
  }
  .vod-content:hover {
    transform: scale(1.1);
    transition: all .3s ease-in-out;
    cursor: pointer;
  }
  img {
    max-width: 100%;
    max-height: 100%;
  }
  .VueCarousel-dot {
    display: none !important;
  }
  .VueCarousel-navigation-button {
    color: $white !important;
  }
  .application .theme--dark.tabs__bar, .theme--dark .tabs__bar {
    background-color: transparent !important;
  }
  .shorten-text {
    clear: both;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
}
</style>
