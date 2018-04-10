import * as types from '../mutation-types'

// initial state
const state = {
  menus: [],
  cats: [],
  subMenus: [],
  isShowBanner: true
}
// getters
const getters = {
  menus: state => state.menus,
  cats: state => state.cats,
  subMenus: state => state.subMenus,
  isShowBanner: state => state.isShowBanner
}

// actions
const actions = {
  setMenu ({ commit }, data) {
    commit(types.SET_MENU, data)
  },
  setSubMenu ({ commit }, data) {
    commit(types.SET_SUBMENU, data)
  },
  setShowBanner ({ commit }, data) {
    commit(types.SET_SHOW_BANNER, data)
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
  },
  [types.SET_SHOW_BANNER] (state, data) {
    state.isShowBanner = data
  }
}

export default {
  state,
  getters,
  actions,
  mutations
}
