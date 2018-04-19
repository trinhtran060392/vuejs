<template>
  <v-container grid-list-md text-xs-center class="packages">
      <v-layout>
        <v-flex class="text-xs-left">
          <div class="account-info">
            Tài khoản: <span class="phone">{{accountInfo.id}}</span>
          </div>
        </v-flex>
      </v-layout>
      <v-layout>
        <v-flex xs12 class="text-xs-left payment-name">
          Phương thức thanh toán
        </v-flex>
      </v-layout>
      <v-layout class="payment-container">
        <v-flex xs12 sm6 md3>
          <div class="payment" v-if="!isSubcriber">
              <div>Ví điện tử</div>
              <div>Dành cho tất cả thuê bao</div>
          </div>
          <div class="payment" v-if="isSubcriber">
              <div>Tài khoản điện thoại</div>
              <div>Dành cho thuê bao của Viettel</div>
          </div>
        </v-flex>
      </v-layout>
      <v-layout row wrap>
        <v-flex xs3 v-for="pack in packages" :key="pack.id">
            <v-card class="item-card" :class="{ 'registed' : pack.registed }" v-show="pack.registed || !isBasicBought">
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
        packages: [],
        isBasicBought: false
      }
    },
    computed: {
      tokenReady () {
        return this.$store.getters.tokenReady
      },
      accountInfo () {
        return this.$store.getters.accountInfo
      },
      isSubcriber () {
        return this.$store.getters.isSubcriber
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
              let isBasicBought = Ulti.checkBasic(this.packages)
              this.isBasicBought = isBasicBought
              console.log(this.isBasicBought)
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
