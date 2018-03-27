import * as types from '../mutation-types'

// initial state
const state = {
  menus: [],
  cats: []
}
// getters
const getters = {
  menus: state => state.menus,
  cats: state => state.cats
}

// actions
const actions = {
  setMenu ({ commit }, data) {
    commit(types.SET_MENU, data)
  }
}
// mutations
const mutations = {
  [types.SET_MENU] (state, data) {
    state.menus = data.menus
    state.cats = data.cats
  }
}

export default {
  state,
  getters,
  actions,
  mutations
}
