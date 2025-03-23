<template>
    <div class="bg-amber-50 container mx-auto p-4 min-w-screen min-h-screen">
      <div v-if="loading" class="flex justify-center items-center h-64">
        <div class="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
      
      <div v-else-if="error" class="bg-rose-50 text-rose-700 p-4 rounded-lg">
        {{ error }}
      </div>
      
      <div v-else-if="member" class="bg-white rounded-lg shadow-lg overflow-hidden">
        <!-- Profile Header -->
        <div class="bg-gradient-to-r from-primary/80 to-primary p-6 text-white">
          <h1 class="text-2xl font-bold">Member Profile</h1>
        </div>
        
        <!-- Profile Content -->
        <div class="p-6">
          <div class="flex flex-col md:flex-row gap-6">
            <!-- Profile Image -->
            <div class="flex-shrink-0">
              <div class="w-32 h-32 rounded-full overflow-hidden bg-gray-200 border-4 border-white shadow-md">
                <img 
                  v-if="member.img_url" 
                  :src="member.img_url" 
                  :alt="member.name" 
                  class="w-full h-full object-cover"
                />
                <user-icon 
                  v-else 
                  class="w-full h-full p-6 text-gray-400"
                />
              </div>
            </div>
            
            <!-- Basic Information -->
            <div class="flex-grow space-y-4">
              <div>
                <h2 class="text-2xl font-bold text-gray-800">{{ member.name }}</h2>
                <p class="text-sm text-gray-500">
                  Member since {{ formatDate(member.created_at) }}
                </p>
                <p class="text-sm text-gray-500">
                  Last active: {{ formatDateTime(member.last_activity) }}
                </p>
              </div>
              
              <!-- Contact Information -->
              <div class="space-y-2">
                <div class="flex items-center gap-2">
                  <mail-icon class="h-4 w-4 text-gray-500" />
                  <a :href="`mailto:${member.email}`" class="text-primary hover:underline">
                    {{ member.email }}
                  </a>
                </div>
                
                <div v-if="member.phone_no" class="flex items-center gap-2">
                  <phone-icon class="h-4 w-4 text-gray-500" />
                  <a :href="`tel:${member.phone_no}`" class="text-gray-700 hover:text-primary">
                    {{ formatPhoneNumber(member.phone_no) }}
                  </a>
                </div>
              </div>
            </div>
          </div>
          
          <!-- Stats Section -->
          <div class="mt-8">
            <h3 class="text-lg font-semibold text-gray-800 mb-4">Member Statistics</h3>
            
            <div class="space-y-4">
              <div v-for="(value, index) in [member.stat1, member.stat2, member.stat3, member.stat4, member.stat5]" 
                   :key="index"
                   v-if="value !== null">
                <div class="flex justify-between mb-1">
                  <span class="text-sm font-medium text-gray-700">Stat {{ index + 1 }}</span>
                  <span class="text-sm font-medium text-gray-700">{{ value }}/100</span>
                </div>
                <div class="w-full bg-gray-200 rounded-full h-2.5">
                  <div class="bg-primary h-2.5 rounded-full" :style="{ width: `${value}%` }"></div>
                </div>
              </div>
              
              <div v-if="!hasAnyStats" class="text-gray-500 italic text-sm">
                No statistics available for this member.
              </div>
            </div>
          </div>
          
          <!-- Actions -->
          <div class="mt-8 flex flex-wrap gap-3">
            <button class="px-4 py-2 bg-primary text-white rounded hover:bg-primary/90 transition-colors flex items-center gap-2">
              <pencil-icon class="h-4 w-4" />
              Edit Profile
            </button>
            
            <button class="px-4 py-2 border border-gray-300 text-gray-700 rounded hover:bg-gray-50 transition-colors flex items-center gap-2">
              <refresh-cw-icon class="h-4 w-4" />
              Update Activity
            </button>
          </div>
        </div>
      </div>
      
      <div v-else class="bg-amber-50 text-amber-700 p-4 rounded-lg">
        No member data found. Please log in to view your profile.
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref, computed, onMounted } from 'vue';
  import { UserIcon, MailIcon, PhoneIcon, PencilIcon, RefreshCwIcon } from 'lucide-vue-next';
  
  // In a real application, this would come from your authentication/API service
  const member = ref(null);
  const loading = ref(true);
  const error = ref(null);
  
  // Sample data that matches your database schema exactly
  // In a real app, you would fetch this from your API
  const fetchMemberData = async () => {
    try {
      // Simulating API call
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // Sample data matching your database schema
      member.value = {
        id: 1,
        name: 'Jane Smith',
        img_url: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60',
        phone_no: '5551234567',
        email: 'jane.smith@example.com',
        created_at: '2023-05-15T10:30:00',
        last_activity: '2025-03-21T14:45:00',
        stat1: 85,
        stat2: 70,
        stat3: 92,
        stat4: null,
        stat5: 60
      };
    } catch (err) {
      error.value = 'Failed to load member data. Please try again later.';
      console.error('Error fetching member data:', err);
    } finally {
      loading.value = false;
    }
  };
  
  // Check if the member has any stats
  const hasAnyStats = computed(() => {
    return member.value && (
      member.value.stat1 !== null || 
      member.value.stat2 !== null || 
      member.value.stat3 !== null || 
      member.value.stat4 !== null || 
      member.value.stat5 !== null
    );
  });
  
  // Format date to a more readable format
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };
  
  // Format date and time
  const formatDateTime = (dateTimeString) => {
    if (!dateTimeString) return 'N/A';
    const options = { 
      month: 'short', 
      day: 'numeric', 
      year: 'numeric',
      hour: '2-digit', 
      minute: '2-digit'
    };
    return new Date(dateTimeString).toLocaleString(undefined, options);
  };
  
  // Format phone number to be more readable
  const formatPhoneNumber = (phoneNumber) => {
    if (!phoneNumber) return '';
    
    // Format as (XXX) XXX-XXXX if 10 digits
    if (phoneNumber.length === 10) {
      return `(${phoneNumber.substring(0, 3)}) ${phoneNumber.substring(3, 6)}-${phoneNumber.substring(6)}`;
    }
    
    // Otherwise return as is
    return phoneNumber;
  };
  
  // Fetch data when component mounts
  onMounted(() => {
    fetchMemberData();
  });
  </script>
  
  <style>
  :root {
    --color-primary: #4f46e5;
    --color-primary-hover: #4338ca;
  }
  
  .bg-primary {
    background-color: var(--color-primary);
  }
  
  .from-primary\/80 {
    --tw-gradient-from: rgba(79, 70, 229, 0.8);
    --tw-gradient-to: rgba(79, 70, 229, 0);
    --tw-gradient-stops: var(--tw-gradient-from), var(--tw-gradient-to);
  }
  
  .to-primary {
    --tw-gradient-to: rgba(79, 70, 229, 1);
  }
  
  .text-primary {
    color: var(--color-primary);
  }
  
  .hover\:bg-primary\/90:hover {
    background-color: var(--color-primary-hover);
  }
  
  .border-primary {
    border-color: var(--color-primary);
  }
  </style>