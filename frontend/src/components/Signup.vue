<template>
  <div class="container-compo mx-auto">
    <div class="container mt-5">
      <h1>Inscription</h1>

      <form @submit.prevent="handleSubmit">
        <div class="mb-3">
          <label for="usernameInput" class="form-label">Pseudo</label>
          <input v-model="username" @click="resetErrorMessage" type="text" class="form-control" id="usernameInput" />
        </div>
        <div class="mb-3">
          <label for="emailInput" class="form-label">Email</label>
          <input v-model="email" @click="resetErrorMessage" type="email" class="form-control" id="emailInput" />
        </div>
        <div class="mb-3">
          <label for="passwordInput" class="form-label">Mot de passe</label>
          <input v-model="password" @click="resetErrorMessage" type="password" class="form-control" id="passwordInput" />
        </div>
        <p v-if="!valid" id="errorMessageId">{{ errorMessage }}</p>
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
        email: this.email,
        password: this.password
      }
      console.log(dataInput)

      try {
        await axios.post('signup', dataInput);
        // console.log(response)
        this.$router.push('/login');
        
      } catch (error) {
          console.log(error.response.data);
          this.valid = false;
          if (error.response.data.message.includes('The string')) {
            this.errorMessage = "Votre mot de passe doit contenir 8 caractères au minimum, contenir des lettres (majuscule et minuscule), au moins 2 chiffres ainsi qu'au moins un caractère spécial.";
          } else {
            this.errorMessage = error.response.data.message;
          }
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