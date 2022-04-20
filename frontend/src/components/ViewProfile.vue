<template>
  <div class="container-compo mx-auto">
    <!-- <div class="card" style="width: 30rem">
      <img :src="avatar" class="img-avatar" alt="avatar" />
      <div class="card-body">
        <h5 class="card-title">Profil</h5>
        <div class="card-text">
          <p>Pseudo: {{ username }}</p>
          <p>Email: {{ email }}</p>
          <p>Bio: {{ bio }}</p>
        </div>
        <div class="card-btns d-flex">
          <a href="#" class="btn btn-primary">Modifier</a>
          <a href="#" class="btn btn-danger">Supprimer</a>
        </div>
      </div>
    </div> -->

    <div class="card mb-3" style="max-width: 800px">
      <div class="row g-0">
        <div class="col-md-4">
          <img :src="avatar" class="img-fluid rounded-start" alt="avatar" />
        </div>
        <div class="col-md-8">
          <div class="card-body">
            <h5 class="card-title">Profil</h5>
            <div class="card-text">
              <p>Pseudo: {{ username }}</p>
              <p>Email: {{ email }}</p>
              <p>Bio: {{ bio }}</p>
            </div>
            <div class="card-btns">
              <!-- <router-link :to="{name: 'modify-profile', params: { id: user.id }}" class="btn btn-primary">Modifier</router-link> -->
              <router-link :to="`/modify-profile/${user.id}`" class="btn btn-primary" v-if="loggedIn">Modifier</router-link>
              <router-link :to="`/modify-profile/${userId}`" class="btn btn-primary" v-if="!loggedIn">Modifier</router-link>
              <!-- <router-link to="/login" class="nav-link login-link">Se connecter</router-link> -->
              <!-- <a href="#" class="btn btn-primary">Modifier</a> -->
              <a href="#" class="btn btn-danger">Supprimer</a>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- <div v-if="!user"> -->
    <!-- <h1>View Profile</h1>
        <p>Username : {{ user.username }}</p>
        <p>Email : {{ user.email }}</p>
        <p>Bio : {{ user.bio }}</p>
        <img :src="user.avatar" alt="avatar" /> -->
    <!-- <p>Rien à voir</p> -->
    <!-- </div> -->
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import axios from "axios";

export default {
  name: "ViewProfile",
  data() {
    return {
      username: "",
      email: "",
      bio: "",
      avatar: "",
      userId: ""
    };
  },
  computed: {
    ...mapGetters(["user"]),
    ...mapGetters(['loggedIn']),
  },
  // created() {
  //   console.log(this.$store.state.logged);
  //   if(!this.$store.state.logged) {
  //     console.log("pas connecté !!!")
  //     this.$router.push('/login');
  //   }
  // },
  async beforeMount() {
    console.log('beforemount')
    
    const token = localStorage.getItem("token");
    const userId = localStorage.getItem("userId");

    // console.log(userId);

    try {
      const response = await axios.get(`${userId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      console.log(response.data);

      this.username = response.data.username;
      this.email = response.data.email;
      this.bio = response.data.bio;
      this.avatar = response.data.avatar;
      this.userId = userId;

      // this.$store.dispatch('user', response.data);
    } catch (error) {
      console.log(error);
    }
  },
  mounted() {
    // this.$store.dispatch('setToken');
    // console.log(this.$store.state.logged);
    // if(this.$store.state.logged) {
    //   console.log("connecté !!!")
    // }
    console.log('mounted')
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">

.img-avatar {
  width: 100px !important;
  height: auto;
}

.container-compo {
  max-width: 500px;
  margin-top: 10%;
}

h1 {
  font-weight: 700;
  text-align: center;
}

.card-btns {
  display: flex;
  gap: 20px;
}
</style>
