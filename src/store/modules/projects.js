import _ from 'lodash'
import data from '../../api/projects'
import * as types from '../mutation-types'

// initial state
const state = {
  all: [],
  newProject: {}
}

// getters
const getters = {
  allProjects: state => state.all,
  newProject: state => state.newProject
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
  }
}

export default {
  state,
  getters,
  actions,
  mutations
}
