<script setup lang="ts">
import { ref, computed } from 'vue';
import { formatDistanceToNow } from 'date-fns';
import type { EventData } from '@/services/eventServices';

const props = defineProps({
  event: {
    type: Object as () => EventData,
    required: true
  }
});

const emit = defineEmits(['edit', 'delete']);

// Format the posted date
const formattedDate = computed(() => {
  try {
    return formatDistanceToNow(new Date(props.event.posted_at), { addSuffix: true });
  } catch (error) {
    return props.event.posted_at || 'Unknown date';
  }
});

// Handle edit button click
function handleEdit() {
  emit('edit', props.event);
}

// Handle delete button click
function handleDelete() {
  emit('delete', props.event);
}

// Toggle dropdown menu
const showDropdown = ref(false);
function toggleDropdown() {
  showDropdown.value = !showDropdown.value;
}

// Close dropdown when clicking outside
function closeDropdown(event: MouseEvent) {
  const target = event.target as Element;
  if (target && !target.closest('.dropdown-container')) {
    showDropdown.value = false;
  }
}

// Register click outside listener
if (typeof window !== 'undefined') {
  window.addEventListener('click', closeDropdown);
}
</script>

<template>
  <div class="bg-white rounded-lg shadow-md overflow-hidden border border-gray-200">
    <!-- Card header -->
    <div class="p-4 flex items-center justify-between">
      <div class="flex items-center">
        <div class="h-10 w-10 rounded-full bg-gray-300 flex items-center justify-center text-gray-600 font-bold">
          {{ event.title.charAt(0) }}
        </div>
        <div class="ml-3">
          <h3 class="font-semibold">{{ event.title }}</h3>
          <p class="text-xs text-gray-500">{{ formattedDate }}</p>
        </div>
      </div>
      
      <!-- Dropdown menu -->
      <div class="dropdown-container relative">
        <button @click.stop="toggleDropdown" class="p-2 rounded-full hover:bg-gray-100">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-gray-500" viewBox="0 0 20 20" fill="currentColor">
            <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
          </svg>
        </button>
        
        <div v-if="showDropdown" class="absolute right-0 mt-1 w-48 bg-white rounded-md shadow-lg z-10 border border-gray-200">
          <div class="py-1">
            <button @click="handleEdit" class="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
              Edit
            </button>
            <button @click="handleDelete" class="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100">
              Delete
            </button>
          </div>
        </div>
      </div>
    </div>
    
    <!-- Event description -->
    <div class="px-4 pb-2">
      <p class="text-gray-800">{{ event.description }}</p>
    </div>
    
    <!-- Event image -->
    <div v-if="event.images" class="w-full">
      <img :src="event.images" :alt="event.title" class="w-full object-cover max-h-96" />
    </div>
    
    <!-- Action buttons -->
    <div class="px-4 py-3 border-t border-gray-200 flex space-x-4">
      <button class="flex items-center text-gray-600 hover:text-blue-500">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
          <path d="M2 10.5a1.5 1.5 0 113 0v6a1.5 1.5 0 01-3 0v-6zM6 10.333v5.43a2 2 0 001.106 1.79l.05.025A4 4 0 008.943 18h5.416a2 2 0 001.962-1.608l1.2-6A2 2 0 0015.56 8H12V4a2 2 0 00-2-2 1 1 0 00-1 1v.667a4 4 0 01-.8 2.4L6.8 7.933a4 4 0 00-.8 2.4z" />
        </svg>
        Like
      </button>
      
      <button class="flex items-center text-gray-600 hover:text-blue-500">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
          <path fill-rule="evenodd" d="M18 5v8a2 2 0 01-2 2h-5l-5 4v-4H4a2 2 0 01-2-2V5a2 2 0 012-2h12a2 2 0 012 2zM7 8H5v2h2V8zm2 0h2v2H9V8zm6 0h-2v2h2V8z" clip-rule="evenodd" />
        </svg>
        Comment
      </button>
      
      <button class="flex items-center text-gray-600 hover:text-blue-500">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
          <path d="M15 8a3 3 0 10-2.977-2.63l-4.94 2.47a3 3 0 100 4.319l4.94 2.47a3 3 0 10.895-1.789l-4.94-2.47a3.027 3.027 0 000-.74l4.94-2.47C13.456 7.68 14.19 8 15 8z" />
        </svg>
        Share
      </button>
    </div>
  </div>
</template>