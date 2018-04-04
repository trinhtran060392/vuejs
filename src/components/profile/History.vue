<template>
  <v-container>
    <v-tabs
      v-model="active"
      dark
      slider-color="yellow"
    >
      <v-tab
        ripple
      >
        Mua gói
      </v-tab>
      <v-tab
        ripple
      >
        Mua lẻ
      </v-tab>
      <v-tab v-if="!isSubcriber"
        ripple
      >
        Lịch sử nạp tiền
      </v-tab>
      <v-tab-item
      >
        <v-layout row wrap>
          <v-flex xs3 v-for="i in registeredPacks" :key="i.id">
              <v-card>
                <v-card-title>
                  {{i.name}}
                </v-card-title>
                <v-card-text>
                  <p>
                    Ngày đăng ký: {{i.date.beautyDay}} {{i.date.beautyTime}}
                  </p>
                  <p>Thời hạn: 1/{{i.beautyPeriod}}</p>
                </v-card-text>
              </v-card>
          </v-flex>
          <v-layout v-if="!registeredPacks.length">
            <v-flex xs12>
              <div class="text-xs-center">Bạn hiện chưa mua gói nào!</div>
            </v-flex>
          </v-layout>
        </v-layout>
      </v-tab-item>
      <v-tab-item
       >
        <v-layout row wrap>
          <v-flex xs3 v-for="i in singleList" :key="i.id">
              <v-card>
                <v-card-title>
                  {{i.title}}
                </v-card-title>
                <v-card-text>
                  <p>
                    Ngày đăng ký {{i.date.beautyDay}} {{i.date.beautyTime}}
                  </p>
                  <p>
                    Ngày hết hạn {{i.date.beautyDay}} {{i.date.beautyTime}}
                  </p>
                  
                </v-card-text>
              </v-card>
          </v-flex>
          <v-layout v-if="!singleList.length">
            <v-flex xs12>
              <div class="text-xs-center">Bạn chưa mua gói nào!</div>
            </v-flex>
          </v-layout>
        </v-layout>
      </v-tab-item>
      <v-tab-item
      >
        <v-layout row wrap>
          <v-flex xs11 v-for="item in trans" :key="item.id">
            <v-layout>
              <v-flex xs4>
                {{item.date.beautyDay}} - {{item.date.beautyTime}}
              </v-flex>
              <v-flex xs4>
                [{{item.source.type === 'scard' ? 'Thẻ cào' : item.source.resource}}]
              </v-flex>
              <v-flex xs4>
                {{item.wallet.topup}} VNĐ
              </v-flex>
            </v-layout>
          </v-flex>
        </v-layout>
      </v-tab-item>
    </v-tabs>
  </v-container>
</template>

<script>
  import HistoryService from '../profile/HistoryService'
  import PackageService from '../shared/PackageService'
  import Ulti from '../shared/Ulti'
  export default {
    data () {
      return {
        active: null,
        singleList: [],
        trans: [],
        registeredPacks: []
      }
    },
    computed: {
      isSubcriber () {
        return this.$store.getters.isSubcriber
      }
    },
    methods: {
      next () {
        const active = parseInt(this.active)
        this.active = (active < 2 ? active + 1 : 0).toString()
      }
    },
    created () {
      HistoryService.getHistory().then((response) => {
        return response.body
      }).then((response) => {
        this.trans = response.data
        for (let i = 0; i < this.trans.length; i++) {
          this.trans[i].wallet = Ulti.buildWallet(this.trans[i].wallet)
          this.trans[i].date = Ulti.beautyDate(this.trans[i].date)
        }
      })
      HistoryService.singleList().then((response) => {
        return response.body
      }).then((response) => {
        let singleList = Ulti.buildSingleVod(response.data)
        this.singleList = singleList
      })
      PackageService.getFullPackages().then((response) => {
        return response.body
      }).then((response) => {
        let fpackage = Ulti.buildPurchasablePackages(response.data)
        PackageService.getPackageContent().then((response) => {
          return response.body
        }).then((response) => {
          let addonProducts = Ulti.getProducts(response.data)
          let addonPackages = Ulti.buildPurchasablePackages(addonProducts)
          let packages = fpackage.concat(addonPackages)
          HistoryService.list().then((response) => {
            return response.body
          }).then((response) => {
            let result = Ulti.checkRegisteredPackage(packages, response.data)
            this.registeredPacks = result.registeredPackages
            console.log(this.registeredPacks)
          })
        })
      })
    }
  }
</script>

<style lang="scss">
  .card__title, .card__actions {
    justify-content: center;
  }
  body {
    a {
      text-decoration: none;
      color: white;
    }
  }
</style>
