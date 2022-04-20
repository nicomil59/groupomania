<template>
  <div class="container-compo mx-auto">
    <div class="container mt-5">
      <h1>Modification du profil</h1>

      <form @submit.prevent="handleSubmit" id="myForm" enctype="multipart/form-data">
        <div class="mb-3">
          <label for="usernameInput" class="form-label">Pseudo</label>
          <input v-model="username" type="text" class="form-control" id="usernameInput" />
        </div>
        <div class="mb-3">
          <label for="bioInput" class="form-label">Bio</label>
          <input v-model="bio" type="text" class="form-control" id="bioInput" />
        </div>
        <div class="mb-3 avatar">
          <img :src="avatar" class="img-fluid rounded-start" alt="avatar" />
        </div>
        <div class="mb-3">
            <label for="avatarInput" class="form-label">Avatar</label>
            <input class="form-control" type="file" id="avatarInput" @change="onFileSelected">
        </div>
        <a @click="abort" class="btn btn-light">Retour</a>
        <button type="submit" class="btn btn-primary">Sauvegarder</button>
      </form>
      <p v-if="isUpdated">Les modifications ont bien été enregistrées !</p>
    </div>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import axios from "axios";

export default {
  name: "ModifyProfile",
  data() {
    return {
      username: this.$store.state.user.username,
      bio: this.$store.state.user.bio,
      avatar: this.$store.state.user.avatar,
      userId: this.$store.state.user.id,
      selectedFile: null,
      isUpdated: false
    };
  },
  computed: {
    ...mapGetters(["user"]),
  },
  methods: {
    async handleSubmit() {
      
      const userInfos = {
        username: this.username,
        bio: this.bio
      }
      console.log("userInfos", userInfos)
      
      let body = userInfos;

      // si image uploadée, envoi d'un objet formData

      if (this.selectedFile !== null) {
        const formData = new FormData();
        formData.append('user', JSON.stringify(userInfos));
        formData.append('avatar', this.selectedFile);
        body = formData;
      }

      const token = localStorage.getItem("token");
      const userId = localStorage.getItem("userId");

      try {
        const response = await axios.put(`${userId}`, body, {
            headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json'
            }});

        console.log("response data", response.data);
        const updatedData = response.data.updatedData;
        // const copyUser = {...this.$store.state.user};
        const updatedUser = Object.assign({...this.$store.state.user}, {...updatedData});

        console.log("updatedUser", updatedUser);
        
        // mise à jour de user dans localStorage
        localStorage.setItem("user", JSON.stringify(updatedUser))

        // mise à jour de user dans le state
        this.$store.dispatch('setUser', updatedUser);

        // redirection vers la page ViewProfile
        // setTimeout(() => {
        //   this.$router.go(-1);
          
        // }, 1000);

        this.isUpdated = true;

      } catch (error) {
        console.log(error.response.data);
      }
    },
    onFileSelected(e) {
      console.log("event on file selected", e);
      this.selectedFile = e.target.files[0];
    },
    abort() {
      // redirection vers la page ViewProfile
        setTimeout(() => {
          this.$router.go(-1);
          
        }, 1000);
    }
  },
  mounted() {
    console.log(this.$store.state.user);
  }

};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.btn {
  font-weight: bold !important;
}

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

.avatar {
    width: 200px;
    height: 200px;
}
</style>
