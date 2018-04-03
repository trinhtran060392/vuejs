
<template>
  <v-container grid-list-md text-xs-center>
      <v-layout row wrap>
        <v-flex xs2 v-for="i in catData" :key="i.id">
            <div class="vod-content">
              <router-link :to="{ name: 'detail', params: { vodId: i.program.id } }">
                <img :src="i.photoUrl">
              </router-link>
            </div>
        </v-flex>
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
        catData: []
      }
    },
    created () {
      let catId = this.$route.params.catId
      DashboardService.getCatContent(catId, 20).then((response) => {
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
        DashboardService.getCatContent(catId, 20).then((response) => {
          console.log(response)
          this.catData = response
        })
      }
    }
  }
</script>

<style>
  
</style>
