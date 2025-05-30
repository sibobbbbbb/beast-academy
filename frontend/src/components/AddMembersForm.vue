<template>
  <!-- Form add member baru -->
  <div v-if="!formSubmitted || !defaultPassword" class="w-full">
    <!-- Header section -->
    <div class="text-center mb-6">
  
      <h2 class="text-2xl font-bold mb-1" style="color: var(--primary-blue);">Add New Member</h2>
      <p class="text-sm" style="color: var(--neutral-700);">Create a new account for member or trainer</p>
    </div>

    <!-- Form container -->
    <div class="bg-white shadow-lg rounded-xl overflow-hidden">
      <div class="p-6">
        <!-- Image Preview Section -->
        <div v-if="imagePreviewUrl" class="mb-4 flex justify-center">
          <div class="relative">
            <img 
              :src="imagePreviewUrl" 
              alt="Profile Preview" 
              class="w-20 h-20 rounded-full object-cover border-2 shadow-md"
              style="border-color: var(--primary-blue);"
            />
            <button 
              @click="removeImage"
              class="absolute -top-1 -right-1 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs hover:opacity-80 transition-all shadow-sm"
              style="background-color: var(--primary-green);"
            >
              ×
            </button>
          </div>
        </div>

        <form class="space-y-4" @submit.prevent="submitForm">
          <!-- Image Upload -->
          <div>
            <label class="block text-sm font-medium mb-1" style="color: var(--neutral-800);">Profile Image *</label>
            <input id="img_upload" type="file" accept="image/*" @change="handleImageUpload" class="hidden" ref="imageUploadRef" />
            <button 
              type="button" 
              @click="triggerFileInput"
              class="w-full py-2 px-3 border border-dashed rounded-lg focus:outline-none focus:ring-1 transition-all text-sm"
              style="border-color: var(--primary-blue); background-color: var(--neutral-200);"
            >
              <div class="flex items-center justify-center space-x-2">
                <svg class="w-5 h-5" style="color: var(--primary-blue);" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <span style="color: var(--neutral-800);">{{ imagePreviewUrl ? 'Change Image' : 'Upload Image' }}</span>
              </div>
            </button>
            <p v-if="errors.img_file" class="mt-1 text-xs" style="color: var(--primary-green);">{{ errors.img_file }}</p>
          </div>

          <!-- Username Input -->
          <div>
            <label for="username" class="block text-sm font-medium mb-1" style="color: var(--neutral-800);">Username *</label>
            <input
              id="username"
              v-model="form.username"
              type="text"
              class="block w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-1 transition-all"
              style="border-color: var(--neutral-400); background-color: var(--neutral-200); color: var(--neutral-800);"
              :class="{ 'border-red-400': errors.username }"
              placeholder="Enter username"
            />
            <p v-if="errors.username" class="mt-1 text-xs" style="color: var(--primary-green);">{{ errors.username }}</p>
          </div>
          
          <!-- Name Input -->
          <div>
            <label for="name" class="block text-sm font-medium mb-1" style="color: var(--neutral-800);">Full Name *</label>
            <input
              id="name"
              v-model="form.name"
              type="text"
              class="block w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-1 transition-all"
              style="border-color: var(--neutral-400); background-color: var(--neutral-200); color: var(--neutral-800);"
              :class="{ 'border-red-400': errors.name }"
              placeholder="Enter full name"
            />
            <p v-if="errors.name" class="mt-1 text-xs" style="color: var(--primary-green);">{{ errors.name }}</p>
          </div>

          <!-- Email Input -->
          <div>
            <label for="email" class="block text-sm font-medium mb-1" style="color: var(--neutral-800);">Email Address *</label>
            <input
              id="email"
              v-model="form.email"
              type="email"
              class="block w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-1 transition-all"
              style="border-color: var(--neutral-400); background-color: var(--neutral-200); color: var(--neutral-800);"
              :class="{ 'border-red-400': errors.email }"
              placeholder="Enter email address"
            />
            <p v-if="errors.email" class="mt-1 text-xs" style="color: var(--primary-green);">{{ errors.email }}</p>
          </div>

          <!-- Role and Phone in one row -->
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <!-- Role Input -->
            <div>
              <label for="role" class="block text-sm font-medium mb-1" style="color: var(--neutral-800);">Role *</label>
              <select
                id="role"
                v-model="form.role"
                class="block w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-1 transition-all appearance-none"
                style="border-color: var(--neutral-400); background-color: var(--neutral-200); color: var(--neutral-800);"
              >
                <option value="member">Member</option>
                <option value="trainer">Trainer</option>
              </select>
            </div>

            <!-- Phone Input -->
            <div>
              <label for="phone" class="block text-sm font-medium mb-1" style="color: var(--neutral-800);">Phone <span class="text-xs" style="color: var(--neutral-600);">(Optional)</span></label>
              <input
                id="phone"
                v-model="form.phone"
                type="tel"
                class="block w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-1 transition-all"
                style="border-color: var(--neutral-400); background-color: var(--neutral-200); color: var(--neutral-800);"
                :class="{ 'border-red-400': errors.phone }"
                placeholder="Phone number"
              />
              <p v-if="errors.phone" class="mt-1 text-xs" style="color: var(--primary-green);">{{ errors.phone }}</p>
            </div>
          </div>

          <!-- API Error message -->
          <div v-if="apiError" class="rounded-lg p-3 border text-sm" style="background-color: var(--neutral-300); border-color: var(--primary-green); color: var(--neutral-800);">
            {{ apiError }}
          </div>

          <!-- Submit button -->
          <div class="pt-2">
            <button
              type="submit"
              class="w-full flex justify-center items-center py-2.5 px-4 border border-transparent rounded-lg text-sm font-medium text-white transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              style="background-color: var(--primary-blue);"
              :disabled="isSubmitting"
            >
              <svg v-if="isSubmitting" class="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              {{ isSubmitting ? 'Creating...' : 'Create Account' }}
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>

  <!-- Success Modal -->
  <div v-if="formSubmitted && defaultPassword" class="fixed inset-0 z-50 flex items-center justify-center p-4">
    <div class="fixed inset-0 transition-opacity" style="background-color: rgba(0, 0, 0, 0.5);" @click="closePasswordModal"></div>
    
    <div class="relative bg-white rounded-xl shadow-xl max-w-md w-full p-6">
      <!-- Success icon and header -->
      <div class="text-center mb-4">
        <div class="mx-auto h-10 w-10 rounded-full flex items-center justify-center mb-3" style="background-color: var(--primary-green); opacity: 0.1;">
          <svg class="h-5 w-5" style="color: var(--primary-green);" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h3 class="text-lg font-medium mb-1" style="color: var(--primary-blue);">{{ form.role.charAt(0).toUpperCase() + form.role.slice(1) }} Created!</h3>
        <p class="text-sm" style="color: var(--neutral-700);">Save this password for first login:</p>
      </div>
      
      <!-- Password display -->
      <div class="rounded-lg p-3 mb-4" style="background-color: var(--neutral-200);">
        <div class="flex items-center justify-between mb-2">
          <span class="text-sm font-medium" style="color: var(--neutral-800);">Password:</span>
          <button 
            @click="copyToClipboard" 
            class="text-xs px-2 py-1 rounded transition-colors"
            style="color: var(--primary-blue); background-color: var(--neutral-300);"
          >
            {{ copyStatus }}
          </button>
        </div>
        <div class="bg-white rounded p-2 border" style="border-color: var(--neutral-400);">
          <code class="text-sm font-mono break-all" style="color: var(--neutral-800);">{{ defaultPassword }}</code>
        </div>
      </div>

      <!-- Warning -->
      <div class="rounded-lg p-3 mb-4 text-sm" style="background-color: var(--primary-green); opacity: 0.1; color: var(--neutral-800);">
        <strong>Important:</strong> The {{ form.role }} needs this password for first login.
      </div>

      <!-- Action buttons -->
      <div class="flex space-x-3">
        <button
          @click="closePasswordModal"
          class="flex-1 py-2 px-3 border rounded-lg text-sm font-medium transition-colors"
          style="border-color: var(--neutral-400); color: var(--neutral-800); background-color: white;"
        >
          Done
        </button>
        <button
          @click="addAnotherMember"
          class="flex-1 py-2 px-3 rounded-lg text-sm font-medium text-white transition-colors"
          style="background-color: var(--primary-blue);"
        >
          Add Another
        </button>
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
    const form = reactive<FormDataMember>({
      username: '',
      name: '',
      img_file: null as File | null,
      email: '',
      phone: '',
      role: 'member',
    })

    const errors = reactive<FormErrors>({})
    const apiError = ref<string | null>(null)
    const isSubmitting = ref(false)
    const formSubmitted = ref(false)
    const imageUploadRef = ref<HTMLInputElement | null>(null)
    const imagePreviewUrl = ref<string | null>(null)
    const defaultPassword = ref<string | null>(null)
    const copyStatus = ref('Copy')

    const copyToClipboard = async () => {
      if (defaultPassword.value) {
        try {
          await navigator.clipboard.writeText(defaultPassword.value)
          copyStatus.value = 'Copied!'
          setTimeout(() => copyStatus.value = 'Copy', 2000)
        } catch (err) {
          copyStatus.value = 'Failed : ' +  err 
          setTimeout(() => copyStatus.value = 'Copy', 2000)
        }
      }
    }

    const closePasswordModal = () => {
      formSubmitted.value = false
      defaultPassword.value = null
      resetForm()
    }

    const resetForm = () => {
      form.username = ''
      form.name = ''
      form.email = ''
      form.phone = ''
      form.img_file = null
      imagePreviewUrl.value = null
      Object.keys(errors).forEach((key) => delete errors[key as keyof FormErrors])
      apiError.value = null
    }

    const addAnotherMember = () => {
      formSubmitted.value = false
      defaultPassword.value = null
      resetForm()
    }

    const triggerFileInput = () => {
      imageUploadRef.value?.click()
    }

    const removeImage = () => {
      form.img_file = null
      imagePreviewUrl.value = null
      if (imageUploadRef.value) {
        imageUploadRef.value.value = ''
      }
      delete errors.img_file
    }

    const handleImageUpload = (event: Event) => {
      const target = event.target as HTMLInputElement
      const file = target.files?.[0]

      if (file) {
        const validTypes = ['image/jpeg', 'image/png', 'image/gif']
        const maxSize = 5 * 1024 * 1024

        if (!validTypes.includes(file.type)) {
          errors.img_file = 'Invalid file type. Please upload JPEG, PNG, or GIF.'
          return
        }

        if (file.size > maxSize) {
          errors.img_file = 'File size exceeds 5MB limit.'
          return
        }

        delete errors.img_file
        form.img_file = file
        imagePreviewUrl.value = URL.createObjectURL(file)
      }
    }

    const validateForm = (): boolean => {
      Object.keys(errors).forEach((key) => delete errors[key as keyof FormErrors])
      apiError.value = null
      let isValid = true

      if (!form.username) {
        errors.username = 'Username is required'
        isValid = false
      } else if (form.username.length > 100) {
        errors.username = 'Username must be less than 100 characters'
        isValid = false
      }

      if (!form.name) {
        errors.name = 'Name is required'
        isValid = false
      } else if (form.name.length > 100) {
        errors.name = 'Name must be less than 100 characters'
        isValid = false
      }

      if (!form.email) {
        errors.email = 'Email is required'
        isValid = false
      } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
        errors.email = 'Please enter a valid email address'
        isValid = false
      }

      if (!form.img_file) {
        errors.img_file = 'Profile image is required'
        isValid = false
      }

      if (form.phone && !/^\d{10,15}$/.test(form.phone.replace(/\s+/g, ''))) {
        errors.phone = 'Please enter a valid phone number'
        isValid = false
      }

      return isValid
    }

    const submitForm = async () => {
      if (!validateForm()) return

      isSubmitting.value = true

      try {
        const result = await addNewMember(form, errors, apiError, isSubmitting, formSubmitted)
        defaultPassword.value = result.defaultPassword
        formSubmitted.value = true
      } catch (error) {
        apiError.value = error instanceof Error ? error.message : 'An error occurred while adding the member.'
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
      defaultPassword,
      copyStatus,
      triggerFileInput,
      removeImage,
      handleImageUpload,
      submitForm,
      copyToClipboard,
      closePasswordModal,
      addAnotherMember
    }
  },
})
</script>

<style scoped>
input:focus,
select:focus,
button:focus {
  outline: none;
  box-shadow: 0 0 0 2px var(--primary-blue);
  border-color: var(--primary-blue);
}

button:hover {
  opacity: 0.9;
}

button[style*="background-color: var(--primary-blue)"]:hover {
  background-color: var(--blue-dark) !important;
}

@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

.animate-spin {
  animation: spin 1s linear infinite;
}

.space-y-4 > :not([hidden]) ~ :not([hidden]) {
  margin-top: 1rem;
}

.grid-cols-1 {
  grid-template-columns: repeat(1, minmax(0, 1fr));
}

@media (min-width: 768px) {
  .md\:grid-cols-2 {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}

.gap-4 {
  gap: 1rem;
}

.shadow-lg {
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
}

.shadow-xl {
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
}

.transition-all {
  transition: all 0.2s ease-in-out;
}

.appearance-none {
  appearance: none;
}

.border-red-400 {
  border-color: #f87171 !important;
}

.disabled\:opacity-50:disabled {
  opacity: 0.5;
}

.disabled\:cursor-not-allowed:disabled {
  cursor: not-allowed;
}

.break-all {
  word-break: break-all;
}

.font-mono {
  font-family: ui-monospace, SFMono-Regular, "SF Mono", Consolas, "Liberation Mono", Menlo, monospace;
}

.z-50 {
  z-index: 50;
}

.fixed {
  position: fixed;
}

.inset-0 {
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
}

.relative {
  position: relative;
}

.absolute {
  position: absolute;
}

.flex {
  display: flex;
}

.grid {
  display: grid;
}

.hidden {
  display: none;
}

.block {
  display: block;
}

.items-center {
  align-items: center;
}

.justify-center {
  justify-content: center;
}

.justify-between {
  justify-content: space-between;
}

.text-center {
  text-align: center;
}

.w-full {
  width: 100%;
}

.h-full {
  height: 100%;
}

.max-w-md {
  max-width: 28rem;
}

.space-x-2 > :not([hidden]) ~ :not([hidden]) {
  margin-left: 0.5rem;
}

.space-x-3 > :not([hidden]) ~ :not([hidden]) {
  margin-left: 0.75rem;
}

.rounded-xl {
  border-radius: 0.75rem;
}

.rounded-lg {
  border-radius: 0.5rem;
}

.rounded-full {
  border-radius: 9999px;
}

.border {
  border-width: 1px;
}

.border-2 {
  border-width: 2px;
}

.border-dashed {
  border-style: dashed;
}

.border-transparent {
  border-color: transparent;
}

.bg-white {
  background-color: #ffffff;
}

.p-6 {
  padding: 1.5rem;
}

.p-4 {
  padding: 1rem;
}

.p-3 {
  padding: 0.75rem;
}

.p-2 {
  padding: 0.5rem;
}

.px-3 {
  padding-left: 0.75rem;
  padding-right: 0.75rem;
}

.px-4 {
  padding-left: 1rem;
  padding-right: 1rem;
}

.py-2 {
  padding-top: 0.5rem;
  padding-bottom: 0.5rem;
}

.py-2\.5 {
  padding-top: 0.625rem;
  padding-bottom: 0.625rem;
}

.pt-2 {
  padding-top: 0.5rem;
}

.mb-1 {
  margin-bottom: 0.25rem;
}

.mb-3 {
  margin-bottom: 0.75rem;
}

.mb-4 {
  margin-bottom: 1rem;
}

.mb-6 {
  margin-bottom: 1.5rem;
}

.mt-1 {
  margin-top: 0.25rem;
}

.mr-2 {
  margin-right: 0.5rem;
}

.-ml-1 {
  margin-left: -0.25rem;
}

.-top-1 {
  top: -0.25rem;
}

.-right-1 {
  right: -0.25rem;
}

.text-xs {
  font-size: 0.75rem;
  line-height: 1rem;
}

.text-sm {
  font-size: 0.875rem;
  line-height: 1.25rem;
}

.text-lg {
  font-size: 1.125rem;
  line-height: 1.75rem;
}

.text-2xl {
  font-size: 1.5rem;
  line-height: 2rem;
}

.font-medium {
  font-weight: 500;
}

.font-bold {
  font-weight: 700;
}

.text-white {
  color: #ffffff;
}

.w-5 {
  width: 1.25rem;
}

.h-5 {
  height: 1.25rem;
}

.w-4 {
  width: 1rem;
}

.h-4 {
  height: 1rem;
}

.w-10 {
  width: 2.5rem;
}

.h-10 {
  height: 2.5rem;
}

.w-20 {
  width: 5rem;
}

.h-20 {
  height: 5rem;
}

.flex-1 {
  flex: 1 1 0%;
}

.overflow-hidden {
  overflow: hidden;
}

.object-cover {
  object-fit: cover;
}

.mx-auto {
  margin-left: auto;
  margin-right: auto;
}

.opacity-25 {
  opacity: 0.25;
}

.opacity-75 {
  opacity: 0.75;
}

.cursor-not-allowed {
  cursor: not-allowed;
}

.shadow-md {
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
}

.shadow-sm {
  box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
}
</style>