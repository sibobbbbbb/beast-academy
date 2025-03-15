<template>
  <div
    class="min-h-screen bg-red-50 flex flex-col items-center justify-center py-12 px-4 sm:px-6 lg:px-8 w-full"
  >
    <div class="w-full pb-3 sm:mx-auto sm:max-w-md">
      <h2 class="mt-6 text-center text-3xl font-extrabold text-red-800">Add New Member</h2>
    </div>

    <div class="mt-8 w-full sm:mx-auto sm:max-w-md">
      <div class="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10 border border-red-200">
        <div v-if="formSubmitted" class="rounded-md bg-red-50 p-4 mb-6">
          <div class="flex">
            <div class="flex-shrink-0">
              <svg
                class="h-5 w-5 text-red-400"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fill-rule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                  clip-rule="evenodd"
                />
              </svg>
            </div>
            <div class="ml-3">
              <p class="text-sm font-medium text-red-800">Member added successfully!</p>
            </div>
          </div>
        </div>

        <form class="space-y-6" @submit.prevent="submitForm">
          <!-- Name -->
          <div class="pb-2">
            <label for="name" class="block text-sm font-medium text-gray-700"> Name </label>
            <div class="mt-1">
              <input
                id="name"
                v-model="form.name"
                name="name"
                type="text"
                autocomplete="name"
                class="text-black appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-red-500 focus:border-red-500 sm:text-sm"
                :class="{ 'border-red-500': errors.name }"
              />
            </div>
            <p v-if="errors.name" class="mt-2 text-sm text-red-600">{{ errors.name }}</p>
          </div>

          <!-- Email -->
          <div class="pb-2">
            <label for="email" class="block text-sm font-medium text-gray-700"> Email </label>
            <div class="mt-1">
              <input
                id="email"
                v-model="form.email"
                name="email"
                type="email"
                autocomplete="email"
                class="text-black appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-red-500 focus:border-red-500 sm:text-sm"
                :class="{ 'border-red-500': errors.email }"
                />
            </div>
            <p v-if="errors.email" class="mt-2 text-sm text-red-600">{{ errors.email }}</p>
          </div>

          <!-- Image -->
          <div class="pb-2">
            <label for="img_url" class="block text-sm font-medium text-gray-700"> Image URL </label>
            <div class="mt-1">
              <input
                id="img_url"
                v-model="form.img_url"
                name="img_url"
                type="img_url"
                autocomplete="new-img_url"
                class="text-black appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-red-500 focus:border-red-500 sm:text-sm"
                :class="{ 'border-red-500': errors.img_url }"
              />
            </div>
            <p v-if="errors.img_url" class="mt-2 text-sm text-red-600">{{ errors.img_url }}</p>
          </div>

          <!-- Phone -->
          <div class="pb-4">
            <label for="phone" class="block text-sm font-medium text-gray-700">
              Phone Number <span class="text-xs text-gray-500">(Optional)</span>
            </label>
            <div class="mt-1">
              <input
                id="phone"
                v-model="form.phone"
                name="phone"
                type="tel"
                autocomplete="tel"
                class="text-black appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-red-500 focus:border-red-500 sm:text-sm"
                :class="{ 'border-red-500': errors.phone }"
                placeholder="Optional"
              />
            </div>
            <p v-if="errors.phone" class="mt-2 text-sm text-red-600">{{ errors.phone }}</p>
          </div>

          <!-- API Error message -->
          <div v-if="apiError" class="rounded-md bg-red-50 p-4">
            <div class="flex">
              <div class="flex-shrink-0">
                <svg
                  class="h-5 w-5 text-red-400"
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
                <p class="text-sm font-medium text-red-800">
                  {{ apiError }}
                </p>
              </div>
            </div>
          </div>

          <!-- Submit button -->
          <div>
            <button
              type="submit"
              class="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
              :disabled="isSubmitting"
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

// components/AddMemberForm.vue
<script lang="ts">
import { defineComponent, reactive, ref } from 'vue'
import { addNewMember } from '@/services/memberServices'
import type { FormData, FormErrors } from '@/types/MemberForm'

export default defineComponent({
  name: 'AddMemberForm',
  setup() {
    const form = reactive<FormData>({
      name: '',
      img_url: '',
      email: '',
      phone: '',
    })

    const errors = reactive<FormErrors>({})
    const apiError = ref<string | null>(null)
    const isSubmitting = ref(false)
    const formSubmitted = ref(false)

    const validateForm = (): boolean => {
      Object.keys(errors).forEach((key) => delete errors[key as keyof FormErrors])
      apiError.value = null
      let isValid = true

      if (!form.name) {
        errors.name = 'Name is required'
        isValid = false
      }

      if (!form.email) {
        errors.email = 'Email is required'
        isValid = false
      } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
        errors.email = 'Please enter a valid email address'
        isValid = false
      }

      if (!form.img_url) {
        errors.img_url = 'Image Url is required'
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
      await addNewMember(form, errors, apiError, isSubmitting, formSubmitted)
    }

    return {
      form,
      errors,
      apiError,
      isSubmitting,
      formSubmitted,
      submitForm,
    }
  },
})
</script>