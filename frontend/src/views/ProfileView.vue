<template>
  <Navbar />
  <div class="flex justify-center items-center min-h-screen bg-gray-100 p-4 md:pt-16">
    <div
      class="w-full max-w-md bg-white overflow-hidden shadow-lg transition-all duration-300 hover:shadow-xl transform hover:-translate-y-1 rounded-lg"
    >
      <!-- Loading Spinner -->
      <div v-if="isLoading" class="flex justify-center items-center h-96">
        <div class="animate-spin rounded-full h-16 w-16 border-t-4 border-[var(--primary-blue)] border-solid"></div>
      </div>

      <!-- Error Message -->
      <div v-else-if="error" class="p-8 text-center text-red-500 font-medium">
        {{ error }}
      </div>

      <!-- Profile Content -->
      <template v-else>
        <!-- Profile Header -->
        <div class="relative bg-[var(--primary-blue)] h-35">
          <div class="absolute -bottom-14 left-1/2 transform -translate-x-1/2">
            <img
              :src="profilePhoto"
              :alt="name"
              class="w-28 h-28 md:w-32 md:h-32 rounded-full border-4 border-white object-cover cursor-pointer"
              referrerpolicy="no-referrer"
              @click="triggerFileInput"
            />
          </div>
        </div>

        <form @submit.prevent="submitForm" class="pt-16 pb-5 px-6">
          <div class="text-center mb-6">
            <input 
              type="file" 
              ref="imageUploadRef" 
              class="hidden" 
              accept="image/*" 
              @change="handleImageUpload"
              id="img_upload"
            />
            <button
              type="button"
              @click="triggerFileInput"
              class="text-sm text-[var(--primary-blue)] hover:underline focus:outline-none"
            >
              Change photo
            </button>
            <p v-if="errors.img" class="mt-1 text-sm text-red-500">{{ errors.img }}</p>
            <p class="text-sm cursor-default text-gray-500 font-medium mt-2">
              Member since {{ formatDate(joinDate) }}
            </p>
          </div>

          <div class="mt-6 space-y-4">
            <!-- Name Field -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Name <span class="text-red-600"> * </span></label>
              <input
                v-model="name"
                type="text"
                class="w-full p-3 border rounded-md focus:ring-2 focus:ring-[var(--primary-blue)] focus:outline-none text-gray-800"
                required
              />
              <p v-if="errors.name" class="mt-1 text-sm text-red-500">{{ errors.name }}</p>
            </div>

            <!-- Email Field (Read-only) -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <div class="flex items-center p-3 border rounded-md bg-gray-50">
                <div class="flex-shrink-0 text-[var(--primary-blue)]">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                    <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                  </svg>
                </div>
                <div class="pl-4">
                  <span class="text-sm text-gray-500">{{ email }}</span>
                </div>
              </div>
            </div>

            <!-- Phone Number Field -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
              <div class="flex items-center p-3 border rounded-md">
                <div class="flex-shrink-0 text-[var(--primary-blue)]">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path
                      d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z"
                    />
                  </svg>
                </div>
                <div class="pl-4 w-full">
                  <input
                    v-model="phoneNumber"
                    type="text"
                    class="w-full text-sm text-gray-800 bg-transparent border-none focus:outline-none focus:ring-0"
                    placeholder="Enter your phone number"
                  />
                </div>
              </div>
              <p v-if="errors.phone" class="mt-1 text-sm text-red-500">{{ errors.phone }}</p>
            </div>
          </div>

          <div class="pt-8">
            <button
              type="submit"
              class="w-full bg-[var(--primary-blue)] text-white py-3 px-6 rounded-md font-medium transition-all duration-300 hover:bg-[var(--blue-dark)] focus:outline-none focus:ring-2 focus:ring-[var(--blue-dark)] focus:ring-offset-2 cursor-pointer flex justify-center items-center"
              :disabled="isSaving"
            >
              <svg
                v-if="isSaving"
                class="animate-spin h-5 w-5 mr-2 text-white"
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
                  d="M4 12a8 8 0 018-8v8H4z"
                ></path>
              </svg>
              {{ isSaving ? 'Saving...' : 'Save Changes' }}
            </button>
          </div>
        </form>
        <!-- Notification Messages -->
        <div v-if="notification.message" class="pb-3 text-center" :class="notification.type === 'success' ? 'text-green-500' : 'text-red-500'">
          {{ notification.message }}
        </div>
      </template>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, onMounted, ref, reactive } from 'vue'
import { getProfileUsers, updateProfile, checkPhoneNumber } from '@/services/memberServices'
import Navbar from '@/components/Navbar.vue'

export default defineComponent({
  name: 'ProfileView',
  components: {
    Navbar
  },
  setup() {
    // Form data
    const name = ref('')
    const email = ref('')
    const phoneNumber = ref('')
    const profilePhoto = ref('')
    const joinDate = ref<Date>()
    const originalData = reactive({
      name: '',
      phoneNumber: '',
      profilePhoto: ''
    })

    // State
    const isLoading = ref(true)
    const isSaving = ref(false)
    const error = ref<string | null>(null)
    const isImageChange = ref(false)
    let imgFile: File | null = null
    const imageUploadRef = ref<HTMLInputElement | null>(null)

    // Notification
    const notification = reactive({
      message: '',
      type: 'success'
    })

    // Error messages
    const errors = reactive({
      name: '',
      phone: '',
      img: '',
      general: ''
    })

    // Load profile data
    onMounted(async () => {
      try {
        const response = await getProfileUsers()
        name.value = response.name
        email.value = response.email
        phoneNumber.value = response.phone_no || ''
        profilePhoto.value = response.img_url
        joinDate.value = new Date(response.created_at)

        // Store original values for comparison
        originalData.name = name.value
        originalData.phoneNumber = phoneNumber.value
        originalData.profilePhoto = profilePhoto.value
      } catch (err) {
        error.value = 'Failed to load profile. Please try again later.'
        console.error('Error fetching profile:', err)
      } finally {
        isLoading.value = false
      }
    })

    // Trigger file input
    const triggerFileInput = () => {
      imageUploadRef.value?.click()
    }

    // Handle image upload
    const handleImageUpload = (event: Event) => {
      // Clear error image
      errors.img = ''
      const target = event.target as HTMLInputElement
      const file = target.files?.[0]
      if (file) {
        const validTypes = ['image/jpeg', 'image/png', 'image/gif']
        const maxSize = 5 * 1024 * 1024 // 5MB

        if (!validTypes.includes(file.type)) {
          errors.img = 'Invalid file type. Please upload JPEG, PNG, or GIF.'
          return
        }

        if (file.size > maxSize) {
          errors.img = 'File size exceeds 5MB limit.'
          return
        }

        // Image preview
        const reader = new FileReader()
        reader.onloadend = () => {
          profilePhoto.value = reader.result as string
          isImageChange.value = true
        }
        reader.readAsDataURL(file)
        imgFile = file
      }
    }

    // Check if data has changed
    const isDataChanged = () => {
      if (name.value !== originalData.name) return true
      if (phoneNumber.value !== originalData.phoneNumber) return true
      if (isImageChange.value) return true
      return false
    }

    // Submit form
    const submitForm = async () => {
      // Clear error and notification messages
      errors.name = ''
      errors.phone = ''
      errors.img = ''
      errors.general = ''
      notification.message = ''

      // Check if there are any changes
      if (!isDataChanged()) {
        notification.message = 'No changes to save.'
        notification.type = 'success'
        return
      }

      // Start loading
      isSaving.value = true

      // Validate input fields
      if (!name.value || !profilePhoto.value) {
        errors.general = 'Please fill in all required fields.'
        isSaving.value = false
        return
      }

      if (name.value.length > 100) {
        errors.name = 'Name cannot exceed 100 characters.'
        isSaving.value = false
        return
      }

      if (phoneNumber.value) {
        if (phoneNumber.value.length < 7 || phoneNumber.value.length > 15 || !/^[0-9]+$/.test(phoneNumber.value)) {
          errors.phone = 'Phone number must be numeric and between 7-15 digits.'
          isSaving.value = false
          return
        }

        // Check if phone number is already used (only if it changed)
        if (phoneNumber.value !== originalData.phoneNumber) {
          try {
            const isPhoneNumberUsed = await checkPhoneNumber(phoneNumber.value)
            if (isPhoneNumberUsed) {
              errors.phone = 'Phone number is already in use by another member.'
              isSaving.value = false
              return
            }
          } catch (err) {
            console.error('Error checking phone number:', err)
            errors.general = 'Failed to validate phone number. Please try again.'
            isSaving.value = false
            return
          }
        }
      }

      try {
        await updateProfile(
          name.value, 
          isImageChange.value ? imgFile : null, 
          phoneNumber.value || ''
        )
        
        // Update original data
        originalData.name = name.value
        originalData.phoneNumber = phoneNumber.value
        originalData.profilePhoto = profilePhoto.value
        isImageChange.value = false
        imgFile = null
        
        // Show success notification
        notification.message = 'Profile updated successfully!'
        notification.type = 'success'
        
        // Clear notification after 3 seconds
        setTimeout(() => {
          notification.message = ''
        }, 3000)
      } catch (error) {
        console.error('Error updating profile:', error)
        notification.message = 'Failed to update profile. Please try again later.'
        notification.type = 'error'
      } finally {
        isSaving.value = false
      }
    }

    // Format date
    const formatDate = (date?: Date): string => {
      if (!date) return '-'
      return new Intl.DateTimeFormat('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      }).format(date)
    }

    return {
      name,
      email,
      phoneNumber,
      profilePhoto,
      joinDate,
      isLoading,
      isSaving,
      error,
      errors,
      notification,
      submitForm,
      formatDate,
      handleImageUpload,
      triggerFileInput,
      imageUploadRef
    }
  }
})
</script>