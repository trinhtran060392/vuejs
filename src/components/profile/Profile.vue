<template>
  <v-container grid-list-md text-xs-center>
      <v-layout row wrap>
        <v-flex xs3 v-for="i in packages" :key="i.id" v-class="{ 'registed' : i.registed }">
            <v-card class="item-card">
              <v-card-title>
                {{i.name}}
              </v-card-title>
              <v-card-text class="price-card">
                29.000 / Months
              </v-card-text>
              <v-card-text class="shorten-text">
                {{i.description}}
              </v-card-text>
              <v-card-actions>
                <v-btn v-if="!i.registed">
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
    created () {
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
  .card__title {
    border-bottom: 1px solid #c8c8c8;
    font-size: 18px;
    padding: 3px;
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
  .item-card {
    background-color: #0F1B33 !important;
    border: 1px solid #c8c8c8;
    border-radius: 5px;
  }
  .item-card .btn {
    border-radius: 26px;
    background-color: #FFF !important;
    color: #2E2501;
    font-size: 13px;
    font-weight: 600;
    height: 30px;
  }
  .item-card .btn:hover {
    background-color: $yellow !important;
    color: #2E2501;
  }
  .item-card .price-card {
    padding: 5px 5px 0;
    font-size: 20px;
    color: $yellow;
  }
  .btn__content:before {
    opacity: 0;
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
  .registed .card__actions {
    background-color: $white !important;
  }
  .registed .btn {
    background: $yellow!important;
    color: #000;
  }
</style>
