<template>
  <div id="app">
    <router-view/>
  </div>
</template>

<script>

import Vue from 'vue'
import Vuetify from 'vuetify'
import VueCarousel from 'vue-carousel'
import VueResource from 'vue-resource'
import Constant from './components/shared/Constant'
import VueLocalStorage from 'vue-localstorage'
import Ulti from './components/shared/Ulti'
import Auth from './components/authentication/Auth'
import store from './store'
import 'video.js/dist/video-js.css'
import Fingerprint from 'fingerprintjs2'
import router from './router'

import './assets/style/main.scss'

Vue.use(Vuetify, {
  theme: {
    primary: '#ffcc05',
    secondary: '#b0bec5',
    accent: '#8c9eff',
    error: '#b71c1c'
  }
})
Vue.use(VueCarousel)
Vue.use(VueResource)
Vue.use(VueLocalStorage)
const fpInstance = new Fingerprint()
Vue.mixin({
  computed: {
    isAutoLogin: {
      get: function () {
        return this.$store.getters.isAutoLogin
      },
      set: function (isAutoLogin) {
        this.$store.dispatch('setAutoLogin', isAutoLogin)
      }
    }
  },
  data: function () {
    return {
      listStepLogin: {
        login: 0,
        kickDevice: 1
      }
    }
  },
  methods: {
    checkAccountUse () {
      Auth.getAccountUse().then((response) => {
        if (response.status === Constant.statusCode.OK) {
          this.$store.dispatch('setListRegisterDevice', response.body.registered_device)
          this.$localStorage.set('isSubscriber', response.body.config.vm_subscriber)
          this.checkPackageDevice()
        }
      })
    },
    checkPackageDevice () {
      Auth.getPackageDevice().then((response) => {
        if (response.status === Constant.statusCode.OK) {
          let listRegisterDevice = this.$store.getters.listRegisterDevice
          let accountInfo = this.$store.getters.accountInfo
          let screenMax = this.getScreenMax(response.body.data)
          this.$store.dispatch('setScreenMax', screenMax)
          console.log(screenMax)
          if ((screenMax >= listRegisterDevice.registered) && accountInfo.status === 'inuse') {
            console.log('login success')
            let accountInfoStr = JSON.stringify(accountInfo)
            this.$localStorage.set('accountInfo', accountInfoStr)
            this.$store.dispatch('changeStatus')
            this.$store.dispatch('showLoginDialog', false)
            this.$store.dispatch('setStepLogin', this.listStepLogin.login)
            // this.$store.dispatch('setAutoLogin', false)
            // this.step = this.listStep.login
            // this.user = {}
          } else {
            if (this.isAutoLogin) {
              this.$store.dispatch('showLoginDialog', true)
              this.isAutoLogin = false
            }
            this.$store.dispatch('setStepLogin', this.listStepLogin.kickDevice)
          }
        }
      })
    },
    getScreenMax (data) {
      let screenMax = 0
      let length = data.length
      if (length === 0) {
        return 0
      }
      for (let i = 0; i < length; i++) {
        let item = data[i]
        if (item.product.screen_max && item.product.screen_max > screenMax) {
          screenMax = item.product.screen_max
        }
      }
      return screenMax
    }
  }
})

export default {
  name: 'app',
  created () {
    console.log('init app')
    let accountInfo = Ulti.getCurrentAccount()
    console.log(accountInfo)
    if (accountInfo && accountInfo.accessToken && accountInfo.accessToken !== Constant.guestToken) {
      console.log('account is ready to save on local')
      Auth.checkToken().then((response) => {
        console.log('token is valid')
        store.dispatch('setTokenStatus', true)
        store.dispatch('setStatus', true)
      }, (error) => {
        console.log('token is not valid', error)
        // try to renew token
        Auth.refreshToken().then((response) => {
          console.log('refresh token ok', response)
          Ulti.saveAccountInfo(response.data)
          store.dispatch('setTokenStatus', true)
          store.dispatch('setStatus', true)
        }, (refreshTokenError) => {
          // refresh error so we clear local data and set guest token
          let temp = {}
          this.$localStorage.remove('accountInfo')
          temp.access_token = Constant.guestToken
          Ulti.saveAccountInfo(temp)
          store.dispatch('setTokenStatus', true)
          store.dispatch('setStatus', false)
          console.log(refreshTokenError)
        })
      })
    } else {
      // this.autoLogin()
      if (Ulti.isPhoneDevice()) {
        this.autoLogin()
      } else {
        let temp = {}
        temp.access_token = Constant.guestToken
        Ulti.saveAccountInfo(temp)
        store.dispatch('setTokenStatus', true)
        store.dispatch('setStatus', false)
        console.log('account info is not saved or guest token is saved')
      }
    }
    fpInstance.get((result) => {
      this.$localStorage.set('deviceUid', result)
    })
  },
  methods: {
    autoLogin () {
      Auth.getRemoteId().then((response) => {
      }, (response) => {
        response = {'ms_ip': '9.55.176.150', 'msisdn': '841666196866'}
        if (response.ms_ip !== undefined) {
          Auth.automaticDetection(response.ms_ip).then((account) => {
            console.log(account)
            let accountInfo = {
              id: response.msisdn.substr(0, 2) === '84' ? `0${response.msisdn.substr(2)}` : response.msisdn,
              accessToken: account.body.access_token,
              refresh_token: account.body.refresh_token,
              expiration_date: account.body.expiration_date,
              refresh_token_expiration_date: account.body.refresh_token_expiration_date,
              temp_password: account.body.temp_password,
              status: account.body.status
            }
            this.$store.dispatch('setAccountInfo', accountInfo)
            this.$store.dispatch('setToken', accountInfo.accessToken)
            this.isAutoLogin = true
            this.checkAccountUse()
          }, (error) => {
            console.log(error)
          })
        }
      })
    }
  }
}

Vue.http.interceptors.push((request, next) => {
  let isAuthenticated = Ulti.isLoggedIn()
  let accountInfo
  let token = `Bearer `
  if (isAuthenticated) {
    accountInfo = Ulti.getCurrentAccount()
    token += accountInfo.accessToken
  } else {
    if (request.headers.map.Authorization) {
      token = request.headers.map.Authorization[0]
    } else {
      token += Constant.guestToken
    }
  }
  request.headers.set('Authorization', token)
  request.headers.set('Content-Type', 'application/json')
  next((response) => {
    if (response.body.error) {
      let temp = response.body.error
      if (temp.code === 'C0201' || temp.code === 'C0202' || temp.code === 'C0203') {
        console.log('you are kicked out')
        let temp = {}
        temp.access_token = Constant.guestToken
        Ulti.saveAccountInfo(temp)
        store.dispatch('setTokenStatus', true)
        store.dispatch('setStatus', false)
        store.dispatch('showLoginDialog', true)
        router.push('/')
      }
    }
  })
})
</script>
