import * as types from './mutation-types'

export const addProject = ({ commit }, project) => {
  commit(types.ADD_PROJECT, project)
}
