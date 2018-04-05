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
  import videojs from 'video.js'
  // require('video.js')
  require('videojs-contrib-media-sources')
  require('videojs-contrib-hls')
  // let player

  // let Hls = require('hls.js')
  // let player
  export default {
    props: { vod: {} },
    data () {
      return {
        vodUrl: null,
        isCompleted: false
      }
    },
    mounted () {
      console.log('mount play')
      let player = videojs('#video')
      player.play()
    },
    watch: {
      'vod' () {
        console.log('refesh', this.vod)
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
            // player.ready(() => {
            //   player.src({
            //     src: 'https://video-dev.github.io/streams/x36xhzz/x36xhzz.m3u8',
            //     type: 'application/x-mpegURL'
            //   })
            // })
            // player.play()
            // if (Hls.isSupported()) {
            //   let video = document.getElementById('video')
            //   let configHls = {
            //     emeEnabled: true,
            //     debug: true,
            //     enableWorker: true,
            //     widevineLicenseUrl: 'https://www.vietteltv.com.vn:8502'
            //   }
            //   console.log('https://video-dev.github.io/streams/x36xhzz/x36xhzz.m3u8', this.vodUrl)
            //   let hls = new Hls(configHls)
            //   hls.loadSource(this.vodUrl)
            //   hls.attachMedia(video)
            //   video.play()
            //   hls.on(Hls.Events.MANIFEST_PARSED, () => {
            //     video.play()
            //   })
            // }
          }
        })
      }
    },
    destroyed () {
    }
  }
</script>
<style lang="scss">
  .video-js .vjs-big-play-button {
    top: 50% !important;
    left: 50% !important;
  }
  .video-js {
    width: auto !important
  }
</style>

