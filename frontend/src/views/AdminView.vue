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
              <h1 class="text-2xl md:text-3xl !font-bold">Admin Dashboard</h1>
              <p class="text-white/80 !mt-1">Complete member management and system administration</p>
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
    <div class="container !mx-auto px-6 md:px-12 py-8" style="min-width: 75dvw;">
      <!-- Admin stats -->
      <div class="grid grid-cols-1 md:grid-cols-4 gap-6 !mb-8">
        <div class="bg-white rounded-xl shadow-sm p-6 border-l-4 border-[var(--primary-blue)]">
          <div class="flex items-center">
            <div class="bg-[var(--primary-blue)]/10 p-3 rounded-lg !mr-4">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-[var(--primary-blue)]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
            <div>
              <p class="text-sm text-[var(--neutral-700)]">Total Members</p>
              <p class="text-2xl !font-bold text-[var(--primary-blue)]">{{ selectedCount }}</p>
            </div>
          </div>
        </div>
        
        <div class="bg-white rounded-xl shadow-sm p-6 border-l-4 border-[var(--primary-green)]">
          <div class="flex items-center">
            <div class="bg-[var(--primary-green)]/10 p-3 rounded-lg !mr-4">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-[var(--primary-green)]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <p class="text-sm text-[var(--neutral-700)]">Selected</p>
              <p class="text-2xl !font-bold text-[var(--primary-green)]">{{ selectedCount }}</p>
            </div>
          </div>
        </div>
        
        <div class="bg-white rounded-xl shadow-sm p-6 border-l-4 border-[var(--green-light)]">
          <div class="flex items-center">
            <div class="bg-[var(--green-light)]/10 p-3 rounded-lg !mr-4">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-[var(--green-light)]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </div>
            <div>
              <p class="text-sm text-[var(--neutral-700)]">Trainers</p>
              <p class="text-2xl !font-bold text-[var(--green-light)]">-</p>
            </div>
          </div>
        </div>
        
        <div class="bg-white rounded-xl shadow-sm p-6 border-l-4 border-orange-400">
          <div class="flex items-center">
            <div class="bg-orange-100 p-3 rounded-lg !mr-4">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-orange-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <div>
              <p class="text-sm text-[var(--neutral-700)]">Events</p>
              <p class="text-2xl !font-bold text-orange-600">-</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Action buttons -->
      <div v-if="revealActions" class="bg-white rounded-xl shadow-sm p-6 !mb-6 border-l-4 border-red-400">
        <div class="flex items-center justify-between">
          <div class="flex items-center">
            <div class="bg-red-100 p-3 rounded-lg !mr-4">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            <div>
              <h3 class="text-lg !font-bold text-red-600">Bulk Actions Available</h3>
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
            
            <button 
              @click="console.log('delete')"
              class="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg !font-medium transition-colors flex items-center"
            >
              <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 !mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
              Delete
            </button>
          </div>
        </div>
      </div>

      <!-- Member management card -->
      <div class="bg-white static rounded-xl shadow-sm overflow-hidden">
        <div class="bg-[var(--primary-blue)] text-white px-6 py-4">
          <div class="flex items-center justify-between">
            <div class="flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 !mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              <h2 class="text-xl !font-bold">Member Management</h2>
            </div>
            <!-- Tennis ball decoration -->
            <div class="w-8 h-8 rounded-full bg-[var(--primary-green)] opacity-40"></div>
          </div>
        </div>
        
        <div class="p-6">
          <UserlistComponent 
            @process-member="(member : Member) => {console.log(member.id)}"
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
                @click="console.log('edit',item!.id)"
                class="bg-[var(--primary-blue)] hover:bg-[var(--blue-dark)] text-white px-4 py-2 rounded-lg !font-medium transition-colors flex items-center"
              >
                <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 !mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
                Edit
              </button>
            </template>



            <template #mobile-actions>
              <div class="flex justify-center !space-x-4 py-4">
                <button 
                  @click="switchMode(mobileContext.edit)"
                  class="bg-[var(--primary-blue)] hover:bg-[var(--blue-dark)] text-white px-6 py-3 rounded-lg !font-medium transition-colors flex items-center"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 !mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                  Edit
                </button>
                <button>
                    Select
                </button>

              </div>
            </template>

            <template #mobile-actions-multi>
                <button 
                  @click="switchMode(mobileContext.delete)"
                  class="bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-lg !font-medium transition-colors flex items-center"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 !mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                  Delete
                </button>
                
                <button 
                  @click="switchMode(mobileContext.export)"
                  class="bg-[var(--primary-green)] hover:bg-[var(--green-dark)] text-white px-6 py-3 rounded-lg !font-medium transition-colors flex items-center"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 !mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  Export
                </button>
            </template>
          </UserlistComponent>
        </div>
      </div>
    </div>
    
    
  </div>
</template>

<script setup lang="ts">
    import {onMounted, ref, type Ref} from 'vue';
    import UserlistComponent, { type SlotProps, type ChildComponentExpose } from '@/components/UserlistComponent.vue';
    // import { type memberlistOp } from '@/types/memberlistOperation';
    //import { assignTrainer, removeStudents, getStudents } from '@/services/trainerAssignmentServices';
    import { selectedCount, clearSelectedMembers, exportToExcel} from '@/utils/memberSelection'; //clearSelectedMembers, exportToExcel, 
    import { type Member } from '@/types/member';
    import { useDeviceModeStore } from '@/stores/deviceMode';
    //import { MoveUpLeftIcon } from 'lucide-vue-next';
    import { X } from 'lucide-vue-next';


    // Add member / Bottom button
    // Delete member - process member / members action // Avail only when selecting one or more
    // Export - process members action // Same as Delete member
    // Edit - process member action // Always available as button

    const deviceStore = useDeviceModeStore();

    const ulistRef : Ref<ChildComponentExpose | null> = ref(null);


    const revealActions : Ref<boolean> = ref(false);

    function modeSet() {
        revealActions.value = selectedCount.value > 0 ? true : false
    }


    const mobileMode = ref(false)

    onMounted(() => {
        mobileMode.value = deviceStore.currentMode === 'mobile' 
        if (!mobileMode.value) {
            isMulti.value = true
        }
    })

    enum mobileContext {
        edit,
        export,
        delete
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
    // function processMemberContext() {
    //     switch (currentMobileContext.value) {
    //         case (mobileContext.edit) : {
    //             // no multi select tap
    //             break;
    //         } 
    //         case (mobileContext.delete) : {
    //             // enable multi select
    //             break;
    //         }
    //         case (mobileContext.export) : {

    //         }
    //     }
    // }

    const isMulti = ref(false);

</script>

<style scoped>
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
.bg-white:not(.static):hover {
  transform: translateY(-2px);
  transition: transform 0.2s ease;
}

/* Pulse animation for action alerts */
@keyframes pulse {
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: 0.8;
  }
}

.border-red-400 {
  animation: pulse 2s infinite;
}
</style>