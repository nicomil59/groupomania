<template>
  <div class="vue-app">
    <NavBar />
    <h1>Test</h1>
  </div>
</template>

<script>
import NavBar from "@/components/NavBar.vue";

export default {
  name: "App",
  components: {
    NavBar,
  },
};
</script>

<style>
body {
  background-color: #fff;
}
</style>
