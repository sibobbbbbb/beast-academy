<template>
  <div class="h-screen w-screen flex items-center justify-center bg-gradient-to-br from-[var(--vt-c-black-soft)] to-[var(--vt-c-black)]">
    <div class="w-full max-w-md bg-[var(--color-background)] rounded-xl shadow-xl overflow-hidden relative mx-4">
      <!-- Tennis ball decoration -->
      <div class="absolute -top-10 -right-10 w-16 h-16 rounded-full bg-[var(--vt-c-divider-dark-1)] opacity-50"></div>
      
      <!-- Header with logo -->
      <div class="pt-5 pb-3 text-center">
        <div class="inline-flex items-center justify-center mb-2">
          <div class="relative w-12 h-12 bg-[var(--vt-c-divider-dark-1)] rounded-full flex items-center justify-center">
            <div class="absolute w-12 h-12 rounded-full border-2 border-[var(--color-text)]"></div>
            <div class="absolute w-10 h-10 rounded-full border-2 border-[var(--color-text)]"></div>
            <div class="absolute w-full h-0.5 bg-[var(--color-text)]"></div>
            <div class="absolute w-0.5 h-full bg-[var(--color-text)]"></div>
          </div>
        </div>
        <h1 class="text-xl font-bold text-[var(--color-heading)] mb-1">Tennis Community</h1>
        <p class="text-sm text-[var(--color-text)]">Create your account</p>
      </div>
      
      <!-- Error Message -->
      <div v-if="errorMessage" class="bg-[var(--vt-c-black-mute)] border border-[var(--vt-c-divider-dark-2)] text-[var(--vt-c-text-dark-2)] px-4 py-2 rounded-md relative mx-6 mb-3">
        <div class="flex items-center justify-between">
          <p class="text-sm">{{ errorMessage }}</p>
          <button @click="errorMessage = ''" class="text-[var(--vt-c-text-dark-2)] hover:text-[var(--vt-c-text-dark-1)] ml-2">
            <svg class="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
              <path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd" />
            </svg>
          </button>
        </div>
      </div>
      
      <!-- Register Form -->
      <div class="px-6 py-3 space-y-4">
        <form @submit.prevent="handleRegister" class="space-y-4 text-[var(--color-text)]">
          <div>
            <label for="username" class="block text-sm font-medium text-[var(--color-heading)] mb-1">Username</label>
            <input 
              type="text" 
              id="username" 
              v-model="username" 
              class="w-full px-3 py-2 bg-[var(--color-background-soft)] border border-[var(--color-border)] rounded-md focus:outline-none focus:ring-2 focus:ring-[var(--vt-c-divider-dark-1)]"
              placeholder="Enter your username"
              required
            />
          </div>
          
          <div>
            <label for="email" class="block text-sm font-medium text-[var(--color-heading)] mb-1">Email</label>
            <input 
              type="email" 
              id="email" 
              v-model="email" 
              class="w-full px-3 py-2 bg-[var(--color-background-soft)] border border-[var(--color-border)] rounded-md focus:outline-none focus:ring-2 focus:ring-[var(--vt-c-divider-dark-1)]"
              placeholder="your@email.com"
              required
            />
          </div>
          
          <div>
            <label for="password" class="block text-sm font-medium text-[var(--color-heading)] mb-1">Password</label>
            <div class="relative">
              <input 
                :type="showPassword ? 'text' : 'password'" 
                id="password" 
                v-model="password" 
                class="w-full px-3 py-2 bg-[var(--color-background-soft)] border border-[var(--color-border)] rounded-md focus:outline-none focus:ring-2 focus:ring-[var(--vt-c-divider-dark-1)]"
                placeholder="••••••••"
                required
              />
              <button 
                type="button" 
                @click="showPassword = !showPassword" 
                class="absolute right-3 top-1/2 transform -translate-y-1/2 text-[var(--color-text)]"
              >
                <svg v-if="showPassword" class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"></path>
                </svg>
                <svg v-else class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path>
                </svg>
              </button>
            </div>
          </div>

          <div>
            <label for="confirmPassword" class="block text-sm font-medium text-[var(--color-heading)] mb-1">Confirm Password</label>
            <div class="relative">
              <input 
                :type="showConfirmPassword ? 'text' : 'password'" 
                id="confirmPassword" 
                v-model="confirmPassword" 
                class="w-full px-3 py-2 bg-[var(--color-background-soft)] border border-[var(--color-border)] rounded-md focus:outline-none focus:ring-2 focus:ring-[var(--vt-c-divider-dark-1)]"
                placeholder="••••••••"
                required
              />
              <button 
                type="button" 
                @click="showConfirmPassword = !showConfirmPassword" 
                class="absolute right-3 top-1/2 transform -translate-y-1/2 text-[var(--color-text)]"
              >
                <svg v-if="showConfirmPassword" class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"></path>
                </svg>
                <svg v-else class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path>
                </svg>
              </button>
            </div>
          </div>
          
          <div>
            <label for="role" class="block text-sm font-medium text-[var(--color-heading)] mb-1">Role</label>
            <select 
              id="role"
              v-model="role" 
              class="w-full px-3 py-2 bg-[var(--color-background-soft)] border border-[var(--color-border)] rounded-md focus:outline-none focus:ring-2 focus:ring-[var(--vt-c-divider-dark-1)] appearance-none pr-8"
              style="background-image: url('data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' fill=\'none\' viewBox=\'0 0 24 24\' stroke=\'%23CCC\'%3E%3Cpath stroke-linecap=\'round\' stroke-linejoin=\'round\' stroke-width=\'2\' d=\'M19 9l-7 7-7-7\'%3E%3C/path%3E%3C/svg%3E'); background-repeat: no-repeat; background-size: 0.8rem; background-position: center right 0.8rem;"
            >
              <option value="member">Member</option>
              <option value="trainer">Trainer</option>
            </select>
          </div>
          
          <button 
            type="submit" 
            class="w-full bg-[var(--vt-c-divider-dark-1)] text-[var(--vt-c-white)] py-2 px-4 rounded-md hover:bg-[var(--vt-c-divider-dark-2)] focus:outline-none focus:ring-2 focus:ring-[var(--vt-c-divider-dark-1)] focus:ring-offset-2 transition-colors text-base font-medium"
            :disabled="isLoading"
          >
            <span v-if="isLoading" class="flex items-center justify-center">
              <svg class="animate-spin -ml-1 mr-2 h-4 w-4 text-[var(--vt-c-white)]" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Registering...
            </span>
            <span v-else>Register</span>
          </button>
        </form>
        
        <div class="mt-3 text-center">
          <p class="text-sm text-[var(--color-text)]">
            Already have an account? 
            <router-link to="/login" class="font-medium text-[var(--vt-c-divider-dark-1)] hover:text-[var(--vt-c-text-dark-1)]">Login</router-link>
          </p>
        </div>
      </div>
      
      <!-- Tennis court decoration at bottom -->
      <div class="h-2 bg-[var(--vt-c-divider-dark-1)] mt-2"></div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import api from '@/utils/axios';
import { AxiosError } from 'axios';

interface ErrorResponse {
  error?: string;
  message?: string;
}

const router = useRouter();
const username = ref('');
const email = ref('');
const password = ref('');
const confirmPassword = ref('');
const role = ref('member'); // Default role
const errorMessage = ref('');
const isLoading = ref(false);
const showPassword = ref(false);
const showConfirmPassword = ref(false);

const handleRegister = async () => {
  errorMessage.value = '';

  // Password validation
  if (password.value !== confirmPassword.value) {
    errorMessage.value = 'Passwords do not match';
    return;
  }

  // Password strength check
  if (password.value.length < 8) {
    errorMessage.value = 'Password must be at least 8 characters long';
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
    const axiosError = error as AxiosError<ErrorResponse>;
    console.error('Register Error:', axiosError.response?.data || axiosError.message);

    // Display appropriate backend error messages
    if (axiosError.response?.status === 400) {
      errorMessage.value = axiosError.response.data?.error || 'Invalid input';
    } else if (axiosError.response?.status === 409) {
      errorMessage.value = 'Email is already in use';
    } else {
      errorMessage.value = 'Registration failed. Please try again.';
    }
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