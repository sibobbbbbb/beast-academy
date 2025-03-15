<template>
    <div class="home">
      <h1>Selamat Datang di Aplikasi</h1>
      <p v-if="authStore.user">Halo, {{ authStore.user.username }}!</p>
      <p v-else>Silakan login untuk melanjutkan.</p>
      <button @click="logout" v-if="authStore.user">Logout</button>
    </div>
  </template>
  
  <script setup lang="ts">
  import { useAuthStore } from '@/stores/auth';
  import { onMounted } from 'vue';
  
  const authStore = useAuthStore();
  
  onMounted(() => {
    authStore.fetchProfile();
  });
  
  const logout = () => {
    authStore.logout();
  };
  </script>
  
  <style scoped>
  .home {
    text-align: center;
    margin-top: 50px;
  }
  </style>
  