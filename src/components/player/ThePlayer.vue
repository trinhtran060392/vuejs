<template>
  <v-container>
    <video id=video width=960 height=540 class="video-js vjs-default-skin" controls>
      <source src="https://video-dev.github.io/streams/x36xhzz/x36xhzz.m3u8" type="application/x-mpegURL">
    </video>
    <!-- <video id="video" controls ></video> -->
  </v-container>
</template>
<script>
  import VodService from '../vod/VodService'
  import Constant from '../shared/Constant'
  import 'videojs-contrib-hls'
  import videojs from 'video.js'
  import ChannelService from '../channel/ChannelService'
  import Ulti from '../shared/Ulti'
  require('videojs-contrib-media-sources')

  export default {
    props: { vod: {}, detailChannel: {} },
    computed: {
      isAuthenticated () {
        return this.$store.getters.isAuthenticated
      },
      tokenReady () {
        return this.$store.getters.tokenReady
      }
    },
    data () {
      return {
        vodUrl: null,
        player: {}
      }
    },
    mounted () {
      this.player = videojs('video')
    },
    watch: {
      'vod' () {
        console.log('watch and refresh vod: ', this.vod)
        this.playVod()
      },
      detailChannel () {
        console.log(this.detailChannel)
        this.checkChannelPlayable()
      },
      tokenReady () {
        if (this.$route.name === 'channel') {
          this.checkChannelPlayable()
        }
      }
    },
    created () {
      console.log('the player component created')
      if (this.$route.name === 'detail') {
        this.playVod()
      } else {
        this.checkChannelPlayable()
      }
    },
    destroyed () {
      if (this.player) {
        this.player.dispose()
      }
    },
    methods: {
      playVod () {
        let vodId = this.$route.params.vodId
        VodService.getVodURL(vodId, this.vod.singleProductId, this.vod.isFreeNoPair).then((response) => {
          if (response.status === Constant.statusCode.OK) {
            let vodRequestId = window.encodeURIComponent(response.body.gsdm.vod_request_id)
            let addresses = response.body.gsdm.glb_addresses
            if (addresses.length > 0) {
              for (let i = 0; i < addresses.length; i++) {
                this.vodUrl = 'http://' + addresses[i] + '/' + this.vod.vodLocator + '?AdaptiveType=HLS&VOD_RequestID=' + vodRequestId
              }
            }
            this.player.ready(() => {
              this.player.src({
                src: this.vodUrl,
                type: 'application/x-mpegURL'
              })
              this.player.play()
            })
          }
        })
      },
      checkChannelPlayable () {
        if (!this.tokenReady) return
        if (!this.isAuthenticated) {
          console.log('open login popup')
          this.$store.dispatch('showLoginDialog', true)
        } else {
          console.log('handle to buy or play now')
          let id = this.$route.params.channelId
          ChannelService.get(id).then((response) => {
            let channel = response
            let isPlayable = Ulti.isChannelPlayable(channel)
            if (!isPlayable) {
              console.log('show buy package', channel)
              this.$store.dispatch('setListPackage', channel.purchasable_products)
              this.$store.dispatch('showPackage', true)
              let obj = {}
              obj.stepNumber = 1
              obj.hasOneStep = false
              this.$store.dispatch('setStep', obj)
            } else {
              this.playChannel(channel)
            }
          })
        }
      },
      playChannel (channel) {
        ChannelService.prepare(channel).then((response) => {
          console.log(response)
          let result = response.body
          if (result.glbAddress && result.glbAddress.length) {
            let reqID = encodeURIComponent(result.requestId)
            let url
            for (let i = 0; i < result.glbAddress.length; i++) {
              url = `http://${result.glbAddress[i]}/${channel.channel.pid}.m3u8?AdaptiveType=HLS&VOD_RequestID=${reqID}`
            }
            this.vodUrl = url
            this.player.ready(() => {
              this.player.src({
                src: this.vodUrl,
                type: 'application/x-mpegURL'
              })
              console.log(this.player)
              this.player.play()
            })
          }
        })
      }
    }
  }
</script>
<style lang="scss">
  .player .video-js .vjs-big-play-button {
    top: 46% !important;
    left: 46% !important;
  }
  .video-js .vjs-big-play-button {
    top: 46% !important;
    left: 44% !important;
  }
  .video-js {
    width: auto !important
  }
</style>

