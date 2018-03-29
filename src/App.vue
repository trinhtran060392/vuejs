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

Vue.use(Vuetify)
Vue.use(VueCarousel)
Vue.use(VueResource)

export default {
  name: 'app'
}

Vue.http.interceptors.push((request, next) => {
  request.headers.set('Authorization', `Bearer ${Constant.guestToken}`)
  next()
})
</script>

<style>
  #app {
    font-family: 'Avenir', Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-align: center;
    color: #ffffff;
  }
  body {
    background-color: #0E1623;
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
    background-color: #0E1623;
  }
  .application.theme--dark a:hover {
    color: #ffcc05;
  }
  .theme--dark .btn:hover {
      color: #ffcc05;
  }
  .vod-content {
    padding: 5px 10px;
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
    color: white !important;
  }
</style>
