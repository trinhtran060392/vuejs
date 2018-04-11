import * as types from '../mutation-types'

const state = {
  screenMax: -1,
  listPackage: [],
  isShowPackage: false,
  listDevice: [],
  pack: {}
}

const getters = {
  screenMax: state => state.screenMax,
  listPackage: state => state.listPackage,
  isShowPackage: state => state.isShowPackage,
  listDevice: state => state.listDevice,
  pack: state => state.pack
}

const actions = {
  setScreenMax ({ commit }, screenMax) {
    commit(types.SCREEN_MAX, screenMax)
  },
  setListPackage ({ commit }, listPackage) {
    commit(types.SET_LIST_PACKAGE, listPackage)
  },
  showPackage ({ commit }, isShowPackage) {
    commit(types.SHOW_PACKAGE, isShowPackage)
  },
  setListDevice ({ commit }, listDevice) {
    commit(types.LIST_DEVICE, listDevice)
  },
  setPackage ({ commit }, pack) {
    commit(types.SET_PACKAGE, pack)
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
    state.isShowPackage = isShowPackage
  },
  [types.LIST_DEVICE] (state, listDevice) {
    state.listDevice = listDevice
  },
  [types.SET_PACKAGE] (state, pack) {
    state.pack = pack
  }
}

export default {
  state,
  getters,
  actions,
  mutations
}
