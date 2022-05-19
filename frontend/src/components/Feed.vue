<template>
    <section id="feed" class="mt-5">
        <div class="feed-posts mx-auto">
            <ul v-if="posts.length > 0" class="mx-auto">
                <li v-for="(post) in posts" :key="post.id" class="mb-5">
                    <PostItem v-bind:post="post" @postdeleted="getAllPosts()" @postupdated="getAllPosts()" />
                </li>
            </ul>
            <p v-else class="zero-post text-center">Aucun post publié pour l'instant !</p>
        </div>
    </section>
</template>

<script>
import PostItem from "@/components/PostItem.vue";
import Api from '../services/Api';

export default {
  name: 'FeedCompo',
  components: {
    PostItem
  },
  data() {
    return {
      posts: [],
      // compoKey: 0
    };
  },
  methods: {
    async getAllPosts() {
      const token = localStorage.getItem("token");

      try {
          const response = await Api.get('posts', {
            headers: {
                Authorization: `Bearer ${token}`,
            },
          });

          // console.log("response appel API getAllPosts", response);
          this.posts = response.data;

          this.$store.dispatch('setPosts', response.data);
          
      } catch (error) {
          console.log(error);  
          console.log('OUUUUUUUUUUPS !')
          this.$router.push('/login');  
      }
    }
  },
  async beforeMount() {
    this.getAllPosts();
  },
  // updated() {
  //   console.log('Feed mis à jour !')
  // }
}

</script>

<style scoped>
    ul {
      list-style-type: none;
      padding-left: 0;
    }

    .feed-title {
      font-size: 1.5rem;
      display: inline-block;
      border-bottom: 3px solid #FD5835;
    }

    .zero-post {
      font-size: 2rem;
      font-weight: 500;
    }
    
</style>