<template>
  <div class="container">
    <Navbar />
    <div class="form-container">
      <h1>Login</h1>
      <form @submit.prevent="login">
        <div>
          <label for="username">Username:</label>
          <input type="text" v-model="username" />
        </div>
        <div>
          <label for="password">Password:</label>
          <input type="password" v-model="password" />
        </div>
        <button type="submit">Login</button>
      </form>
      <div v-if="error" class="error-message">{{ error }}</div>
    </div>
  </div>
</template>

<script>
import Navbar from '@/components/Navbar.vue';

export default {
  components: {
    Navbar
  },
  data() {
    return {
      username: '',
      password: '',
      error: ''
    };
  },
  methods: {
    login() {
      this.$store.dispatch('login', {
        username: this.username,
        password: this.password
      }).then(() => {
        this.$router.push('/dashboard');
      }).catch(err => {
        this.error = 'Invalid username or password';
      });
    }
  }
};
</script>

<style scoped>
.form-container {
  max-width: 400px;
  margin: 50px auto;
  background: white;
  padding: 20px;
  box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.1);
  border-radius: 5px;
}

h1 {
  text-align: center;
  color:#000;
}

.error-message {
  color: red;
  margin-top: 10px;
  text-align: center;
}
</style>
