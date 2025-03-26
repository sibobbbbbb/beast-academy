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
  <div class="fixed inset-0 bg-[#0099cc] bg-opacity-50 flex items-center justify-center z-50 p-4">
    <div class="bg-white rounded-lg shadow-xl w-full max-w-md">
      <div class="p-6">
        <h2 class="text-xl font-bold mb-6 text-[#0099cc]">{{ title }}</h2>
        
        <form @submit.prevent="handleSubmit">
          <!-- Title input -->
          <div class="mb-5">
            <label for="title" class="block text-sm font-medium text-gray-700 mb-1">Title</label>
            <input
              id="title"
              v-model="formData.title"
              type="text"
              class="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0099cc] focus:border-transparent"
              placeholder="Event title"
            />
            <p v-if="errors.title" class="mt-1 text-sm text-red-600">{{ errors.title }}</p>
          </div>
          
          <!-- Description input -->
          <div class="mb-5">
            <label for="description" class="block text-sm font-medium text-gray-700 mb-1">Description</label>
            <textarea
              id="description"
              v-model="formData.description"
              rows="4"
              class="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0099cc] focus:border-transparent"
              placeholder="Event description"
            ></textarea>
            <p v-if="errors.description" class="mt-1 text-sm text-red-600">{{ errors.description }}</p>
          </div>
          
          <!-- Image input -->
          <div class="mb-6">
            <label for="image" class="block text-sm font-medium text-gray-700 mb-1">Image</label>
            <div class="border border-gray-300 border-dashed rounded-lg p-4 bg-gray-50">
              <input
                id="image"
                type="file"
                accept="image/*"
                @change="handleImageChange"
                class="w-full"
              />
              
              <!-- Image preview -->
              <div v-if="formData.images" class="mt-3">
                <img :src="formData.images" alt="Preview" class="h-40 object-cover rounded-md mx-auto" />
              </div>
            </div>
            
            <!-- Image URL input -->
            <div class="mt-3">
              <label for="imageUrl" class="block text-sm font-medium text-gray-700 mb-1">Or enter image URL</label>
              <input
                id="imageUrl"
                v-model="formData.images"
                type="text"
                class="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0099cc] focus:border-transparent"
                placeholder="https://example.com/image.jpg"
              />
            </div>
          </div>
          
          <!-- Form actions -->
          <div class="flex justify-end space-x-3">
            <button
              type="button"
              @click="handleCancel"
              class="px-5 py-2.5 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 font-medium transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              class="px-5 py-2.5 bg-[#0099cc] text-white rounded-lg hover:bg-[#007aa3] focus:outline-none focus:ring-2 focus:ring-[#0099cc] focus:ring-offset-2 font-medium transition-colors"
            >
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>