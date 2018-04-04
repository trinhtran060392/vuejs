<template>
  <v-container grid-list-md text-xs-center>
      <v-layout row wrap>
        <v-flex xs3 v-for="i in packages" :key="i.id">
            <v-card>
              <v-card-title>
                {{i.name}}
              </v-card-title>
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
</style>
