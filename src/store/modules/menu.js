import * as types from '../mutation-types'

// initial state
const state = {
  menus: [],
  cats: [],
  subMenus: []
}
// getters
const getters = {
  menus: state => state.menus,
  cats: state => state.cats,
  subMenus: state => state.subMenus
}

// actions
const actions = {
  setMenu ({ commit }, data) {
    commit(types.SET_MENU, data)
  },
  setSubMenu ({ commit }, data) {
    commit(types.SET_SUBMENU, data)
  }
}
// mutations
const mutations = {
  [types.SET_MENU] (state, data) {
    state.menus = data.menus
    state.cats = data.cats
  },
  [types.SET_SUBMENU] (state, data) {
    state.subMenus = data
  }
}

export default {
  state,
  getters,
  actions,
  mutations
}
