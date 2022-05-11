<template>
    <div class="card comment-card border-0 px-3">
        <div class="card-header border-0 px-3 py-2">
            <div class="d-flex justify-content-between align-items-center">

                <div class="d-flex justify-content-between align-items-center">
                    <div class="me-1">
                        <img class="rounded-circle avatar" :src="comment.User.avatar" alt="avatar">
                    </div>
                    <div class="ms-1">
                        <div class="h5 m-0 comment-username">{{ comment.User.username }}</div>
                        
                    </div>
                </div>

                <div v-if="user.id === comment.User.id || user.isAdmin" class="dropdown">
                    <a class="btn btn-white" type="button" id="dropdownMenuButton1" data-bs-toggle="dropdown"
                        aria-expanded="false">
                        <i class="fas fa-ellipsis-h ellipsis-icon"></i>
                    </a>

                    <ul class="dropdown-menu dropdown-menu-right" aria-labelledby="dropdownMenuButton1">
                        <li><a v-if="user.id === comment.User.id" class="dropdown-item" href="javascript:void(0)" @click="editComment(comment.id)">Modifier</a></li>
                        <li><a class="dropdown-item" href="javascript:void(0)" @click="deleteComment(comment.id)">Supprimer</a></li>
                    </ul>
                    
                </div>

            </div>
        </div>

        <div v-show="!toModify" class="card-body px-3 pt-1">
            <p class="card-text">{{ comment.content }}</p>
        </div>

        <!-- Affichage lors de l'édition du commentaire -->
        <div v-show="toModify" class="card-body px-3 pt-1">
            <h3 class="text-center mb-3">Éditer le commentaire</h3>
            <form @submit.prevent="handleSubmit" id="commentEditForm" enctype="multipart/form-data" class="mb-5">
                <div class="mb-3">
                    <label for="commentInput" class="form-label">Commentaire</label>
                    <textarea @click="resetErrorMessage" v-model="messageEdit" type="text" class="form-control" id="commentInput" rows="3" />
                </div>
                <p v-if="!validEdit" class="validFeedback">{{ errorMessageEdit }}</p>
                <a @click="abort" class="btn btn-white btn-space btn-abort">Annuler</a>
                <button :disabled="!validEdit" type="submit" class="btn btn-groupo">Sauvegarder</button>
            </form>
        </div>

        <div class="card-footer bg-white border-0 px-3 pt-0 pb-1">
            <p class="text-muted comment-time mb-1">{{ formatTime(comment.createdAt) }}</p>
        </div>
    </div>

</template>

<script>
    import { mapGetters } from "vuex";
    import moment from 'moment';
    moment.locale('fr');
    import Api from '../services/Api';

    export default {
        name: 'CommentItem',
        props: {
            comment: Object,
            postId: Number
        },
        data() {
            return {
                commentId: null,
                messageEdit: this.$props.comment.content,
                validEdit: true,
                errorMessageEdit: '',
                toModify: false,
            };
        },
        computed: {
            ...mapGetters(["user"])
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
            async deleteComment(id) {

                const token = localStorage.getItem("token");
                console.log(this.$props.postId, "this.$props.postId");
                const postId = this.$props.postId;
                const commentId = id;

                console.log('id du commentaire à supprimer', id);

                let okToDelete = confirm('Vous êtes sûr(e) de vouloir supprimer ce commentaire ?')
                if (!okToDelete) {
                    return
                }

                try {
                    const response = await Api.delete(`posts/${postId}/comment/${commentId}`, {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        }
                    });

                    console.log(response.data);

                    alert('Commentaire supprimé !');
                    this.$router.go();

                } catch (error) {
                    console.log(error.response.data);
                }
            },
            editComment(id) {
                console.log('edit du Commentaire n°', id);
                this.toModify = true;
                this.commentId = id;
            },
            async handleSubmit() {
      
                const token = localStorage.getItem("token");
                const postId = this.$props.postId;
                const commentId = this.commentId;
                
                console.log('id du post', postId)
                console.log('id du commentaire à éditer', commentId)
                console.log('message edited', this.messageEdit)

                const body = { content: this.messageEdit };

                try {
                    const response = await Api.put(`posts/${postId}/comment/${commentId}`, body, {
                        headers: {
                            Authorization: `Bearer ${token}`,
                            'Content-Type': 'application/json'
                        },
                    });
                    console.log("response appel API update", response.data);

                    alert('Le commentaire a bien été édité');

                    this.messageEdit = '';
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
            },
            resetErrorMessage() {
                this.validEdit = true;
            }
        },
        beforeMount() {
            // console.log('beforeMount Post Item');
            
        },
        mounted() {
        }
    }
</script>

<style scoped>
    .comment-card .card-header, .comment-card .card-body {
        background-color: #f7f8fa;
    }

    .comment-card .card-header {
        border-top-left-radius: 15px;
        border-top-right-radius: 15px;
    }

    .comment-card .card-body {
        border-bottom-left-radius: 15px;
        border-bottom-right-radius: 15px;
    }
    
    .avatar {
        width: 30px;
        height: 30px;
        object-fit: cover;
    }

    .comment-username {
        font-size: 1rem;
    }

    .ellipsis-icon {
        color: #65676B;
        font-size: 13px;
    }

    .card-text {
        font-size: 0.9rem;
    }

    .comment-time {
        font-size: 0.8rem;
    }

    textarea {
        resize: none;
        background: #fcfbfb;
    }

    .btn-space {
        margin-right: 10px;
    }

    .btn-abort {
        background-color: #FFF;
    }
    .btn-abort:hover {
        background-color: #d6d6d6;
    }
    
    .validFeedback {
        color: red;
    }
    
</style>