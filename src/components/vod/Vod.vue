<template>
  <v-container grid-list-md text-xs-center>
      <div>this is detail vod page</div>
    </v-container>
</template>

<script>
import VodService from './VodService'
export default {
  created () {
    let vodId = this.$route.params.vodId
    VodService.get(vodId).then((response) => {
      console.log(response)
    })
  }
}
</script>
