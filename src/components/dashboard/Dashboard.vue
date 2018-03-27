
<template>
  <div class="dashboard-container">
    <v-container grid-list-md text-xs-center>
      <v-layout row wrap>
        <v-flex xs3 v-for="i in cats" :key="`3${i}`">
          <v-card dark color="secondary">
            <v-card-text class="px-0">
              <router-link :to="{ name: 'user', params: { userId: i.id }}">{{ i.name[0].text }}</router-link>
            </v-card-text>
            
          </v-card>
        </v-flex>
      </v-layout>
    </v-container>
    <v-container>
      <carousel :autoplay="true">
        <slide v-for="i in [1,2,3]" :key="`3${i}`"><span class="label">{{i}}</span></slide>
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
        users: []
      }
    },
    computed: {
      cats () {
        return this.$store.getters.cats
      }
    },
    watch: {
      cats: function (val) {
        console.log(this.cats)
        for (let i = 0; i < this.cats.length; i++) {
          var temp = this.cats[i].categoryConfig
          DashboardService.getCatContent(temp.value).then((response) => {
            return response.body
          }).then((data) => {
            console.log(data)
          })
        }
      }
    }
  }
</script>

<style scoped>
  
</style>
