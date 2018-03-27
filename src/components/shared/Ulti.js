import _ from 'lodash'
import Vue from 'vue'

export default new Vue({
  methods: {
    getCategories (data) {
      let result = []
      for (let i = 0; i < data.length; i++) {
        let temp = data[i]
        let size = temp.path_id.match(/\//g).length
        let categoryConfig = this.getCategory(temp)
        if (size === 2 && categoryConfig && this.checkValidCat(temp)) {
          temp.categoryConfig = categoryConfig
          result.push(temp)
        }
      }
      return result
    },
    getCategory (data) {
      if (!data.config || data.type === '__root') return undefined
      let categoryConfig = _.find(data.config, (temp) => {
        return temp.name === '__category'
      })
      let isHidden = _.find(data.config, (temp) => {
        return temp.name === 'hidden' && temp.value === 'true'
      })
      if (!categoryConfig || isHidden) return undefined
      return categoryConfig
    },
    checkValidCat (data) {
      let temp = data.path_id.split('/')
      for (let i = 0; i < temp.length; i++) {
        if (temp[i] === 'WEB_HOME') {
          return true
        }
      }
      return false
    },
    getMenus (data) {
      let result = []
      for (let i = 0; i < data.length; i++) {
        let temp = data[i]
        let size = temp.path_id.match(/\//g).length
        if (size === 1 && this.checkValidMenu(temp)) {
          result.push(temp)
        }
      }
      return result
    },
    checkValidMenu (data) {
      let result = true
      let temp = data.path_id.split('/')
      for (let i = 0; i < temp.length; i++) {
        if (temp[i] === 'STB.SETTING' || temp[i] === 'home') {
          result = false
          break
        }
      }
      if (data.type === '__root') result = false
      let isHidden = _.find(data.config, (temp) => {
        return temp.name === 'hidden' && temp.value === 'true'
      })
      if (isHidden) result = false
      return result
    }
  }
})
