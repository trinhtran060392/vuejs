<template>
  <v-app id="inspire" dark>
    <Notification></Notification>
    <Login></Login>
    <PackageSelection/>
    <ConfirmDialog/>
    <!-- <Player></Player> -->
    <v-navigation-drawer
      v-if="isInSettingPage"
      clipped
      fixed
      app>
      <v-list dense>
        <v-list-tile  to="/account" exact>
          <v-list-tile-action>
            <v-icon>account_circle</v-icon>
          </v-list-tile-action>
          <v-list-tile-content>
            <v-list-tile-title>
              <router-link :to="{ name: 'account' }" class="text-item">
                Thông tin tài khoản
              </router-link>
            </v-list-tile-title>
          </v-list-tile-content>
        </v-list-tile>
        <v-list-tile  to="/history" exact>
          <v-list-tile-action>
            <v-icon>history</v-icon>
          </v-list-tile-action>
          <v-list-tile-content>
            <v-list-tile-title>
              <router-link :to="{ name: 'history' }" class="text-item">
                Lịch sử giao dịch
              </router-link>
            </v-list-tile-title>
          </v-list-tile-content>
        </v-list-tile>
        <v-list-tile  to="/wallet" exact>
          <v-list-tile-action>
            <v-icon>account_balance_wallet</v-icon>
          </v-list-tile-action>
          <v-list-tile-content>
            <v-list-tile-title>
              <router-link :to="{ name: 'wallet' }" class="text-item">
                Ví điện tử
              </router-link>
            </v-list-tile-title>
          </v-list-tile-content>
        </v-list-tile>
        <v-list-tile  exact>
          <v-list-tile-action>
            <v-icon>exit_to_app</v-icon>
          </v-list-tile-action>
          <v-list-tile-content>
            <v-list-tile-title>
              <a @click="clickSubAccount({ type: 2 })"> Đăng xuất
              </a>
            </v-list-tile-title>
          </v-list-tile-content>
        </v-list-tile>
      </v-list>
    </v-navigation-drawer>
    <v-toolbar app fixed clipped-left class="nav-head">
      <v-toolbar-title>
        <router-link :to = "{path: '/'}">
          <img src="../../assets/static/logo.png">
        </router-link>
      </v-toolbar-title>
      
      <v-toolbar-items class="hidden-sm-and-down">
        <v-menu open-on-hover offset-y v-for="menu in menus" :key="menu.path_id">
          <v-btn flat slot="activator" @click="openAllMenu(menu)">{{menu.name[0].text}}</v-btn>
          <v-list v-if="menu.children.length">
            <v-list-tile v-for="item in menu.children" :key="item.path_id" @click="openSubMenu(item)">
              <v-list-tile-title>{{ item.name[0].text }}</v-list-tile-title>
            </v-list-tile>
          </v-list>
        </v-menu>
        <v-text-field
          v-model="searchText"
          label="Search"
          required class="search"
          @keyup.enter="search(searchText)">
        </v-text-field>
      </v-toolbar-items>
      <v-spacer></v-spacer>
      <v-btn v-if="!isAuthenticated" color="" class="btn-login"  @click="openLogin()">Đăng nhập</v-btn>
      <div v-if="isAuthenticated" class="text-xs-center">
        <v-menu offset-y>
          <v-btn color="" class="btn-login" dark slot="activator">{{account.id}}</v-btn>
          <v-list>
            <v-list-tile v-for="item in items" :key="item.type">
              <v-list-tile-action>
                <v-icon>{{item.icon}}</v-icon>
              </v-list-tile-action>
              <v-list-tile-content>
                <v-list-tile-title>
                  <a @click="clickSubAccount(item)"> {{ item.title }}
                  </a>
                </v-list-tile-title>
              </v-list-tile-content>
            </v-list-tile>
          </v-list>
        </v-menu>
      </div>
    </v-toolbar>
    <v-content class="content-conainer">
      <carousel  v-if="banners.length && isShowBanner" :autoplay="false" :perPage="1" :navigationEnabled="true" :loop="true" class="banner" :paginationEnabled="true"
      delimiter-icon="">
        <slide v-for="i in banners" :key="`${i.id}`">
          <v-layout>
              <v-flex xs4 class="banner-action">
                <div class="banner-action-group">
                  <div class="title">{{i.title}}</div>
                  <v-btn :to="{ name: 'detail', params: { vodId: i.action_url } }" class="btn-now">
                    <v-icon>play_arrow</v-icon>Xem ngay</v-btn>
                </div>
              </v-flex>
              <v-flex xs8>
                <router-link :to="{ name: 'detail', params: { vodId: i.action_url } }" class="img-wrapper">
                  <img :src="i.photoUrl">
                </router-link>
              </v-flex>
            </v-layout>
        </slide>
      </carousel>
      <router-view></router-view>
      <v-footer app>
        <v-container>
          <v-layout row wrap>
            <v-flex md3 offset-md2 xs6 sm6>
              <v-card class="img-container">
                <img src="../../assets/static/ap1.png">
              </v-card>
            </v-flex>
            <v-flex md3 offset-md2 xs6 sm6>
              <v-card class="img-container">
                <img src="../../assets/static/ap2.png">
              </v-card>
            </v-flex>
          </v-layout>
        </v-container>
        
      </v-footer>
      <v-divider></v-divider>
      <v-footer>
        <v-container>
          <p class="col-copry">Tổng công ty Viễn thông Viettel<br>
          Trung tâm chăm sóc khách hàng: 18008119 (miễn phí)<br>
          © 2017 All rights reserved.<br>
          </p>
        </v-container>
      </v-footer>
    </v-content>
    
  </v-app>
</template>


<script>
  import DashboardService from '../dashboard/DashboardService'
  import Ulti from '../shared/Ulti'
  import _ from 'lodash'
  import Login from '../authentication/Login'
  import Auth from '../authentication/Auth'
  import PackageSelection from '../package/PackageSelection'
  import Notification from '../shared/Notification'
  import ConfirmDialog from '../shared/ConfirmDialog'
  import Constant from '../shared/Constant'

  export default {
    components: {
      Login,
      PackageSelection,
      Notification,
      ConfirmDialog
    },
    computed: {
      isAuthenticated () {
        if (this.$store.getters.isAuthenticated) {
          this.setAccount()
        }
        return this.$store.getters.isAuthenticated
      },
      isInSettingPage () {
        return this.$store.getters.isInSettingPage
      },
      tokenReady () {
        return this.$store.getters.tokenReady
      },
      isShowBanner () {
        return this.$store.getters.isShowBanner
      }
    },
    data () {
      return {
        menus: [],
        items: [
          { title: 'Trang Tài Khoản', type: 1, icon: 'account_circle' },
          {
            type: 2,
            title: 'Đăng xuất',
            icon: 'exit_to_app'
          }
        ],
        searchText: '',
        banners: []
      }
    },
    props: {
      source: String
    },
    created () {
      this.initData()
    },
    watch: {
      tokenReady (val) {
        this.initData()
      }
    },
    methods: {
      search (text) {
        this.$router.push({ path: `/search?q=${text}` })
      },
      openMenu (menu) {
        this.$router.push({ path: `/cat/${menu.id}` })
      },
      openDashboard () {
        this.$router.push('/')
      },
      openSubMenu (menu) {
        console.log(menu)
        let catId = Ulti.getCategoryIdOfMenu(menu)
        this.$router.push({ path: `/subcat/${catId}?name=${menu.name[0].text}` })
      },
      openAllMenu (menu) {
        console.log(menu)
        let pathId = menu.path_id
        if (pathId === '/WEB_HOME') {
          this.$router.push({path: '/'})
          return
        }
        if (menu.type === 'channel') {
          this.$router.push({path: `/channels/${Constant.defaultChannel}`})
          return
        }
        let result = Ulti.getSubcategoryId(menu)
        this.$store.dispatch('setSubMenu', result)
        this.$router.push({ path: `/cat/${menu.id}` })
      },
      openLogin () {
        this.$store.dispatch('showLoginDialog', true)
      },
      setAccount () {
        let account = this.$localStorage.get('accountInfo')
        if (account) {
          this.account = JSON.parse(account)
        }
      },
      clickSubAccount (item) {
        switch (item.type) {
          case 2:
            this.$localStorage.remove('accountInfo')
            this.account = undefined
            this.$store.dispatch('changeStatus')
            this.$router.push({ path: '/' })
            break
          case 1:
            this.$router.push({ path: '/account' })
            break
        }
      },
      initData () {
        if (!this.tokenReady) return
        DashboardService.getBanners().then((response) => {
          let data = response.body.data
          if (data && data.length > 0) {
            let probannerList = data[0].data[0].campaigns
            for (let i = 0; i < probannerList.length; i++) {
              let value = probannerList[i]
              let determine = value.name[0].text.indexOf('#')
              value.title = value.name[0].text.substring(0, determine)
              value.desc = value.name[0].text.substring(determine + 1)
              value.photoUrl = Constant.entryPoint + '/api1/contents/pictures/' + value.id
            }
            this.banners = probannerList
            console.log(this.banners)
          }
        })
        DashboardService.getCats().then((response) => {
          return response.body
        }).then((response) => {
          let result = response.data
          let cats = Ulti.getCategories(result)
          let menus = Ulti.getMenus(result)
          this.menus = menus
          this.cats = cats
          let sharedData = {}
          sharedData.menus = menus
          sharedData.cats = cats
          this.$store.dispatch('setMenu', sharedData)
          if (this.$route.name === 'category') {
            let catId = this.$route.params.catId
            let menu = _.find(menus, (menu) => {
              return menu.id === catId
            })
            let result = Ulti.getSubcategoryId(menu)
            this.$store.dispatch('setSubMenu', result)
          }
        })
        let account = Ulti.getCurrentAccount()
        if (!account || account.accessToken === Constant.guestToken) return
        Auth.info().then((response) => {
          return response.body
        }).then((response) => {
          this.$store.dispatch('setIsSubcriber', response.config.vm_subscriber)
        })
      }
    }
  }
</script>
