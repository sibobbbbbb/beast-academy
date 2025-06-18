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
              <p>• Click "Manage Students" on a trainer to assign/unassign members</p>
              <p>• Click "Delete" to permanently remove a trainer and all their data</p>
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
          <!-- Trainer Selection Phase -->
          <UserlistComponent 
            v-if="phase === Selection.Trainer"
            ref="trainerListRef"
            role-filter="trainer"
            :multi-select="false"
            @process-member="selectTrainerid(parseInt(($event as Member).id.toString()))"
          >
            <template v-slot="{ item }: SlotProps">
              <div class="flex space-x-2">
                <!-- Manage Students Button -->
                <button 
                  @click="selectTrainerid(item!.id)"
                  class="bg-[var(--primary-green)] hover:bg-[var(--green-dark)] text-white px-4 py-2 rounded-lg !font-medium transition-colors flex items-center"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 !mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                  Manage Students
                </button>
                <div class="px-2"></div>
                <!-- Delete Trainer Button -->
                <button 
                  @click="confirmDeleteTrainer(item)"
                  :disabled="isDeletingTrainer"
                  class="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded-lg text-sm transition-colors disabled:opacity-50 flex items-center"
                  title="Delete trainer"
                >
                  <svg v-if="isDeletingTrainer && deletingTrainerId === item.id" class="w-3 h-3 mr-1 animate-spin" fill="none" viewBox="0 0 24 24">
                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                    <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  <svg v-else xmlns="http://www.w3.org/2000/svg" class="h-3 w-3 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                  {{ isDeletingTrainer && deletingTrainerId === item.id ? 'Deleting...' : 'Delete' }}
                </button>
              </div>
            </template>
          </UserlistComponent>

          <!-- Member Assignment Phase -->
          <UserlistComponent 
            v-else-if="phase === Selection.Members"
            ref="memberListRef"
            :role-filter="filter"
            :multi-select="true"
            @memberlist-operation="addOrRemoveStudents"
          />

          <!-- Delete Confirmation Modal -->
          <teleport to="body">
            <div 
              v-if="showDeleteConfirmModal" 
              class="fixed inset-0 bg-white bg-opacity-75 backdrop-blur-sm flex items-center justify-center z-50"
            >
              <div class="bg-white rounded-xl p-6 max-w-2xl w-full mx-6 shadow-2xl border border-gray-200">
                <!-- Header dengan icon dan title -->
                <div class="flex items-start mb-5">
                  <div class="bg-red-100 p-2.5 rounded-full mr-4 flex-shrink-0">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 15.5c-.77.833.192 2.5 1.732 2.5z" />
                    </svg>
                  </div>
                  <div class="px-1.5"></div>
                  <div class="flex-1">
                    <h3 class="text-lg font-bold text-gray-900 mb-1">Konfirmasi Hapus Trainer</h3>
                    <p class="text-gray-600 text-sm">
                      Apakah Anda yakin ingin menghapus trainer <strong class="text-red-600">{{ trainerToDelete?.name }}</strong>?
                    </p>
                  </div>
                </div>
                
                <!-- Warning content -->
                <div class="bg-red-50 border border-red-200 rounded-lg p-4 mb-5">
                  <div class="flex items-start">
                    <div class="flex-1">
                      <p class="text-sm font-semibold text-red-800 mb-3">Tindakan ini akan:</p>
                      <div class="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-2.5 text-sm text-red-700">
                        <div class="flex items-start">
                          <span class="leading-5">- Menghapus trainer secara permanen</span>
                        </div>
                        <div class="flex items-start">
                          <span class="leading-5">- Menghapus semua assignment member ke trainer ini</span>
                        </div>
                        <div class="flex items-start">
                          <span class="leading-5">- Menghapus semua training notes yang dibuat trainer ini</span>
                        </div>
                        <div class="flex items-start">
                          <span class="leading-5">- Tindakan ini tidak dapat dibatalkan</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                
                <!-- Action buttons -->
                <div class="flex justify-end space-x-3 pt-2">
                  <button 
                    @click="cancelDeleteTrainer"
                    :disabled="isDeletingTrainer"
                    class="px-5 py-2.5 text-gray-700 bg-gray-100 border border-gray-300 rounded-lg hover:bg-gray-200 disabled:opacity-50 transition-colors font-medium text-sm"
                  >
                    Batal
                  </button>
                  <div class="px-2"></div>
                  <button 
                    @click="executeDeleteTrainer"
                    :disabled="isDeletingTrainer"
                    class="px-5 py-2.5 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 flex items-center transition-colors font-medium text-sm"
                  >
                    <svg v-if="isDeletingTrainer" class="w-4 h-4 mr-2 animate-spin" fill="none" viewBox="0 0 24 24">
                      <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                      <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 914 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    {{ isDeletingTrainer ? 'Menghapus...' : 'Ya, Hapus Trainer' }}
                  </button>
                </div>
              </div>
            </div>
          </teleport>
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
import { deleteMemberById } from '@/services/memberServices';

// Enum untuk fase selection
enum Selection {
    Trainer = "Trainer",
    Members = "Members"
}

// Refs untuk komponen
const ulistRef: Ref<ChildComponentExpose | null> = ref(null);
const trainerListRef = ref<ChildComponentExpose | null>(null);
const memberListRef = ref<ChildComponentExpose | null>(null);

// State untuk fase dan trainer selection
const phase: Ref<Selection> = ref(Selection.Trainer);
const selectedTrainerID: Ref<number | null> = ref(null);

// State untuk delete functionality
const showDeleteConfirmModal = ref(false);
const trainerToDelete = ref<Member | null>(null);
const isDeletingTrainer = ref(false);
const deletingTrainerId = ref<number | null>(null);

// Computed untuk filter role
const filter = computed(() => {
    return phase.value === Selection.Trainer ? "trainer" : "member";
});

// === ORIGINAL ASSIGNMENT FUNCTIONALITY ===

function selectTrainerid(trainerid: number) {
    selectedTrainerID.value = trainerid;
    // refresh selection to match trainer
    getStudents(selectedTrainerID.value).then((value: Member[]) => {
        selectMembers(value);
        phase.value = Selection.Members;
    });
}

function returnFromTrainer() {
    selectedTrainerID.value = null;
    clearSelectedMembers();
    phase.value = Selection.Trainer;
}

function addOrRemoveStudents(op: memberlistOp) {
    if (op.operation === "add") {
        assignTrainer(selectedTrainerID.value!, [op.member.id]);
    }
    else if (op.operation === "remove") {
        removeStudents(selectedTrainerID.value!, [op.member.id]);
    }
    else {
        console.error("Illegal operation type, which shouldnt happen wtf did you do");
    }
}

// === NEW DELETE FUNCTIONALITY ===

const confirmDeleteTrainer = (trainer: Member) => {
    trainerToDelete.value = trainer;
    showDeleteConfirmModal.value = true;
};

const cancelDeleteTrainer = () => {
    if (!isDeletingTrainer.value) {
        showDeleteConfirmModal.value = false;
        trainerToDelete.value = null;
    }
};

const executeDeleteTrainer = async () => {
    if (!trainerToDelete.value) return;
    
    try {
        isDeletingTrainer.value = true;
        deletingTrainerId.value = trainerToDelete.value.id;
        
        // Gunakan fungsi deleteMemberById yang sudah ada (works for all user types)
        await deleteMemberById(trainerToDelete.value.id);
        
        // Show success message
        alert(`Trainer ${trainerToDelete.value.name} berhasil dihapus beserta semua data terkaitnya.`);
        
        // Refresh trainer list
        if (trainerListRef.value) {
            trainerListRef.value.refresh(0);
        }
        
        // Reset states
        showDeleteConfirmModal.value = false;
        trainerToDelete.value = null;
        
        // If currently viewing deleted trainer's students, go back to trainer selection
        if (selectedTrainerID.value === deletingTrainerId.value) {
            returnFromTrainer();
        }
        
    } catch (error: unknown) {
        console.error('Error deleting trainer:', error);
        
        let errorMessage = 'Gagal menghapus trainer';
        if (error instanceof Error) {
            errorMessage = `Gagal menghapus trainer: ${error.message}`;
        }
        
        alert(errorMessage);
    } finally {
        isDeletingTrainer.value = false;
        deletingTrainerId.value = null;
    }
};
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