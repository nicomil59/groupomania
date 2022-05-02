<template>
    <div>
        <h2>New Post</h2>
    </div>
</template>

<script>

export default {
  name: 'NewPost',
  
  beforeMount() {
    console.log('beforeMount newpost');
  }
}

</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

</style>