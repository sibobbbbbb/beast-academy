import { createRouter, createWebHistory } from 'vue-router';
import Login from '../views/Login.vue';
import Home from '../views/Home.vue';
import Register from '../views/Register.vue';
import AddMembersView from '../components/AddMembersForm.vue';

const routes = [
  { path: '/', component: Home },
  { path: '/login', component: Login },
  { path: '/home', component: Home },
  { path: '/register', component: Register },
  {
    path: '/add-member',
    name: 'add-member',
    component: AddMembersView,
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
