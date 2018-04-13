
<template>
  <div class="dashboard-container">
    <v-container v-for="item in catData" :key="`${item.title}`">
      <v-layout row wrap>
        <v-flex xs6>
          <p class="title-text text-sm-left text-xs-center">{{item.title}}</p>
        </v-flex>
        <v-flex xs6 class="text-xs-right">
          <!-- <v-btn @click="showAll(item.subCatId, item.title)">Xem tất cả</v-btn> -->
          <a @click="showAll(item.subCatId, item.title)" class="span-show-all">Xem tất cả</a>
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
  import DashboardService from '../dashboard/DashboardService'
  export default {
    components: {
      Carousel, Slide
    },
    data () {
      return {
        catData: []
      }
    },
    computed: {
      subMenus () {
        return this.$store.getters.subMenus.catMenuIds
      },
      tokenReady () {
        return this.$store.getters.tokenReady
      }
    },
    watch: {
      subMenus (val) {
        this.initData()
      },
      tokenReady (val) {
        this.initData()
      }
    },
    created () {
      this.initData()
    },
    methods: {
      showAll (subCatId, title) {
        this.$router.push({ path: `/subcat/${subCatId}?name=${title}` })
      },
      initData () {
        if (!this.tokenReady) return
        this.catData = []
        let catIds = this.subMenus
        console.log('create cat page')
        if (!catIds || !catIds.length) return
        for (let i = 0; i < catIds.length; i++) {
          let temp = catIds[i]
          let obj = {}
          DashboardService.getCatContent(temp.catMenuId).then((response) => {
            obj.data = response
            obj.title = temp.title
            obj.subCatId = temp.catMenuId
            this.catData.push(obj)
          })
        }
      }
    }
  }
</script>

<style>
  
</style>
