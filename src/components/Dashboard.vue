<template>
  <div class="hello content">
    <div v-for="project in projects" class="pr-container">
        <div class="project-id inline-style">
        <router-link :to="{ name: 'project', params: { projectId: project.id }}">{{ project.id }}</router-link>
      </div>
      <div class="remove-pr inline-style">
        <button @click="removePr(project.id)">Remove</button>
      </div>
    </div>
    <div>
      <input type="text" name="name" :value="newProject.id" @input="updateNewProject">
    </div>
    <div>
      <a @click="addProject">Add Project</a>
    </div>
  </div>
</template>

<script>
  import { mapGetters, mapActions } from 'vuex'
  export default {
    computed: mapGetters({
      projects: 'allProjects',
      newProject: 'newProject'
    }),
    methods: mapActions([
      'addProject', 'updateNewProject', 'removePr'
    ]),
    created () {
      this.$store.dispatch('getAllProjects')
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.pr-container {
  padding: 10px;
}
.inline-style {
  display: inline-block;
}
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
.hello {
  min-height: 500px;
}
</style>
