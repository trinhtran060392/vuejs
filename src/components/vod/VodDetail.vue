<template>
  <v-container grid-list-md text-xs-center class="detail-vod">
    <div class="player" v-if="isAuthenticated && vod.playable">
      <ThePlayer :vod="vod"/>
    </div>
    <v-layout row wrap>
        <v-flex xs3 class="text-md-center image-container">
          <img :src="vod.photoUrl">
          <div class="play-mask" @click="playVod()"></div>
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
    <v-layout row wrap v-if="eps.length">
      <div class="ep-id">Tập: </div>
      <div v-for="i in eps" :key="`${i.program.id}`" class="ep-id" :class="{'active' : vod.id === i.program.id}">
        <router-link :to="{ name: 'detail', params: { vodId: i.program.id } }">
          {{i.program.series.episode}}
        </router-link>
      </div>
    </v-layout>
    <v-layout>
      <carousel :autoplay="true" :perPage="8" :navigationEnabled="true" :loop="true" v-if="relateVods.length">
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
import ThePlayer from '../player/ThePlayer'
import Ulti from '../shared/Ulti'
export default {
  components: {
    ThePlayer
  },
  data () {
    return {
      vod: {},
      relateVods: [],
      eps: []
    }
  },
  computed: {
    tokenReady () {
      return this.$store.getters.tokenReady
    },
    isAuthenticated () {
      return this.$store.getters.isAuthenticated
    }
  },
  watch: {
    $route (to, from) {
      if (from.params.vodId !== to.params.vodId) {
        if (!this.tokenReady) return
        this.initData()
      }
    },
    tokenReady (val) {
      this.initData()
    }
  },
  created () {
    console.log('created')
    this.initData()
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
    playVod () {
      if (!this.isAuthenticated) {
        console.log('open login popup')
        this.$store.dispatch('showLoginDialog', true)
      } else {
        console.log('check buy now or play now')
        let vodId = this.$route.params.vodId
        let isPlayable
        VodService.get(vodId).then((response) => {
          isPlayable = Ulti.isPlayable(response)
          this.$set(this.vod, 'playable', isPlayable)
          if (!isPlayable) {
            console.log(response)
            let obj = {}
            obj.stepNumber = 1
            obj.hasOneStep = false
            this.$store.dispatch('setStep', obj)
            this.$store.dispatch('setListPackage', response.purchasable_products)
            this.$store.dispatch('showPackage', true)
          }
        })
      }
    },
    initData () {
      if (!this.tokenReady) return
      let vodId = this.$route.params.vodId
      VodService.get(vodId).then((response) => {
        this.vod = response
        if (response.isVodInSeries) {
          VodService.getEpsForSeriesVod(response.epId).then((response) => {
            this.eps = response
          })
        }
        VodService.relateVods(vodId).then((response) => {
          this.relateVods = response
        })
      })
    }
  }
}
</script>
<style lang="scss">
  .image-container {
    position: relative;
    .play-mask {
      position: absolute;
      background: url('/static/icon-play.png') center no-repeat;
      left: 0;
      top: 0;
      width: 100%;
      height: 100%;
      display: block;
      cursor: pointer;
    }
  }
</style>
