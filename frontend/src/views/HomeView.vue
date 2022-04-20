<template>
  <div class="home">
    <h3 v-if="user">Bonjour, {{ user.username }}</h3>
    <h3 v-if="!user">Vous n'êtes pas connecté</h3>
  </div>
</template>

<script>
// @ is an alias to /src
// import HelloWorld from '@/components/HelloWorld.vue'
// import axios from 'axios';
import { mapGetters } from 'vuex';

export default {
  name: 'HomeView',
  computed: {
    ...mapGetters(['user'])
  },
  mounted() {
    console.log("logged", this.$store.state.logged);
    const isLogged = this.$store.state.logged;

    if(!isLogged) {
      setTimeout(() => {
        this.$router.push('/login');
        
      }, 1500);
    }
  }
}
</script>
