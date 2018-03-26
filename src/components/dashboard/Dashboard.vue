
<template>
  <div class="dashboard-container">
    <v-container grid-list-md text-xs-center>
      <v-layout row wrap>
        <v-flex xs3 v-for="i in users" :key="`3${i}`">
          <v-card dark color="secondary">
            <v-card-text class="px-0">{{i.first_name}}</v-card-text>
          </v-card>
        </v-flex>
      </v-layout>
    </v-container>
  </div>
</template>

<script>
  import DashboardService from './DashboardService'
  export default {
    data () {
      return {
        users: []
      }
    },
    created () {
      DashboardService.getUsers().then((response) => {
        return response.body
      }).then((response) => {
        let result = response.data
        this.users = result
      })
    }
  }
</script>

<style scoped>
  
</style>
