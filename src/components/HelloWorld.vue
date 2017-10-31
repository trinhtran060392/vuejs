<template>
  <div class="hello">
    <li v-for="project in projects">{{ project.id }}</li>
  </div>
</template>

<script>
  import { mapGetters, mapActions } from 'vuex'
  export default {
    computed: mapGetters({
      projects: 'allProjects'
    }),
    methods: mapActions([
      'addProject'
    ]),
    created () {
      console.log(0)
      this.$store.dispatch('getAllProjects')
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h1, h2 {
  font-weight: normal;
}

ul {
  list-style-type: none;
  padding: 0;
}

li {
  display: inline-block;
  margin: 0 10px;
}

a {
  color: #42b983;
}
</style>
