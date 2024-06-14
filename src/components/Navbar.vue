<template>
  <nav>
    <router-link to="/">Home</router-link>
    <router-link v-if="!user" to="/login">Login</router-link>
    <router-link v-if="!user" to="/register">Register</router-link>
    <router-link v-if="user" to="/dashboard">Dashboard</router-link>
    <a v-if="user" href="#" @click.prevent="logout">Logout</a>
  </nav>
</template>

<script>
export default {
  computed: {
    user() {
      return this.$store.state.user;
    }
  },
  methods: {
    logout() {
      this.$store.dispatch('logout');
      this.$router.push('/');
    }
  }
};
</script>

<style scoped>
nav {
  display: flex;
  gap: 10px;
}
</style>
