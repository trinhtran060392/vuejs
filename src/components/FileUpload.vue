<!-- HTML Template -->
<template>
    <div class="container">
      <div v-if="!image">
    <h2>Select an image</h2>
    <input type="file" @change="onFileChange">
  </div>
  <div v-else>
    <img :src="image" />
    <button @click="removeImage">Remove image</button>
  </div>
  <div v-if="!assertImg">
    <h2>Select an image</h2>
    <input type="file" @change="onFileAssertChange">
  </div>
  <div v-else>
    <img :src="assertImg" />
    <button @click="removeImage">Remove image</button>
  </div>

  <div class="check-equal">
    <button class="" @click="checkEqual">Check Equal</button>
  </div>
</div>
</template>

<script>
  import { mapGetters, mapActions } from 'vuex'
  export default {
    computed: mapGetters({
      result: 'result'
    }),
    data: function () {
      return {
        image: '',
        assertImg: ''
      }
    },
    methods: {
      onFileChange (e) {
        let files = e.target.files || e.dataTransfer.files
        if (!files.length) {
          return
        }
        this.createImage(files[0], 1)
      },
      onFileAssertChange (e) {
        let files = e.target.files || e.dataTransfer.files
        if (!files.length) {
          return
        }
        this.createImage(files[0], 2)
      },
      createImage (file, fileOrder) {
        let reader = new FileReader()
        let vm = this

        reader.onload = (e) => {
          if (fileOrder === 1) {
            vm.image = e.target.result
          } else vm.assertImg = e.target.result
        }
        reader.readAsDataURL(file)
      },
      removeImage: function (e) {
        this.image = ''
      },
      ...mapActions([
        'checkEqual', 'initResult'
      ])
    },
    watch: {
      result: function (val) {
        console.log(this.$route)
        if (val) {
          this.$router.push('/result')
          this.initResult()
        }
      }
    }
  }
</script>
<style scoped>
  .container {
    margin: 50px 0;
    border: 5px solid blue;
    padding: 20px;
  }
  button {
    background: #d8d8d8;
  }

</style>