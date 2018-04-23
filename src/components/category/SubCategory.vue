
<template>
  <v-container grid-list-md text-xs-center>
      <h3 class="title-text">{{title}}</h3>
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
        <v-btn @click="loadMoreItem()" class="btn-add">Xem thêm</v-btn>
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
    computed: {
      tokenReady () {
        return this.$store.getters.tokenReady
      }
    },
    created () {
      this.initData()
    },
    mounted () {
      console.log(12345)
    },
    watch: {
      '$route.params.catId' () {
        this.initData()
      },
      '$route.query.name' () {
        this.title = this.$route.query.name
      },
      tokenReady (val) {
        this.initData()
      }
    },
    methods: {
      initData () {
        if (!this.tokenReady) return
        let catId = this.$route.params.catId
        this.title = this.$route.query.name
        DashboardService.getCatContent(catId, 24).then((response) => {
          console.log(response)
          this.catData = response
        })
      },
      loadMoreItem () {
        let catId = this.$route.params.catId
        let offset = this.catData.length
        DashboardService.getCatContentByOffset(catId, offset, 24).then((response) => {
          console.log(response)
          this.catData = this.catData.concat(response)
        })
      }
    }
  }
</script>

<style>
  
</style>
