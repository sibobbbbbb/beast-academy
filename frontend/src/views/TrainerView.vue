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
        <details class="bg-white rounded-xl shadow-sm p-6 !mb-6" >
        <summary class="!mb-1"> Trainer Stats</summary>
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
              <p class="text-2xl !font-bold text-[var(--primary-blue)]">{{ trainerStats.studentsCount }}</p>
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
              <p class="text-2xl !font-bold text-[var(--primary-green)]">{{ trainerStats.notesGiven }}</p>
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
              <p class="text-2xl !font-bold text-[var(--green-light)]">{{ trainerStats.activeNotes }}</p>
            </div>
          </div>
        </div>
      </div>

      </details>

      <div v-if="revealActions || (mobileMode && isMulti)" class="bg-white rounded-xl shadow-sm p-6 !mb-6 border-l-4 border-(--primary-green) sticky top-1.5 md:relative">
        <div class="flex items-center justify-between">
          <div class="flex items-center">
            <div class="bg-green-100 p-3 rounded-lg !mr-4">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-(--primary-green)" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"/><circle cx="12" cy="12" r="3"/>
              </svg>
            </div>
            <div>
              <h3 class="text-lg !font-bold">Bulk Actions</h3>
              <p class="text-[var(--neutral-700)]">{{ selectedCount }} members selected for bulk operations</p>
            </div>
          </div>
          
          <div class="flex !space-x-3">
            <button 
              @click="exportToExcel()"
              class="bg-[var(--primary-green)] hover:bg-[var(--green-dark)] text-white px-4 py-2 rounded-lg !font-medium transition-colors flex items-center"
            >
              <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 !mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              Export
            </button>
          </div>
        </div>
      </div>

      <!-- Member list card -->
      <div class="bg-white static_view rounded-xl shadow-sm overflow-hidden">
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

            <template #mobile-actions>
              <div class="flex justify-center !space-x-4 py-4">
                <button @click="isMulti = true" class="bg-[var(--neutral-700)] hover:bg-[var(--blue-dark)] text-white px-6 py-3 rounded-lg !font-medium transition-colors flex items-center">
                    Toggle Select
                </button>
              </div>
            </template>

            <template #mobile-actions-multi>
                <div class="flex justify-center !space-x-4 py-4">
                    <button @click="{isMulti = false; clearSelectedMembers(); revealActions = false}" class="bg-[var(--neutral-700)] hover:bg-[var(--blue-dark)] text-white px-6 py-3 rounded-lg !font-medium transition-colors flex items-center">
                        Disable Select
                    </button>
                </div>
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
    import {selectedCount, clearSelectedMembers, exportToExcel} from '@/utils/memberSelection'; // clearSelectedMembers, exportToExcel, 
    import { type Member } from '@/types/member';
    import { useDeviceModeStore } from '@/stores/deviceMode';
    //import { MoveUpLeftIcon } from 'lucide-vue-next';
    import { useRouter } from 'vue-router';
    import { getTrainerStats } from '@/utils/admin';
    import { useAuthStore } from '@/stores/auth';

    // Add member / Bottom button
    // Delete member - process member / members action // Avail only when selecting one or more
    // Export - process members action // Same as Delete member
    // Edit - process member action // Always available as button

    const deviceStore = useDeviceModeStore();

    const ulistRef : Ref<ChildComponentExpose | null> = ref(null);

    const revealActions : Ref<boolean> = ref(false);

    const router = useRouter();
    const authStore = useAuthStore();

    // Mock data for stats - replace with real data
    //const lastFetch = ref<Member[]>([]);

    interface TrainerStats {
      studentsCount: number;
      notesGiven: number;
      activeNotes: number;
    }


    const trainerStats : Ref<TrainerStats> = ref({studentsCount: -1, notesGiven: -1, activeNotes: -1} as TrainerStats)

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

        authStore.checkAuthStatus().then(() => {
              const user = authStore.user
              const id = user?.id
              getTrainerStats(id!).then((results) => {trainerStats.value = results as TrainerStats})
        })

    })

    // enum mobileContext {
    //     export
    // }

    // const currentMobileContext : Ref<null | mobileContext> = ref(null)

    // function switchMode(mode : mobileContext) {
    //     if (currentMobileContext.value === mode) {
    //         currentMobileContext.value = null;
    //     } else {
    //         currentMobileContext.value = mode;
    //     }
    // }

    // //function for process member emit
    // function processMemberContext() {
    //     switch (currentMobileContext.value) {
    //         case (mobileContext.export) : {
    //             // no multi select tap
    //             break;
    //         } 
    //         default : {
                
    //         }
    //     }
    // }

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
.bg-white:not(.static_view):hover {
  transform: translateY(-2px);
  transition: transform 0.2s ease;
}
</style>