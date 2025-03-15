<template>
    <div class="flex min-h-screen items-center justify-center bg-gray-100">
      <div class="w-full max-w-md bg-white p-8 rounded-2xl shadow-lg">
        <h2 class="text-2xl font-bold text-center text-gray-700">Login</h2>
        <form @submit.prevent="handleLogin" class="mt-6">
          <div>
            <label class="block text-gray-600">Email</label>
            <input 
              v-model="email" 
              type="email" 
              class="w-full mt-1 px-4 py-2 border rounded-lg focus:ring focus:ring-blue-300 outline-none"
              required
            />
          </div>
          <div class="mt-4">
            <label class="block text-gray-600">Password</label>
            <input 
              v-model="password" 
              type="password" 
              class="w-full mt-1 px-4 py-2 border rounded-lg focus:ring focus:ring-blue-300 outline-none"
              required
            />
          </div>
          <button 
            type="submit" 
            class="mt-6 w-full bg-blue-500 hover:bg-blue-600 text-white py-2 rounded-lg transition"
          >
            Login
          </button>
        </form>
        <p class="mt-4 text-sm text-gray-600 text-center">
          Belum punya akun? <router-link to="/register" class="text-blue-500 hover:underline">Daftar</router-link>
        </p>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref } from 'vue';
  import { useRouter } from 'vue-router';
  import api from '@/utils/axios';
  
  const email = ref('');
  const password = ref('');
  const router = useRouter();
  
  const handleLogin = async () => {
    try {
      const response = await api.post('/auth/login', { email: email.value, password: password.value });
      localStorage.setItem('token', response.data.token);
      router.push('/home');
    } catch (error) {
      console.error('Login gagal', error);
    }
  };
  </script>
  