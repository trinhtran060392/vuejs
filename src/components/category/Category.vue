
<template>
  <div class="dashboard-container">
    <v-container v-for="item in catData" :key="`${item.title}`">
      <p class="title-text text-sm-left text-xs-center">{{item.title}}</p>
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
      }
    },
    watch: {
      subMenus (val) {
        console.log('watch cat update')
        this.catData = []
        let catIds = this.subMenus
        if (!catIds || !catIds.length) return
        for (let i = 0; i < catIds.length; i++) {
          let temp = catIds[i]
          let obj = {}
          DashboardService.getCatContent(temp.catMenuId).then((response) => {
            obj.title = temp.title
            obj.data = response
            this.catData.push(obj)
          })
        }
      }
    },
    created () {
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
          this.catData.push(obj)
        })
      }
    }
  }
</script>

<style>
  
</style>
