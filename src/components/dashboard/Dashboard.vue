
<template>
  <div class="dashboard-container">
    <v-container v-for="item in homeData" :key="`${item.title}`">
      <div> 
        {{item.title}}
      </div>
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
            this.homeData.push(obj)
            console.log(obj)
          })
        }
      }
    },
    created () {
      for (let i = 0; i < this.cats.length; i++) {
        let temp = this.cats[i].categoryConfig
        let obj = {}
        obj.title = this.cats[i].name[0].text
        DashboardService.getCatContent(temp.value).then((response) => {
          obj.data = response
          this.homeData.push(obj)
        })
      }
    }
  }
</script>

<style>
  .vod-content {
    padding: 5px;
    max-height: 250px;
  }
  img {
    max-width: 100%;
  }
</style>
