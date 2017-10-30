<template>
  <div class="hello">
    <h1>{{ count }}</h1>
    <button @click="increment(10)">Increment count</button>
    <button @click="decrement">Decrement count</button>

    <button @click="addProject">Add project</button>
    <li v-for="project in projects">{{ project.name }}</li>
  </div>
</template>

<script>
  import { mapActions } from 'vuex'
  export default {
    data: function () {
      return {
        projects: []
      }
    },
    computed: {
      count () {
        return this.$store.state.count
      }
    },
    methods: {
      ...mapActions(['increment', 'decrement']),
      addProject () {
        this.projects.push({name: 'NameDemo'})
      }
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
