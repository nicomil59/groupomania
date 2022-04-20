<template>
    <div class="container-compo mx-auto">
        <div class="container mt-5">
            <h1 class="mb-4">Modification<br>du mot de passe</h1>

            <form @submit.prevent="handleSubmit" id="myForm">
                <div class="mb-3">
                    <label for="currentPwd" class="form-label">Mot de passe actuel</label>
                    <input v-model="currentPwd" @click="resetErrorMessage" type="password" class="form-control"
                        id="currentPwd" required />
                </div>
                <div class="mb-3">
                    <label for="newPwd" class="form-label">Nouveau mot de passe</label>
                    <input v-model="newPwd" @click="resetErrorMessage" type="password" class="form-control" id="newPwd"
                        required />
                </div>
                <p v-if="isSamePassword" class="validFeedback">Le nouveau mot de passe doit être différent !</p>
                <div class="mb-4">
                    <label for="confirmPwd" class="form-label">Confirmer le mot de passe</label>
                    <input v-model="confirmPwd" @click="resetErrorMessage" type="password" class="form-control"
                        id="confirmPwd" required />
                </div>
                <p v-if="!isConfirmPasswordOK" class="validFeedback">Les mots de passe sont différents !</p>
                <p v-if="!valid" class="validFeedback">{{ errorMessage }}</p>

                <a @click="abort" class="btn btn-light btn-space">Retour</a>
                <button :disabled="isSamePassword || !isConfirmPasswordOK" type="submit"
                    class="btn btn-primary btn-space btn-groupo">Valider</button>
            </form>
            <p v-if="isUpdated">Le mot de passe a bien été modifié !</p>

        </div>
    </div>
</template>

<script>
    // import { mapGetters } from "vuex";
    import axios from "axios";

    export default {
        name: "ModifyPassword",
        data() {
            return {
                currentPwd: '',
                newPwd: '',
                confirmPwd: '',
                valid: true,
                errorMessage: '',
                isUpdated: false,
            };
        },
        computed: {
            isSamePassword() {
                return this.newPwd !== '' && this.currentPwd === this.newPwd
            },
            isConfirmPasswordOK() {
                if (this.confirmPwd !== '') {
                    return this.newPwd === this.confirmPwd;
                } else {
                    return true;
                }
            }
        },
        methods: {
            abort() {
                // redirection vers la page ModifyProfile
                setTimeout(() => {
                    this.$router.go(-1);

                }, 1000);
            },
            async handleSubmit() {

                const dataInput = {
                    currentPassword: this.currentPwd,
                    newPassword: this.newPwd
                }
                console.log("dataInput", dataInput)
                console.log(this.$store.state.user)

                const token = localStorage.getItem("token");
                const userId = localStorage.getItem("userId");

                try {
                    const response = await axios.put(`${userId}/password`, dataInput, {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        }
                    });

                    console.log("response data", response.data);
                    // const updatedUser = Object.assign({
                    //     ...this.$store.state.user
                    // }, {
                    //     ...updatedData
                    // });

                    // console.log("updatedUser", updatedUser);

                    // mise à jour de user dans localStorage
                    // localStorage.setItem("user", JSON.stringify(updatedUser))

                    // mise à jour de user dans le state
                    // this.$store.dispatch('setUser', updatedUser);



                    this.isUpdated = true;

                } catch (error) {
                    console.log(error.response.data);
                    this.valid = false;
                    if (error.response.data.message === 'Mot de passe actuel incorrect !') {
                        this.errorMessage = error.response.data.message;
                    } else {
                        this.errorMessage =
                            "Votre mot de passe doit contenir 8 caractères au minimum, contenir des lettres (majuscule et minuscule), au moins 2 chiffres ainsi qu'au moins un caractère spécial.";
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
<style scoped>
    .btn {
        font-weight: bold !important;
    }



    .container-compo {
        max-width: 500px;
        margin-top: 10%;
    }

    h1 {
        font-weight: 700;
        text-align: center;
    }

    .notice {
        font-size: 14px;
    }

    .btn-space {
        margin-right: 10px;
    }

    .validFeedback {
        color: red;
    }
</style>