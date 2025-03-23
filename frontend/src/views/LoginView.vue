<template>
  <div class="h-screen w-screen flex items-center justify-center bg-gradient-to-br from-[var(--vt-c-black-soft)] to-[var(--vt-c-black)]">
    <div class="w-full max-w-md bg-[var(--color-background)] rounded-xl shadow-xl overflow-hidden relative mx-4">
      <!-- Tennis ball decoration -->
      <div class="absolute -top-10 -right-10 w-20 h-20 rounded-full bg-[var(--vt-c-divider-dark-1)] opacity-50"></div>
      
      <!-- Header with logo -->
      <div class="pt-8 pb-6 text-center">
        <div class="inline-flex items-center justify-center mb-4">
          <div class="relative w-16 h-16 bg-[var(--vt-c-divider-dark-1)] rounded-full flex items-center justify-center">
            <div class="absolute w-16 h-16 rounded-full border-2 border-[var(--color-text)]"></div>
            <div class="absolute w-14 h-14 rounded-full border-2 border-[var(--color-text)]"></div>
            <div class="absolute w-full h-0.5 bg-[var(--color-text)]"></div>
            <div class="absolute w-0.5 h-full bg-[var(--color-text)]"></div>
          </div>
        </div>
        <h1 class="text-2xl font-bold text-[var(--color-heading)] mb-1">Tennis Community</h1>
        <p class="text-[var(--color-text)]">Sign in to your account</p>
      </div>
      
      <!-- Login Form -->
      <div class="px-8 py-6 space-y-6">
        <!-- Error Alert -->
        <div v-if="loginError" class="bg-[var(--vt-c-black-mute)] border border-[var(--vt-c-divider-dark-2)] text-[var(--vt-c-text-dark-2)] px-4 py-3 rounded-md relative mb-6">
          <div class="flex items-center justify-between">
            <p>{{ errorMessage }}</p>
            <button @click="loginError = false" class="text-[var(--vt-c-text-dark-2)] hover:text-[var(--vt-c-text-dark-1)] ml-2">
              <svg class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd" />
              </svg>
            </button>
          </div>
        </div>

        <form @submit.prevent="handleLogin" class="space-y-6 text-[var(--color-text)]">
          <div>
            <label for="email" class="block text-base font-medium text-[var(--color-heading)] mb-2">Email</label>
            <input 
              type="email" 
              id="email" 
              v-model="email" 
              class="w-full px-4 py-3 bg-[var(--color-background-soft)] border border-[var(--color-border)] rounded-md focus:outline-none focus:ring-2 focus:ring-[var(--vt-c-divider-dark-1)] text-[var(--color-text)]"
              placeholder="your@email.com"
              autocomplete="off"
              required
            />
          </div>
          
          <div>
            <div class="flex items-center justify-between mb-2">
              <label for="password" class="block text-base font-medium text-[var(--color-heading)]">Password</label>
              <a href="#" class="text-sm text-[var(--vt-c-text-dark-2)] hover:text-[var(--vt-c-text-dark-1)]">Forgot password?</a>
            </div>
            <div class="relative">
              <input 
                :type="showPassword ? 'text' : 'password'" 
                id="password" 
                v-model="password" 
                class="w-full px-4 py-3 bg-[var(--color-background-soft)] border border-[var(--color-border)] rounded-md focus:outline-none focus:ring-2 focus:ring-[var(--vt-c-divider-dark-1)] text-[var(--color-text)]"
                placeholder="••••••••"
                autocomplete="off"
                required
              />
              <button 
                type="button" 
                @click="showPassword = !showPassword" 
                class="absolute right-3 top-1/2 transform -translate-y-1/2 text-[var(--color-text)]"
              >
                <svg v-if="showPassword" class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"></path>
                </svg>
                <svg v-else class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path>
                </svg>
              </button>
            </div>
          </div>
          
          <div class="flex items-center space-x-3">
            <input type="checkbox" id="remember" class="h-5 w-5 text-[var(--vt-c-divider-dark-1)] focus:ring-[var(--vt-c-divider-dark-1)] border-[var(--color-border)] rounded" />
            <label for="remember" class="ml-2 block text-base text-[var(--color-text)] !ml-2">Remember me</label>
          </div>
          
          <button 
            type="submit" 
            class="w-full bg-[var(--vt-c-divider-dark-1)] text-[var(--vt-c-white)] py-3 px-4 rounded-md hover:bg-[var(--vt-c-divider-dark-2)] focus:outline-none focus:ring-2 focus:ring-[var(--vt-c-divider-dark-1)] focus:ring-offset-2 transition-colors text-lg font-medium flex justify-center items-center"
            :disabled="isLoading"
          >
            <svg v-if="isLoading" class="animate-spin -ml-1 mr-2 h-5 w-5 text-[var(--vt-c-white)]" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            {{ isLoading ? 'Signing in...' : 'Login' }}
          </button>
        </form>
        
        <div class="mt-6 text-center">
          <p class="text-[var(--color-text)]">
            Belum punya akun? <router-link to="/register" class="font-medium text-[var(--vt-c-divider-dark-1)] hover:text-[var(--vt-c-text-dark-1)]">Daftar</router-link>
          </p>
        </div>
        
        <div class="mt-8 space-y-6">
          <div class="relative">
            <div class="absolute inset-0 flex items-center">
              <div class="w-full border-t border-[var(--color-border)]"></div>
            </div>
            <div class="relative flex justify-center text-sm ">
              <span class="px-2 bg-[var(--color-background)] text-[var(--color-text)]">Or continue with</span>
            </div>
          </div>
          
          <div class="mt-6 grid grid-cols-2 gap-4">
            <button 
              type="button" 
              @click="signInWithFacebook"
              class="flex justify-center items-center py-3 px-4 border border-[var(--color-border)] rounded-md shadow-sm bg-[var(--color-background-soft)] text-sm font-medium text-[var(--color-text)] hover:bg-[var(--color-background-mute)]"
              :disabled="isLoading"
            >
              <svg class="h-5 w-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12.0003 2C6.47731 2 2.00031 6.477 2.00031 12C2.00031 16.991 5.65731 21.128 10.4383 21.879V14.89H7.89831V12H10.4383V9.797C10.4383 7.291 11.9323 5.907 14.2153 5.907C15.3103 5.907 16.4543 6.102 16.4543 6.102V8.562H15.1923C13.9503 8.562 13.5623 9.333 13.5623 10.124V12H16.3363L15.8933 14.89H13.5623V21.879C18.3433 21.129 22.0003 16.99 22.0003 12C22.0003 6.477 17.5233 2 12.0003 2Z" />
              </svg>
              Facebook
            </button>
            <button 
              type="button" 
              @click="signInWithGoogle"
              id="googleSignInButton"
              class="flex justify-center items-center py-3 px-4 border border-[var(--color-border)] rounded-md shadow-sm bg-[var(--color-background-soft)] text-sm font-medium text-[var(--color-text)] hover:bg-[var(--color-background-mute)]"
              :disabled="isLoading"
            >
              <svg class="h-5 w-5 mr-2" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12.545 10.239v3.821h5.445c-0.712 2.315-2.647 3.972-5.445 3.972-3.332 0-6.033-2.701-6.033-6.032s2.701-6.032 6.033-6.032c1.498 0 2.866 0.549 3.921 1.453l2.814-2.814C17.503 2.988 15.139 2 12.545 2 7.021 2 2.543 6.477 2.543 12s4.478 10 10.002 10c8.396 0 10.249-7.85 9.426-11.748l-9.426-0.013z"/>
              </svg>
              Google
            </button>
          </div>
        </div>
      </div>
      
      <!-- Tennis court decoration at bottom -->
      <div class="h-2 bg-[var(--vt-c-divider-dark-1)] mt-6"></div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import api from '@/utils/axios';
import { AxiosError } from 'axios';

// Declare global Google and Facebook SDK variables
declare global {
  interface Window {
    google?: {
      accounts: {
        id: {
          initialize: (config: any) => void;
          renderButton: (element: HTMLElement, config: any) => void;
          prompt: () => void;
        }
      }
    };
    FB?: {
      init: (config: any) => void;
      login: (callback: (response: any) => void, options: any) => void;
      getLoginStatus: (callback: (response: any) => void) => void;
      api: (endpoint: string, callback: (response: any) => void) => void;
    };
  }
}

interface ErrorResponse {
  error?: string;
  message?: string;
}

interface UserProfile {
  id: number;
  username: string;
  email: string;
  role: string;
}

const email = ref('');
const password = ref('');
const router = useRouter();
const isLoading = ref(false);
const loginError = ref(false);
const errorMessage = ref('Invalid email or password. Please try again.');
const showPassword = ref(false);

// Configure social login
onMounted(() => {
  // Debug environment variables
  console.log("VITE_GOOGLE_CLIENT_ID:", import.meta.env.VITE_GOOGLE_CLIENT_ID);
  
  // Load Google SDK
  loadGoogleScript();
  
  // Load Facebook SDK
  loadFacebookScript();
});

// Load the Google Sign-In SDK with better error handling
const loadGoogleScript = () => {
  // Check if the script is already loaded
  if (document.querySelector('script[src="https://accounts.google.com/gsi/client"]')) {
    console.log("Google SDK script already exists, initializing directly");
    initializeGoogleSignIn();
    return;
  }

  console.log("Loading Google SDK script...");
  const script = document.createElement('script');
  script.src = 'https://accounts.google.com/gsi/client';
  script.async = true;
  script.defer = true;
  script.onload = () => {
    console.log("Google SDK script loaded successfully");
    initializeGoogleSignIn();
  };
  script.onerror = (error) => {
    console.error("Error loading Google SDK script:", error);
    loginError.value = true;
    errorMessage.value = 'Failed to load Google Sign-In. Please try again later.';
  };
  document.head.appendChild(script);
};

// Initialize Google Sign-In with better error handling
const initializeGoogleSignIn = () => {
  try {
    console.log("Initializing Google Sign-In...");
    
    if (!window.google) {
      console.error("Google SDK not loaded properly - window.google is undefined");
      return;
    }
    
    if (!window.google.accounts) {
      console.error("Google accounts API not available - window.google.accounts is undefined");
      return;
    }
    
    if (!window.google.accounts.id) {
      console.error("Google ID service not available - window.google.accounts.id is undefined");
      return;
    }
    
    // Debug client ID
    const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;
    console.log("Using Google Client ID:", clientId);
    
    if (!clientId) {
      console.error("Google Client ID is missing or empty");
      return;
    }
    
    window.google.accounts.id.initialize({
      client_id: clientId,
      callback: handleGoogleSignIn,
      auto_select: false,
      cancel_on_tap_outside: true,
      context: 'signin',
      // Add error handler
      error_callback: (error: any) => {
        console.error("Google Sign-In initialization error:", error);
        loginError.value = true;
        errorMessage.value = 'An error occurred with Google Sign-In. Please try again.';
      }
    });
    
    console.log("Google Sign-In initialized successfully");
    
    // Optionally render the button directly
    // if (document.getElementById('googleSignInButton')) {
    //   window.google.accounts.id.renderButton(
    //     document.getElementById('googleSignInButton')!,
    //     { theme: 'outline', size: 'large', width: '100%' }
    //   );
    // }
  } catch (error) {
    console.error("Error in Google Sign-In initialization:", error);
    loginError.value = true;
    errorMessage.value = 'Failed to initialize Google Sign-In. Please try again later.';
  }
};

// Handle Google Sign-In response with better error handling
const handleGoogleSignIn = async (response: any) => {
  console.log("Google Sign-In response received:", response);
  isLoading.value = true;
  loginError.value = false;
  
  if (!response || !response.credential) {
    console.error("Invalid Google Sign-In response - missing credential");
    loginError.value = true;
    errorMessage.value = 'Failed to authenticate with Google. Missing credentials.';
    isLoading.value = false;
    return;
  }
  
  try {
    console.log("Sending Google token to backend...");
    const result = await api.post('/auth/google', {
      token: response.credential
    }, {
      withCredentials: true
    });
    
    console.log('Google login successful:', result.data);
    router.push('/userlisttest');
    await getUserProfile();
  } catch (error) {
    const axiosError = error as AxiosError<ErrorResponse>;
    console.error('Google login failed:', axiosError);
    loginError.value = true;
    
    if (axiosError.response?.data?.error) {
      errorMessage.value = axiosError.response.data.error;
    } else if (axiosError.message) {
      errorMessage.value = `Google login failed: ${axiosError.message}`;
    } else {
      errorMessage.value = 'Google login failed. Please try again.';
    }
  } finally {
    isLoading.value = false;
  }
};

// Handle Google Sign-In button click with better fallback
// Replace your signInWithGoogle function with this:
const signInWithGoogle = () => {
  console.log("Google Sign-In button clicked");
  loginError.value = false;
  
  // Use the redirect approach directly instead of One Tap
  const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;
  const redirectUri = `${window.location.origin}/auth/google/callback`;
  const scope = "email profile";
  
  const authUrl = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${clientId}&redirect_uri=${encodeURIComponent(redirectUri)}&response_type=code&scope=${encodeURIComponent(scope)}&access_type=offline&prompt=consent`;
  
  console.log("Redirecting to Google OAuth URL:", authUrl);
  window.location.href = authUrl;
};


// Rest of your code remains the same...
// Facebook login, regular login, etc.

// Load the Facebook SDK
const loadFacebookScript = () => {
  const script = document.createElement('script');
  script.src = 'https://connect.facebook.net/en_US/sdk.js';
  script.async = true;
  script.defer = true;
  script.onload = initializeFacebookSDK;
  document.head.appendChild(script);
};

// Initialize Facebook SDK
const initializeFacebookSDK = () => {
  if (window.FB) {
    window.FB.init({
      appId: import.meta.env.VITE_FACEBOOK_APP_ID,
      cookie: true,
      xfbml: true,
      version: 'v16.0' // Use the latest version
    });
  }
};

// Handle Facebook Sign-In
const signInWithFacebook = () => {
  if (!window.FB) {
    console.error('Facebook SDK is not initialized yet');
    errorMessage.value = 'Facebook login is not available. Please try again later.';
    loginError.value = true;
    return;
  }
  
  isLoading.value = true;
  
  window.FB.login(async (response) => {
    if (response.authResponse) {
      try {
        const result = await api.post('/auth/facebook', {
          accessToken: response.authResponse.accessToken
        }, {
          withCredentials: true
        });
        
        console.log('Facebook login successful:', result.data);
        router.push('/userlisttest');
        await getUserProfile();
      } catch (error) {
        const axiosError = error as AxiosError<ErrorResponse>;
        console.error('Facebook login failed:', axiosError);
        loginError.value = true;
        errorMessage.value = axiosError.response?.data?.error || 'Facebook login failed. Please try again.';
      }
    } else {
      console.log('User cancelled Facebook login or did not fully authorize.');
      loginError.value = true;
      errorMessage.value = 'Facebook login was cancelled or failed. Please try again.';
    }
    isLoading.value = false;
  }, { scope: 'email,public_profile' });
};

// Regular email/password login
const handleLogin = async () => {
  loginError.value = false;
  isLoading.value = true;
  
  try {
    // The backend sets httpOnly cookie automatically
    const response = await api.post('/auth/login', { 
      email: email.value, 
      password: password.value 
    }, {
      withCredentials: true // Important for cookies to be sent/received
    });
    
    console.log('Login successful:', response.data);
    
    // No need to store token in localStorage since it's in httpOnly cookie
    // Instead, just redirect to the dashboard
    router.push('/userlisttest');
    
    // For testing: Get the user profile which includes role
    await getUserProfile();
  } catch (error) {
    const axiosError = error as AxiosError<ErrorResponse>;
    console.error('Login failed', axiosError);
    loginError.value = true;
    
    // Set specific error message based on error response in English
    if (axiosError.response) {
      if (axiosError.response.status === 401) {
        errorMessage.value = 'The email or password you entered is incorrect.';
      } else if (axiosError.response.status === 404) {
        errorMessage.value = 'Account not found. Please register first.';
      } else if (axiosError.response.status === 429) {
        errorMessage.value = 'Too many attempts. Please try again later.';
      } else if (axiosError.response.data?.error) {
        errorMessage.value = axiosError.response.data.error;
      } else if (axiosError.response.data?.message) {
        errorMessage.value = axiosError.response.data.message;
      } else {
        errorMessage.value = 'An error occurred. Please try again.';
      }
    } else if (axiosError.request) {
      errorMessage.value = 'Unable to connect to the server. Please check your connection.';
    } else {
      errorMessage.value = 'An error occurred. Please try again.';
    }
  } finally {
    isLoading.value = false;
  }
};

const getUserProfile = async (): Promise<UserProfile | null> => {
  try {
    const response = await api.get<UserProfile>('/auth/me', {
      withCredentials: true // Important for sending the cookie
    });
    
    // Specifically log the role for testing
    console.log('User role:', response.data.role);
    
    return response.data;
  } catch (error) {
    const axiosError = error as AxiosError;
    console.error('Failed to get user profile:', axiosError);
    return null;
  }
};
</script>

<style scoped>
/* You may need to add these styles if the spacing still isn't working properly */
.space-y-6 > :not([hidden]) ~ :not([hidden]) {
  --tw-space-y-reverse: 0;
  margin-top: calc(1.5rem * calc(1 - var(--tw-space-y-reverse)));
  margin-bottom: calc(1.5rem * var(--tw-space-y-reverse));
}
</style>