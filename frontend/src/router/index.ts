import { createRouter, createWebHistory } from 'vue-router'
import Login from '../views/LoginView.vue'
import Home from '../views/HomeView.vue'
import Register from '../views/RegisterView.vue'
import AddMembersView from '@/views/AddMembersView.vue'
import ProfileView from '@/views/ProfileView.vue'
import EventView from '@/views/EventView.vue'

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
      path: '/profile',
      name: 'profile',
      component: ProfileView,
    },
    {
      path: '/auth/google/callback',
      name: 'GoogleCallback',
      component: () => import('../views/GoogleView.vue'),
    },
    {
      path: '/edit-profile',
      name: 'edit-profile',
      component: () => import('../views/EditProfileView.vue'),
    },
    {
      path: '/events',
      name: 'events',
      component: EventView,
    }
    {
      path: '/event',
      name: 'event',  
      component: () => import('../views/EventView.vue'),
    },
    {
      path: '/eventdetail/:id',
      name: 'eventdetail',
      component: () => import('../views/EventDetails.vue'),
    },
  ],
})

export default router
