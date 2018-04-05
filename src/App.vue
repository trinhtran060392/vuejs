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
import router from './router'

Vue.use(Vuetify)
Vue.use(VueCarousel)
Vue.use(VueResource)
Vue.use(VueLocalStorage)

export default {
  name: 'app'
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
  next()
})
</script>

<style lang="scss">
  @import "src/assets/style/common.scss";
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
