<template>
  <div class="hello">
    <li v-for="project in projects">{{ project.id }}</li>
    <div>
      <input type="text" name="name" v-model="newProject.id">
    </div>
    <div>
      <a href="" @click="addProject(newProject)">Add Project</a>
    </div>
  </div>
</template>

<script>
  import { mapGetters, mapActions } from 'vuex'
  export default {
    data: function () {
      return {
        newProject: {}
      }
    },
    computed: mapGetters({
      projects: 'allProjects'
    }),
    methods: mapActions([
      'addProject'
    ]),
    created () {
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
