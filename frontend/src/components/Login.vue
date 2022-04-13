<template>
  <div class="container-compo mx-auto">
    <div class="container">
      <h1>Connexion</h1>
      <p>{{ msg }}</p>

      <form  @submit.prevent="handleSubmit">
        <div class="mb-3">
          <label for="usernameInput" class="form-label">Pseudo</label>
          <input v-model="username" type="text" class="form-control" id="usernameInput" />
        </div>
        <div class="mb-3">
          <label for="passwordInput" class="form-label">Mot de passe</label>
          <input v-model="password" type="password" class="form-control" id="passwordInput" />
        </div>
        <button type="submit" class="btn btn-primary">Se Connecter</button>
        <p class="mt-3">Pas encore de compte ? <router-link to="/signup">Inscription</router-link></p>
      </form>
    </div>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  name: "LogIn",
  data() {
    return {
      username: '',
      password: ''
    }
  },
  props: {
    msg: String,
  },
  methods: {
    async handleSubmit() {
      const dataInput = {
        username: this.username,
        password: this.password
      }
      console.log(dataInput)

      try {
        const response = await axios.post('signin', dataInput);
        
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('userId', response.data.user.id);

        console.log(response.data.user)

        this.$store.dispatch('user', response.data.user);
        this.$router.push('/');

      } catch (error) {
        console.log(error)
      }
    }
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
.container-compo {
  max-width: 500px;
  margin-top: 10%;
}

h1 {
  font-weight: 700;
  text-align: center;
}

button {
  font-weight: bold;
}
</style>