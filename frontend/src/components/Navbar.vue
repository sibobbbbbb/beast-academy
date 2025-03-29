<template>
  <header class="w-full py-3 px-5 md:px-8 lg:px-12 flex items-center justify-between fixed top-0 z-50" :style="{ background: 'var(--primary-blue)' }">
    <!-- Logo -->
    <div class="flex items-center">
      <a href="/" class="flex items-center" @click.prevent="goToHomeAndReload">
        <img :src="logoImage" alt="Tennis Community Logo" class="w-10 md:w-12 lg:w-15 h-auto object-contain" />
        <h1 class="text-xl md:text-2xl !font-bold !ml-2 text-white">BEAST</h1>
      </a>
    </div>
    
    <!-- Navigation Links - Hidden on mobile, compact on tablet, full on desktop -->
    <nav class="hidden md:flex items-center !space-x-4 lg:!space-x-15">
      <a 
        v-for="item in navigationItems" 
        :key="item.path"
        :href="item.path"
        class="text-white text-sm lg:text-base hover:text-[var(--primary-green)] transition-colors"
      >
        {{ item.name }}
      </a>
    </nav>
    
    <!-- Auth Buttons - Show only when NOT logged in -->
    <div v-if="!authStore.isLoggedIn" class="hidden md:flex items-center !space-x-2 lg:!space-x-4">
      <router-link to="/login" class="text-white !font-medium text-sm lg:text-base hover:text-[var(--primary-green)] transition-colors">Login</router-link>
      <router-link 
        to="/register" 
        class="bg-white text-[var(--primary-blue)] px-3 py-1.5 md:px-4 md:py-2 rounded-md hover:bg-[var(--neutral-200)] transition-colors !font-medium text-sm lg:text-base"
      >
        Register
      </router-link>
    </div>
    
    <!-- User Profile Dropdown - Show only when logged in -->
    <div v-else class="hidden md:flex items-center">
      <div class="relative profile-dropdown-container">
        <button 
          @click="toggleProfileDropdown" 
          class="flex items-center !space-x-2 text-white hover:text-[var(--primary-green)] transition-colors focus:outline-none cursor-pointer"
        >
          <div class="w-8 h-8 lg:w-9 lg:h-9 rounded-full overflow-hidden border-2 border-white">
            <img v-if="authStore.userAvatar" :src="authStore.userAvatar" alt="Profile" class="w-full h-full object-cover" />
            <div v-else class="w-full h-full flex items-center justify-center bg-[var(--primary-green)] text-white font-medium">
              {{ authStore.userInitials }}
            </div>
          </div>
          <!-- Hide username on tablet, show on desktop -->
          <span class="hidden lg:inline-block">{{ authStore.userName }}</span>
          <svg 
            class="w-4 h-4 transition-transform" 
            :class="{ 'rotate-180': profileDropdownOpen }"
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24" 
            xmlns="http://www.w3.org/2000/svg"
          >
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path>
          </svg>
        </button>
        
        <!-- Dropdown menu - supports both hover (desktop) and click (tablet) -->
        <div 
          v-show="profileDropdownOpen"
          class="absolute right-0 !mt-2 w-48 bg-white rounded-md shadow-lg overflow-hidden z-20 transition-all duration-200"
        >
          <div class="py-1">
            <router-link to="/profile" class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100" @click="profileDropdownOpen = false">My Profile</router-link>
            <router-link to="/settings" class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100" @click="profileDropdownOpen = false">Settings</router-link>
            <button @click="handleLogout" class="w-full text-left block px-4 py-2 text-sm text-red-600 hover:bg-gray-100 cursor-pointer">Sign out</button>
          </div>
        </div>
      </div>
    </div>
    
    <!-- Mobile Menu Button - Hidden on md and larger screens -->
    <button 
      @click="toggleMobileMenu" 
      class="md:hidden text-white focus:outline-none"
      aria-label="Toggle mobile menu"
    >
      <svg class="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path v-if="!mobileMenuOpen" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"></path>
        <path v-else stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
      </svg>
    </button>
  </header>
  
  <!-- Mobile Menu - Hidden on md and larger screens -->
  <div 
    v-show="mobileMenuOpen" 
    class="fixed top-[48px] left-0 right-0 md:hidden bg-[var(--primary-blue)] pb-4 px-6 z-40 shadow-lg"
  >
    <nav class="flex flex-col !space-y-2 pt-8">
      <a 
        v-for="item in navigationItems" 
        :key="item.path"
        :href="item.path"
        class="py-3 text-white hover:text-[var(--primary-green)] transition-colors !font-medium text-base border-b border-white/10"
        @click="closeMobileMenu"
      >
        {{ item.name }}
      </a>
    </nav>
    
    <div v-if="authStore.isLoggedIn" class="!mt-4 pt-4 border-t border-white/20">
      <div class="flex items-center !mb-4">
        <div class="w-10 h-10 rounded-full overflow-hidden border-2 border-white !mr-3">
          <img v-if="authStore.userAvatar" :src="authStore.userAvatar" alt="Profile" class="w-full h-full object-cover" />
          <div v-else class="w-full h-full flex items-center justify-center bg-[var(--primary-green)] text-white !font-medium">
            {{ authStore.userInitials }}
          </div>
        </div>
        <span class="text-white !font-medium">{{ authStore.userName }}</span>
      </div>
      <router-link to="/profile" class="block py-3 text-white hover:text-[var(--primary-green)] border-b border-white/10" @click="closeMobileMenu">My Profile</router-link>
      <router-link to="/settings" class="block py-3 text-white hover:text-[var(--primary-green)] border-b border-white/10" @click="closeMobileMenu">Settings</router-link>
      <button @click="handleLogout" class="w-full text-left py-3 text-white hover:text-red-300 !font-medium !mt-2">Sign out</button>
    </div>
    
    <div v-else class="!mt-4 pt-4 border-t border-white/20 flex flex-col !space-y-2">
      <router-link 
        to="/login" 
        class="py-3 text-white hover:text-[var(--primary-green)] !font-medium border-b border-white/10"
        @click="closeMobileMenu"
      >
        Login
      </router-link>
      <router-link 
        to="/register" 
        class="py-3 text-white hover:text-[var(--primary-green)] !font-medium"
        @click="closeMobileMenu"
      >
        Register
      </router-link>
    </div>
  </div>
  
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount, defineComponent } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '@/stores/auth';
import logoImage from '@/assets/beastLogo.png';

// Fix multi-word component name warning
defineComponent({
  name: 'SiteNavbar'
});

// Inisialisasi router dan auth store
const router = useRouter();
const authStore = useAuthStore();

// Menu states
const mobileMenuOpen = ref(false);
const profileDropdownOpen = ref(false);

// Toggle functions
const toggleMobileMenu = () => {
  mobileMenuOpen.value = !mobileMenuOpen.value;
  // Close profile dropdown if it's open
  if (profileDropdownOpen.value) profileDropdownOpen.value = false;
};

const toggleProfileDropdown = () => {
  profileDropdownOpen.value = !profileDropdownOpen.value;
};

const closeMobileMenu = () => {
  mobileMenuOpen.value = false;
};

// Navigation items
const navigationItems = [
  { name: 'Features', path: '/#features' },
  { name: 'About', path: '/#about' },
  { name: 'Community', path: '/#community' },
  { name: 'Events', path: '/events' },
  { name: 'Contact', path: '/#contact' },
];

// Close menus when window is resized
const handleResize = () => {
  if (window.innerWidth >= 768 && mobileMenuOpen.value) {
    mobileMenuOpen.value = false;
  }
  
  // Add click outside event listener for profile dropdown
  if (profileDropdownOpen.value) {
    window.addEventListener('click', handleClickOutside);
  } else {
    window.removeEventListener('click', handleClickOutside);
  }
};

// Handle click outside profile dropdown
const handleClickOutside = (event: MouseEvent) => {
  const target = event.target as HTMLElement;
  const dropdown = document.querySelector('.profile-dropdown-container');
  if (dropdown && !dropdown.contains(target)) {
    profileDropdownOpen.value = false;
  }
};

// Event listeners
onMounted(() => {
  window.addEventListener('resize', handleResize);
  
  // Add click outside event listener for profile dropdown
  if (profileDropdownOpen.value) {
    window.addEventListener('click', handleClickOutside);
  }
  
  // Check authentication status
  authStore.checkAuthStatus();
});

onBeforeUnmount(() => {
  window.removeEventListener('resize', handleResize);
  window.removeEventListener('click', handleClickOutside);
});

// Logout handler
const handleLogout = async () => {
  const success = await authStore.logout();
  if (success) {
    mobileMenuOpen.value = false;
    profileDropdownOpen.value = false;
    
    // Redirect ke halaman home dan reload halaman
    router.push('/').then(() => {
      window.location.reload();
    });
  }
};

// Fungsi untuk navigasi ke home dengan reload
const goToHomeAndReload = () => {
  window.location.href = '/';
};
</script>

<style scoped>
/* Optional: Add custom transition */
.dropdown-enter-active,
.dropdown-leave-active {
  transition: all 0.2s ease;
}

.dropdown-enter-from,
.dropdown-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}
</style>