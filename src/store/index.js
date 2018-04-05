import Vue from 'vue'
import Vuex from 'vuex'
import * as getters from './getters'
import auth from './modules/auth'
import menu from './modules/menu'
import packages from './modules/packages'

Vue.use(Vuex)

const debug = process.env.NODE_ENV !== 'production'

const store = new Vuex.Store({
  getters,
  modules: {
    auth,
    menu,
    packages
  },
  strict: debug
})

export default store
