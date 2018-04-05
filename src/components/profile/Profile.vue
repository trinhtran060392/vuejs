<template>
  <v-container grid-list-md text-xs-center>
      <v-layout row wrap>
        <v-flex xs3 v-for="i in packages" :key="i.id">
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
  .card__title, .card__actions {
    justify-content: center;
  }
  .card__title {
    border-bottom: 1px solid #c8c8c8;
    font-size: 18px;
    padding: 3px;
  }
  .shorten-text {
    margin-bottom: 8px;
    color: #fff!important;
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
    background-color: #ffcc05 !important;
    color: #2E2501;
  }
  .item-card .price-card {
    padding: 5px 5px 0;
    font-size: 20px;
    color: #ffcc05
  }
  .btn__content:before {
    opacity: 0;
  }
</style>
