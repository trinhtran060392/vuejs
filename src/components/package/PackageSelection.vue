<template>
    <v-dialog v-model="isShowPackage" content-class="package-dialog" max-width="400px">
        <v-card class="package" v-if="step === 1">
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
            <v-card class="package" v-if="step === 2">
            <v-toolbar class="header">
                <v-toolbar-title>{{pack.name}}</v-toolbar-title>
            </v-toolbar>
            <v-card-text>
                <div class="package-description">{{pack.description}}</div>
                <v-container grid-list-md>
                  <v-radio-group v-model="selectedPack">
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
            <v-card-actions>
                <v-spacer></v-spacer>
                <v-flex xs6>
                <v-btn color="blue darken-1" class="btn-login" flat @click="prevStep()"> Quay lại
                </v-btn>
                </v-flex>
                <v-flex xs6>
                <v-btn color="blue darken-1" class="btn-login" flat > Xác nhận</v-btn>
                </v-flex>
            </v-card-actions>
            </v-card>
        </v-card>
    </v-dialog>
</template>
<script>
export default {
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
        this.$store.dispatch('setStep', 1)
      }
    },
    selectedPack: {
      get () {
        return this.$store.getters.selectedPack
      },
      set () {
        this.$store.dispatch('setDefaultPack', null)
      }
    }
  },
  created () {
    console.log(this.listPackage)
  },
  methods: {
    close () {
      this.$store.dispatch('showPackage', false)
    },
    nextStep (pack) {
      this.$store.dispatch('setPackage', pack)
      this.$store.dispatch('setDefaultPack', pack.beautyRentalPeriods[0].period)
      this.$store.dispatch('setStep', 2)
      console.log(this.pack)
    },
    prevStep () {
      this.$store.dispatch('setStep', 1)
    }
  }
}
</script>

