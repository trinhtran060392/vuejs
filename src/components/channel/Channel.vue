<template>
  <v-container grid-list-md text-xs-center>
    <v-layout row wrap>
      <v-flex xs8>
        <ThePlayer :detailChannel="detailChannel"/>
      </v-flex>
      <v-flex xs4 align-center justify-center>
        <div>This is channel program</div>
      </v-flex>
    </v-layout>
    <v-tabs
      v-model="active"
      color="cyan"
      dark
      slider-color="yellow"
    >
      <v-tab
        v-for="i in channelCategory"
        :key="i.id"
        ripple
      @click="selectCategory(i)">
        {{ i.name }}
      </v-tab>
    </v-tabs>
    <div v-if="currentCat.id === 'all'">
      <v-container v-for="item in channelCategory" :key="`${item.id}`">
        <v-layout row wrap v-if="item.id !== 'all'">
          <v-flex xs6>
            <p class="title-text text-sm-left text-xs-center">{{item.name}}</p>
          </v-flex>
        </v-layout>
        <v-layout row wrap>
          <v-flex xs2 v-for="i in channel[item.id]" :key="i.id">
              <div class="channel-content" @click="playChannel(i.channelId)">
                <img :src="i.photoUrl">
              </div>
          </v-flex>
        </v-layout>
      </v-container>
    </div>
    <v-layout row wrap v-if="currentCat.id !== 'all'">
      <v-flex xs2 v-for="i in channel[currentCat.id]" :key="i.id">
          <div class="channel-content" @click="playChannel(i.channelId)">
            <img :src="i.photoUrl">
          </div>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
import ChannelService from './ChannelService'
import ChannelCategory from './ChannelCategory'
import Ulti from '../shared/Ulti'
import ThePlayer from '../player/ThePlayer'

export default {
  components: {
    ThePlayer
  },
  data () {
    return {
      channel: {},
      currentCat: {
        id: 'all'
      },
      active: null,
      detailChannel: {}
    }
  },
  computed: {
    tokenReady () {
      return this.$store.getters.tokenReady
    },
    channelCategory () {
      return ChannelCategory.CHANNEL_CATEGORY_LIST
    }
  },
  created () {
    this.initData()
    console.log(this.channelCategory)
  },
  watch: {
    tokenReady (val) {
      this.initData()
    }
  },
  methods: {
    playChannel (id) {
      ChannelService.get(id).then((response) => {
        this.detailChannel = response
        this.$router.push({ name: 'channel', params: { channelId: id } })
        console.log(response)
      })
    },
    selectCategory (item) {
      this.currentCat = item
    },
    initData () {
      if (!this.tokenReady) return
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
        for (let i = 0; i < this.channelCategory.length; i++) {
          let temp = this.channelCategory[i]
          let channelsByCategory = Ulti.getChannelsByCategoryId(temp.config, data)
          let categoryKey = temp.id
          this.channel[categoryKey] = channelsByCategory
        }
        this.selectCategory(this.channelCategory[0])
      })
    }
  }
}
</script>

