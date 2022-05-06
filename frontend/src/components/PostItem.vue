<template>
    <div class="card post-card">
        <div class="card-header bg-white p-3">
            <div class="d-flex justify-content-between align-items-center">

                <div class="d-flex justify-content-between align-items-center">
                    <div class="me-2">
                        <img class="rounded-circle avatar" :src="post.User.avatar" alt="avatar">
                    </div>
                    <div class="ms-2">
                        <div class="h5 m-0 post-username">{{ post.User.username }}</div>
                        <div class="h7 text-muted post-time">{{ formatTime(post.createdAt) }}</div>
                    </div>
                </div>

                <div v-if="user.id === post.User.id || user.isAdmin" class="dropdown">
                    <a class="btn btn-white" type="button" id="dropdownMenuButton1" data-bs-toggle="dropdown"
                        aria-expanded="false">
                        <i class="fas fa-ellipsis-h ellipsis-icon"></i>
                    </a>

                    <ul class="dropdown-menu dropdown-menu-right" aria-labelledby="dropdownMenuButton1">
                        <li><a v-if="user.id === post.User.id" class="dropdown-item" href="javascript:void(0)" @click="editPost(post.id)">Modifier</a></li>
                        <li><a v-if="user.id === post.User.id || user.isAdmin" class="dropdown-item"
                                href="javascript:void(0)" @click="deletePost(post.id)">Supprimer</a></li>
                    </ul>
                    
                </div>

            </div>
        </div>

        <div v-show="!toModify" class="card-body">
            <p class="card-text" ref="mycardtext">
                
            </p>
            <img v-if="post.imageUrl" :src="post.imageUrl" alt="image" class="post-image mb-3">
            <!-- <p v-if="isUpdated" class="post-firstpublished mb-0 mt-3 text-end">Première publication le {{ formatTimeUpdated(post.createdAt) }}</p> -->
        </div>

        <!-- Affichage lors de la modification -->

        <div v-if="toModify" class="card-body">
            <h3 class="text-center mb-3">Modifier la publication</h3>
            <form @submit.prevent="handleSubmit" id="myForm" enctype="multipart/form-data" class="mb-5">
                <div class="mb-3">
                    <label for="messageInput" class="form-label">Message</label>
                    <textarea @click="resetErrorMessage" v-model="messageEdit" type="text" class="form-control" id="messageInput" rows="5" />
                </div>
                <div class="mb-3">
                    <label for="imageInput" class="form-label mb-3 d-block">Image</label>
                    <img v-if="previewImageEdit" class="image-preview d-block mb-3" :src="previewImageEdit" />
                    <a v-if="previewImageEdit && !selectedFileEdit" @click="removeImage" class="btn btn-danger mb-3">Supprimer image</a>
                    <input class="form-control btn-upload mb-3" type="file" id="imageInput" @change="onFileSelected" @click="resetErrorMessage">
                    <!-- <a v-if="!selectedFileEdit" @click="removeImage" class="btn btn-danger mb-3">Supprimer image</a> -->
                </div>
                
                <p v-if="!validEdit" class="validFeedback">{{ errorMessageEdit }}</p>
                <a @click="abort" class="btn btn-light btn-space">Annuler</a>
                <button :disabled="!validEdit" type="submit" class="btn btn-groupo">Sauvegarder</button>
            </form>
            
        </div>
        <div class="card-footer d-flex bg-white p-3">
            <a href="#" class="card-link"><i class="far fa-heart"></i> J'aime</a>
            <a href="#" class="card-link"><i class="far fa-comment"></i> Commenter</a>
        </div>
    </div>

</template>

<script>
    import moment from 'moment';
    moment.locale('fr');
    import { mapGetters } from "vuex";
    import Api from '../services/Api';
    import getClickableLink from '../utils/getClickableLink';

    export default {
        name: 'PostItem',
        props: {
            post: Object
        },
        data() {
            return {
                postId: null,
                messageEdit: this.$props.post.content,
                selectedFileEdit: null,
                previewImageEdit: this.$props.post.imageUrl,
                previousImage: '',
                validEdit: true,
                errorMessageEdit: '',
                toModify: false,
                deleteImg: false
            };
        },
        computed: {
            ...mapGetters(["user"]),
            // isUpdated() {
            //     return this.$props.post.createdAt !== this.$props.post.updatedAt;
            // }
        },
        methods: {
            formatTime(time) {
                const now = moment();

                moment.relativeTimeThreshold('m', 60);
                moment.relativeTimeThreshold('h', 24);

                if (now.diff(time, 'years') > 0) {
                    return moment(time).format('Do MMM YYYY');
                } else if (now.diff(time, 'minutes') > 1440 ) {
                    return moment(time).format('Do MMM');
                } else {
                    return moment(time).fromNow();
                }
            },
            // formatTimeUpdated(time) {
            //     return moment(time).format('dddd Do MMMM YYYY à HH:mm');
            // },
            async deletePost(id) {

                const token = localStorage.getItem("token");
                const postId = id;

                console.log('id du post à supprimer', id);

                let okToDelete = confirm('Vous êtes sûr(e) de supprimer ce post ?')
                if (!okToDelete) {
                    return
                }

                try {
                    const response = await Api.delete(`posts/${postId}`, {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        }
                    });

                    console.log(response.data);

                    alert('Post supprimé !');
                    this.$router.go();

                } catch (error) {
                    console.log(error.response.data);
                }
            },
            editPost(id) {
                console.log('edit du Post n°', id);
                this.toModify = true;
                this.postId = id;
            },
            async handleSubmit() {
      
                console.log('id du message à éditer', this.postId)
                console.log('message edited', this.messageEdit)
                console.log('effacer image ?', this.deleteImg)

                const postInfos = {
                    content: this.messageEdit,
                    deleteImg: this.deleteImg
                }

                let body = postInfos;

                // si image uploadée, envoi d'un objet formData

                if (this.selectedFileEdit !== null) {
                    const formData = new FormData();
                    formData.append('post', JSON.stringify({ content: this.messageEdit}));
                    formData.append('image', this.selectedFileEdit);
                    body = formData;
                }

                const token = localStorage.getItem("token");

                try {
                    const response = await Api.put(`posts/${this.postId}`, body, {
                        headers: {
                            Authorization: `Bearer ${token}`,
                            'Content-Type': 'application/json'
                        },
                    });
                    console.log("response appel API update", response.data);

                    alert('Les modifications ont bien été enregistrées !');

                    // this.messageEdit = '';
                    // this.selectedFileEdit = null;
                    // this.previewImageEdit = '';
                    // this.deleteImg = false;
                    this.toModify = false;
                    this.$router.go();

                } catch (error) {
                    console.log(error.response.data);
                    this.validEdit = false;
                    this.errorMessageEdit = error.response.data.message;
                }
            },
            abort() {
                this.toModify = false;
                // this.$refs.mycardtext.innerHTML = getClickableLink(this.$props.post.content);
                this.previewImageEdit = this.previousImage;
                this.selectedFileEdit = null;
                this.deleteImg = false;
            },
            onFileSelected(e) {
                const file = e.target.files[0];
                console.log('file', file)
                if (!file) {
                    if(this.deleteImg) {
                        this.previewImageEdit = '';
                    } else {
                        this.previewImageEdit = this.previousImage;
                    }
                    this.selectedFileEdit = null;
                    return
                }
                const allowedTypes = ['image/jpg', 'image/jpeg', 'image/png', 'image/webp', 'image/gif'];
                const MAX_SIZE = 1048576;
                const tooLarge = file.size > MAX_SIZE;

                if(allowedTypes.includes(file.type) && !tooLarge) {
                    this.selectedFileEdit = e.target.files[0];

                    // if(this.previewImageEdit) {
                    //     this.previousImage = this.previewImageEdit;
                    // }

                    // preview uploaded image
                    let reader = new FileReader;
                    const vm = this;

                    reader.onload = e => {
                        vm.previewImageEdit = e.target.result;
                    }
                    reader.readAsDataURL(file);

                } else {
                    this.validEdit = false;
                    this.errorMessageEdit = tooLarge ? "Fichier trop volumineux : la taille ne doit pas dépasser 1 Mo" : "Seules les images sont autorisées";
                }
            },
            removeImage() {
                this.previewImageEdit = '';
                this.deleteImg = true;
            },
            resetErrorMessage() {
                this.validEdit = true;
            }
             
        },
        beforeMount() {
            // console.log('beforeMount Post Item');
            // console.log(this.$store.state.user.isAdmin)
        },
        mounted() {
            // console.log(this.$refs.mycardtext);
            this.$refs.mycardtext.innerHTML = getClickableLink(this.$props.post.content);
            if(this.previewImageEdit) {
                this.previousImage = this.previewImageEdit;
            }
        }
    }
</script>

<style scoped>
    .post-card {
        border-radius: 15px;
        box-shadow: 0 2px 4px rgb(0 0 0 / 15%);
    }

    .avatar {
        width: 45px;
        height: 45px;
        object-fit: cover;
    }

    .post-card .card-header {
        border-top-left-radius: 15px;
        border-top-right-radius: 15px;
    }

    .post-card .card-footer {
        border-bottom-left-radius: 15px;
        border-bottom-right-radius: 15px;
        gap: 20px;
    }

    .ellipsis-icon {
        color: #65676B;
    }

    .dropdown-item,
    .card-link {
        color: #65676B;
    }

    .post-image {
        max-width: 100%;
    }

    .post-time {
        font-size: 0.9rem;
    }

    /* .post-firstpublished {
        font-size: 13px;
        color: #666;
        font-style: italic;
    } */

    label {
        font-weight: 500;
    }

    textarea {
        resize: none;
        background: #fcfbfb;
    }

    .validFeedback {
        color: red;
    }

    .btn-space {
        margin-right: 10px;
    }

    .image-preview {
        max-width: 100%;
    }

    .btn-upload {
        max-width: 320px;
        border-radius: 24px;
    }

    .btn-remove {
        background-color: #EFEFEF;
        border-color: #EFEFEF;
        color: #111 !important;
    }

    .btn-remove:hover {
        background-color: #d6d6d6;
    }
    
</style>