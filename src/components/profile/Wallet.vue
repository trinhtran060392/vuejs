<template>
    <v-container wallet>
        <div class="wallet-info">
            <v-layout>
                <v-flex xs12 class="text-xs-left">
                    <div class="wallet-title">
                        VÍ ĐIỆN TỬ
                    </div>
                </v-flex>
            </v-layout>
        
            <v-layout>
                <v-flex xs12  class="text-xs-left">
                    Bạn có thể sử dụng ví điện tử để thanh toán hoặc mua các gói cước, video clip, sự kiện giải trí
                </v-flex>
            </v-layout>
        </div>
        <div class="wallet-info">
            <v-layout xs12 class="text-xs-left">
                <div class="wallet-title">
                    TÀI KHOẢN VÍ
                </div>
            </v-layout>
            <v-layout>
                <v-flex xs10>
                    <v-layout>
                        <v-flex xs6>
                            <div class="wallet-money">
                                <v-layout align-center class="has-border">
                                    <v-flex xs6>
                                        Tài khoản ví
                                    </v-flex>
                                    <v-flex xs6>
                                      <span class="money">{{wallet.topup}}</span> VND
                                    </v-flex>
                                </v-layout>
                            </div>
                        </v-flex>
                        <v-flex xs6>
                            <div class="wallet-money">
                                <v-layout align-center>
                                    <v-flex xs6>
                                        Tài khoản khuyến mại
                                    </v-flex>
                                    <v-flex xs6>
                                      <span class="money">{{wallet.bonus}}</span> VND
                                    </v-flex>
                                </v-layout>
                            </div>
                        </v-flex>
                    </v-layout>
                </v-flex>
            </v-layout>
        </div>
        <div class="wallet-info">
            <v-layout xs12 class="text-xs-left">
                <div class="wallet-title">
                    NẠP TIỀN
                </div>
            </v-layout>
            <v-layout>
                <v-flex xs10>
                    <v-layout>
                        <v-flex xs6>
                            <v-card class="phone-recharge">
                                <v-card-title>
                                    Từ tài khoản di động Viettel
                                </v-card-title>
                                <v-card-text>
                                    <v-text-field required
                                    label="Số điện thoại Viettel"
                                    ></v-text-field>
                                    <v-select
                                      :items="phone.predefined_amount"
                                      v-model="selectedOption"
                                      label="Số Tiền Cần Nạp (Tối thiểu 10.000 VND)"
                                    ></v-select>
                                </v-card-text>
                                <v-card-actions>
                                    <v-btn @click="phoneRechargeConfirm()" class="vt-btn">Nạp tiền</v-btn>
                                </v-card-actions>
                            </v-card>
                        </v-flex>

                        <v-flex xs6>
                            <v-card class="card-recharge">
                                <v-card-title>
                                    Từ thẻ cào Viettel
                                </v-card-title>
                                <v-card-text>
                                    <v-text-field label="Serial Thẻ Cào" required="" v-model="card.serial">

                                    </v-text-field>
                                    <v-text-field label="Mã Thẻ Cào" required="" v-model="card.pin">

                                    </v-text-field>
                                </v-card-text>
                                
                                <v-card-actions>
                                    <v-btn @click="cardRechargeConfirm()" class="vt-btn">Nạp tiền</v-btn>
                                    <div class="error-text" v-if="errorMess">
                                      {{errorMess}}
                                    </div>
                                </v-card-actions>
                            </v-card>
                        </v-flex>
                    </v-layout>
                </v-flex>
            </v-layout>
        </div>

    </v-container>
</template>

<script>
import HistoryService from './HistoryService'
import _ from 'lodash'
export default {
  data () {
    return {
      wallet: {},
      phone: {},
      selectedOption: null,
      card: {},
      errorMess: ''
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
    tokenReady () {
      this.initData()
    }
  },
  methods: {
    initData () {
      if (!this.tokenReady) return
      HistoryService.wallet().then((response) => {
        let result = response.body
        this.wallet = result
      })
      HistoryService.payment().then((response) => {
        let result = response.body
        let phone = _.find(result.wallet_topup_methods, (payment) => {
          return payment.method === 'phone'
        })
        this.phone = phone
        console.log(phone)
      })
    },
    cardRechargeConfirm () {
      console.log(this.card)
      if (!this.card.serial || !this.card.pin) {
        this.errorMess = 'Số serial và pin là bắt buộc.'
        return
      }
      this.errorMess = ''
      let obj = {}
      obj.show = true
      obj.data = this.card
      this.$store.dispatch('setConfirmObj', obj)
    }
  }
}
</script>

