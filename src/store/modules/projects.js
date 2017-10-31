import data from '../../api/projects'
import * as types from '../mutation-types'

// initial state
const state = {
  all: []
}

// getters
const getters = {
  allProjects: state => state.all
}

// actions
const actions = {
  getAllProjects ({ commit }) {
    console.log(1)
    data.getProjects(projects => {
      commit(types.RECEIVE_PROJECTS, { projects })
    })
  },
  addProjects ({ commit }, project) {
    commit(types.ADD_PROJECT, project)
  }
}

// mutations
const mutations = {
  [types.RECEIVE_PROJECTS] (state, { projects }) {
    console.log(projects)
    state.all = projects
  },
  [types.ADD_PROJECT] (state, project) {
    state.all.push(project)
  }
}

export default {
  state,
  getters,
  actions,
  mutations
}
