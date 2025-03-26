<script setup lang="ts">
import { ref, onMounted } from 'vue';
import type { EventData } from '@/services/eventServices';

const props = defineProps({
  event: {
    type: Object as () => EventData,
    required: true
  },
  title: {
    type: String,
    default: 'Event Form'
  }
});

const emit = defineEmits(['save', 'cancel']);

// Form data
const formData = ref<EventData>({
  id: '',
  title: '',
  images: '',
  description: '',
  posted_at: ''
});

// Form validation
const errors = ref({
  title: '',
  description: ''
});

// Initialize form with event data
onMounted(() => {
  if (props.event) {
    formData.value = { ...props.event };
  }
});

// Validate form
function validateForm() {
  let isValid = true;
  errors.value = {
    title: '',
    description: ''
  };
  
  if (!formData.value.title.trim()) {
    errors.value.title = 'Title is required';
    isValid = false;
  }
  
  if (!formData.value.description.trim()) {
    errors.value.description = 'Description is required';
    isValid = false;
  }
  
  return isValid;
}

// Handle form submission
function handleSubmit() {
  if (validateForm()) {
    emit('save', { ...formData.value });
  }
}

// Handle cancel
function handleCancel() {
  emit('cancel');
}

// Handle image preview
function handleImageChange(event: Event) {
  const target = event.target as HTMLInputElement;
  if (target && target.files && target.files[0]) {
    const file = target.files[0];
    if (file) {
      // In a real app, you would upload this file to a server
      // For now, we'll just create a local URL for preview
      formData.value.images = URL.createObjectURL(file);
    }
  }
}
</script>

<template>
  <div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
    <div class="bg-white rounded-lg shadow-xl w-full max-w-md">
      <div class="p-6">
        <h2 class="text-xl font-bold mb-4">{{ title }}</h2>
        
        <form @submit.prevent="handleSubmit">
          <!-- Title input -->
          <div class="mb-4">
            <label for="title" class="block text-sm font-medium text-gray-700 mb-1">Title</label>
            <input
              id="title"
              v-model="formData.title"
              type="text"
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Event title"
            />
            <p v-if="errors.title" class="mt-1 text-sm text-red-600">{{ errors.title }}</p>
          </div>
          
          <!-- Description input -->
          <div class="mb-4">
            <label for="description" class="block text-sm font-medium text-gray-700 mb-1">Description</label>
            <textarea
              id="description"
              v-model="formData.description"
              rows="4"
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Event description"
            ></textarea>
            <p v-if="errors.description" class="mt-1 text-sm text-red-600">{{ errors.description }}</p>
          </div>
          
          <!-- Image input -->
          <div class="mb-6">
            <label for="image" class="block text-sm font-medium text-gray-700 mb-1">Image</label>
            <input
              id="image"
              type="file"
              accept="image/*"
              @change="handleImageChange"
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            
            <!-- Image preview -->
            <div v-if="formData.images" class="mt-2">
              <img :src="formData.images" alt="Preview" class="h-40 object-cover rounded-md" />
            </div>
            
            <!-- Image URL input -->
            <div class="mt-2">
              <label for="imageUrl" class="block text-sm font-medium text-gray-700 mb-1">Or enter image URL</label>
              <input
                id="imageUrl"
                v-model="formData.images"
                type="text"
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="https://example.com/image.jpg"
              />
            </div>
          </div>
          
          <!-- Form actions -->
          <div class="flex justify-end space-x-3">
            <button
              type="button"
              @click="handleCancel"
              class="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              class="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>