
<template>
  <v-container grid-list-md text-xs-center>
      <h3>{{title}}</h3>
      <v-layout row wrap>
        <v-flex xs2 v-for="i in catData" :key="i.id">
            <div class="vod-content">
              <router-link :to="{ name: 'detail', params: { vodId: i.program.id } }">
                <img :src="i.photoUrl">
              </router-link>
            </div>
        </v-flex>
      </v-layout>
      <v-layout justify-center>
        <v-btn>Xem thêm</v-btn>
      </v-layout>
    </v-container>
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
        catData: [],
        title: ''
      }
    },
    created () {
      let catId = this.$route.params.catId
      this.title = this.$route.query.name
      DashboardService.getCatContent(catId, 24).then((response) => {
        console.log(response)
        this.catData = response
      })
    },
    mounted () {
      console.log(12345)
    },
    watch: {
      '$route.params.catId' () {
        let catId = this.$route.params.catId
        console.log(this.$route)
        DashboardService.getCatContent(catId, 24).then((response) => {
          console.log(response)
          this.catData = response
        })
      },
      '$route.query.name' () {
        this.title = this.$route.query.name
      }
    }
  }
</script>

<style>
  
</style>
