<template>
  <div
    class="min-h-full flex flex-col items-center justify-center py-12 px-4 sm:px-6 lg:px-8 w-full"
    style="background: var(--color-background-mute);"
  >
    <div class="w-full pb-3 sm:mx-auto sm:max-w-md">
      <h2 class="mt-6 text-center text-3xl font-extrabold" style="color: var(--color-heading);">
        Add New Member
      </h2>
    </div>

    <div class="mt-8 w-full sm:mx-auto sm:max-w-md">
      <div class="py-8 px-4 shadow sm:rounded-lg sm:px-10 border" 
           style="background: var(--color-background); border-color: var(--color-border);">
        
        <!-- Image Preview -->
        <div v-if="imagePreviewUrl" class="mb-4 flex justify-center">
          <img 
            :src="imagePreviewUrl" 
            alt="Profile Preview" 
            class="w-32 h-32 rounded-full object-cover"
          />
        </div>

        <form class="space-y-6" @submit.prevent="submitForm">
          <!-- Image Upload -->
          <div class="pb-2">
            <label class="block text-sm font-medium" style="color: var(--color-text);">
              Profile Image
            </label>
            <div class="mt-1 flex items-center">
              <input
                id="img_upload"
                type="file" 
                accept="image/*"
                @change="handleImageUpload"
                class="hidden"
                ref="imageUploadRef"
              />
              <button 
                type="button" 
                @click="triggerFileInput"
                class="w-full py-2 px-4 border rounded-md shadow-sm text-sm font-medium focus:outline-none"
                style="background-color: var(--color-background-soft); border-color: var(--color-border);"
              >
                {{ imagePreviewUrl ? 'Change Image' : 'Upload Image' }}
              </button>
            </div>
            <p v-if="errors.img_file" class="mt-2 text-sm text-red-500">
              {{ errors.img_file }}
            </p>
          </div>

          <!-- Name Input -->
          <div class="pb-2">
            <label for="name" class="block text-sm font-medium" style="color: var(--color-text);">
              Name
            </label>
            <div class="mt-1">
              <input
                id="name"
                v-model="form.name"
                name="name"
                type="text"
                autocomplete="name"
                class="appearance-none block w-full px-3 py-2 border rounded-md shadow-sm placeholder-gray-400 focus:outline-none sm:text-sm"
                :class="{ 'border-red-500': errors.name }"
                style="border-color: var(--color-border); color: var(--color-text); background: var(--color-background-soft);"
              />
            </div>
            <p v-if="errors.name" class="mt-2 text-sm text-red-500">
              {{ errors.name }}
            </p>
          </div>

          <!-- Email Input -->
          <div class="pb-2">
            <label for="email" class="block text-sm font-medium" style="color: var(--color-text);">
              Email
            </label>
            <div class="mt-1">
              <input
                id="email"
                v-model="form.email"
                name="email"
                type="email"
                autocomplete="email"
                class="appearance-none block w-full px-3 py-2 border rounded-md shadow-sm placeholder-gray-400 focus:outline-none sm:text-sm"
                :class="{ 'border-red-500': errors.email }"
                style="border-color: var(--color-border); color: var(--color-text); background: var(--color-background-soft);"
              />
            </div>
            <p v-if="errors.email" class="mt-2 text-sm text-red-500">
              {{ errors.email }}
            </p>
          </div>

          <!-- Phone Input -->
          <div class="pb-2">
            <label for="phone" class="block text-sm font-medium" style="color: var(--color-text);">
              Phone Number <span class="text-xs opacity-70">(Optional)</span>
            </label>
            <div class="mt-1">
              <input
                id="phone"
                v-model="form.phone"
                name="phone"
                type="tel"
                autocomplete="tel"
                class="appearance-none block w-full px-3 py-2 border rounded-md shadow-sm placeholder-gray-400 focus:outline-none sm:text-sm"
                :class="{ 'border-red-500': errors.phone }"
                style="border-color: var(--color-border); color: var(--color-text); background: var(--color-background-soft);"
                placeholder="Optional"
              />
            </div>
            <p v-if="errors.phone" class="mt-2 text-sm text-red-500">
              {{ errors.phone }}
            </p>
          </div>

          <!-- API Error message -->
          <div v-if="apiError" class="rounded-md p-4" style="background: var(--color-background-soft);">
            <div class="flex">
              <div class="flex-shrink-0">
                <svg
                  class="h-5 w-5 text-red-500"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fill-rule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                    clip-rule="evenodd"
                  />
                </svg>
              </div>
              <div class="ml-3">
                <p class="text-sm font-medium" style="color: var(--color-text);">
                  {{ apiError }}
                </p>
              </div>
            </div>
          </div>

          <!-- Submit button -->
          <div>
            <button
              type="submit"
              class="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white focus:outline-none focus:ring-2 focus:ring-offset-2"
              :disabled="isSubmitting"
              style="background-color: #42b883; border-color: #42b883;"
            >
              <svg
                v-if="isSubmitting"
                class="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  class="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  stroke-width="4"
                ></circle>
                <path
                  class="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
              {{ isSubmitting ? 'Adding...' : 'Add Member' }}
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, reactive, ref } from 'vue'
import { addNewMember } from '@/services/memberServices'
import type { FormDataMember, FormErrors } from '@/types/MemberForm'

export default defineComponent({
  name: 'AddMemberForm',
  setup() {
    // Form data reactive object
    const form = reactive<FormDataMember>({
      name: '',
      img_file: null as File | null,
      email: '',
      phone: '',
    })

    // Refs for form state and validation
    const errors = reactive<FormErrors>({})
    const apiError = ref<string | null>(null)
    const isSubmitting = ref(false)
    const formSubmitted = ref(false)
    const imageUploadRef = ref<HTMLInputElement | null>(null)
    const imagePreviewUrl = ref<string | null>(null)

    // Trigger file input click
    const triggerFileInput = () => {
      imageUploadRef.value?.click()
    }

    // Handle image upload
    const handleImageUpload = (event: Event) => {
      const target = event.target as HTMLInputElement
      const file = target.files?.[0]

      if (file) {
        // Validate file type and size
        const validTypes = ['image/jpeg', 'image/png', 'image/gif']
        const maxSize = 5 * 1024 * 1024 // 5MB

        if (!validTypes.includes(file.type)) {
          errors.img_file = 'Invalid file type. Please upload JPEG, PNG, or GIF.'
          return
        }

        if (file.size > maxSize) {
          errors.img_file = 'File size exceeds 5MB limit.'
          return
        }

        // Clear previous errors
        delete errors.img_file

        // Set file and create preview
        form.img_file = file
        imagePreviewUrl.value = URL.createObjectURL(file)
      }
    }

    // Form validation
    const validateForm = (): boolean => {
      // Clear previous errors
      Object.keys(errors).forEach((key) => delete errors[key as keyof FormErrors])
      apiError.value = null
      let isValid = true

      // Name validation
      if (!form.name) {
        errors.name = 'Name is required'
        isValid = false
      }

      // Email validation
      if (!form.email) {
        errors.email = 'Email is required'
        isValid = false
      } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
        errors.email = 'Please enter a valid email address'
        isValid = false
      }

      // Image validation
      if (!form.img_file) {
        errors.img_file = 'Profile image is required'
        isValid = false
      }

      // Phone validation (optional)
      if (form.phone && !/^\d{10,15}$/.test(form.phone.replace(/\s+/g, ''))) {
        errors.phone = 'Please enter a valid phone number'
        isValid = false
      }

      return isValid
    }

    // Form submission
    const submitForm = async () => {
      // Validate form
      if (!validateForm()) return

      // Set submitting state
      isSubmitting.value = true

      try {
        // Call service to add member
        await addNewMember(form, errors, apiError, isSubmitting, formSubmitted)
      } catch (error) {
        console.error('Member addition failed', error)
        apiError.value = 'Failed to add member. Please try again.'
      } finally {
        isSubmitting.value = false
      }
    }

    return {
      form,
      errors,
      apiError,
      isSubmitting,
      formSubmitted,
      imageUploadRef,
      imagePreviewUrl,
      triggerFileInput,
      submitForm,
      handleImageUpload
    }
  },
})
</script>

<style scoped>
input:focus {
  border-color: #42b883 !important;
  box-shadow: 0 0 0 1px #42b883 !important;
}

button:hover {
  background-color: #33a06f !important;
}
</style>