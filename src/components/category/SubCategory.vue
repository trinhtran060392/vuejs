
<template>
  <div class="dashboard-container">
    <v-container>
      <v-layout>
        <v-flex xs2 v-for="i in catData" :key="`2${i.id}`">
          <img :src="i.photoUrl">
        </v-flex>
      </v-layout>
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
    created () {
      let catId = this.$route.params.catId
      console.log(catId)
      DashboardService.getCatContent(catId, 20).then((response) => {
        console.log(response)
        this.catData = response
      })
    }
  }
</script>

<style>
  
</style>
