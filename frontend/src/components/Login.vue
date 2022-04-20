<template>
  <div class="container-compo mx-auto">
    <div class="container">
      <h1>Connexion</h1>

      <form  @submit.prevent="handleSubmit">
        <div class="mb-3">
          <label for="usernameInput" class="form-label">Pseudo</label>
          <input @click="resetErrorMessage" v-model="username" type="text" class="form-control" id="usernameInput" />
        </div>
        <div class="mb-3">
          <label for="passwordInput" class="form-label">Mot de passe</label>
          <input @click="resetErrorMessage" v-model="password" type="password" class="form-control" id="passwordInput" />
        </div>
        <p v-if="!valid" id="errorMessageId">{{ errorMessage }}</p>
        <button type="submit" class="btn btn-primary">Se connecter</button>
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
      password: '',
      valid: true,
      errorMessage: ''
    }
  },
  // props: {
  //   msg: String,
  // },
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
        localStorage.setItem('userId', response.data.userId);
        // localStorage.setItem('user', response.data.user);
        localStorage.setItem("user", JSON.stringify(response.data.user))

        console.log(response.data.user)

        this.$store.dispatch('setUser', response.data.user);

        this.$store.dispatch('setLogin');

        this.$router.push('/');

      } catch (error) {
          console.log(error.response.data);
          this.valid = false;
          this.errorMessage = error.response.data.message;
      }
    },
    resetErrorMessage() {
      console.log('reset error message')
      this.valid = true;
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
  font-size: 50px;
}

#errorMessageId {
  color: red;
}


</style>