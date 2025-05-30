<template>
  <div class="relative">
    <!-- Back button -->
    <router-link
      to="/userlisttest"
      class="fixed top-4 left-4 z-10 p-2 rounded-full hover:bg-[var(--neutral-200)] transition-colors cursor-pointer"
      :style="{ color: 'var(--primary-blue)' }"
    >
      <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
      </svg>
    </router-link>

    <!-- Main content -->
    <AddMemberForm />
  </div>
</template>

<script setup lang="ts">
import AddMemberForm from '../components/AddMembersForm.vue'
</script>

