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
  },
  [types.UPDATE_NEWPROJECT] (state, id) {
    state.newProject.id = id
  }
}

export default {
  state,
  getters,
  actions,
  mutations
}
