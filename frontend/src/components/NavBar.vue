<template>
  <nav class="navbar navbar-expand-lg navbar-light bg-white">
    <div class="container">
      <router-link to="/" class="navbar-brand">
        <img
          src="../assets/icon-left-font.png"
          alt="logo Groupomania"
          class="d-inline-block align-text-top"
        />
      </router-link>
      <button
        class="navbar-toggler"
        type="button"
        data-bs-toggle="collapse"
        data-bs-target="#navbarNav"
        aria-controls="navbarNav"
        aria-expanded="false"
        aria-label="Toggle navigation"
      >
        <span class="navbar-toggler-icon"></span>
      </button>
      <div class="collapse navbar-collapse" id="navbarNav">
        <ul class="navbar-nav ms-auto" v-if="!loggedIn">
          <li class="nav-item">
            <router-link to="/login" class="nav-link login-link">Se connecter</router-link>
          </li>
          <li class="nav-item">
            <router-link to="/signup" class="nav-link signup-link">S'inscrire</router-link>
          </li>
        </ul>
        <!-- <div>
          <p v-if="loggedIn">loggedIn !</p>
          <p v-else>loggedOut !</p>
        </div> -->
        <ul class="navbar-nav ms-auto" v-if="loggedIn">
          <!-- <li class="nav-item">
            <router-link :to="{name: 'view-profile', params: { id: user.id }}" class="nav-link">Profil</router-link>
          </li> -->
          <li class="nav-item">
            <router-link :to="{name: 'view-profile', params: { id: user.id }}" class="nav-link" data-toggle="tooltip" data-placement="bottom" :title="'Profil de ' + user.username">
              <div class="avatar-container">
                <img :src="user.avatar" alt="avatar account">
              </div>
            </router-link>
          </li>
          <li class="nav-item nav-item-logout">
            <a href="javascript:void(0)" @click="handleClick" class="nav-link">Se déconnecter</a>
          </li>
        </ul>
      </div>
    </div>
  </nav>
</template>

<script>
import { mapGetters } from 'vuex';

export default {
  name: "NavBar",
  // props: ['user'],
  methods: {
    handleClick() {
      localStorage.removeItem('userId');
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      this.$store.dispatch('setUser', null);

      this.$store.dispatch('setLogout');

      this.$router.push('/login');
    }
  },
  computed: {
    ...mapGetters(['user']),
    ...mapGetters(['loggedIn']),
  },
  beforeMount() {
    console.log('beforeMount');
    this.$store.dispatch('checkToken');
    
  }
};
</script>

<style lang="scss" scoped>
nav {
  padding: 30px;

  img {
      height: 50px;
  }

  a {
    font-weight: bold;
    color: #2c3e50;
    margin-right: 10px;

    &.router-link-exact-active {
      color: #42b983;
    }
  }
}

.navbar {
  border-bottom: 1px solid #EFEFEF;
}

.nav-item:first-child {
  margin-right: 30px;
}

.login-link, .signup-link {
  padding: 8px 12px !important;
  border-radius: 24px;
}

.login-link {
  background-color: #FD5835;
  color: #fff !important;
}

.login-link:hover {
  background-color: #c1442b;
}

.signup-link {
  background-color: #EFEFEF;
  color: #111 !important;
}

.signup-link:hover {
  background-color: #d6d6d6;
}

.avatar-container {
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
}
.avatar-container img {
  border-radius: 50%;
  border: 2px solid #FD5835;
  width: 100%;
  height: 100%;
}

.nav-item-logout {
  display: flex;
  align-items: center;
}
</style>
