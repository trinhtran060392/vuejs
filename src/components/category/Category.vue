
<template>
  <div class="dashboard-container">
    <v-container v-for="item in [1, 2, 3]" :key="`${item}`">
      <p class="text-sm-left text-xs-center">{{item}}</p>
      <carousel :autoplay="true" :perPage="8" :navigationEnabled="true" :loop="true">
        <slide v-for="i in item.data" :key="`3${i.id}`">
          <div class="vod-content">
            <img :src="i.photoUrl">
          </div>
        </slide>
      </carousel>
    </v-container>
  </div>
</template>

<script>
  import { Carousel, Slide } from 'vue-carousel'
  // import CatService from './CatService'
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
    },
    watch: {
    },
    created () {
      let catId = this.$route.params.catId
      console.log(catId)
    }
  }
</script>

<style>
  
</style>
