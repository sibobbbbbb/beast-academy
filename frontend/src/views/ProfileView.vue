<template>
  <div class="flex justify-center items-center min-h-screen bg-gray-100 p-4">
    <div
      class="w-full max-w-md bg-white overflow-hidden shadow-lg transition-all duration-300 hover:shadow-xl transform hover:-translate-y-1 rounded-lg"
    >
      <!-- Loading Spinner -->
      <div v-if="isLoading" class="flex justify-center items-center h-96">
        <div class="animate-spin rounded-full h-16 w-16 border-t-4 border-indigo-500 border-solid"></div>
      </div>

      <!-- Error Message -->
      <div v-else-if="error" class="p-8 text-center text-red-500 font-medium">
        {{ error }}
      </div>

      <!-- Profile Content -->
      <template v-else>
        <!-- Photo Sections -->
        <div class="relative bg-gradient-to-r from-blue-500 to-indigo-600 h-40 md:h-48">
          <div class="absolute -bottom-14 left-1/2 transform -translate-x-1/2">
            <img
              :src="member?.profilePhoto"
              :alt="`${member?.name}`"
              class="w-28 h-28 md:w-32 md:h-32 rounded-full border-4 border-white object-cover transition-transform duration-300 hover:scale-105"
              referrerpolicy="no-referrer"
            />
          </div>
        </div>

        <div class="pt-16 pb-8 px-6">
          <div class="text-center">
            <h1
              class="text-2xl cursor-default font-bold text-gray-800 mb-2 transition-colors duration-300 hover:text-indigo-600"
            >
              {{ member?.name }}
            </h1>
            <p class="text-sm cursor-default text-gray-500 font-medium">
              Member since {{ formatDate(member?.joinDate) }}
            </p>
          </div>

          <div class="mt-8 space-y-4">
            <div
              class="flex items-center transition-all duration-300 hover:bg-gray-50 p-3 rounded-md"
            >
              <div class="flex-shrink-0 text-indigo-500">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                  <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                </svg>
              </div>
              <div class="pl-4">
                <p class="text-sm font-medium text-gray-700">
                  Email : <span class="text-sm text-gray-500"> {{ member?.email }} </span>
                </p>
              </div>
            </div>

            <div
              class="flex items-center transition-all duration-300 hover:bg-gray-50 p-3 rounded-md"
            >
              <div class="flex-shrink-0 text-indigo-500">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" viewBox="0 0 20 20" fill="currentColor">
                  <path
                    d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z"
                  />
                </svg>
              </div>
              <div class="pl-4">
                <p class="text-sm font-medium text-gray-700">
                  Phone : <span class="text-sm text-gray-500">{{ member?.phoneNumber }}</span>
                </p>
              </div>
            </div>
          </div>

          <div class="pt-8">
            <button
              class="w-full bg-indigo-600 text-white py-3 px-6 rounded-md font-medium transition-all duration-300 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
              @click="editProfile"
            >
              Edit Profile
            </button>
          </div>
        </div>
      </template>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, onMounted, ref } from 'vue'
import { getProfileUsers } from '@/services/memberServices'
import { useRouter } from 'vue-router';
import type { Member } from '@/types/member'
import { useMemberStore } from '@/stores/member'

export default defineComponent({
  name: 'MemberProfileCard',
  setup() {
    const member = ref<Member | null>(null)
    const isLoading = ref(true)
    const error = ref<string | null>(null)
    const router = useRouter()
    const store = useMemberStore()

    const editProfile = () => {
      store.setMember(member.value as Member)
      router.push('/edit-profile')
    }

    onMounted(async () => {
      try {
        const response = await getProfileUsers()
        member.value = {
          name: response.name,
          profilePhoto: response.img_url,
          email: response.email,
          phoneNumber: response.phone_no || '-',
          joinDate: new Date(response.created_at)
        }
      } catch (err) {
        error.value = 'Failed to load profile. Please try again later.'
        console.error('Error fetching profile:', err)
      } finally {
        isLoading.value = false
      }
    })

    const formatDate = (date?: Date): string => {
      if (!date) return '-'
      return new Intl.DateTimeFormat('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      }).format(date)
    }

    return { member, isLoading, error, formatDate, editProfile }
  }
})
</script>
