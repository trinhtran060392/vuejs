<template>
  <v-container v-if="data.length">
    <v-tabs
      v-model="active"
      color="cyan"
      dark
      slider-color="yellow"
    >
      <v-tab
        v-for="item in data"
        :key="item.name"
        ripple
      >
        {{item.name}} ({{item.total}})
      </v-tab>
      <v-tab-item
        v-for="item in data"
        :key="item.id"
      >
        <v-layout row wrap>
          <v-flex xs2 v-for="i in item.data" :key="i.id">
              <div class="vod-content">
                <img :src="i.photoUrl">
              </div>
          </v-flex>
        </v-layout>
        <v-layout row wrap justify-center v-show="item.loadMorable">
          <v-btn @click="searchMore()">Xem thêm</v-btn>
        </v-layout>
      </v-tab-item>
    </v-tabs>
  </v-container>
</template>

<script>
  import SearchService from './SearchService'
  export default {
    data () {
      return {
        data: [],
        active: null
      }
    },
    created () {
      let val = this.$route.query.q
      this.initData(val)
    },
    computed: {
      tokenReady (val) {
        return this.$store.getters.tokenReady
      }
    },
    watch: {
      '$route.query.q' (val) {
        this.initData(val)
      },
      'tokenReady' (val) {
        this.initData(val)
      }
    },
    methods: {
      initData (val) {
        if (!this.tokenReady) return
        SearchService.get(val, 0, 24).then((data) => {
          let result = []
          let temp = data.hits.data
          for (let i = 0; i < temp.length; i++) {
            let obj = {}
            let hit = temp[i]
            obj = data[hit]
            obj.name = hit.toUpperCase()
            obj.originHitName = hit
            obj.id = i
            if (obj.data.length < obj.total) obj.loadMorable = true
            else obj.loadMorable = false
            result.push(obj)
          }
          this.data = result
        })
      },
      searchMore () {
        let currentData = this.data[this.active]
        let dataLength = currentData.data.length
        if (dataLength < currentData.total) {
          console.log('load more')
          let originHitName = currentData.originHitName
          SearchService.loadMore(this.$route.query.q, dataLength, 24, originHitName).then((data) => {
            currentData.data = currentData.data.concat(data[originHitName].data)
            if (currentData.data.length < data[originHitName].total) currentData.loadMorable = true
            else currentData.loadMorable = false
            this.data[this.active] = currentData
          })
        }
      }
    }
  }
</script>
