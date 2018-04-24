<template>
  <v-dialog v-model="confirmObj.show" persistent max-width="400px" content-class="notify-modal">
    <v-card>
      <v-card-title>Thông tin nạp tiền</v-card-title>
      <v-card-text>
        <v-layout class="notify-title">
            Bạn đang nạp tiền vào ví điện tử bằng hình thức nạp từ thẻ cào Viettel
        </v-layout>
          <v-layout>
              <v-flex xs6>
                  <div class="text-xs-left">Serial thẻ cào</div>
              </v-flex>
              <v-flex xs6>
                  <div class="text-xs-left">{{confirmObj.data.serial}}</div>
              </v-flex>
          </v-layout>
        <v-layout>
            <v-flex xs6>
                  <div class="text-xs-left">Mã thẻ cào</div>
              </v-flex>
              <v-flex xs6>
                  <div class="text-xs-left">{{confirmObj.data.pin}}</div>
              </v-flex>
        </v-layout>
      </v-card-text>
    </v-card>
    <v-card-actions>
      <v-btn @click="closeNotify()" class="vt-btn">Đóng</v-btn>
      <v-btn class="vt-btn">Xác nhận</v-btn>
    </v-card-actions>
  </v-dialog>
</template>

<script>
export default {
  computed: {
    confirmObj: {
      get () {
        return this.$store.getters.confirmObj
      },
      set () {
        let obj = {}
        obj.show = false
        obj.data = {}
        this.$store.dispatch('setConfirmObj', obj)
      }
    }
  },
  methods: {
    closeNotify () {
      let obj = {}
      obj.show = false
      obj.data = {}
      this.$store.dispatch('setConfirmObj', obj)
    }
  }
}
</script>
