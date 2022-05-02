<template>
    <div>
        <!-- <p><strong>{{ post.User.username }}</strong> : {{ post.content }}</p>
        <pre>{{ formatTime(post.createdAt) }}</pre>
        <i class="far fa-heart"></i>
        <i class="far fa-comment"></i> -->
        <div class="card post-card">

            <div class="card-header bg-white p-3">
                <div class="d-flex justify-content-between align-items-center">
                    <div class="d-flex justify-content-between align-items-center">
                        <div class="me-2">
                            <img class="rounded-circle avatar" :src="post.User.avatar" alt="avatar">
                        </div>
                        <div class="ms-2">
                            <div class="h5 m-0 post-username">{{ post.User.username }}</div>
                            <div class="h7 text-muted post-time">{{ formatTime(post.updatedAt) }}</div>
                        </div>
                    </div>
                    <div>
                        <div class="dropdown">
                            <a class="btn btn-white" type="button" id="dropdownMenuButton1"
                                data-bs-toggle="dropdown" aria-expanded="false">
                                <i class="fas fa-ellipsis-h ellipsis-icon"></i>
                            </a>
                            
                            <ul class="dropdown-menu dropdown-menu-right" aria-labelledby="dropdownMenuButton1">
                                <li><a class="dropdown-item" href="#">Modifier</a></li>
                                <li><a class="dropdown-item" href="#">Supprimer</a></li>
                            </ul>
                        </div>
                    </div>
                </div>

            </div>
            <div class="card-body">
                <p class="card-text">
                    {{ post.content }}
                </p>
                <img v-if="post.imageUrl" :src="post.imageUrl" alt="image" class="post-image">
            </div>
            <div class="card-footer d-flex bg-white p-3">
                <a href="#" class="card-link"><i class="far fa-heart"></i> J'aime</a>
                <a href="#" class="card-link"><i class="far fa-comment"></i> Commenter</a>
            </div>
        </div>
    </div>
</template>

<script>
    import moment from 'moment';
    moment.locale('fr');

    export default {
        name: 'PostItem',
        props: {
            post: Object
        },
        methods: {
            formatTime(time) {
                const now = moment();

                if(now.diff(time, 'years') > 0) {
                    return moment(time).format('Do MMM YYYY');
                } else if (now.diff(time, 'days') > 0)  {
                    return moment(time).format('Do MMM');
                } else {
                    return moment(time).fromNow(true);
                }
            }
        },
        beforeMount() {
            // console.log('beforeMount Post Item');
        }
    }
</script>

<style scoped>
    .post-card {
        border-radius: 15px;
        /* max-width: 680px; */
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
    }
    
    .card-footer {
        gap: 20px;
    }

    .ellipsis-icon {
        color: #65676B;
    }
    
    .dropdown-item, .card-link {
        color: #65676B;
    }

    .post-image {
        max-width: 100%;
    }

    .post-time {
        font-size: 0.9rem;
    }
    
</style>