<template>
  <v-app id="inspire" dark>
    <v-navigation-drawer
      clipped
      fixed
      v-model="isAuthenticated"
      app>
      <v-list dense>
        <v-list-tile @click="">
          <v-list-tile-action>
            <v-icon>dashboard</v-icon>
          </v-list-tile-action>
          <v-list-tile-content>
            <v-list-tile-title>Dashboard</v-list-tile-title>
          </v-list-tile-content>
        </v-list-tile>
        <v-list-tile @click="">
          <v-list-tile-action>
            <v-icon>settings</v-icon>
          </v-list-tile-action>
          <v-list-tile-content>
            <v-list-tile-title>Settings</v-list-tile-title>
          </v-list-tile-content>
        </v-list-tile>
      </v-list>
    </v-navigation-drawer>
    <v-toolbar app fixed clipped-left>
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
      <v-menu offset-y>
        <v-btn color="primary" dark slot="activator">Dropdown</v-btn>
        <v-list>
          <v-list-tile v-for="item in items" :key="item.title">
            <v-list-tile-title>{{ item.title }}</v-list-tile-title>
          </v-list-tile>
        </v-list>
      </v-menu>
    </v-toolbar>
    <v-content>
      <v-container fluid fill-height>
        <v-layout>
          <v-flex>
            <router-view></router-view>
          </v-flex>
        </v-layout>
      </v-container>
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
  export default {
    computed: {
      isAuthenticated () {
        return this.$store.getters.isAuthenticated
      }
    },
    data () {
      return {
        menus: [],
        items: [
          { title: 'One' }
        ]
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
      },
      openAllMenu (menu) {
        console.log(menu)
        let pathId = menu.path_id
        if (pathId === '/WEB_HOME') {
          this.$router.push({path: '/'})
          return
        }
        let result = {}
        result.id = menu.id
        let array = []
        for (let i = 0; i < menu.children.length; i++) {
          let obj = {}
          let temp = menu.children[i]
          let catMenuId = Ulti.getCategoryIdOfMenu(temp)
          obj.catMenuId = catMenuId
          obj.title = temp.name[0].text
          array.push(obj)
        }
        result.catMenuIds = array
        this.$store.dispatch('setSubMenu', result)
        this.$router.push({ path: `/cat/${menu.id}` })
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
      })
    }
  }
</script>

<style scoped>
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
</style>
