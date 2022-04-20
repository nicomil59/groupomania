<template>
  <div class="container-compo mx-auto">
    <div class="container mt-5">
      <h1>Inscription</h1>

      <form @submit.prevent="handleSubmit">
        <div class="mb-3">
          <label for="usernameInput" class="form-label">Pseudo</label>
          <input v-model="username" type="text" class="form-control" id="usernameInput" />
        </div>
        <div class="mb-3">
          <label for="emailInput" class="form-label">Email</label>
          <input v-model="email" type="email" class="form-control" id="emailInput" />
        </div>
        <div class="mb-3">
          <label for="passwordInput" class="form-label">Mot de passe</label>
          <input v-model="password" type="password" class="form-control" id="passwordInput" />
        </div>
        <button type="submit" class="btn btn-primary">Créer un compte</button>
        <p class="mt-3">Déjà un compte ? <router-link to="/login">Connexion</router-link></p>
      </form>
    </div>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  name: "SignUp",
  data() {
    return {
      username: '',
      email: '',
      password: ''
    }
  },
  // props: {
  //   msg: String,
  // },
  methods: {
    async handleSubmit() {
      const dataInput = {
        username: this.username,
        email: this.email,
        password: this.password
      }
      console.log(dataInput)

      try {
        await axios.post('signup', dataInput);
        // console.log(response)
        this.$router.push('/login');
        
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
  font-size: 50px;
}


</style>