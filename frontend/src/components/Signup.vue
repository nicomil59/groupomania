<template>
  <div class="container-compo mx-auto">
    <div class="container">
      <h1 class="mb-4">Inscription</h1>

      <form @submit.prevent="handleSubmit">
        <div class="mb-3">
          <label for="usernameInput" class="form-label">Pseudo</label>
          <input v-model="username" @click="resetErrorMessage" type="text" class="form-control" id="usernameInput" required />
        </div>
        <div class="mb-3">
          <label for="emailInput" class="form-label">Email</label>
          <input v-model="email" @click="resetErrorMessage" type="email" class="form-control" id="emailInput" required />
        </div>
        <div class="mb-4">
          <label for="passwordInput" class="form-label">Mot de passe</label>
          <input v-model="password" @click="resetErrorMessage" type="password" class="form-control" id="passwordInput" required />
        </div>
        <p v-if="!valid" id="errorMessageId" class="validFeedback">{{ errorMessage }}</p>
        <button type="submit" class="btn btn-primary btn-groupo">Créer un compte</button>
        <p class="mt-3">Déjà un compte ? <router-link to="/login">Connexion</router-link></p>
      </form>
    </div>
  </div>
</template>

<script>
import Api from '../services/Api';

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
  methods: {
    async handleSubmit() {
      const dataInput = {
        username: this.username,
        email: this.email,
        password: this.password
      }
      console.log(dataInput)

      try {
        await Api.post('users/signup', dataInput);
        alert('Inscription réussie. Veuillez vous connecter.');
        this.$router.push('/login');
        
      } catch (error) {
        this.valid = false;
        if (error.response.data.message.includes('The string')) {
          this.errorMessage = "Votre mot de passe doit contenir 8 caractères au minimum, contenir des lettres (majuscule et minuscule), au moins 2 chiffres ainsi qu'au moins un caractère spécial.";
        } else {
          this.errorMessage = error.response.data.message;
        }
      }
    },
    resetErrorMessage() {
      this.valid = true;
    }
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  .container-compo {
    max-width: 500px;
    margin-top: 5%;
  }

  h1 {
    font-weight: 700;
    text-align: center;
  }

  .validFeedback {
    color: red;
  }
</style>