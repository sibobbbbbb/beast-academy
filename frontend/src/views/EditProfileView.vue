<template>
  <div class="flex justify-center items-center min-h-screen bg-gray-100 p-4">
    <div
      class="w-full max-w-md bg-white overflow-hidden shadow-lg transition-all duration-300 hover:shadow-xl transform hover:-translate-y-1 rounded-lg"
    >
      <div class="p-6">
        <h1 class="text-2xl font-bold text-gray-800 text-center mb-4">Edit Profile</h1>

        <form @submit.prevent="submitForm" class="space-y-4">
          <!-- Name Field -->
          <div>
            <label class="block text-sm font-medium text-gray-700">Name</label>
            <input
              v-model="name"
              type="text"
              class="text-black w-full p-3 border rounded-md focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              required
            />
          </div>

          <!-- Phone Number Field -->
          <div>
            <label class="block text-sm font-medium text-gray-700">Phone Number</label>
            <input
              v-model="phoneNumber"
              type="text"
              class="text-black w-full p-3 border rounded-md focus:ring-2 focus:ring-indigo-500 focus:outline-none"
            />
          </div>

          <!-- Profile Photo Field -->
          <div>
            <label class="block text-sm font-medium text-gray-700">Profile Photo URL</label>
            <input
              v-model="profilePhoto"
              type="url"
              class="text-black w-full p-3 border rounded-md focus:ring-2 focus:ring-indigo-500 focus:outline-none"
            />
          </div>

          <div class="pt-4">
            <button
              type="submit"
              class="w-full bg-indigo-600 text-white py-3 px-6 rounded-md font-medium transition-all duration-300 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
            >
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue'
import { updateProfile, checkPhoneNumber } from '@/services/memberServices'
import { useMemberStore } from '@/stores/member'
import { useRouter } from 'vue-router'

export default defineComponent({
  name: 'EditProfileView',
  setup() {
    const router = useRouter()
    const store = useMemberStore()
    const memberData = ref(store.member)

    if (!memberData.value) {
      router.push('/profile')
    }

    const name = ref(memberData.value?.name)
    const phoneNumber = ref(
      memberData.value?.phoneNumber === '-' ? '' : memberData.value?.phoneNumber,
    )
    const profilePhoto = ref(memberData.value?.profilePhoto)

    const submitForm = async () => {
      try {
        // Validasi input data
        if (!name.value || !profilePhoto.value) {
          alert('Please fill in all fields.')
          return
        }

        if (name.value.length > 100) {
          alert('Name cannot exceed 100 characters.')
          return
        }

        if (phoneNumber.value) {
          if (phoneNumber.value.length > 15 || !/^[0-9]+$/.test(phoneNumber.value)) {
            alert('Phone number must be numeric and not exceed 15 digits.')
            return
          }

          // Cek nomor telepon yang sudah terdaftar
          const isPhoneNumberUsed = await checkPhoneNumber(phoneNumber.value)
          if (isPhoneNumberUsed) {
            alert('Phone number is already in use by another member.')
            return
          }
        }

        if (profilePhoto.value.length > 2048 || !/^https?:\/\/.+\..+/.test(profilePhoto.value)) {
          alert('Invalid profile photo URL.')
          return
        }

        // Cek nomor telepon yang sudah terdaftar
        if (phoneNumber.value) {
          const isPhoneNumberUsed = await checkPhoneNumber(phoneNumber.value)
          if (isPhoneNumberUsed) {
            alert('Phone number is already in use by another member.')
            return
          }
        }

        await updateProfile(name.value, profilePhoto.value, phoneNumber.value || '')
        alert('Profile successfully updated!')
        router.push('/profile')
      } catch (error) {
        console.error('Error updating profile:', error)
        alert('Failed to update profile. Please try again later.')
      }
    }

    return { name, phoneNumber, profilePhoto, submitForm }
  },
})
</script>
