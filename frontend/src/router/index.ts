import { createRouter, createWebHistory } from 'vue-router'
import Login from '../views/Login.vue'
import Home from '../views/Home.vue'
import Register from '../views/Register.vue'
import AddMembersView from '../components/AddMembersForm.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: Home,
    },
    { path: '/login', component: Login },
    { path: '/register', component: Register },
    { path: '/add-member', name: 'add-member', component: AddMembersView },
    {
      path: '/userlisttest',
      name: 'userlisttest',
      component: () => import('../views/UserlistTestView.vue'),
    },
    {
      path: '/userlist',
      name: 'userlist',
      component: () => import('../views/MemberView.vue'),
    },
  ],
})

export default router
