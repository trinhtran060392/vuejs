<template>
  <v-container grid-list-md text-xs-center>
    <v-card class="player">
      <Player :vod="vod"></Player>
    </v-card>
    <v-layout row wrap>
        <v-flex xs3>
          <img :src="vod.photoUrl">
        </v-flex>
        <v-flex xs9>
            <v-card>
              <v-card-title class="text-xs-left">
                {{vod.name}}
              </v-card-title>
              <v-card-text class="grey--text text-xs-left">Nội dung</v-card-text>
              <v-card-text class="text-xs-left">
                {{vod.description}}
              </v-card-text>
              <v-card-text class="grey--text text-xs-left">Thông tin chi tiết</v-card-text>
              <v-card-text class="text-xs-left">
                <p>Đạo diễn: {{vod.directors}}</p>
                <p>Diễn viên: {{vod.actors}}</p>
              </v-card-text>
            </v-card>
        </v-flex>
    </v-layout>
    <v-layout>
      
    <carousel :autoplay="true" :perPage="8" :navigationEnabled="true" :loop="true">
      <slide v-for="i in relateVods" :key="`3${i.id}`">
        <div class="vod-content">
          <router-link :to="{ name: 'detail', params: { vodId: i.program.id } }">
            <img :src="i.photoUrl">
          </router-link>
        </div>
      </slide>
      </carousel>
    </v-layout>
  </v-container>
</template>

<script>
import VodService from './VodService'
import Player from '../player/Player'
export default {
  components: {
    Player
  },
  data () {
    return {
      vod: {},
      relateVods: []
    }
  },
  watch: {
    '$route' (to, from) {
      if (from.params.vodId !== to.params.vodId) {
        let vodId = this.$route.params.vodId
        VodService.get(vodId).then((response) => {
          this.vod = response
          VodService.relateVods(vodId).then((response) => {
            this.relateVods = response
          })
        })
      }
    }
  },
  created () {
    console.log('created')
    let vodId = this.$route.params.vodId
    VodService.get(vodId).then((response) => {
      this.vod = response
      VodService.relateVods(vodId).then((response) => {
        this.relateVods = response
      })
    })
  },
  mounted () {
    console.log('mounted')
  },
  updated () {
    console.log('updated')
  },
  destroyed () {
    console.log('destroy')
  },
  methods: {
    play () {
      this.$router.push({ name: 'play' })
    }
  }
}
</script>
<style lang="scss">
  .application .theme--dark.card, .theme--dark .card {
    background-color: transparent;
  }
  .player {
    margin: 30px 0px 20px 0px;
  }
</style>
