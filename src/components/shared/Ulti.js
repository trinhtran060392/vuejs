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
    transformLiteVod (vod) {
      if (vod.program) {
        vod.photoUrl = `${Constant.entryPoint}/api1/contents/pictures/${vod.program.id}?width=215.000000&height=307.000000`
        vod.bigPhotoUrl = `${Constant.entryPoint}/api1/contents/pictures/${vod.program.id}`
      }
      return vod
    },
    transformVod (vod) {
      let svod = {}
      svod.isVisiable = false
      svod.isPublish = false
      svod.isVtvCab = false
      svod.isWifiPackage = false
      svod.isSingleVOD = false
      svod.isPurchasedPackage = false
      svod.isExclusivePackage = false
      svod.isPurchasedExclusive = false
      svod.isEncrypted = false
      svod.purchased_products = []
      svod.purchasable_products = []
      svod.purchasable_single_product = []
      svod.purchased_single_product = []

      if (vod.program) {
        svod.photoUrl = `${Constant.entryPoint}/api1/contents/pictures/${vod.program.id}?width=215.000000&height=307.000000`
        svod.bigPhotoUrl = `${Constant.entryPoint}/api1/contents/pictures/${vod.program.id}`
        svod.name = vod.program.title[0].text
        svod.id = vod.program.id
        var des = vod.program.synopsis[0].text
        var tm = 'Thuyết minh - '
        if (des.indexOf(tm) === 0) {
          des = des.substring(tm.length - 1, des.length - 1)
        }
        tm = 'Phụ đề - '
        if (des.indexOf(tm) === 0) {
          des = des.substring(tm.length - 1, des.length - 1)
        }

        tm = 'Phụ đề- '
        if (des.indexOf(tm) === 0) {
          des = des.substring(tm.length - 1, des.length - 1)
        }
        svod.description = des.substring(0, 398)
        svod.shortDescription = des.substring(0, 300)

        if (vod.program.series) {
          svod.isVodInSeries = true
          svod.epId = vod.program.series.id
        } else {
          svod.isVodInSeries = false
        }
        svod.name = svod.name.replace('–', '-')

        let nameSplit = []
        if (svod.name.indexOf(' - ') > 0) {
          nameSplit = svod.name.split(' - ')
        } else if (svod.name.indexOf(' – ') > 0) {
          nameSplit = svod.name.split(' – ')
        } else if (svod.name.indexOf('–') > 0) {
          nameSplit = svod.name.split('–')
        } else if (svod.name.indexOf('-') > 0) {
          nameSplit = svod.name.split('-')
        } else {
          nameSplit = [svod.name]
        }
        if (nameSplit.length > 1) {
          if (nameSplit[0].toUpperCase().indexOf('TẬP') >= 0) {
            if (nameSplit.length === 4) {
              svod.firstTitle = nameSplit[2].trim() + ' - ' + nameSplit[3].trim()
              svod.secondTitle = nameSplit[0].trim() + ' : ' + nameSplit[1].trim()
            } else if (nameSplit.length === 3) {
              svod.firstTitle = nameSplit[2].trim()
              svod.secondTitle = nameSplit[0].trim() + ' : ' + nameSplit[1].trim()
            } else if (nameSplit.length === 2) {
              svod.firstTitle = nameSplit[1].trim()
              svod.secondTitle = nameSplit[0].trim()
            } else {
              svod.firstTitle = nameSplit[1]
              svod.secondTitle = ''
            }
          } else if (nameSplit[0].toUpperCase().indexOf('PHẦN') >= 0) {
            if (nameSplit.length === 3) {
              svod.firstTitle = nameSplit[2].trim()
              svod.secondTitle = nameSplit[0].trim() + ' : ' + nameSplit[1].trim()
            } else if (nameSplit.length === 2) {
              svod.firstTitle = nameSplit[1].trim()
              svod.secondTitle = nameSplit[0].trim()
            } else {
              svod.firstTitle = ''
              svod.secondTitle = ''
            }
          } else {
            if (nameSplit.length === 3) {
              svod.firstTitle = nameSplit[1].trim() + ' : ' + nameSplit[2].trim()
              svod.secondTitle = nameSplit[0].trim()
            } else if (nameSplit.length === 2) {
              svod.firstTitle = nameSplit[1].trim()
              svod.secondTitle = nameSplit[0].trim()
            } else {
              svod.firstTitle = ''
              svod.secondTitle = ''
            }
          }
        } else {
          svod.firstTitle = nameSplit[0].trim()
          svod.secondTitle = ''
        }

        if (typeof vod.program.directors_text !== 'undefined' && vod.program.directors_text.length > 0 && vod.program.directors_text[0].text !== '') {
          svod.directors = vod.program.directors_text[0].text
        } else {
          svod.directors = ''
        }

        if (typeof vod.program.actors_text !== 'undefined' && vod.program.actors_text.length > 0 && vod.program.actors_text[0].text !== '') {
          svod.actors = vod.program.actors_text[0].text
        } else {
          svod.actors = ''
        }

        svod.genres = ''
        if (typeof vod.program.genres !== 'undefined' && vod.program.genres !== null) {
          if (vod.program.genres.length > 1) {
            for (let i = 0; i < vod.program.genres.length; i++) {
              let temp = vod.program.genres[i]
              if (i === vod.program.genres.length - 1) svod.genres = svod.genres + temp
              else svod.genres = svod.genres + temp + ','
            }
          } else {
            svod.genres = vod.program.genres[0]
          }
        } else {
          svod.genres = ''
        }

        if (typeof vod.program.production_country !== 'undefined' && vod.program.production_country !== '') {
          svod.country = vod.program.production_country.substring(0, vod.program.production_country.length - 1)
        } else {
          svod.country = ''
        }
      }

      if (typeof vod.visible !== 'undefined' && vod.visible) {
        svod.isVisiable = true
      }
      if (typeof vod.config !== 'undefined') {
        for (let i = 0; i < vod.config.length; i++) {
          let item = vod.config[i]
          if (item.name === 'Public' && item.value === '1') {
            svod.isPublish = true
            break
          }
        }
      }
      if (typeof vod.channel !== 'undefined' && typeof vod.channel.genres !== 'undefined') {
        for (let i = 0; i < vod.channel.genres.length; i++) {
          let item = vod.channel.genres[i]
          if (item === '1:11:0:0') {
            svod.isVtvCab = true
            break
          }
        }
      }

      // build packages
      for (let i = 0; i < vod.product.length; i++) {
        let product = vod.product[i]
        svod.isFreeNoPair = this.checkFreeProduct(product)
        if (product.purchase && product.purchasable === 'false') {
          svod.isWifiPackage = true
        }
        if (product.type !== 'single' && (product.cclass.indexOf('HANDHELD') === 0 || product.cclass.indexOf('TV_SMART') !== -1)) {
          if (product.exclusive && product.exclusive === 'true' && product.purchasable === 'true') {
            svod.isExclusivePackage = true
            if (product.purchase) {
              svod.isPurchasedExclusive = true
            }
          }
          if (product.purchase) {
            svod.isPurchasedPackage = true
            svod.purchased_products.push(this.getLiteProduct(product))
          } else {
            if (this.checkValidProduct(product) && product.purchasable === 'true') {
              svod.purchasable_products.push(this.getLiteProduct(product))
            }
          }
        }
        if (product.type === 'single' && (product.cclass.indexOf('HANDHELD') >= 0 || product.cclass.indexOf('TV_SMART') !== -1)) {
          svod.isSingleVOD = true
          svod.singleProductId = product.id
          svod.product_pid = product.pid
          let timeNow
          if (product.purchase && product.purchase.is_directly === 'true') {
            let expired = this.checkExpired(timeNow, product.purchase.expired_date)
            if (!expired) {
              svod.singlePurchaseId = product.purchase.id
              svod.isPurchasedPackage = true
              svod.purchased_single_product.push(this.getLiteProduct(product))
            } else {
              if (product.hidden === 'false') svod.purchasable_single_product.push(this.getLiteProduct(product))
            }
          } else {
            if (product.hidden === 'false') svod.purchasable_single_product.push(this.getLiteProduct(product))
          }
          if (product.cclass.length === 1) {
            if (product.location) {
              if (product.location.device.indexOf('handheld') !== -1 || product.location.device.indexOf('tv_smart') !== -1) {
                svod.vodLocator = product.location.locator
              }
              if ((product.location.device.indexOf('handheld') !== -1 || product.location.device.indexOf('tv_smart') !== -1) && product.location.encryption === 'true') {
                svod.isEncrypted = true
              }
            }
          } else {
            for (let i = 0; i < product.locations.length; i++) {
              let location = product.locations[i]
              if (location.device.indexOf('handheld') !== -1 || location.device.indexOf('tv_smart') !== -1) {
                svod.vodLocator = location.locator
              }
              if ((location.device.indexOf('handheld') !== -1 || location.device.indexOf('tv_smart') !== -1) && location.encryption === 'true') {
                svod.isEncrypted = true
              }
            }
          }
        }
      }
      if (vod.program) {
        let take = vod.program.display_runtime.split(':')
        let minutes = 0
        if (take.length > 1) {
          minutes = parseFloat(take[0]) * 60 + parseFloat(take[1])
        } else if (take.length === 1) {
          minutes = parseFloat(take[0])
        }
        svod.duration = minutes
      }
      if (vod.channel) {
        svod.channel = vod.channel
      }
      return svod
    },
    checkExpired (timeNow, equalTime) {
      return true
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
    getTypeDevice () {
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
    isPhoneDevice () {
      if (/Android|webOS|iPhone|iPad|IEMobile|Opera Mini|Windows Phone/i.test(navigator.userAgent)) {
        return true
      } else {
        return false
      }
    },
    buildPurchasablePackages (products) {
      let purchasableProducts = []
      for (let i = 0; i < products.length; i++) {
        let product = products[i]
        if (product.type !== 'single' && (product.cclass.indexOf('HANDHELD') !== -1 || product.cclass.indexOf('TV_SMART') !== -1)) {
          let liteProduct = this.getLiteProduct(product)
          if (this.checkValidProduct(product)) purchasableProducts.push(liteProduct)
        }
      }
      return purchasableProducts
    },
    getLiteProduct (product) {
      product.beautyRentalPeriods = this.beautyRentalPeriods(product.rental_periods)
      return product
    },
    beautyRentalPeriods (rentalPeriods) {
      if (!rentalPeriods || !rentalPeriods.length) return []
      let result = []
      for (let i = 0; i < rentalPeriods.length; i++) {
        let temp = rentalPeriods[i]
        let obj = {}
        obj.beautyPeriod = this.beautyPeriod('d', temp.period)
        obj.beautyPrice = this.beautyPrice(temp.price[0].value)
        obj.period = temp.period
        obj.price = temp.price
        result.push(obj)
      }
      return result
    },
    beautyPeriod (key, value) {
      let day
      if (key === 's') {
        day = value / 86400
      } else if (key === 'd') {
        day = value
      }
      switch (day) {
        case 1: return 'ngày'
        case 7: return 'tuần'
        case 30: return 'tháng'
        default: return (key === 'd') ? value + ' ngày' : (value / 86400) + ' ngày'
      }
    },
    getDisplayProduct (data) {
      let products = []
      for (let i = 0; i < data.length; i++) {
        let temp = data[i]
        if (temp.hidden === 'false') products.push(temp)
      }
      return products
    },
    getProducts (data) {
      let result = []
      for (let i = 0; i < data.length; i++) {
        let temp = data[i]
        if (temp.product) {
          result = result.concat(this.getDisplayProduct(temp.product))
        }
      }
      return result
    },
    checkValidProduct (product, checkPurchased) {
      let temp = false
      if (product.rental_periods && product.rental_periods.length && product.hidden === 'false') {
        temp = true
      }
      if (!temp && checkPurchased) {
        if (product.purchase) {
          temp = true
        }
      }
      return temp
    },
    isLoggedIn () {
      let account = this.$localStorage.get('accountInfo')
      let token
      if (account) {
        account = JSON.parse(account)
        token = account.accessToken
      }
      if (account && token && token !== Constant.guestToken) return true
      return false
    },
    getCurrentAccount () {
      let result = JSON.parse(this.$localStorage.get('accountInfo'))
      return result
    },
    checkFreeProduct (product) {
      let temp = false
      _.forEach(product.locations, (location) => {
        _.forEach(location.parameter, (parameter) => {
          if (parameter.name === 'Audience' && parameter.value === 'private:All') {
            temp = true
          }
        })
        if (!temp) {
          _.forEach(product.price, (price) => {
            if (price.currency === 'VND' && price.value === 0) {
              temp = true
            }
          })
        }
      })
      if (!temp && product.price !== undefined && Array.isArray(product.price) && !product.price.length) {
        temp = true
      }
      return temp
    },
    beautyPrice (value) {
      value = value.toString()
      if (value.length > 3) {
        return value.slice(0, value.length - 3) + '.' + value.slice(value.length - 3, value.length)
      } else {
        return value
      }
    },
    buildWallet (data) {
      data.topup = this.beautyPrice(data.topup)
      data.bonus = this.beautyPrice(data.bonus)
      return data
    },
    beautyDate (date) {
      let obj = {}
      let array = date.split('T')
      let day = array[0].split('-')
      let time = array[1].split('+')
      let beautyDay = ''
      for (let i = day.length - 1; i >= 0; i--) {
        beautyDay += day[i]
        if (i !== 0) beautyDay += '/'
      }
      let beautyTime = time[0]
      obj.beautyDay = beautyDay
      obj.beautyTime = beautyTime
      return obj
    },
    buildSingleVod (response) {
      let result = []
      let temp = response
      for (let i = 0; i < temp.length; i++) {
        let obj = {}
        obj.product = temp[i].product
        obj.title = temp[i].product.title
        obj.priceMax = temp[i].product.price[0].value
        obj.beautyUnit = 'VNĐ'
        obj.date = this.beautyDate(temp[i].purchase_stdt)
        obj.endDate = this.beautyDate(temp[i].purchase_endt)
        obj.auto_renewal = false
        result.push(obj)
      }
      return result
    },
    checkRegisteredPackage (packages, purchasedData) {
      let registeredPackages = []
      let availablePackages = []
      if (purchasedData.length) {
        for (let i = 0; i < purchasedData.length; i++) {
          for (let j = 0; j < packages.length; j++) {
            if (packages[j].id === purchasedData[i].product.id) {
              let price = purchasedData[i].product.price[0].value
              packages[j].parentId = purchasedData[i].id
              packages[j].purchase_stdt = purchasedData[i].purchase_stdt
              packages[j].purchase_endt = purchasedData[i].purchase_endt
              packages[j].auto_renewal = true
              packages[j].registed = true
              packages[j].beautyPeriod = this.returnPeriodName(this.getPeriodFromPrice(price, packages[j].rental_periods))
              packages[j].priceMax = this.beautyPrice(price)
              packages[j].date = this.beautyDate(purchasedData[i].purchase_stdt)
            } else {
              if (!packages[j].registed) {
                packages[j].registed = false
              }
            }
          }
        }
      }
      for (let i = 0; i < packages.length; i++) {
        packages[i].description = !Array.isArray(packages[i].description) ? packages[i].description : packages[i].description[0].text
        if (packages[i].registed) registeredPackages.push(packages[i])
        else if (packages[i].purchasable === 'true') availablePackages.push(packages[i])
      }
      let totalPackages = registeredPackages.concat(availablePackages)

      let obj = {}
      obj.totalPackages = totalPackages
      obj.registeredPackages = registeredPackages
      return obj
    },
    returnPeriodName (val) {
      switch (val) {
        case 1:
          return 'Ngày'
        case 7:
          return 'Tuần'
        case 30:
          return 'Tháng'
        default:
          break
      }
    },
    getPeriodFromPrice (value, prices) {
      for (let i = 0; i < prices.length; i++) {
        if (value === prices[i].price[0].value) {
          return prices[i].period
        }
      }
    },
    saveAccountInfo (response) {
      let temp = this.getCurrentAccount()
      if (!temp || !temp.accessToken) temp = {}
      temp.accessToken = response.access_token
      temp.refresh_token = response.refresh_token
      let accountInfoStr = JSON.stringify(temp)
      this.$localStorage.set('accountInfo', accountInfoStr)
    },
    getChannelsByCategoryId (config, list) {
      let result = []
      let listChannel = ',' + config + ''
      for (let i = 0; i < list.length; i++) {
        let channelItem = list[i]
        let channel = ',' + channelItem.serviceId + ''
        if (listChannel.indexOf(channel) !== -1) {
          result.push(channelItem)
        }
      }
      return result
    },
    addImgUrl (data) {
      for (let item in data) {
        let temp = data[item].data
        if (temp && Array.isArray(temp) && temp.length) {
          for (let i = 0; i < temp.length; i++) {
            if (temp[i].program) {
              temp[i].photoUrl = Constant.entryPoint + '/api1/contents/pictures/' + temp[i].program.id + '?width=215.000000&height=307.000000'
            } else if (item === 'vgroup') {
              temp[i].photoUrl = Constant.entryPoint + '/api1/contents/categories/' + temp[i].id + '/picture?width=215.000000&height=307.000000'
            } else if (temp[i].channel) temp[i].photoUrl = Constant.entryPoint + '/api1/contents/pictures/' + temp[i].channel.id + '?type=original'
          }
        }
      }
      return data
    },
    getDeviceid () {
      return this.$localStorage.get('deviceUid')
    },
    isPlayable (vod) {
      let playable = false
      if (vod.isExclusivePackage) {
        if (vod.isPurchasedExclusive) {
          playable = true
        }
      } else {
        if (vod.isFreeNoPair || vod.isWifiPackage || vod.isPurchasedPackage) {
          playable = true
        }
      }
      return playable
    },
    isChannelPlayable (channel) {
      let playable = false
      if (channel.isVisiable) {
        if (channel.isPublish) {
          playable = true
        } else {
          if (channel.isExclusivePackage) {
            if (channel.isPurchasedExclusive) {
              playable = true
            }
          } else if (channel.isVtvCab) {
            if (channel.isPurchasedPackage) {
              playable = true
            }
          } else {
            if (channel.isFreeNoPair) {
              playable = true
            } else {
              if (channel.isWifiPackage || channel.isPurchasedPackage) {
                playable = true
              }
            }
          }
        }
      }
      return playable
    }
  }
})
