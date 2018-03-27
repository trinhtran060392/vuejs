<template>
  <div id="app">
    <router-view/>
  </div>
</template>

<script>

import Vue from 'vue'
import Vuetify from 'vuetify'
import VueCarousel from 'vue-carousel'

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

</style>
