<template>
  <v-container grid-list-md text-xs-center class="packages">
      <v-layout row wrap>
        <v-flex xs3 v-for="pack in packages" :key="pack.id">
            <v-card class="item-card" :class="{ 'registed' : pack.registed }">
              <v-card-title>
                {{pack.name}}
              </v-card-title>
              <v-card-text class="price-card">
                {{pack.productAlias.beautyPrice}} VNĐ/ {{pack.productAlias.beautyPeriod}}
              </v-card-text>
              <v-card-text class="shorten-text">
                {{pack.description}}
              </v-card-text>
              <v-card-actions>
                <v-btn v-if="!pack.registed" @click="buyNow(pack)">
                  Mua ngay
                </v-btn>
                <v-btn v-else>
                  Xem chi tiết
                </v-btn>
              </v-card-actions>
            </v-card>
        </v-flex>
      </v-layout>
    </v-container>
</template>

<script>
  import PackageService from '../shared/PackageService'
  import HistoryService from '../profile/HistoryService'
  import Ulti from '../shared/Ulti'
  export default {

    data () {
      return {
        packages: []
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
      'tokenReady' (val) {
        this.initData()
      }
    },
    methods: {
      initData () {
        if (!this.tokenReady) return
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
              this.packages = result.totalPackages
              console.log(this.packages)
            })
          })
        })
      },
      buyNow (pack) {
        let obj = {}
        obj.stepNumber = 2
        obj.hasOneStep = true
        this.$store.dispatch('setStep', obj)
        this.$store.dispatch('setPackage', pack)
        this.$store.dispatch('showPackage', true)
      }
    }
  }
</script>
