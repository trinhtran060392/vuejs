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
                <v-flex xs9>
                    <v-layout>
                        <v-flex xs6>
                            <div class="wallet-money has-border">
                                <v-layout align-center>
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
        </div>

    </v-container>
</template>

<script>
import HistoryService from './HistoryService'
export default {
  data () {
    return {
      wallet: {}
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
    }
  }
}
</script>

