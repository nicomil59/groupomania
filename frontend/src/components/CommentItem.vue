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

                <div class="dropdown">
                    <a class="btn btn-white" type="button" id="dropdownMenuButton1" data-bs-toggle="dropdown"
                        aria-expanded="false">
                        <i class="fas fa-ellipsis-h ellipsis-icon"></i>
                    </a>

                    <ul class="dropdown-menu dropdown-menu-right" aria-labelledby="dropdownMenuButton1">
                        <li><a class="dropdown-item" href="javascript:void(0)" >Modifier</a></li>
                        <li><a class="dropdown-item"
                                href="javascript:void(0)" >Supprimer</a></li>
                    </ul>
                    
                </div>

            </div>
        </div>
        <div class="card-body px-3 pt-1">
            <p class="card-text">{{ comment.content }}</p>
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

    export default {
        name: 'CommentItem',
        props: {
            comment: Object
        },
        data() {
            return {
                // postId: null,
                // selectedFileEdit: null,
                // previewImageEdit: this.$props.post.imageUrl,
                // previousImage: '',
                // validEdit: true,
                // errorMessageEdit: '',
                // toModify: false,
                // deleteImg: false
            };
        },
        computed: {
            ...mapGetters(["user"])
        },
        methods: {
            formatTime(time) {
                const now = moment();

                // console.log(time)

                moment.relativeTimeThreshold('m', 60);
                moment.relativeTimeThreshold('h', 24);

                if (now.diff(time, 'years') > 0) {
                    return moment(time).format('Do MMM YYYY');
                } else if (now.diff(time, 'minutes') > 1440 ) {
                    return moment(time).format('Do MMM');
                } else {
                    return moment(time).fromNow();
                }
            }
        },
        beforeMount() {
            // console.log('beforeMount Post Item');
            // console.log(this.$store.state.user.isAdmin)
        },
        mounted() {
            // console.log(this.$refs.mycardtext);
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
    
</style>