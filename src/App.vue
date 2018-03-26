<template>
  <div id="app">
    <router-view/>
  </div>
</template>

<script>

import Vue from 'vue'
import VueResource from 'vue-resource'
import Vuetify from 'vuetify'
import VueCarousel from 'vue-carousel'

Vue.use(VueResource)
Vue.use(Vuetify)
Vue.use(VueCarousel)

export default {
  name: 'app'
}
</script>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}
</style>
