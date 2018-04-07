<template>
  <v-container>
    <v-tabs
      v-model="active"
      color="cyan"
      dark
      slider-color="yellow"
    >
      <v-tab
        v-for="item in data"
        :key="item.id"
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
        active: null,
        dataLength: null
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
            obj.id = i
            result.push(obj)
          }
          this.data = result
          this.dataLength = result.length
        })
      }
    }
  }
</script>
