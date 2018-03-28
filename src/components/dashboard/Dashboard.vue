
<template>
  <div class="dashboard-container">
    <v-container v-for="item in homeData" :key="`${item.title}`">
      <p class="text-sm-left text-xs-center">{{item.title}}</p>
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
            this.homeData.push(obj)
          })
        }
      },
      menus: function (val) {
        console.log(val)
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
  .VueCarousel-wrapper {
    padding: 30px 0;
  }
  .vod-content {
    padding: 5px;
    max-height: 265px;
  }
  .vod-content:hover {
    transform: scale(1.1);
    transition: all .3s ease-in-out;
    cursor: pointer;
  }
  img {
    max-width: 100%;
  }
  .VueCarousel-dot {
    display: none !important;
  }
  .VueCarousel-navigation-button {
    color: white !important;
  }
</style>
