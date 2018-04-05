<template>
  <v-app id="inspire" dark>
    <Login></Login>
    <Package></Package>
    <v-navigation-drawer
      v-if="isInSettingPage"
      clipped
      fixed
      app>
      <v-list dense>
        <v-list-tile @click="" class="item-menu active-item">
          <v-list-tile-action>
            <v-icon>dashboard</v-icon>
          </v-list-tile-action>
          <v-list-tile-content>
            <v-list-tile-title>
              <router-link :to="{ name: 'account' }" class="text-item">
                Thông tin tài khoản
              </router-link>
            </v-list-tile-title>
          </v-list-tile-content>
        </v-list-tile>
        <v-list-tile @click="" class="item-menu">
          <v-list-tile-action>
            <v-icon>settings</v-icon>
          </v-list-tile-action>
          <v-list-tile-content>
            <v-list-tile-title>
              <router-link :to="{ name: 'history' }" class="text-item">
                Lịch sử giao dịch
              </router-link>
            </v-list-tile-title>
          </v-list-tile-content>
        </v-list-tile>
      </v-list>
    </v-navigation-drawer>
    <v-toolbar app fixed clipped-left class="nav-head">
      <v-toolbar-title>
        <img src="../../assets/static/logo.png">
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
      </v-toolbar-items>
      <v-spacer></v-spacer>
      <v-btn v-if="!isAuthenticated" color="" class="btn-login"  @click="openLogin()">Đăng nhập</v-btn>
      <div v-if="isAuthenticated" class="text-xs-center">
        <v-menu offset-y>
          <v-btn color="" class="btn-login" dark slot="activator">{{account.id}}</v-btn>
          <v-list>
            <v-list-tile v-for="item in items" :key="item.type" @click="clickSubAccount(item)">
              <v-list-tile-title>{{ item.title }}</v-list-tile-title>
            </v-list-tile>
          </v-list>
        </v-menu>
      </div>
    </v-toolbar>
    <v-content>
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
  import Package from '../package/Package'
  export default {
    components: {
      Login,
      Package
    },
    computed: {
      isAuthenticated () {
        if (this.$store.getters.isAuthenticated) {
          this.setAccount()
        } else {
          if (this.account) {
            this.$store.dispatch('changeStatus')
          }
        }
        return this.$store.getters.isAuthenticated
      },
      isInSettingPage () {
        return this.$store.getters.isInSettingPage
      }
    },
    data () {
      return {
        menus: [],
        items: [
          { title: 'Trang Tài Khoản', type: 1 },
          {
            type: 2,
            title: 'Đăng xuất'
          }
        ],
        account: JSON.parse(this.$localStorage.get('accountInfo'))
      }
    },
    props: {
      source: String
    },
    methods: {
      openMenu (menu) {
        this.$router.push({ path: `/cat/${menu.id}` })
      },
      openDashboard () {
        this.$router.push('/')
      },
      openSubMenu (menu) {
        console.log(menu)
        let catId = Ulti.getCategoryIdOfMenu(menu)
        this.$router.push({ path: `/subcat/${menu.id}/${catId}?name=${menu.name[0].text}` })
      },
      openAllMenu (menu) {
        let pathId = menu.path_id
        if (pathId === '/WEB_HOME') {
          this.$router.push({path: '/'})
          return
        }
        if (menu.type === 'channel') {
          this.$router.push({path: '/channels/default'})
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
            break
          case 1:
            this.$router.push({ path: '/account' })
            break
        }
      }
    },
    created () {
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
        console.log(menus)
      })
      Auth.info().then((response) => {
        return response.body
      }).then((response) => {
        console.log(response)
        this.$store.dispatch('setIsSubcriber', response.config.vm_subscriber)
      })
    }
  }
</script>

<style scoped lang="scss">
  $yellow: #ffcc05;
  .img-container {
    background: rgba(10, 14, 21, 0.6);
    border: 1px solid #292929;
    padding: 10px;
  }
  .application .theme--dark.card, .theme--dark .card {
    background-color: none;
  }
  .application .theme--dark.toolbar, .theme--dark .toolbar {
    background-color: transparent;
  }
  .item-menu:hover .text-item{
    color: #ffcc05;
  }
  .item-menu .text-item{
    font-size: 15px !important;
    color: #c8c8c8;
    text-decoration: none;
  }
  .nav-head {
    background-color: rgba(14,22,35,.86) !important;
  }
  .btn-login {
    border: 1px solid rgba(255,204,5,.35);
    color: $yellow !important;
    background-color: rgba(14,22,35,.86) !important;
  }
  .active-item {
    background: rgba(50,50,50,.85)!important;
  }
  .active-item .text-item{
    font-weight: 600;
    color: $yellow;
  }
</style>
