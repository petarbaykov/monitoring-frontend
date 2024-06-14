<template>
  <div class="container">
    <Navbar />
    <div class="content">
      <h1>Welcome to the HTTP Monitoring App</h1>
      <p>Please login or register to continue.</p>
    </div>
  </div>
</template>

<script>
import Navbar from '@/components/Navbar.vue';

export default {
  components: {
    Navbar
  }
};
</script>

<style scoped>
.content {
  text-align: center;
  margin-top: 100px;
  background: white;
  padding: 20px;
  box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.1);
  border-radius: 5px;
}
</style>
