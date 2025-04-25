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
        <div class="relative bg-[var(--primary-blue)] h-32">
          <div class="absolute -bottom-12 left-1/2 transform -translate-x-1/2">
            <img
              :src="profilePhoto"
              :alt="name"
              class="w-32 h-32 rounded-full border-4 border-white object-cover cursor-pointer"
              referrerpolicy="no-referrer"
              @click="triggerFileInput"
            />
          </div>
        </div>

        <form @submit.prevent="submitForm" class="pt-16 pb-4 px-5">
          <div class="text-center !mb-4">
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
              class="text-xs text-[var(--primary-blue)] hover:underline focus:outline-none cursor-pointer"
            >
              Change photo
            </button>
            <p v-if="errors.img" class="!mt-1 text-xs text-red-500">{{ errors.img }}</p>
            <p class="text-xs cursor-default text-gray-500 font-medium !mt-2">
              Member since {{ formatDate(joinDate) }}
            </p>
          </div>

          <div class="!mt-4 !space-y-3">
            <!-- Username Field -->
            <div>
              <label class="block text-xs font-medium text-gray-700 !mb-1">Username <span class="text-red-600"> * </span></label>
              <input
                v-model="username"
                type="text"
                class="w-full p-2 border rounded-md focus:ring-2 focus:ring-[var(--primary-blue)] focus:outline-none text-gray-800 text-sm"
                required
              />
              <p v-if="errors.username" class="!mt-1 text-xs text-red-500">{{ errors.username }}</p>
            </div>

            <!-- Name Field -->
            <div>
              <label class="block text-xs font-medium text-gray-700 !mb-1">Name <span class="text-red-600"> * </span></label>
              <input
                v-model="name"
                type="text"
                class="w-full p-2 border rounded-md focus:ring-2 focus:ring-[var(--primary-blue)] focus:outline-none text-gray-800 text-sm"
                required
              />
              <p v-if="errors.name" class="!mt-1 text-xs text-red-500">{{ errors.name }}</p>
            </div>

            <!-- Email Field (Read-only) -->
            <div>
              <label class="block text-xs font-medium text-gray-700 !mb-1">Email</label>
              <div class="flex items-center p-2 border rounded-md bg-gray-50">
                <div class="flex-shrink-0 text-[var(--primary-blue)]">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                    <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                  </svg>
                </div>
                <div class="pl-3">
                  <span class="text-xs text-gray-500">{{ email }}</span>
                </div>
              </div>
            </div>

            <!-- Phone Number Field -->
            <div v-if ="role !== 'admin'">
              <label class="block text-xs font-medium text-gray-700 !mb-1">Phone Number</label>
              <div class="flex items-center p-2 border rounded-md">
                <div class="flex-shrink-0 text-[var(--primary-blue)]">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                    <path
                      d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z"
                    />
                  </svg>
                </div>
                <div class="pl-3 w-full">
                  <input
                    v-model="phoneNumber"
                    type="text"
                    class="w-full text-xs text-gray-800 bg-transparent border-none focus:outline-none focus:ring-0"
                    placeholder="Enter your phone number"
                  />
                </div>
              </div>
              <p v-if="errors.phone" class="!mt-1 text-xs text-red-500">{{ errors.phone }}</p>
            </div>
          </div>

          <!-- Link change password -->
          <div class="mt-4">
            <a href="#" @click.prevent="openPasswordModal" class="text-xs text-blue-600 hover:underline">Change Password</a>
          </div>

          <div class="pt-6">
            <button
              type="submit"
              class="w-full bg-[var(--primary-blue)] text-white py-2 px-4 rounded-md font-medium transition-all duration-300 hover:bg-[var(--blue-dark)] focus:outline-none focus:ring-2 focus:ring-[var(--blue-dark)] focus:ring-offset-2 cursor-pointer flex justify-center items-center text-sm"
              :disabled="isSaving"
            >
              <svg
                v-if="isSaving"
                class="animate-spin h-4 w-4 mr-2 text-white"
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
        <div v-if="notification.message" class="pb-3 text-center text-xs" :class="notification.type === 'success' ? 'text-green-500' : 'text-red-500'">
          {{ notification.message }}
        </div>
      </template>
    </div>

    <!-- Modal Change Password -->
    <div v-if="showPasswordModal" class="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div class="bg-white p-6 rounded-md w-80">
        <h3 class="text-lg font-bold mb-4">Change Password</h3>
        
        <!-- Old Password Input with toggle icon -->
        <div class="mb-3">
          <label class="block text-xs font-medium text-gray-700 mb-1">Old Password</label>
          <div class="relative">
            <input
              v-model="oldPassword"
              :type="showOldPassword ? 'text' : 'password'"
              class="w-full p-2 pr-10 border rounded-md focus:ring-2 focus:ring-[var(--primary-blue)] focus:outline-none text-sm"
              placeholder="Enter your current password"
            />
            <span class="absolute inset-y-0 right-0 flex items-center pr-2 cursor-pointer" @click="toggleOldPassword">
              <svg v-if="showOldPassword" xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 text-gray-500" viewBox="0 0 20 20" fill="currentColor">
                <path d="M10 3a7 7 0 017 7 7 7 0 11-7-7z"/>
                <path d="M10 5a5 5 0 00-5 5 5 5 0 007.906 3.468l1.564 1.563A7 7 0 0110 3z" fill-opacity="0.5"/>
              </svg>
              <svg v-else xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 text-gray-500" viewBox="0 0 20 20" fill="currentColor">
                <path fill-rule="evenodd" d="M3.707 3.293a1 1 0 00-1.414 1.414l16 16a1 1 0 001.414-1.414l-1.19-1.19A9.027 9.027 0 0119 10a9 9 0 00-14.416-7.299L3.707 3.293zM7.293 7.293l-.646.646A3 3 0 009.293 10l.353.353a3 3 0 01-.646.293l-2.707-2.707zM12 10a2 2 0 00-2-2 2 2 0 00-.787.137l1.63 1.63A1 1 0 0112 10z" clip-rule="evenodd"/>
              </svg>
            </span>
          </div>
        </div>
        
        <!-- New Password Input with toggle icon -->
        <div class="mb-4">
          <label class="block text-xs font-medium text-gray-700 mb-1">New Password</label>
          <div class="relative">
            <input
              v-model="newPassword"
              :type="showNewPassword ? 'text' : 'password'"
              class="w-full p-2 pr-10 border rounded-md focus:ring-2 focus:ring-[var(--primary-blue)] focus:outline-none text-sm"
              placeholder="Enter a new password"
            />
            <span class="absolute inset-y-0 right-0 flex items-center pr-2 cursor-pointer" @click="toggleNewPassword">
              <svg v-if="showNewPassword" xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 text-gray-500" viewBox="0 0 20 20" fill="currentColor">
                <path d="M10 3a7 7 0 017 7 7 7 0 11-7-7z"/>
                <path d="M10 5a5 5 0 00-5 5 5 5 0 007.906 3.468l1.564 1.563A7 7 0 0110 3z" fill-opacity="0.5"/>
              </svg>
              <svg v-else xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 text-gray-500" viewBox="0 0 20 20" fill="currentColor">
                <path fill-rule="evenodd" d="M3.707 3.293a1 1 0 00-1.414 1.414l16 16a1 1 0 001.414-1.414l-1.19-1.19A9.027 9.027 0 0119 10a9 9 0 00-14.416-7.299L3.707 3.293zM7.293 7.293l-.646.646A3 3 0 009.293 10l.353.353a3 3 0 01-.646.293l-2.707-2.707zM12 10a2 2 0 00-2-2 2 2 0 00-.787.137l1.63 1.63A1 1 0 0112 10z" clip-rule="evenodd"/>
              </svg>
            </span>
          </div>
        </div>

        <!-- Tampilkan pesan error password jika ada -->
        <p v-if="passwordError" class="mb-4 text-xs text-red-500">{{ passwordError }}</p>

        <div class="flex justify-end space-x-2">
          <button @click="closePasswordModal" class="px-3 py-1 text-xs text-gray-700 hover:underline">Cancel</button>
          <button @click="change_password" class="px-3 py-1 text-xs text-white bg-[var(--primary-blue)] rounded-md hover:bg-[var(--blue-dark)]">
            Change Password
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, onMounted, ref, reactive } from 'vue'
import { getProfileUsers, updateProfile, checkPhoneNumber, changePassword } from '@/services/memberServices'
import Navbar from '@/components/Navbar.vue'

export default defineComponent({
  name: 'ProfileView',
  components: {
    Navbar
  },
  setup() {
    
    // Form data
    const username = ref('')
    const name = ref('')
    const email = ref('')
    const phoneNumber = ref('')
    const profilePhoto = ref('')
    const role = ref('')
    const joinDate = ref<Date>()
    const originalData = reactive({
      username: '',
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
      general: '',
      username: ''
    })

    // New Password Modal state and fields
    const showPasswordModal = ref(false)
    const oldPassword = ref('')
    const newPassword = ref('')
    const showOldPassword = ref(false)
    const showNewPassword = ref(false)
    const passwordError = ref('')

    const toggleOldPassword = () => {
      showOldPassword.value = !showOldPassword.value
    }

    const toggleNewPassword = () => {
      showNewPassword.value = !showNewPassword.value
    }

    // Load profile data
    onMounted(async () => {
      try {
        const response = await getProfileUsers()
        username.value = response.username
        name.value = response.name
        email.value = response.email
        phoneNumber.value = response.phone_no || ''
        profilePhoto.value = response.avatar
        joinDate.value = new Date(response.created_at)

        // Store original values for comparison
        originalData.username = username.value
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
      if (username.value !== originalData.username) return true
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
          username.value,
          name.value, 
          isImageChange.value ? imgFile : null, 
          phoneNumber.value || ''
        )
        
        // Update original data
        originalData.username = username.value
        originalData.name = name.value
        originalData.phoneNumber = phoneNumber.value
        originalData.profilePhoto = profilePhoto.value
        isImageChange.value = false
        imgFile = null
        
        // Show success notification
        notification.message = 'Profile updated successfully!'
        notification.type = 'success'
        
        // Refresh halaman setelah 1 detik
        setTimeout(() => {
          window.location.reload();
        }, 1000)
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

    
    const openPasswordModal = () => {
      showPasswordModal.value = true
    }
    
    const closePasswordModal = () => {
      showPasswordModal.value = false
      oldPassword.value = ''
      newPassword.value = ''
    }
    
    const change_password = async () => {      
      try {
        await changePassword(oldPassword.value, newPassword.value)
        notification.message = 'Password changed successfully!'
        notification.type = 'success'
        closePasswordModal()
        passwordError.value = ''
      } catch (error: any) {
        console.error('Error changing password:', error)
        // Ambil pesan error dari error.response jika tersedia, atau gunakan error.message
        const errMsg = error.response?.data?.message || error.message || 'Failed to change password. Please try again later.'
        passwordError.value = errMsg
        notification.type = 'error'
      } 
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
      imageUploadRef,
      role,
      username,
      showPasswordModal,
      oldPassword,
      newPassword,
      openPasswordModal,
      closePasswordModal,
      change_password,
      showOldPassword,
      showNewPassword,
      toggleOldPassword,
      toggleNewPassword,
      passwordError
    }
  }
})
</script>

