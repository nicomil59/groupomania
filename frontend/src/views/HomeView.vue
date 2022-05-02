<template>
  <div class="container-compo mx-auto">
    <div v-if="user" class="wall mx-auto">
      <NewPost />
      <Feed  />
    </div>
    <div v-else class="welcome mx-auto">
      <img src="../assets/icon-above-font.png" alt="logo Groupomania" class="logo mx-auto d-block">
      <h1 class="welcome-title mt-4">Bienvenue sur le réseau social de Groupomania</h1>
      <p class= "welcome-text mt-4">Inscrivez-vous pour partager vos idées et vos inspirations et rester en contact avec vos collègues !</p>
      <div class="d-flex align-items-center justify-content-between mt-5 welcome-btns">
          <router-link to="/signup" class="btn btn-primary btn-signup">Créer un compte</router-link>
          <span class="ms-auto">Vous avez déjà un compte ?</span>
          <router-link to="/login" class="btn btn-primary btn-login">Se connecter</router-link>
      </div>
    </div>
  </div>
</template>

<script>
// @ is an alias to /src
import Feed from "@/components/Feed.vue";
import NewPost from "@/components/NewPost.vue";
import { mapGetters } from 'vuex';

export default {
  name: 'HomeView',
  components: {
    NewPost,
    Feed
  },
  computed: {
    ...mapGetters(['user'])
  },
  mounted() {
    // console.log(this.$store.state.user);
    
    console.log("logged", this.$store.state.logged);
    // const isLogged = this.$store.state.logged;

    // if(!isLogged) {
    //   setTimeout(() => {
    //     this.$router.push('/login');
    //   }, 1500);
    // }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  .container-compo {
    margin-top: 2%;
  }

  .wall {
    max-width: 680px;
    width: 80%;
  }

  .welcome {
    padding: 0 25px;
    max-width: 800px;
  }

  .welcome-title {
    font-weight: 700;
    font-size: 2rem;
  }

  .logo {
    max-width: 400px;
    width: 80%;
  }

  .welcome-btns {
    gap: 20px;
  }

  .welcome-btns span {
    font-size: 1.1rem;
    font-weight: 500;
  }

  .btn-signup {
    width: 200px;
    background-color: #fff;
    color: #333 !important;
    border: 2px solid #EFEFEF;
    font-size: 1.2rem;
  }

  .btn-signup:hover {
    background-color: #EFEFEF;
  }

  .btn-login {
    width: 200px;
    background-color: #fff;
    color: #333 !important;
    border: 2px solid #FD5835;
    font-size: 1.2rem;
  }

  .btn-login:hover {
    background-color: #FD5835;
    color: #fff !important;
  }

  @media screen and (max-width: 768px) {
    .wall {
      max-width: 680px;
      width: 90%;
    }
    
    .welcome-btns {
      flex-direction: column;
    }

    .welcome-btns span {
      margin-left: 0 !important;
      margin-top: 20px;
    }
  }
  
</style>
