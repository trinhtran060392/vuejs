<template>
  <div>This is profile page</div>
</template>
<script>
  export default {
    computed: {
      isAuthenticated () {
        return this.$store.getters.isAuthenticated
      }
    },
    created () {
      console.log(this.isAuthenticated)
    }
  }
</script>
