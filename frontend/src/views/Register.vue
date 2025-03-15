<template>
  <div class="h-screen w-screen flex items-center justify-center bg-gradient-to-br from-green-800 to-green-600">
    <div class="w-full max-w-md bg-white rounded-xl shadow-xl overflow-hidden relative mx-4">
      <!-- Tennis ball decoration -->
      <div class="absolute -top-10 -right-10 w-16 h-16 rounded-full bg-yellow-400 opacity-50"></div>
      
      <!-- Header with logo -->
      <div class="pt-5 pb-3 text-center">
        <div class="inline-flex items-center justify-center mb-2">
          <div class="relative w-12 h-12 bg-yellow-400 rounded-full flex items-center justify-center">
            <div class="absolute w-12 h-12 rounded-full border-2 border-white"></div>
            <div class="absolute w-10 h-10 rounded-full border-2 border-white"></div>
            <div class="absolute w-full h-0.5 bg-white"></div>
            <div class="absolute w-0.5 h-full bg-white"></div>
          </div>
        </div>
        <h1 class="text-xl font-bold text-gray-800 mb-1">Tennis Community</h1>
        <p class="text-sm text-gray-500">Create your account</p>
      </div>
      
      <!-- Error Message -->
      <div v-if="errorMessage" class="bg-red-50 border border-red-200 text-red-600 px-4 py-2 rounded-md relative mx-6 mb-3">
        <div class="flex items-center justify-between">
          <p class="text-sm">{{ errorMessage }}</p>
          <button @click="errorMessage = ''" class="text-red-500 hover:text-red-700 ml-2">
            <svg class="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
              <path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd" />
            </svg>
          </button>
        </div>
      </div>
      
      <!-- Register Form -->
      <div class="px-6 py-3 space-y-4">
        <form @submit.prevent="handleRegister" class="space-y-4 text-black">
          <div>
            <label for="username" class="block text-sm font-medium text-gray-800 mb-1">Username</label>
            <input 
              type="text" 
              id="username" 
              v-model="username" 
              class="w-full px-3 py-2 bg-blue-50 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
              placeholder="Enter your username"
              required
            />
          </div>
          
          <div>
            <label for="email" class="block text-sm font-medium text-gray-800 mb-1">Email</label>
            <input 
              type="email" 
              id="email" 
              v-model="email" 
              class="w-full px-3 py-2 bg-blue-50 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
              placeholder="your@email.com"
              required
            />
          </div>
          
          <div>
            <label for="password" class="block text-sm font-medium text-gray-800 mb-1">Password</label>
            <input 
              type="password" 
              id="password" 
              v-model="password" 
              class="w-full px-3 py-2 bg-blue-50 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
              placeholder="••••••••"
              required
            />
          </div>
          
          <div>
            <label for="confirmPassword" class="block text-sm font-medium text-gray-800 mb-1">Confirm Password</label>
            <input 
              type="password" 
              id="confirmPassword" 
              v-model="confirmPassword" 
              class="w-full px-3 py-2 bg-blue-50 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
              placeholder="••••••••"
              required
            />
          </div>
          
          <div>
            <label for="role" class="block text-sm font-medium text-gray-800 mb-1">Role</label>
            <select 
              id="role"
              v-model="role" 
              class="w-full px-3 py-2 bg-blue-50 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 appearance-none pr-8"
              style="background-image: url('data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' fill=\'none\' viewBox=\'0 0 24 24\' stroke=\'%23333\'%3E%3Cpath stroke-linecap=\'round\' stroke-linejoin=\'round\' stroke-width=\'2\' d=\'M19 9l-7 7-7-7\'%3E%3C/path%3E%3C/svg%3E'); background-repeat: no-repeat; background-size: 0.8rem; background-position: center right 0.8rem;"
            >
              <option value="member">Member</option>
              <option value="admin">Admin</option>
              <option value="trainer">Trainer</option>
            </select>
          </div>
          
          <button 
            type="submit" 
            class="w-full bg-green-500 text-white py-2 px-4 rounded-md hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-colors text-base font-medium"
            :disabled="isLoading"
          >
            <span v-if="isLoading" class="flex items-center justify-center">
              <svg class="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Registering...
            </span>
            <span v-else>Register</span>
          </button>
        </form>
        
        <div class="mt-3 text-center">
          <p class="text-sm text-gray-600">
            Already have an account? 
            <router-link to="/login" class="font-medium text-green-600 hover:text-green-800">Login</router-link>
          </p>
        </div>
      </div>
      
      <!-- Tennis court decoration at bottom -->
      <div class="h-2 bg-green-600 mt-2"></div>
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
const confirmPassword = ref('');
const role = ref('member'); // Default role
const errorMessage = ref('');
const isLoading = ref(false);

const handleRegister = async () => {
  errorMessage.value = '';
  
  // Password validation
  if (password.value !== confirmPassword.value) {
    errorMessage.value = 'Password dan konfirmasi password tidak cocok';
    return;
  }
  
  // Password strength check
  if (password.value.length < 8) {
    errorMessage.value = 'Password harus minimal 8 karakter';
    return;
  }
  
  isLoading.value = true;
  
  try {
    const response = await api.post('/auth/register', { 
      username: username.value, 
      email: email.value, 
      password: password.value, 
      role: role.value
    });

    console.log('Register Success:', response.data);
    router.push('/login');
  } catch (error) {
    console.error('Register Error:', (error as any).response?.data || (error as any).message);
    const err = error as any;
    errorMessage.value = err.response?.data?.message || 'Registration failed. Please try again.';
  } finally {
    isLoading.value = false;
  }
};
</script>

<style scoped>
/* Adjust spacing between form elements */
.space-y-4 > :not([hidden]) ~ :not([hidden]) {
  --tw-space-y-reverse: 0;
  margin-top: calc(1rem * calc(1 - var(--tw-space-y-reverse)));
  margin-bottom: calc(1rem * var(--tw-space-y-reverse));
}
</style>