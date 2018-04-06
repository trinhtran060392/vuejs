<template>
  <v-container grid-list-md text-xs-center>
      <v-layout row wrap>
        <v-flex xs2 v-for="i in channels" :key="i.id">
            <div class="vod-content">
              <img :src="i.photoUrl">
            </div>
        </v-flex>
      </v-layout>
    </v-container>
</template>

<script>
import ChannelService from './ChannelService'
export default {
  data () {
    return {
      channels: []
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
  watch: {
    tokenReady (val) {
      this.initData()
    }
  },
  methods: {
    initData () {
      if (!this.tokenReady) return
      ChannelService.list(50).then((response) => {
        return response.body
      }).then((response) => {
        let data = []
        let result = response.data
        console.log(result)
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
        console.log(data)
        this.channels = data
      })
    }
  }
}
</script>

