<script setup lang="ts">
defineProps({
  title: {
    type: String,
    default: 'Confirm'
  },
  message: {
    type: String,
    required: true
  },
  confirmText: {
    type: String,
    default: 'Confirm'
  },
  cancelText: {
    type: String,
    default: 'Cancel'
  }
});

const emit = defineEmits(['confirm', 'cancel']);

function handleConfirm() {
  emit('confirm');
}

function handleCancel() {
  emit('cancel');
}
</script>

<template>
  <div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
    <div class="bg-white rounded-lg shadow-xl w-full max-w-md">
      <div class="p-6">
        <div class="flex items-center !mb-4">
          <div class="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center !mr-3">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <h2 class="text-xl font-bold text-gray-800">{{ title }}</h2>
        </div>
        
        <p class="text-gray-600 !mb-6 pl-13">{{ message }}</p>
        
        <div class="flex justify-end !space-x-3">
          <button
            @click="handleCancel"
            class="px-5 py-2.5 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 font-medium transition-colors cursor-pointer focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
          >
            {{ cancelText }}
          </button>
          <button
            @click="handleConfirm"
            class="px-5 py-2.5 bg-red-600 text-white rounded-lg hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 font-medium transition-colors cursor-pointer"
          >
            {{ confirmText }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>