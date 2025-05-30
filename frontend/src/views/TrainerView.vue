<template>
  <div class="min-h-screen bg-[var(--neutral-200)]">
    <!-- Header with tennis theme -->
    <div class="bg-[var(--primary-blue)] text-white py-6 px-6 md:px-12">
      <div class="container !mx-auto">
        <div class="flex items-center justify-between">
          <div class="flex items-center">
            <router-link
              to="/"
              class="flex items-center text-white hover:text-[var(--primary-green)] transition-colors !mr-6"
            >
              <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 !mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
              </svg>
            </router-link>
            <div>
              <h1 class="text-2xl md:text-3xl !font-bold">Trainer Dashboard</h1>
              <p class="text-white/80 !mt-1">Manage your members and add training notes</p>
            </div>
          </div>
          
          <!-- Tennis ball decoration -->
          <div class="hidden md:flex items-center !space-x-4">
            <div class="w-12 h-12 rounded-full bg-[var(--primary-green)] opacity-20"></div>
            <div class="w-8 h-8 rounded-full bg-[var(--primary-green)] opacity-40"></div>
          </div>
        </div>
      </div>
    </div>

    <!-- Main content -->
    <div class="container !mx-auto px-6 md:px-12 py-8">
      <!-- Stats cards -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6 !mb-8">
        <div class="bg-white rounded-xl shadow-sm p-6 border-l-4 border-[var(--primary-blue)]">
          <div class="flex items-center">
            <div class="bg-[var(--primary-blue)]/10 p-3 rounded-lg !mr-4">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-[var(--primary-blue)]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
            <div>
              <p class="text-sm text-[var(--neutral-700)]">Total Members</p>
              <p class="text-2xl !font-bold text-[var(--primary-blue)]">{{ lastFetch.length }}</p>
            </div>
          </div>
        </div>
        
        <div class="bg-white rounded-xl shadow-sm p-6 border-l-4 border-[var(--primary-green)]">
          <div class="flex items-center">
            <div class="bg-[var(--primary-green)]/10 p-3 rounded-lg !mr-4">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-[var(--primary-green)]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <div>
              <p class="text-sm text-[var(--neutral-700)]">Notes Added</p>
              <p class="text-2xl !font-bold text-[var(--primary-green)]">-</p>
            </div>
          </div>
        </div>
        
        <div class="bg-white rounded-xl shadow-sm p-6 border-l-4 border-[var(--green-light)]">
          <div class="flex items-center">
            <div class="bg-[var(--green-light)]/10 p-3 rounded-lg !mr-4">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-[var(--green-light)]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
              </svg>
            </div>
            <div>
              <p class="text-sm text-[var(--neutral-700)]">Active Sessions</p>
              <p class="text-2xl !font-bold text-[var(--green-light)]">-</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Member list card -->
      <div class="bg-white rounded-xl shadow-sm overflow-hidden">
        <div class="bg-[var(--primary-blue)] text-white px-6 py-4">
          <div class="flex items-center justify-between">
            <div class="flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 !mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              <h2 class="text-xl !font-bold">Member Management</h2>
            </div>
            <!-- Tennis ball decoration -->
            <div class="w-8 h-8 rounded-full bg-[var(--primary-green)] opacity-40"></div>
          </div>
        </div>
        
        <div class="p-6">
            <UserlistComponent @process-member="(member : Member) => {navigateToNotes(member)}"
            ref="ulistRef"
            :multi-select="isMulti"
            @memberlist-operation="modeSet"
            role-filter="member"
            @mobile-long-press="() => {
                isMulti = true
            }"
            @update:multi-select="(state : boolean) => {
                clearSelectedMembers()
                isMulti = state;
            }"
            >
            <template v-slot="{ item }: SlotProps">
              <button 
                @click="navigateToNotes(item)"
                class="bg-[var(--primary-green)] hover:bg-[var(--green-dark)] text-white px-4 py-2 rounded-lg !font-medium transition-colors flex items-center"
              >
                <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 !mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
                </svg>
                Add Notes
              </button>
            </template>
          </UserlistComponent>
        </div>
      </div>
    </div>
    

  </div>
</template>

<script setup lang="ts">
    import { onMounted, ref, type Ref} from 'vue'; //computed,
    import UserlistComponent, { type SlotProps, type ChildComponentExpose } from '@/components/UserlistComponent.vue';
    //import { type memberlistOp } from '@/types/memberlistOperation';
    //import { assignTrainer, removeStudents, getStudents } from '@/services/trainerAssignmentServices';
    import {selectedCount, clearSelectedMembers, exportToExcel, exportToFile} from '@/utils/memberSelection'; // clearSelectedMembers, exportToExcel, 
    import { type Member } from '@/types/member';
    import { useDeviceModeStore } from '@/stores/deviceMode';
    //import { MoveUpLeftIcon } from 'lucide-vue-next';
    import { useRouter } from 'vue-router';

    // Add member / Bottom button
    // Delete member - process member / members action // Avail only when selecting one or more
    // Export - process members action // Same as Delete member
    // Edit - process member action // Always available as button

    const deviceStore = useDeviceModeStore();

    const ulistRef : Ref<ChildComponentExpose | null> = ref(null);

    const revealActions : Ref<boolean> = ref(false);

    const router = useRouter();

    // Mock data for stats - replace with real data
    const lastFetch = ref<Member[]>([]);

    function modeSet() {
        revealActions.value = selectedCount.value > 0 ? true : false
    }

    const mobileMode = ref(false)

    function navigateToNotes(item: Member) {
        router.push(`/notes-list/${item.id}`);
    }

    onMounted(() => {
        mobileMode.value = deviceStore.currentMode === 'mobile' 
        if (!mobileMode.value) {
            isMulti.value = true
        }
    })

    enum mobileContext {
        export
    }

    const currentMobileContext : Ref<null | mobileContext> = ref(null)

    function switchMode(mode : mobileContext) {
        if (currentMobileContext.value === mode) {
            currentMobileContext.value = null;
        } else {
            currentMobileContext.value = mode;
        }
    }

    //function for process member emit
    function processMemberContext() {
        switch (currentMobileContext.value) {
            case (mobileContext.export) : {
                // no multi select tap
                break;
            } 
            default : {
                
            }
        }
    }

    const isMulti = ref(false);

</script>

<style scoped>
/* Custom styles for trainer view */
.container {
  max-width: 1200px;
}

/* Animation for cards */
@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.bg-white {
  animation: fadeInUp 0.5s ease-out;
}

/* Hover effects */
.bg-white:hover {
  transform: translateY(-2px);
  transition: transform 0.2s ease;
}
</style>