<template>
  <div class="dashboard-container">
    <v-container grid-list-md text-xs-center>
      <v-layout row wrap>
        <v-flex xs12>
          <v-card dark color="secondary">
            <v-card-text class="px-0">{{user.first_name}}</v-card-text>
          </v-card>
        </v-flex>
      </v-layout>
    </v-container>
    <div>
      <carousel :autoplay="true">
        <slide v-for="i in [1,2,3]" :key="`3${i}`"><span class="label">{{i}}</span></slide>
      </carousel>
    </div>
  </div>
</template>

<script>
  import UserService from './UserService'
  import { Carousel, Slide } from 'vue-carousel'
  export default {
    components: {
      Carousel,
      Slide
    },
    data () {
      return {
        user: {}
      }
    },
    created () {
      let userId = this.$route.params.userId
      UserService.getUser(userId).then((response) => {
        return response.body
      }).then((response) => {
        let result = response.data
        this.user = result
        console.log(result)
      })
    }
  }
</script>

<style scoped>
  .VueCarousel-slide {
    position: relative;
    background: #42b983;
    color: #fff;
    font-family: Arial;
    font-size: 24px;
    text-align: center;
    min-height: 100px;
  }

  .label {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
  }
</style>
