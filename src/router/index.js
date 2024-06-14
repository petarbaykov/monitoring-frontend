import { createRouter, createWebHistory } from 'vue-router';
import Home from '../views/Home.vue';
import Login from '../views/Login.vue';
import Register from '../views/Register.vue';
import Dashboard from '../views/Dashboard.vue';
import store from '../store';

const routes = [
  { path: '/', name: 'Home', component: Home },
  { path: '/login', name: 'Login', component: Login },
  { path: '/register', name: 'Register', component: Register },
  {
    path: '/dashboard',
    name: 'Dashboard',
    component: Dashboard,
    props: { auth: true },
    meta: { requiresAuth: true }
    // beforeEnter: (to, from, next) => {
    //   if (!store.state.user) {
    //     next('/login');
    //   } else {
    //     next();
    //   }
    // }
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

router.beforeEach(async (to, from, next) => {
  const requiresAuth = to.matched.some(record => record.meta.requiresAuth);

  console.log('to', to);

  if (requiresAuth && !store.getters.isAuthenticated) {
    try {
      await store.dispatch('fetchCurrentUser');
      if (store.getters.isAuthenticated) {
        next();
      } else {
        next('/login');
      }
    } catch (error) {
      next('/login');
    }
  } else if (store.getters.isAuthenticated && (to.path === '/login' || to.path === '/register')){
    next('/dashboard');
  } else {
    next();
  }
});

export default router;