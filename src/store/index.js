import Vue from 'vue'
import Vuex from 'vuex'
import * as getters from './getters'
import auth from './modules/auth'
import menu from './modules/menu'

Vue.use(Vuex)

const debug = process.env.NODE_ENV !== 'production'

const store = new Vuex.Store({
  getters,
  modules: {
    auth,
    menu
  },
  strict: debug
})

export default store
