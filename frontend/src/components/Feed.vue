<template>
    <div>
        <h2>Fil d'actualité</h2>
        <div class="feed-posts mx-auto">
            <ul class="mx-auto">
                <!-- <li v-for="(post, index) in posts" :key="index" class="mb-5">
                    <p><strong>{{ post.User.username }}</strong> : {{ post.content }}</p>
                    <pre>{{ formatTime(post.createdAt) }}</pre>
                </li> -->
                <li v-for="(post, index) in posts" :key="index" class="mb-5">
                    <PostItem v-bind:post="post" />
                </li>
            </ul>
        </div>
    </div>
</template>

<script>
import PostItem from "@/components/PostItem.vue";
import Api from '../services/Api';
import moment from 'moment';
// console.log(moment().format());


export default {
  name: 'FeedCompo',
  components: {
    PostItem
  },
  data() {
    return {
      posts: [],
    };
  },
  methods: {
    formatTime(time) {
        return moment(time).fromNow();
    }
  },
  async beforeMount() {
    const token = localStorage.getItem("token");

    try {

        const response = await Api.get('posts', {
        headers: {
            Authorization: `Bearer ${token}`,
        },
        });

        console.log("response appel API getAllPosts", response);
        this.posts = response.data;
        
    } catch (error) {
        console.log(error);    
    }
  }
}

</script>

<style scoped>
    ul {
        list-style-type: none;
        padding-left: 0;
    }

</style>