<template>
  <div>
    <NavBar />
    <router-view />
  </div>
</template>

<script>
import NavBar from "@/components/NavBar.vue";
// import axios from 'axios';

export default {
  name: "app",
  components: {
    NavBar
  },
  // data() {
  //   return {
  //     user: null
  //   }
  // },
  async created() {
    // const token = localStorage.getItem('token');
    // const userId = localStorage.getItem('userId');

    // console.log(userId);

    try {
      // const response = await axios.get(`${userId}`);
      // console.log(response.data);
      // this.user = response.data;
      // this.$store.dispatch('user', response.data);
    }
    catch (error) {
      console.log(error)
    }
  }
}
</script>

<style lang="scss">
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  // text-align: center;
  color: #2c3e50;
}


</style>
