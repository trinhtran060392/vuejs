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
      <v-tab-item>
        <v-layout row wrap>
          <v-flex xs3 v-for="i in registeredPacks" :key="i.id">
              <v-card class="registed item-card his-card">
                <v-card-title>
                  {{i.name}}
                </v-card-title>
                <v-card-text class="price-card">
                  29.000 / Months
                </v-card-text>
                <v-card-text class="shorten-text">
                  Ngày đăng ký: {{i.date.beautyDay}} {{i.date.beautyTime}}
                  Thời hạn: 1/{{i.beautyPeriod}}
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
  $yellow: #ffcc05;
  $white: #fff;
  $black: #000;
  .card__title, .card__actions {
    justify-content: center;
  }
  body {
    a {
      text-decoration: none;
      color: white;
    }
  }
  .tabs__items {
    margin-top: 30px;
  }
  .card__title {
    border-bottom: 1px solid #c8c8c8;
    font-size: 18px;
    padding: 3px;
  }
  .item-card .price-card {
    padding: 5px 5px 0;
    font-size: 20px;
    color: $yellow;
  }
  .item-card .shorten-text {
    margin-bottom: 8px;
    color: #fff;
    font-weight: 600;
    font-size: 13px;
    background-color: #0F1B33 !important;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    height: 45px;
    padding: 5px 8px;
    white-space: normal;
  }
  .registed.item-card {
    border: none;
  }
  .registed .card__title{
    background: #d09b00;
    border: 1px solid #d09b00;
  }
  .registed .price-card{
    background-color: $white;
    color: $black;
    font-weight: 600;
  }
  .registed .shorten-text {
    background-color: $white !important;
    color: $black;
    margin-bottom: 0;
  }
  .item-card.his-card .shorten-text{
    height: 95px;
  }
</style>
