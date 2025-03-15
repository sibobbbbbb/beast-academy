<template>
    <div class="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-500 to-purple-600 p-4">
      <div class="w-full max-w-md bg-white shadow-lg rounded-xl p-6">
        <h2 class="text-2xl font-bold text-center text-gray-900">Register</h2>
        
        <form @submit.prevent="handleRegister" class="mt-4">
          <div class="mb-4">
            <label class="block text-gray-700">Username</label>
            <input v-model="username" type="text" placeholder="Enter your username"
              class="w-full mt-1 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" required />
          </div>
  
          <div class="mb-4">
            <label class="block text-gray-700">Email</label>
            <input v-model="email" type="email" placeholder="Enter your email"
              class="w-full mt-1 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" required />
          </div>
  
          <div class="mb-4">
            <label class="block text-gray-700">Password</label>
            <input v-model="password" type="password" placeholder="Enter your password"
              class="w-full mt-1 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" required />
          </div>
  
          <div class="mb-4">
            <label class="block text-gray-700">Role</label>
            <select v-model="role" class="w-full mt-1 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
              <option value="member">Member</option>
              <option value="admin">Admin</option>
              <option value="trainer">Trainer</option>
            </select>
          </div>
  
          <button type="submit"
            class="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition duration-300">
            Register
          </button>
  
          <p class="mt-4 text-center text-gray-600">
            Already have an account? 
            <router-link to="/login" class="text-blue-600 hover:underline">Login</router-link>
          </p>
        </form>
      </div>
    </div>
  </template>
  
  <script setup lang="ts">
  import { ref } from 'vue';
  import { useRouter } from 'vue-router';
  import api from '@/utils/axios';
  
  const router = useRouter();
  const username = ref('');
  const email = ref('');
  const password = ref('');
  const role = ref('member'); // Default role
  
  const handleRegister = async () => {
    try {
      const response = await api.post('/auth/register', { 
        username: username.value, 
        email: email.value, 
        password: password.value, 
        role: role.value
      });
  
      console.log('Register Success:', response.data);
      alert('Registration successful! Please log in.');
      router.push('/login');
    } catch (error) {
      console.error('Register Error:', (error as any).response?.data || (error as any).message);
      const err = error as any;
      alert(err.response?.data?.message || 'Registration failed.');
    }
  };
  </script>
  