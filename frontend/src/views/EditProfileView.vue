<template>
  <div class="flex justify-center items-center min-h-screen bg-gray-100 p-4">
    <div class="w-full max-w-md bg-white overflow-hidden shadow-lg transition-all duration-300 hover:shadow-xl transform hover:-translate-y-1 rounded-lg">
      <div class="p-6">
        <h1 class="text-2xl font-bold text-gray-800 text-center mb-4">Edit Profile</h1>
        
        <!-- General Error Message -->
        <div v-if="errors.general" class="rounded-md p-4 mb-4" style="background: var(--color-background-soft);">
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
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm-1-11a1 1 0 112 0v3a1 1 0 11-2 0V7zm1 8a1.5 1.5 0 100-3 1.5 1.5 0 000 3z"
                  clip-rule="evenodd"
                />
              </svg>
            </div>
            <div class="ml-3">
              <p class="text-sm font-medium" style="color: var(--color-text);">
                {{ errors.general }}
              </p>
            </div>
          </div>
        </div>

        <!-- Image Preview -->
        <div class="pt-4 mb-4 flex justify-center">
          <img
            :src="profilePhoto"
            alt="Profile Preview"
            class="w-32 h-32 rounded-full object-cover"
          />
        </div>

        <form @submit.prevent="submitForm" class="space-y-4">
          <!-- Profile Photo Field -->
          <div class="pb-2">
            <label class="block text-sm font-medium" style="color: var(--color-text)">
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
                class="text-black w-full py-2 px-4 border rounded-md shadow-sm text-sm font-medium focus:outline-none hover:bg-indigo-500"
                style="border-color: var(--color-border)"
              >
                Change Image
              </button>
            </div>
            <p v-if="errors.img" class="mt-2 text-sm text-red-500">{{ errors.img }}</p>
          </div>

          <!-- Name Field -->
          <div>
            <label class="block text-sm font-medium text-gray-700">Name</label>
            <input
              v-model="name"
              type="text"
              class="text-black w-full p-3 border rounded-md focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              required
            />
            <p v-if="errors.name" class="mt-2 text-sm text-red-500">{{ errors.name }}</p>
          </div>

          <!-- Phone Number Field -->
          <div>
            <label class="block text-sm font-medium text-gray-700">Phone Number</label>
            <input
              v-model="phoneNumber"
              type="text"
              class="text-black w-full p-3 border rounded-md focus:ring-2 focus:ring-indigo-500 focus:outline-none"
            />
            <p v-if="errors.phone" class="mt-2 text-sm text-red-500">{{ errors.phone }}</p>
          </div>

          <div class="pt-4">
            <button
              type="submit"
              class="w-full bg-indigo-600 text-white py-3 px-6 rounded-md font-medium transition-all duration-300 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 flex justify-center items-center"
              :disabled="isLoading"
            >
              <svg
                v-if="isLoading"
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
              {{ isLoading ? 'Saving...' : 'Save Changes' }}
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, reactive, ref } from 'vue'
import { updateProfile, checkPhoneNumber } from '@/services/memberServices'
import { useMemberStore } from '@/stores/member'
import { useRouter } from 'vue-router'

export default defineComponent({
  name: 'EditProfileView',
  setup() {
    const router = useRouter()
    const store = useMemberStore()
    const memberData = ref(store.member)
    let isImageChange = false
    const isLoading = ref(false)

    // Jika tidak ada member data, redirect ke /profile
    if (!memberData.value) {
      router.push('/profile')
    }

    // Inisialisasi field form
    const name = ref(memberData.value?.name)
    const phoneNumber = ref(
      memberData.value?.phoneNumber === '-' ? '' : memberData.value?.phoneNumber
    )
    const profilePhoto = ref(memberData.value?.profilePhoto)
    let img_file: File | null = null

    // Buat reactive object untuk error messages
    const errors = reactive({
      name: '',
      phone: '',
      img: '',
      general: '',
    })

    const imageUploadRef = ref<HTMLInputElement | null>(null)

    // Trigger file input click
    const triggerFileInput = () => {
      imageUploadRef.value?.click()
    }

    // Handle image upload dengan validasi dan set error jika terjadi
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
          isImageChange = true
        }
        reader.readAsDataURL(file)
        img_file = file
      }
    }

    // Check if member data has changed
    const isMemberDataChange = () => {
      if (name.value !== memberData.value?.name) return true
      if (phoneNumber.value !== memberData.value?.phoneNumber) return true
      if (isImageChange) return true
      return false
    }

    // Submit form
    const submitForm = async () => {
      // Clear error messages
      errors.name = ''
      errors.phone = ''
      errors.img = ''
      errors.general = ''

      // Check if there are any changes in member data
      if (!isMemberDataChange()) {
        errors.general = 'Profile not changed.'
        return
      }

      // loading start
      isLoading.value = true

      // Validasi input field
      if (!name.value || !profilePhoto.value) {
        errors.general = 'Please fill in all fields.'
        isLoading.value = false
        return
      }

      if (name.value.length > 100) {
        errors.name = 'Name cannot exceed 100 characters.'
        isLoading.value = false
        return
      }

      if (phoneNumber.value) {
        if (phoneNumber.value.length < 7 || phoneNumber.value.length > 15 || !/^[0-9]+$/.test(phoneNumber.value)) {
          errors.phone = 'Phone number must be numeric and not exceed 15 digits.'
          isLoading.value = false
          return
        }

        // is phone number already used
        const isPhoneNumberUsed = await checkPhoneNumber(phoneNumber.value)
        if (isPhoneNumberUsed) {
          errors.phone = 'Phone number is already in use by another member.'
          isLoading.value = false
          return
        }
      }

      try {
        if (isImageChange) {
          await updateProfile(name.value, img_file, phoneNumber.value || '')
        } else {
          await updateProfile(name.value, null, phoneNumber.value || '')
        }
        router.push('/profile')
      } catch (error) {
        console.error('Error updating profile:', error)
        errors.general = 'Failed to update profile. Please try again later.'
      } finally {
        isLoading.value = false
      }
    }

    return {
      name,
      phoneNumber,
      profilePhoto,
      isLoading,
      errors,
      submitForm,
      handleImageUpload,
      triggerFileInput,
      imageUploadRef,
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
