import _ from 'lodash'
import Vue from 'vue'
import Constant from './Constant'

export default new Vue({
  data: {
    listModel: ['iphone', 'ipad', 'android', 'PC_WINDOWS', 'windows phone', 'WINDOW_PAD', 'PC_MAC'],
    listModelUppercase: ['IOS_PHONE', 'IOS_PAD', 'ANDROID_PHONE', 'PC_WINDOWS', 'WINDOW_PHONE', 'WINDOW_PAD', 'PC_MAC']
  },
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
      for (let i = 0; i < result.length; i++) {
        let temp = result[i]
        let children = this.buildChildren(temp, data)
        result[i].children = children
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
    },
    transformVod (vod) {
      if (vod.program) {
        vod.photoUrl = `${Constant.entryPoint}/api1/contents/pictures/${vod.program.id}?width=215.000000&height=307.000000`
        vod.bigPhotoUrl = `${Constant.entryPoint}/api1/contents/pictures/${vod.program.id}`
      }
      return vod
    },
    getCategoryIdOfMenu (menu) {
      var categoryId = ''
      for (let i = 0; i < menu.config.length; i++) {
        let config = menu.config[i]
        if (config.name === '__category') {
          categoryId = config.value
        }
      }
      return categoryId
    },
    buildChildren (menu, menuArray) {
      let result = []
      for (let i = 0; i < menuArray.length; i++) {
        let temp = menuArray[i]
        let size = temp.path_id.match(/\//g).length
        if (size === 2 && temp.path_id.includes(menu.path_id) && menu.path_id !== '/WEB_HOME' && !temp.path_id.includes('.PROMOTION')) {
          result.push(temp)
        }
      }
      return result
    },
    getSubcategoryId (menu) {
      let result = {}
      result.id = menu.id
      let array = []
      for (let i = 0; i < menu.children.length; i++) {
        let obj = {}
        let temp = menu.children[i]
        let catMenuId = this.getCategoryIdOfMenu(temp)
        obj.catMenuId = catMenuId
        obj.title = temp.name[0].text
        array.push(obj)
      }
      result.catMenuIds = array
      return result
    },
    getDeviceModel () {
      let navigate = navigator.userAgent.toLowerCase()
      let length = this.listModel.length
      for (let i = 0; i < length; i++) {
        if (navigate.indexOf(this.listModel[i].toLowerCase()) >= 0) {
          return this.listModelUppercase[i]
        }
      }
      return 'PC_WINDOWS'
    },
    getDeviceModelNumber () {
      let ua = navigator.userAgent
      let tem
      let M = ua.match(/(opera|chrome|coc_coc_browser|safari|firefox|msie|trident(?=\/))\/?\s*(\d+)/i) || []
      if (/trident/i.test(M[1])) {
        tem = /\brv[ :]+(\d+)/g.exec(ua) || []
        return 'IE ' + (tem[1] || '')
      }
      if (M[1] === 'Chrome') {
        tem = ua.match(/\b(OPR|Edge)\/(\d+)/)
        if (tem !== null) {
          return tem.slice(1).join(' ').replace('OPR', 'Opera')
        }
      }
      M = M[2] ? [M[1], M[2]] : [navigator.appName, navigator.appVersion, '-?']
      if ((tem = ua.match(/version\/(\d+)/i)) !== null) {
        M.splice(1, 1, tem[1])
      }
      return M.join(' ')
    },
    getTypeDevice: function () {
      if (this.isPhoneDevice()) {
        if (window.matchMedia('(max-width: 767px)').matches) {
          return 'phone'
        } else {
          return 'pad'
        }
      } else {
        return 'others'
      }
    },
    isPhoneDevice: function () {
      if (/Android|webOS|iPhone|iPad|IEMobile|Opera Mini|Windows Phone/i.test(navigator.userAgent)) {
        return true
      } else {
        return false
      }
    }
  }
})
