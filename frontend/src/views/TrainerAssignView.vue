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
              <h1 class="text-2xl md:text-3xl !font-bold">Trainer Assignment</h1>
              <p class="text-white/80 !mt-1">Assign trainers to members and manage training relationships</p>
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

    <!-- Phase indicator -->
    <div class="bg-white border-b border-[var(--neutral-400)] py-4 px-6 md:px-12">
      <div class="container !mx-auto">
        <div class="flex items-center justify-between">
          <div class="flex items-center !space-x-4">
            <!-- Step indicator -->
            <div class="flex items-center !space-x-4">
              <div class="flex items-center">
                <div :class="[
                  'w-8 h-8 rounded-full flex items-center justify-center text-sm !font-bold',
                  phase === Selection.Trainer ? 'bg-[var(--primary-blue)] text-white' : 'bg-[var(--neutral-400)] text-white'
                ]">
                  1
                </div>
                <span :class="[
                  '!ml-2 !font-medium',
                  phase === Selection.Trainer ? 'text-[var(--primary-blue)]' : 'text-[var(--neutral-600)]'
                ]">
                  Select Trainer
                </span>
              </div>
              
              <div class="w-12 h-1 bg-[var(--neutral-400)] rounded">
                <div :class="[
                  'h-full rounded transition-all duration-300',
                  phase === Selection.Members ? 'w-full bg-[var(--primary-blue)]' : 'w-0'
                ]"></div>
              </div>
              
              <div class="flex items-center">
                <div :class="[
                  'w-8 h-8 rounded-full flex items-center justify-center text-sm !font-bold',
                  phase === Selection.Members ? 'bg-[var(--primary-blue)] text-white' : 'bg-[var(--neutral-400)] text-white'
                ]">
                  2
                </div>
                <span :class="[
                  '!ml-2 !font-medium',
                  phase === Selection.Members ? 'text-[var(--primary-blue)]' : 'text-[var(--neutral-600)]'
                ]">
                  Manage Students
                </span>
              </div>
            </div>
          </div>
          
          <!-- Return button -->
          <button 
            v-if="selectedTrainerID" 
            @click="returnFromTrainer"
            class="bg-[var(--primary-green)] hover:bg-[var(--green-dark)] text-white px-4 py-2 rounded-lg !font-medium transition-colors flex items-center"
          >
            <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 !mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Return to Trainers
          </button>
        </div>
      </div>
    </div>

    <!-- Main content -->
    <div class="container !mx-auto px-6 md:px-12 py-8">
      <!-- Current selection info -->
      <div v-if="selectedTrainerID" class="bg-white rounded-xl shadow-sm p-6 !mb-6 border-l-4 border-[var(--primary-green)]">
        <div class="flex items-center">
          <div class="bg-[var(--primary-green)]/10 p-3 rounded-lg !mr-4">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-[var(--primary-green)]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
          </div>
          <div>
            <h3 class="text-lg !font-bold text-[var(--primary-blue)]">Selected Trainer</h3>
            <p class="text-[var(--neutral-700)]">Managing students for Trainer ID: {{ selectedTrainerID }}</p>
          </div>
        </div>
      </div>

      <!-- Instructions -->
      <div class="bg-white rounded-xl shadow-sm p-6 !mb-8">
        <div class="flex items-start !space-x-4">
          <div class="bg-[var(--primary-blue)]/10 p-3 rounded-lg">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-[var(--primary-blue)]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div>
            <h3 class="text-lg !font-bold text-[var(--primary-blue)] !mb-2">How to Use</h3>
            <div v-if="phase === Selection.Trainer" class="text-[var(--neutral-700)] !space-y-2">
              <p>• Click on a trainer from the list below to manage their students</p>
              <p>• You can see all available trainers and their current assignments</p>
            </div>
            <div v-else class="text-[var(--neutral-700)] !space-y-2">
              <p>• Check/uncheck members to assign or remove them from this trainer</p>
              <p>• Selected members are currently assigned to this trainer</p>
              <p>• Changes are saved automatically when you check/uncheck</p>
            </div>
          </div>
        </div>
      </div>

      <!-- List container -->
      <div class="bg-white rounded-xl shadow-sm overflow-hidden">
        <div class="bg-[var(--primary-blue)] text-white px-6 py-4">
          <div class="flex items-center justify-between">
            <div class="flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 !mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path v-if="phase === Selection.Trainer" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                <path v-else stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              <h2 class="text-xl !font-bold">
                {{ phase === Selection.Trainer ? 'Select Trainer' : 'Manage Students' }}
              </h2>
            </div>
            <!-- Tennis ball decoration -->
            <div class="w-8 h-8 rounded-full bg-[var(--primary-green)] opacity-40"></div>
          </div>
        </div>
        
        <div class="p-6">
          <UserlistComponent 
            @process-member="(member : Member) => {selectTrainerid(member.id)}"
            ref="ulistRef"
            @memberlist-operation="addOrRemoveStudents"
            v-slot="{ item }: SlotProps"
            :multi-select="phase === Selection.Members"
            :role-filter="filter"
          >
            <button 
              v-if="phase === Selection.Trainer" 
              @click="selectTrainerid(item!.id)"
              class="bg-[var(--primary-green)] hover:bg-[var(--green-dark)] text-white px-4 py-2 rounded-lg !font-medium transition-colors flex items-center"
            >
              <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 !mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              Manage Students
            </button>
          </UserlistComponent>
        </div>
      </div>
    </div>
    
    
  </div>
</template>

<script setup lang="ts">
    import {computed, ref, type Ref} from 'vue';
    import UserlistComponent, { type SlotProps, type ChildComponentExpose } from '@/components/UserlistComponent.vue';
    import { type memberlistOp } from '@/types/memberlistOperation';
    import { assignTrainer, removeStudents, getStudents } from '@/services/trainerAssignmentServices';
    import { selectMembers, clearSelectedMembers } from '@/utils/memberSelection';
import type { Member } from '@/types/member';

    enum Selection {
        Trainer = "Trainer",
        Members = "Members"
    }

    const ulistRef : Ref<ChildComponentExpose | null> = ref(null);
    
    // function doStuff() {
    //     if (ulistRef.value) {
    //         ulistRef.value.processSelectedMembers();
    //     }
    // }

    const phase : Ref<Selection> = ref(Selection.Trainer);
    const filter = computed(() => {
        return phase.value === Selection.Trainer ? "trainer" : "member";
        });

    // const mode : Ref<Selection> = ref(Selection.)

    const selectedTrainerID : Ref<number | null> = ref(null);

    function selectTrainerid(trainerid : number) {
        selectedTrainerID.value = trainerid
        // refresh selection to match trainer
        getStudents(selectedTrainerID.value).then((value : Member[]) => {
            selectMembers(value);
            phase.value = Selection.Members
        });
    }

    function returnFromTrainer() {
        selectedTrainerID.value = null
        clearSelectedMembers()
        phase.value = Selection.Trainer
    }

    // function finalizeSelection() {
    //     // do something lmao
    // }

    function addOrRemoveStudents(op : memberlistOp) {
        if (op.operation === "add") {
            //console.log("Add")
            //console.log(op.member)
            assignTrainer(selectedTrainerID.value!, [op.member.id])
        }
        else if (op.operation === "remove") {
            //console.log("Rem")
            //console.log(op.member)
            removeStudents(selectedTrainerID.value!, [op.member.id])
        }
        else {
            console.error("Illegal operation type, which shouldnt happen wtf did you do")
        }
    }
    
</script>

<style scoped>
.container {
  max-width: 1200px;
}

/* Animation for phase transition */
.transition-all {
  transition: all 0.3s ease;
}

/* Step indicator animation */
@keyframes pulse {
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: 0.7;
  }
}



</style>