<template>
  <v-container grid-list-md text-xs-center>
    <v-layout row wrap>
        <v-flex xs3>
          <img :src="vod.photoUrl">
        </v-flex>
        <v-flex xs9>
            <v-card>
              <v-card-title>
                {{vod.name}}
              </v-card-title>
              <v-card-title class="grey--text">Nội dung</v-card-title>
              <v-card-text class="text-xs-left">
                {{vod.description}}
              </v-card-text>
              <v-card-title class="grey--text">Thông tin chi tiết</v-card-title>
              <v-card-text class="text-xs-left">
                <p>Đạo diễn: {{vod.directors}}</p>
                <p>Diễn viên: {{vod.actors}}</p>
              </v-card-text>
            </v-card>
        </v-flex>
    </v-layout>
    <v-layout>
      
    <carousel :autoplay="true" :perPage="8" :navigationEnabled="true" :loop="true">
      <slide v-for="i in vod.relateVods" :key="`3${i.id}`">
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
export default {
  data () {
    return {
      vod: {}
    }
  },
  created () {
    let vodId = this.$route.params.vodId
    VodService.get(vodId).then((response) => {
      this.vod = response
      VodService.relateVods(vodId).then((response) => {
        this.$set(this.vod, 'relateVods', response)
        console.log(this.vod)
      })
    })
  }
}
</script>
<style lang="scss">
  .application .theme--dark.card, .theme--dark .card {
    background-color: transparent;
  }
</style>
