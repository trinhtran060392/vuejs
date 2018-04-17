<template>
  <div class="dashboard-container">
    <v-container>
      <carousel :autoplay="true" :perPage="15" :navigationEnabled="true" :loop="false" :paginationEnabled="false">
        <slide v-for="i in channels" :key="`3${i.id}`">
          <div class="channel-content small">
            <a @click="playChannel(i)">
              <img :src="i.photoUrl">
            </a>
          </div>
        </slide>
      </carousel>
    </v-container>
    <v-container v-for="item in homeData" :key="`${item.title}`">
      <v-layout row wrap class="row-item">
        <v-flex xs6>
          <p class="title-text text-sm-left text-xs-center">{{item.title}}</p>
        </v-flex>
        <v-flex xs6 class="text-xs-right">
          <!--<v-btn @click="showAll(item.subCatId, item.title)">Xem tất cả</v-btn>-->
          <a @click="showAll(item.subCatId, item.title)" class="span-show-all">Xem tất cả</a>
        </v-flex>
      </v-layout>
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
    <v-container v-if="resumeList.length && isAuthenticated">
      <v-layout row wrap class="row-item">
        <v-flex xs6>
          <p class="title-text text-sm-left text-xs-center">Đang xem</p>
        </v-flex>
      </v-layout>
      <carousel :autoplay="true" :perPage="8" :navigationEnabled="true" :loop="true">
        <slide v-for="i in resumeList" :key="`3${i.id}`">
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
  import DashboardService from './DashboardService'
  import ChannelService from '../channel/ChannelService'
  import VodService from '../vod/VodService'
  import _ from 'lodash'
  export default {
    components: {
      Carousel, Slide
    },
    data () {
      return {
        users: [],
        homeData: [],
        isLoadCompleted: false,
        channels: [],
        resumeList: []
      }
    },
    computed: {
      cats () {
        return this.$store.getters.cats
      },
      menus () {
        return this.$store.getters.menus
      },
      tokenReady () {
        return this.$store.getters.tokenReady
      },
      isAuthenticated () {
        return this.$store.getters.isAuthenticated
      }
    },
    watch: {
      cats () {
        this.initData()
      },
      menus (val) {
      },
      tokenReady (to, from) {
        console.log(to, from)
        this.initData()
      },
      isAuthenticated (val) {
        if (val) this.getResumeList()
      }
    },
    created () {
      this.initData()
    },
    methods: {
      getResumeList () {
        DashboardService.getResumeList().then((response) => {
          return response.body
        }).then((response) => {
          let ids = []
          _.forEach(response.data, (item) => {
            ids.push(item.id)
          })
          VodService.getVodByIds(ids).then((response) => {
            console.log(response)
            this.resumeList = response
          })
        })
      },
      playChannel (item) {
        this.$router.push({ name: 'channel', params: { channelId: item.channelId } })
      },
      showAll (id, title) {
        this.$router.push({ path: `/subcat/${id}?name=${title}` })
      },
      initData () {
        if (!this.tokenReady) return
        for (let i = 0; i < this.cats.length; i++) {
          let temp = this.cats[i].categoryConfig
          let obj = {}
          obj.title = this.cats[i].name[0].text
          DashboardService.getCatContent(temp.value).then((response) => {
            obj.data = response
            obj.subCatId = temp.value
            this.homeData.push(obj)
          })
        }
        if (this.isLoadCompleted) return
        ChannelService.list(500).then((response) => {
          return response.body
        }).then((response) => {
          let data = []
          let result = response.data
          for (let i = 0; i < result.length; i++) {
            let obj = {}
            let temp = result[i]
            let genres = temp.channel.genres[0].split(':')
            genres = `${genres[0]}:${genres[1]}`
            obj.channelId = temp.channel.id
            obj.channelName = temp.channel.name[0].text
            obj.genres = genres
            obj.serviceId = temp.service_id
            obj.channel = temp.channel
            obj.pid = temp.channel.pid
            obj.photoUrl = `/static/channel/channel_${obj.pid}.png`
            data.push(obj)
          }
          this.isLoadCompleted = true
          this.channels = data
        })
        if (this.isAuthenticated) this.getResumeList()
      }
    }
  }
</script>

<style>

</style>
