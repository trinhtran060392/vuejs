<template>
  <v-dialog v-model="message.show" persistent max-width="400px" content-class="notify-modal">
    <v-card>
      <v-card-title>Thông báo</v-card-title>
      <v-card-text>
          {{message.text}}
      </v-card-text>
    </v-card>
    <v-card-actions>
      <v-btn @click="closeNotify()">Đóng</v-btn>
    </v-card-actions>
  </v-dialog>
</template>

<script>
export default {
  computed: {
    message: {
      get () {
        return this.$store.getters.message
      },
      set () {
        let obj = {}
        obj.show = false
        obj.message = ''
        this.$store.dispatch('setMessage', obj)
      }
    }
  },
  methods: {
    closeNotify () {
      let obj = {}
      obj.show = false
      obj.message = ''
      this.$store.dispatch('setMessage', obj)
    }
  }
}
</script>
