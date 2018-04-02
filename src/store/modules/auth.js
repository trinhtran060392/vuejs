import _ from 'lodash'
import data from '../../api/projects'
import * as types from '../mutation-types'

// initial state
const state = {
  all: [],
  newProject: {},
  selected: {},
  result: false,
  isAuthenticated: false,
  showLoginDialog: false,
  isInSettingPage: false
}
// setters
const setters = {
  setStatus (isAuthenticated) {
    state.isAuthenticated = isAuthenticated
  }
}
// getters
const getters = {
  allProjects: state => state.all,
  newProject: state => state.newProject,
  selected: state => state.selected,
  result: state => state.result,
  isAuthenticated: state => state.isAuthenticated,
  showLoginDialog: state => state.showLoginDialog,
  isInSettingPage: state => state.isInSettingPage
}

// actions
const actions = {
  removePr ({ commit }, id) {
    commit(types.REMOVE_PR, id)
  },
  getAllProjects ({ commit }) {
    data.getProjects(projects => {
      commit(types.RECEIVE_PROJECTS, { projects })
    })
  },
  addProject ({ commit }) {
    let newProjectUpdated = { id: state.newProject.id }
    commit(types.ADD_PROJECT, newProjectUpdated)
  },
  updateNewProject ({ commit }, e) {
    commit(types.UPDATE_NEWPROJECT, e.target.value)
  },
  editPr ({ commit }, id) {
    commit(types.EDIT_PR, id)
  },
  updateProject ({ commit }, e) {
    commit(types.UPDATE_CURRENT_PROJECT, e.target.value)
  },
  checkEqual ({ commit }, img, assertImg) {
    data.checkEqualImg(result => {
      commit(types.ASSERT_IMAGE, result)
    })
  },
  initResult ({ commit }) {
    commit(types.INIT_RESULT)
  },
  changeStatus ({ commit }) {
    commit(types.CHANGE_STATUS)
  },
  showLoginDialog ({ commit }, isShow) {
    commit(types.SHOW_LOGIN_DIALOG, isShow)
  },
  setIsInSettingPage ({ commit }, isSettingPage) {
    commit(types.SET_SETTING_PAGE, isSettingPage)
  }
}

// mutations
const mutations = {
  [types.RECEIVE_PROJECTS] (state, { projects }) {
    state.all = projects
  },
  [types.ADD_PROJECT] (state, project) {
    state.all.push(project)
    state.newProject.id = ''
  },
  [types.UPDATE_NEWPROJECT] (state, id) {
    state.newProject.id = id
  },
  [types.REMOVE_PR] (state, id) {
    let index = _.findIndex(state.all, project => {
      return project.id === id
    })
    state.all.splice(index, 1)
  },
  [types.EDIT_PR] (state, id) {
    let project = _.find(state.all, project => {
      return project.id === id
    })
    state.selected = project
  },
  [types.UPDATE_CURRENT_PROJECT] (state, id) {
    let index = _.findIndex(state.all, project => {
      return state.selected.id === project.id
    })
    state.all[index].id = id
    state.selected = {}
  },
  [types.ASSERT_IMAGE] (state, result) {
    state.result = result
  },
  [types.INIT_RESULT] (state) {
    state.result = false
  },
  [types.CHANGE_STATUS] (state) {
    state.isAuthenticated = !state.isAuthenticated
  },
  [types.SHOW_LOGIN_DIALOG] (state, isShow) {
    state.showLoginDialog = isShow
  },
  [types.SET_SETTING_PAGE] (state, isInSettingPage) {
    state.isInSettingPage = isInSettingPage
  }
}

export default {
  state,
  getters,
  actions,
  mutations,
  setters
}
