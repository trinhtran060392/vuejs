import * as types from '../mutation-types'

const state = {
  screenMax: 0,
  listPackage: [],
  isShowPackage: false
}

const getters = {
  screenMax: state => state.screenMax,
  listPackage: state => state.listPackage,
  isShowPackage: state => state.isShowPackage
}

const actions = {
  setScreenMax ({ commit }, screenMax) {
    commit(types.SCREEN_MAX, screenMax)
  },
  setListPackage ({ commit }, listPackage) {
    commit(types.SET_LIST_PACKAGE, listPackage)
  },
  showPackage ({ commit }, isShowPackage) {
    console.log(isShowPackage)
    commit(types.SHOW_PACKAGE, isShowPackage)
  }
}

const mutations = {
  [types.SCREEN_MAX] (state, screenMax) {
    state.screenMax = screenMax
  },
  [types.SET_LIST_PACKAGE] (state, listPackage) {
    state.listPackage = listPackage
  },
  [types.SHOW_PACKAGE] (state, isShowPackage) {
    console.log(isShowPackage)
    state.isShowPackage = isShowPackage
  }
}

export default {
  state,
  getters,
  actions,
  mutations
}
