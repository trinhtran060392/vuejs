<template>
  <v-dialog v-model="showDialogLogin" max-width="500px">
    <v-form v-model="valid">
      <v-text-field
        label="Name"
        v-model="name"
        :rules="nameRules"
        :counter="10"
        required
      ></v-text-field>
      <v-text-field
        label="E-mail"
        v-model="password"
        type="password"
        :rules="passwordRules"
        required
      ></v-text-field>
    </v-form>
  </v-dialog>
</template>
<script>
  export default {
    computed: {
      // showDialogLogin () {
      //   return this.$store.getters.showDialogLogin
      // },
      showDialogLogin: {
      // getter
        get: function () {
          console.log(this.$store.getters.showDialogLogin)
          return this.$store.getters.showDialogLogin
        },
        // setter
        set: function (newValue) {
          console.log(newValue)
          this.$store.dispatch('showLoginDialog', false)
        }
      }
    },
    data () {
      return {
        valid: false,
        name: '',
        nameRules: [
          v => !!v || 'Name is required',
          v => v.length <= 10 || 'Name must be less than 10 characters'
        ],
        password: '',
        passwordRules: [
          v => !!v || 'Name is required'
        ]
      }
    }
  }
</script>
