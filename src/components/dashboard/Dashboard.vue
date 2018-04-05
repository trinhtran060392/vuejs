
<template>
  <div class="dashboard-container">
    <v-container v-for="item in homeData" :key="`${item.title}`">
      <v-layout row wrap>
        <v-flex xs6>
          <p class="title-text text-sm-left text-xs-center">{{item.title}}</p>
        </v-flex>
        <v-flex xs6 class="text-xs-right">
          <v-btn @click="showAll(item.subCatId, item.title)">Xem tất cả</v-btn>
        </v-flex>
      </v-layout>
      <carousel :autoplay="true" :perPage="8" :navigationEnabled="true" :loop="true">
        <slide v-for="i in item.data" :key="`3${i.id}`">
          <div class="vod-content">
            <router-link :to="{ name: 'detail', params: { vodId: i.program.id } }">
              <img :src="i.photoUrl">
            </router-link>
            
          </div>
        </slide>
      </carousel>
    </v-container>
  </div>
</template>

<script>
  import { Carousel, Slide } from 'vue-carousel'
  import DashboardService from './DashboardService'
  export default {
    components: {
      Carousel, Slide
    },
    data () {
      return {
        users: [],
        homeData: [],
        isLoadCompleted: false
      }
    },
    computed: {
      cats () {
        return this.$store.getters.cats
      },
      menus () {
        return this.$store.getters.menus
      }
    },
    watch: {
      cats: function (val) {
        for (let i = 0; i < this.cats.length; i++) {
          let temp = this.cats[i].categoryConfig
          let obj = {}
          obj.title = this.cats[i].name[0].text
          DashboardService.getCatContent(temp.value).then((response) => {
            obj.data = response
            obj.subCatId = temp.value
            this.homeData.push(obj)
          })
        }
      },
      menus: function (val) {
      }
    },
    created () {
      for (let i = 0; i < this.cats.length; i++) {
        let temp = this.cats[i].categoryConfig
        let obj = {}
        obj.title = this.cats[i].name[0].text
        DashboardService.getCatContent(temp.value).then((response) => {
          obj.data = response
          obj.subCatId = temp.value
          this.homeData.push(obj)
        })
      }
    },
    methods: {
      showAll (id, title) {
        this.$router.push({ path: `/subcat/${id}?name=${title}` })
      }
    }
  }
</script>

<style>

</style>
