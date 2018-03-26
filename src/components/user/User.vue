<template>
  <div class="dashboard-container">
    <v-container grid-list-md text-xs-center>
      <v-layout row wrap>
        <v-flex xs12>
          <v-card dark color="secondary">
            <v-card-text class="px-0">{{user.first_name}}</v-card-text>
          </v-card>
        </v-flex>
      </v-layout>
    </v-container>
  </div>
</template>

<script>
  import UserService from './UserService'
  export default {
    data () {
      return {
        user: {}
      }
    },
    created () {
      UserService.getUser(3).then((response) => {
        return response.body
      }).then((response) => {
        let result = response.data
        this.user = result
        console.log(result)
      })
    }
  }
</script>

<style scoped>
  
</style>
