<template>
  <div>This is profile page</div>
</template>
<script>
  export default {
    created () {
      this.$store.dispatch('setIsInSettingPage', true)
    }
  }
</script>
