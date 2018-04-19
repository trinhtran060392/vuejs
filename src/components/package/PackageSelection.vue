<template>
  <v-dialog v-model="isShowPackage" content-class="package-dialog" max-width="400px">
    <v-card class="package" v-show="step.stepNumber === 1">
      <v-toolbar class="header">
          <v-toolbar-title>Lựa chọn gói</v-toolbar-title>
      </v-toolbar>
      <v-card-text>
          <div class="package-description">Để xem được nội dung này, quý khách vui lòng chọn mua 1 trong các gói sau:</div>
          <v-container grid-list-md>
            <v-layout v-for="pack in listPackage" :key="pack.id">
              <v-flex xs12>
                <v-btn class="package-btn" @click="nextStep(pack)">
                  {{pack.name}}
                </v-btn>
              </v-flex>
            </v-layout>
          </v-container>
      </v-card-text>
      <v-card-actions>
          <v-btn color="blue darken-1" class="btn-login" @click="close()" flat > Đóng
          </v-btn>
      </v-card-actions>
    </v-card>
    <v-card class="package" v-show="step.stepNumber === 2">
      <v-toolbar class="header">
          <v-toolbar-title>{{pack.name}}</v-toolbar-title>
      </v-toolbar>
      <v-card-text>
          <div class="package-description">{{pack.description}}</div>
          <v-container grid-list-md>
            <v-radio-group v-model="selectedPeriod">
              <template v-for="item in pack.beautyRentalPeriods">
                <v-layout row wrap :key="item.period" class="radio-wrapper">
                  <v-flex xs4>
                    <v-radio :label="`Gói ${item.beautyPeriod}`" :value="item.period" :key="item.period">
                    </v-radio>
                  </v-flex>
                  <v-flex xs8 justify-center class="package-price">
                    {{ item.beautyPrice }} VNĐ/ {{item.beautyPeriod}}
                  </v-flex>
                </v-layout>
              </template>
            </v-radio-group>
          </v-container>
      </v-card-text>
      <v-card-actions v-if="!step.hasOneStep">
          <v-spacer></v-spacer>
          <v-flex xs6>
          <v-btn color="blue darken-1" class="btn-login" flat @click="prevStep()"> Quay lại
          </v-btn>
          </v-flex>
          <v-flex xs6>
          <v-btn color="blue darken-1" class="btn-login" @click="buy()" flat > Xác nhận</v-btn>
          </v-flex>
      </v-card-actions>
      <v-card-actions v-if="step.hasOneStep">
          <v-spacer></v-spacer>
          <v-flex xs6>
          <v-btn color="blue darken-1" class="btn-login" @click="close()" flat > Đóng
          </v-btn>
          </v-flex>
          <v-flex xs6>
          <v-btn color="blue darken-1" class="btn-login" @click="buy()" flat > Xác nhận</v-btn>
          </v-flex>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>
<script>
import _ from 'lodash'
import PurchaseService from './PurchaseService'
export default {
  data () {
    return {
      selectedPeriod: undefined
    }
  },
  computed: {
    isShowPackage: {
      get () {
        return this.$store.getters.isShowPackage
      },
      set () {
        this.$store.dispatch('showPackage', false)
      }
    },
    listPackage: {
      get () {
        return this.$store.getters.listPackage
      }
    },
    pack () {
      return this.$store.getters.pack
    },
    step: {
      get () {
        return this.$store.getters.step
      },
      set () {
        let obj = {}
        obj.stepNumber = 1
        obj.hasOneStep = false
        this.$store.dispatch('setStep', obj)
      }
    }
  },
  watch: {
    pack () {
      this.selectedPeriod = this.pack.beautyRentalPeriods[0].period
    }
  },
  methods: {
    buy () {
      console.log(this.pack, this.selectedPeriod, 'buy')
      let product = {}
      product.promotion_id = ''
      product.product_name = this.pack.name
      product.product_id = this.pack.id
      product.product_type = this.pack.type
      product.product_category = 'vod'
      product.rental_period = this.selectedPeriod
      product.unit = 'D'
      product.product_type = this.pack.type
      product.entry_path = ''
      product.content_id = this.step.hasOneStep ? '' : ''
      product.auto_renewal = 'T'

      let priceObj = _.find(this.pack.beautyRentalPeriods, (priceObjTemp) => {
        return priceObjTemp.period === this.selectedPeriod
      })

      product.amount = priceObj.price[0].value

      PurchaseService.create(product).then((response) => {
        product.currency = 'VND'
        product.normal = 0
        product.normal_vat = 0
        product.point = 0
        product.sale_code = ''
        product.coupon_tx_id = ''
        let purchaseObj = response.body
        PurchaseService.pay(product, purchaseObj).then((response) => {
          let result = response.body
          console.log(result)
          let obj = {}
          obj.show = true
          obj.text = 'Quý Khách Đã Thanh Toán Thành Công'
          this.$store.dispatch('setMessage', obj)
        }, (response) => {
          let result = response.body
          if (result.error) {
            let message
            switch (result.error.code) {
              case 'U0252':
                message = 'Tài khoản không đủ để đăng ký dịch vụ, Quý khách vui lòng kiểm tra và thử lại. Trân trọng'
                break
              case 'U0232':
                message = 'Tài khoản trong ví điện tử của bạn không đủ.'
                break
              case 'U0503':
                message = 'Không thể kết nối với máy chủ BMS. Vui lòng thử lại.'
                break
              default:
                message = 'Có lỗi trong quá trình thanh toán.'
                break
            }
            this.close()
            console.log(message)
            let obj = {}
            obj.show = true
            obj.text = message
            this.$store.dispatch('setMessage', obj)
          }
        })
      })
    },
    close () {
      this.$store.dispatch('showPackage', false)
    },
    nextStep (pack) {
      let obj = {}
      obj.stepNumber = 2
      obj.hasOneStep = false
      this.$store.dispatch('setStep', obj)
      this.$store.dispatch('setPackage', pack)
    },
    prevStep (pack) {
      let obj = {}
      obj.stepNumber = 1
      obj.hasOneStep = false
      this.$store.dispatch('setStep', obj)
    }
  }
}
</script>

