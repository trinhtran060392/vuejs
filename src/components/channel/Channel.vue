<template>
  <div>Channel</div>
</template>

<script>
import ChannelService from './ChannelService'
export default {
  data () {
    return {
      channels: []
    }
  },
  created () {
    ChannelService.list(10).then((response) => {
      return response.body
    }).then((response) => {
      console.log(response)
    })
  }
}
</script>

