import Vue from 'vue'
import Vuex from 'vuex'
import * as getters from './getters'
import projects from './modules/projects'

Vue.use(Vuex)

const debug = process.env.NODE_ENV !== 'production'

export default new Vuex.Store({
  getters,
  modules: {
    projects
  },
  strict: debug
})
