<template>
  <!-- Desktop Version -->
  <section v-if="!mobileMode" class="userlist-desktop">
    <!-- Search and Filter UI -->
    <div class="bg-white rounded-xl shadow-sm p-6 !mb-6">
      <div class="flex flex-col lg:flex-row lg:items-center justify-between !space-y-4 lg:space-y-0">
        <SearchBox @search="handleSearch" class="flex-1 max-w-md"/>
        
        <div class="flex items-center !space-x-4">
          <div class="flex items-center !space-x-2">
            <span class="text-sm text-[var(--neutral-700)] whitespace-nowrap">Show</span>
            <select v-model="perPage" class="px-3 py-2 border border-[var(--neutral-400)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--primary-blue)] bg-white">
              <option :value="1">1</option>
              <option :value="10">10</option>
              <option :value="20">20</option>
              <option :value="50">50</option>
            </select>
            <span class="text-sm text-[var(--neutral-700)] whitespace-nowrap">per page</span>
          </div>
          
          <button 
            @click="refresh(currentPage)" 
            class="bg-[var(--neutral-400)] hover:bg-[var(--neutral-500)] text-white px-4 py-2 rounded-lg !font-medium transition-colors flex items-center"
          >
            <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 !mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            Refresh
          </button>
        </div>
      </div>
    </div>

    <!-- Member List Display -->
    <div class="bg-white rounded-xl shadow-sm overflow-hidden">
      <div class="overflow-x-auto">
        <table class="w-full">
          <thead class="bg-[var(--neutral-300)]">
            <tr>
              <th v-show="props.multiSelect" class="px-6 py-4 text-left">
                <div class="flex items-center">
                  <svg class="w-5 h-5 text-[var(--primary-blue)]" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512">
                    <path fill="currentColor" d="M64 80c-8.8 0-16 7.2-16 16l0 320c0 8.8 7.2 16 16 16l320 0c8.8 0 16-7.2 16-16l0-320c0-8.8-7.2-16-16-16L64 80zM0 96C0 60.7 28.7 32 64 32l320 0c35.3 0 64 28.7 64 64l0 320c0 35.3-28.7 64-64 64L64 480c-35.3 0-64-28.7-64-64L0 96zM200 344l0-64-64 0c-13.3 0-24-10.7-24-24s10.7-24 24-24l64 0 0-64c0-13.3 10.7-24 24-24s24 10.7 24 24l0 64 64 0c13.3 0 24 10.7 24 24s-10.7 24-24 24l-64 0 0 64c0-13.3-10.7-24-24-24s-24-10.7-24-24z" />
                  </svg>
                </div>
              </th>
              <th class="px-3 py-4 text-left text-sm !font-medium text-[var(--neutral-800)] uppercase tracking-wider">
                <SortableHeader sortid="id" @sort="handleSort" :active="activeSort['id' as ActiveSortKey]">ID</SortableHeader>
              </th>
              <th class="px-6 pl-2 py-4 text-left text-sm !font-medium text-[var(--neutral-800)] uppercase tracking-wider">
                <SortableHeader sortid="name" @sort="handleSort" :active="activeSort['name'as ActiveSortKey]">Name</SortableHeader>
              </th>
              <th v-if="$slots.default" class="px-6 py-4 text-left text-sm !font-medium text-[var(--neutral-800)] uppercase tracking-wider">
                <NormalHeader>Action</NormalHeader>
              </th>
              <th class="px-6 py-4 text-left text-sm !font-medium text-[var(--neutral-800)] uppercase tracking-wider">
                <SortableHeader sortid="created_at" @sort="handleSort" :active="activeSort['created_at'as ActiveSortKey]">Joined</SortableHeader>
              </th>
              <th class="px-6 py-4 text-left text-sm !font-medium text-[var(--neutral-800)] uppercase tracking-wider">
                <SortableHeader sortid="phone_no" @sort="handleSort" :active="activeSort['phone_no'as ActiveSortKey]">Contact</SortableHeader>
              </th>
              <th class="px-6 py-4 text-left text-sm !font-medium text-[var(--neutral-800)] uppercase tracking-wider">
                <SortableHeader sortid="activity_score" @sort="handleSort" :active="activeSort['activity_score' as ActiveSortKey]">Activeness</SortableHeader>
              </th>
            </tr>
          </thead>

          <tbody class="bg-white divide-y divide-[var(--neutral-300)]">
            <tr v-for="item in lastFetch" :key="item.id" 
                :class="{ 'bg-[var(--primary-blue)]/5': selectedMembersMap.has(item.id) }"
                class="hover:bg-[var(--neutral-200)] transition-colors">
              <td v-show="props.multiSelect" class="px-6 py-4 whitespace-nowrap">
                <input type="checkbox"
                  @change="($event) => {let operation : boolean = !($event.target as HTMLInputElement).checked; toggleSelect(item, operation)}"
                  :checked="selectedMembersMap.has(item.id)"
                  class="h-5 w-5 text-[var(--primary-blue)] focus:ring-[var(--primary-blue)] border-[var(--neutral-400)] rounded" />
              </td>
              <td class="px-3 py-4 whitespace-nowrap text-sm !font-medium text-[var(--neutral-800)]">
                {{ item.id }}
              </td>
              <td class="px-6 pl-0 py-4 whitespace-nowrap">
                <div class="flex items-center">
                  <div class="flex-shrink-0 h-10 w-10 relative group">
                    <div class="h-10 w-10 rounded-full bg-[var(--primary-blue)]/10 flex items-center justify-center overflow-hidden">
                      <img 
                        v-if="item.avatar" 
                        :src="item.avatar"
                        alt="Profile" 
                        class="w-full h-full object-cover" 
                        @error="item.avatar = undefined"
                        referrerpolicy="no-referrer"
                      />
                      <span v-else class="text-sm !font-medium text-[var(--primary-blue)]">{{ item.name.charAt(0).toUpperCase() }}</span>
                    </div>
                    
                    <!-- Tombol Edit Foto - Hanya tampil untuk admin -->
                    <button 
                      v-if="userRole === 'admin'"
                      @click="triggerPhotoUpload(item.id)"
                      class="absolute -top-1 -right-1 bg-[var(--primary-blue)] text-white rounded-full w-6 h-6 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200 hover:bg-[var(--primary-blue)]/80"
                      :disabled="isUploadingPhoto.has(item.id)"
                      title="Edit foto profile"
                    >
                      <!-- Loading spinner saat upload -->
                      <div v-if="isUploadingPhoto.has(item.id)" class="w-3 h-3 border border-white border-t-transparent rounded-full animate-spin"></div>
                      <!-- Icon pensil -->
                      <svg v-else xmlns="http://www.w3.org/2000/svg" class="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                      </svg>
                    </button>
                    
                    <!-- Hidden file input untuk setiap member -->
                    <input 
                      :id="`fileInput_${item.id}`"
                      type="file" 
                      accept="image/jpeg,image/png,image/gif" 
                      class="hidden" 
                      @change="handlePhotoUpload($event, item)"
                    />
                  </div>
                  <div class="!ml-4">
                    <div class="text-sm !font-medium text-[var(--neutral-800)]">{{ item.name }}</div>
                    <div class="text-sm text-[var(--neutral-600)]">ID: {{ item.id }}</div>
                  </div>
                </div>
              </td>
              <td v-if="$slots.default" class="px-6 py-4 whitespace-nowrap">
                <slot :item="item">
                  <!-- Context actions if any-->
                </slot>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-[var(--neutral-600)]">
                {{ new Date(item.created_at).toLocaleDateString('en-US', {
                  year: 'numeric', 
                  month: 'short', 
                  day: 'numeric'
                }) }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="text-sm text-[var(--neutral-800)]">{{ item.phone_no || '-' }}</div>
                <div class="text-sm text-[var(--neutral-600)]">{{ item.email || '-' }}</div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-m !font-medium"
                      :class="getActivityBadgeClass(item.activity_score ?? null)">
                  {{ item.activity_score || 'N/A' }}
                </span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Pagination -->
      <div class="bg-[var(--neutral-200)] px-6 py-4">
        <div class="flex items-center justify-between">
          <div class="text-sm text-[var(--neutral-700)]">
            Showing {{ lastFetch.length }} of {{ lastFetch.length }} results
          </div>
          
          <div class="flex items-center !space-x-2">
            <button 
              @click="currentPage > 0 ? refresh(currentPage - 1) : null"
              :disabled="currentPage <= 0"
              :class="[
                'px-4 py-2 rounded-lg !font-medium transition-colors flex items-center text-sm',
                currentPage <= 0 
                  ? 'bg-[var(--neutral-400)] text-[var(--neutral-600)] cursor-not-allowed' 
                  : 'bg-[var(--primary-blue)] hover:bg-[var(--blue-dark)] text-white'
              ]"
            >
              <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 !mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
              </svg>
              Prev
            </button>
            
            <Pagination :current-page="currentPage" @go-to-page="refresh" :page-count="totalPages" />
            
            <button 
              @click="!maxPage ? refresh(currentPage + 1) : null"
              :disabled="maxPage"
              :class="[
                'px-4 py-2 rounded-lg !font-medium transition-colors flex items-center text-sm',
                maxPage 
                  ? 'bg-[var(--neutral-400)] text-[var(--neutral-600)] cursor-not-allowed' 
                  : 'bg-[var(--primary-blue)] hover:bg-[var(--blue-dark)] text-white'
              ]"
            >
              Next
              <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 !ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  </section>

  <!-- Mobile Version -->
  <section v-else class="userlist-mobile">
    <!-- Mobile Controls -->
    <div class="bg-white rounded-xl shadow-sm p-4 !mb-6">
      <details class="group !mb-4">
        <summary class="flex items-center justify-between cursor-pointer">
          <span class="text-lg !font-semibold text-[var(--primary-blue)]">Display Options</span>
          <span class="transition-transform group-open:rotate-180">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path>
            </svg>
          </span>
        </summary>
        
        <div class="!mt-4 pt-4 border-t border-[var(--neutral-300)]">
          <div class="flex flex-wrap gap-2 !mb-4">
            <span v-if="mobileDisplayTag.length === 0" class="text-sm text-[var(--neutral-600)]">No additional fields selected</span>
            <span v-for="tag in mobileTagSelected" :key="tag" 
                  @click="toggleTag(tag)"
                  class="inline-flex items-center px-3 py-1 rounded-full text-sm bg-[var(--primary-blue)] text-white cursor-pointer hover:bg-[var(--blue-dark)] transition-colors">
              {{ mobileTagText[tag] }}
              <svg class="w-4 h-4 !ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
              </svg>
            </span>
          </div>
          
          <div class="grid grid-cols-2 gap-2">
            <button v-for="(label, key) in mobileTagText" :key="key" 
                    @click="toggleTag(key)"
                    :class="[
                      'px-3 py-2 rounded-lg text-sm !font-medium transition-colors',
                      mobileTagSelected.includes(key) 
                        ? 'bg-[var(--primary-green)] text-white' 
                        : 'bg-[var(--neutral-200)] text-[var(--neutral-800)] hover:bg-[var(--neutral-300)]'
                    ]">
              {{ label }}
            </button>
          </div>
        </div>
      </details>
      
      <SearchBox @search="handleSearch" />
    </div>

    <!-- Mobile List -->
    <div class="!space-y-4 !mb-20">
      <MobileListItem v-for="item in lastFetch" :key="item.id" 
            @click="props.multiSelect ? toggleSelect(item) : processSingleMember(item)"
            :class="{ selected: selectedMembersMap.has(item.id) }" 
            @longpress="reportLongPress(item)"
                class="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow p-4">
        <!-- primary slot, main text -->
        <template #main>
          <div class="flex items-center !space-x-3">
                  <div class="flex-shrink-0 h-10 w-10">
                    <div class="h-10 w-10 rounded-full bg-[var(--primary-blue)]/10 flex items-center justify-center overflow-hidden">
                          <img 
                            v-if="item.avatar" 
                            :src="item.avatar"
                            alt="Profile" 
                            class="w-full h-full object-cover" 
                            @error="item.avatar = undefined"
                            referrerpolicy="no-referrer"
                          />
                      <span v-else class="text-sm !font-medium text-[var(--primary-blue)]">{{ item.name.charAt(0).toUpperCase() }}</span>
                    </div>
                  </div>
            <div class="flex-1">
              <div class="!font-semibold text-[var(--primary-blue)]">{{ item.name }}</div>
            </div>
          </div>
        </template>
        <!-- Sub slot -->
        <template #sub>
          <span class="text-sm text-[var(--neutral-600)]">ID: {{ item.id }}</span>
        </template>
        <!-- non-primary slots -->
        <template #x1 v-if="mobileTagSelected[0]">
          <div class="border-t border-[var(--neutral-200)]">
            <span class="text-xs !font-medium text-[var(--neutral-500)] uppercase tracking-wider">
              {{ mobileTagText[mobileTagSelected[0]] }}
            </span>
            <div class="text-sm text-[var(--neutral-700)] !mt-1">
              {{ formatMobileValue((item as Record<string, any>)[mobileTagSelected[0]], mobileTagSelected[0]) }}
            </div>
          </div>
        </template>
        <template #x2 v-if="mobileTagSelected[1]">
          <div>
            <span class="text-xs !font-medium text-[var(--neutral-500)] uppercase tracking-wider">
              {{ mobileTagText[mobileTagSelected[1]] }}
            </span>
            <div class="text-sm text-[var(--neutral-700)] !mt-1">
              {{ formatMobileValue((item as Record<string, any>)[mobileTagSelected[1]], mobileTagSelected[1]) }}
            </div>
          </div>
        </template>
        <template #x3 v-if="mobileTagSelected[2]">
          <div>
            <span class="text-xs !font-medium text-[var(--neutral-500)] uppercase tracking-wider">
              {{ mobileTagText[mobileTagSelected[2]] }}
            </span>
            <div class="text-sm text-[var(--neutral-700)] !mt-1">
              {{ formatMobileValue((item as Record<string, any>)[mobileTagSelected[2]], mobileTagSelected[2]) }}
            </div>
          </div>
        </template>
      </MobileListItem>
      
      <!-- Infinite scroll trigger sentinel -->
      <div v-if="!maxPage" ref="loadMoreRef" class="text-center py-4">
        <div class="inline-flex items-center !space-x-2 text-[var(--neutral-600)]">
          <div class="w-5 h-5 border-2 border-[var(--primary-blue)] border-t-transparent rounded-full animate-spin"></div>
          <span>Loading more...</span>
        </div>
      </div>
      <div v-else class="text-center py-4 text-[var(--neutral-600)]">
        No more to display
      </div>
    </div>

    <!-- Mobile Bottom Actions -->
    <div class="fixed bottom-0 left-0 right-0 bg-white border-t border-[var(--neutral-300)] p-4 shadow-lg">
      <div class="flex justify-center !mb-2">
        <div class="w-12 h-1 bg-[var(--neutral-400)] rounded-full"></div>
      </div>
      
      <slot v-if="!props.multiSelect" name="mobile-actions">
        <!-- Context actions if any-->
      </slot>

      <slot v-else name="mobile-actions-multi">
        <!-- Context actions if any-->
      </slot>
    </div>
  </section>

  <!-- Error Dialog -->
  <Teleport to="body">
    <div v-if="errorMessage || errorTitle" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div class="bg-white rounded-xl shadow-xl p-6 m-4 max-w-md w-full">
        <div class="flex items-center !mb-4">
          <div class="bg-red-100 p-2 rounded-full !mr-3">
            <svg class="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path>
            </svg>
          </div>
          <h3 class="text-lg !font-semibold text-[var(--neutral-800)]">{{ errorTitle }}</h3>
        </div>
        <p class="text-[var(--neutral-600)] !mb-6">{{ errorMessage }}</p>
        <button 
          @click="{errorMessage = '' ; errorTitle = ''}"
          class="w-full bg-[var(--primary-blue)] hover:bg-[var(--blue-dark)] text-white py-2 px-4 rounded-lg !font-medium transition-colors"
        >
          Close
        </button>
      </div>
    </div>
  </Teleport>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted, nextTick, onUnmounted, toRef } from 'vue'
import { fetchMembers } from '@/services/templateServices';
import { type Member } from '@/types/member';
import { selectedMembersMap, selectMember, deselectMember } from '@/utils/memberSelection';
import SortableHeader from '@/components/SortableHeader.vue';
import SearchBox from '@/components/SearchBox.vue';
import { useDeviceModeStore } from '@/stores/deviceMode'
import MobileListItem from '@/components/MobileListItem.vue'
import NormalHeader from './NormalHeader.vue';
import { type memberlistOp } from '@/types/memberlistOperation';
import Pagination from '@/components/PaginationApp.vue';
import { updateMemberPhoto } from '@/services/memberServices';

const deviceStore = useDeviceModeStore()
import { useBackCancel } from '@/utils/useBackCancel';
/*
  ##  GUIDE
  This component is made to allow userlist to act as a component that purely allows and assists in
  member operation, however this makes it overengineered, this guide aims to help understand that

  #General Idea
  The userlistcomponent handles "selecting multiple members" operation when given the prop multiSelect
  In PC version it enables the multiselect collumn, in Mobile, tapping a member instead selects it
  
  <UserlistComponent multiSelect/>

  ##  Single Member operations
  # PC Ver :
  Since PC userlisttest does not have a way to trigger the process-member emit, you are required to
  use slotProps to make scoped actions to process singular items

  import UserlistComponent, { type SlotProps } from '@/components/UserlistComponent.vue';

  <template>
    <UserlistComponent v-slot="{ item }: SlotProps">
        <button @click="doSomethingWithMember(item)">Edit</button>
    </UserlistComponent>
  </template>

  where item is Member object

  # Mobile Ver :
  Simply use the @process-members emit
  <UserlistComponent @process-members="(member) => {console.log(member)}">

  ## Multi Member operation
  # PC and Mobile Ver :
  Use the defineExpose function to trigger processSelectedMembers(), at this point it does trigger the
  emit and you can catch the value at the emit, however it also returns member list, do what suits ya

  const ulistRef = ref(null);
    
  function doStuff() {
    if (ulistRef.value) {
        ulistRef.value.processSelectedMembers();
    }
  }
  <UserlistComponent ref="ulistRef" multiSelect>
  
  ## memberlistOp
  # Also, if that is not enough, to make a more live modifications, memberlistOp is added

  memberlist op has two kinds : add and remove to selection
  self explanatory, see the type
*/

const perPage = ref(10);
const currentPage = ref(0);
const lastFetch = ref<Member[]>([]);
const maxPage = ref(false);
const sortBy = ref("");
const order = ref("");
const searchQuery = ref("");
const selectedRole = ref("");
const totalPages = ref(1);
type ActiveSortKey = "created_at" | "email" | "phone_no" | "last_activity" | "name" | "id" | "activity_score";
const activeSort = ref<Record<ActiveSortKey, string>>({
  "created_at" : "",
  "email" : "",
  "phone_no" : "",
  "last_activity" : "",
  "name" : "",
  "id" : "",
  "activity_score" : ""
})
const userRole = ref("");
const isUploadingPhoto = ref<Set<number>>(new Set());

const mobileMode = ref(false);

const props = defineProps({
  multiSelect: {
    type: Boolean,
    default: false,
  },
  roleFilter: {
    type: String,
    required: false,
  },
});

// Helper function to get activity badge styling
const getActivityBadgeClass = (score: number | null) => {
  if (!score) return 'bg-gray-100 text-gray-800';
  if (score >= 8) return 'bg-green-100 text-green-800';
  if (score >= 6) return 'bg-yellow-100 text-yellow-800';
  return 'bg-red-100 text-red-800';
};

// Helper function to format mobile values
const formatMobileValue = (value: unknown, field: string) => {
  if (value === null || value === undefined || value === '') return '-';
  
  if (field === 'created_at' && typeof value === 'string') {
    return new Date(value).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short', 
      day: 'numeric'
    });
  }
  
  return value as string;
};

async function dataFetcher(page: number, append = false) {
  try {
    const response = await fetchMembers(perPage.value, page, sortBy.value, order.value, searchQuery.value, selectedRole.value);
    console.log(`Filter by ${selectedRole.value}`)
    if (append) {
      lastFetch.value = [...lastFetch.value, ...response.data]; // append mode
    } else {
      lastFetch.value = response.data; // reset mode
    }
  
    console.log(lastFetch.value)
    totalPages.value = response.pagination.totalPages;

    // Cek apakah ini halaman terakhir
    maxPage.value = response.pagination.totalPages <= currentPage.value + 1;
  } 
    catch (e: unknown) {
      console.error("Failed to fetch members:", e);
    if (e instanceof Error) {
      reportError(e.message);
    } else if (typeof e === 'string') {
      reportError(e);
    } else {
      reportError('An unknown error occurred');
    }
  }
};

const refresh = async (newPage?: number, append = false) => {
  if (newPage !== undefined) {
    currentPage.value = newPage;
  }

  await dataFetcher(currentPage.value, append);
};

// Fungsi untuk menangani sorting dari SortableHeader
const handleSort = (column: string, reverse: boolean) => {
  if (sortBy.value != "") {
    activeSort.value[sortBy.value as ActiveSortKey] = ""
  }
  sortBy.value = column;
  order.value = reverse ? "desc" : "asc";
  activeSort.value[sortBy.value as ActiveSortKey] = order.value
  refresh(0);
};

// Fungsi untuk menangani pencarian
const handleSearch = (query: string) => {
  searchQuery.value = query;
  refresh(0);
};

// Fungsi untuk menangani filter role
const handleFilter = (role: string) => {
  selectedRole.value = role;
  refresh(0);
};

onMounted(async () => {
  await getUserRole();
  mobileMode.value = deviceStore.currentMode === 'mobile'

  // set up the observer exactly once
  observer = new IntersectionObserver(([entry]) => {
    if (entry.isIntersecting && !maxPage.value) {
      refresh(currentPage.value + 1, true)
    }
  }, { threshold: 1.0 })

  if (props.roleFilter) {
    selectedRole.value = props.roleFilter
  }

  refresh(0);
})

// Mobile utils
const loadMoreRef = ref<HTMLElement | null>(null)
let observer: IntersectionObserver

// Function to toggle tag
function toggleTag(key: string) {
  const index = mobileTagSelected.value.indexOf(key);

  if (index > -1) {
    // Immutable removal to avoid Vue reactivity glitches
    mobileTagSelected.value = mobileTagSelected.value.filter(k => k !== key);
  } else if (mobileTagSelected.value.length < 3) {
    mobileTagSelected.value = [...mobileTagSelected.value, key];
  }
}

// Pagination
//On perpage change
watch(perPage, async () => {
  currentPage.value = 0;
  await dataFetcher(0);
});

// when sentinel becomes visible only in mobile mode
watch(loadMoreRef, async el => {
  if (mobileMode.value && el) {
    await nextTick()
    observer.observe(el)
  }
}, { immediate: true })

// Infinite scroll
onUnmounted(() => {
  if (loadMoreRef.value) observer.unobserve(loadMoreRef.value)
})

const mobileTagSelected = ref<string[]>([]);

const mobileTagText: Record<string, string> = {
  "email" : "E-Mail",
  "phone_no" : "Phone no.",
  "created_at" : "Created at",
  "last_activity" : "Last activity",
};

const mobileDisplayTag = computed(() => {
  return mobileTagSelected.value.map(key => mobileTagText[key]);
});

// Watch role prop for changes
watch(
  () => props.roleFilter,
  (newRole) => {
    if (newRole !== undefined) {
      handleFilter(newRole);
    }
  },
  { immediate: true } // Optional: if you want to run the filter on component mount
);

// Emits for parent
const emit = defineEmits<{
  (event: 'processMember', members: Member): void;
  (event: 'processMemberList', members: Member[]): void;
  (event: 'memberlistOperation', memberlistop: memberlistOp) : void;
  (event: 'mobileLongPress', member: Member) : void;
  (event: 'update:multiSelect', value: boolean): void
  (event: 'on-back'): void
}>();

function longPressBarrier(memberid : number) {
  const longTapped = localTapMap.has(memberid) ? localTapMap.get(memberid) : false;

  // already long tapped, do not continue
  if (longTapped) {
    //avoid memory overuse, realistically you could only long tap one at a time methinks
    // but just in case
    localTapMap.delete(memberid);
    return true;
  }

  return false;
}

// intendedOperation is false for deselecting, and true for selecting
function toggleSelect(item : Member, intendedOperation : boolean = selectedMembersMap.value.has(item.id)) {
  if (longPressBarrier(item.id)) {
    return
  }

  if (intendedOperation === true) {
    deselectMember(item)
    emit('memberlistOperation',
      {member : item, operation : "remove"} as memberlistOp
    )
  } else {
    selectMember(item)
    emit('memberlistOperation',
      {member : item, operation : "add"} as memberlistOp
    )
  }
}

function processSelectedMembers() : Member[] {
  const selectedMembers = Array.from(selectedMembersMap.value.values());
  emit('processMemberList', selectedMembers);
  return selectedMembers;
}

function processSingleMember(member: Member) : Member {
  emit('processMember', member);
  return member
}

const errorTitle = ref("");
const errorMessage = ref("");

function reportError(title : string, message?: string) {
  // do something
  errorTitle.value = title;
  errorMessage.value = message || "";
}

export interface ChildComponentExpose {
  processSelectedMembers: () => Member;
  refresh: (newPage?: number, append?: boolean) => Promise<void>;
}

export interface SlotProps {
  item?: Member;
}

// Report long press
function reportLongPress(item : Member) {
  
  emit('mobileLongPress',item)

  nextTick(() => {
    if (props.multiSelect) {
      toggleSelect(item);
    } else {
      processSingleMember(item);
    }
    localTapMap.set(item.id, true);
    // To help wait emit actions to resolve
    console.log("Has :", selectedMembersMap.value.has(item.id))
  });

  console.log("HOLD PROC")
}

// Prevent doubling from mobile presses
const localTapMap = new Map<number, boolean>()

defineExpose({
  processSelectedMembers,
  refresh
})

// Called by useBackCancel to disable multi-select
function stopMultiSelect() {
  console.log("back")
  emit('update:multiSelect', false)
  emit('on-back')
}

const multiSelectActiveRef = toRef(props, 'multiSelect')
// Intercept browser back when multi-select is active
useBackCancel(
  multiSelectActiveRef,
  stopMultiSelect
)

const getUserRole = async () => {
  try {
    const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
    const response = await fetch(`${API_BASE_URL}/auth/me`, {
      credentials: 'include',
    });
    const userData = await response.json();
    userRole.value = userData.role || '';
  } catch (error) {
    console.error('Error getting user role:', error);
  }
};

const triggerPhotoUpload = (memberId: number) => {
  const fileInput = document.getElementById(`fileInput_${memberId}`) as HTMLInputElement;
  if (fileInput) {
    fileInput.click();
  }
};

const handlePhotoUpload = async (event: Event, member: Member) => {
  const target = event.target as HTMLInputElement;
  const file = target.files?.[0];
  
  if (!file) return;
  
  // Validasi file
  const validTypes = ['image/jpeg', 'image/png', 'image/gif'];
  const maxSize = 5 * 1024 * 1024; // 5MB
  
  if (!validTypes.includes(file.type)) {
    alert('Tipe file tidak valid. Gunakan JPEG, PNG, atau GIF.');
    target.value = '';
    return;
  }
  
  if (file.size > maxSize) {
    alert('Ukuran file melebihi 5MB.');
    target.value = '';
    return;
  }
  
  // Konfirmasi update
  const confirmed = confirm(`Apakah Anda yakin ingin mengubah foto profil ${member.name}?`);
  if (!confirmed) {
    target.value = '';
    return;
  }
  
  try {
    // Set loading state
    isUploadingPhoto.value.add(member.id);
    
    // Upload foto
    const response = await updateMemberPhoto(member.id, file);
    
    // Update avatar di UI langsung dengan URL baru dari server
    member.avatar = response.avatar;
    
    // Show success message
    alert('Foto profil berhasil diupdate!');
    
    // Reset input
    target.value = '';
    
  } catch (error: unknown) {
    console.error('Error uploading photo:', error);
    
    // Type guard untuk handle error message
    let errorMessage = 'Gagal mengupdate foto profil';
    
    if (error instanceof Error) {
      errorMessage = `Gagal mengupdate foto profil: ${error.message}`;
    } else if (typeof error === 'string') {
      errorMessage = `Gagal mengupdate foto profil: ${error}`;
    } else {
      errorMessage = 'Gagal mengupdate foto profil. Silakan coba lagi.';
    }
    
    alert(errorMessage);
    target.value = '';
  } finally {
    // Remove loading state
    isUploadingPhoto.value.delete(member.id);
  }
};

</script>

<style scoped>
/* Container styling */
.userlist-desktop,
.userlist-mobile {
  width: 100%;
}

/* Custom scrollbar */
.overflow-x-auto::-webkit-scrollbar {
  height: 6px;
}

.overflow-x-auto::-webkit-scrollbar-track {
  background: var(--neutral-200);
}

.overflow-x-auto::-webkit-scrollbar-thumb {
  background: var(--primary-blue);
  border-radius: 3px;
}

.overflow-x-auto::-webkit-scrollbar-thumb:hover {
  background: var(--blue-dark);
}

/* Animation classes */
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

/* Loading animation */
@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

.animate-spin {
  animation: spin 1s linear infinite;
}

/* Hover effects */
.hover\:shadow-md:hover {
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
}

/* Focus styles for accessibility */
button:focus,
input:focus,
select:focus {
  outline: 2px solid var(--primary-blue);
  outline-offset: 2px;
}

/* Mobile responsive */
@media (max-width: 768px) {
  .userlist-mobile .space-y-4 {
    margin-bottom: 80px; /* Account for fixed bottom nav */
  }
}

/* Table responsive improvements */
@media (max-width: 1024px) {
  .overflow-x-auto {
    -webkit-overflow-scrolling: touch;
  }
}

/* Custom checkbox styling */
input[type="checkbox"] {
  accent-color: var(--primary-blue);
}

/* Mobile bottom nav safe area */
@supports (padding-bottom: env(safe-area-inset-bottom)) {
  .fixed.bottom-0 {
    padding-bottom: calc(1rem + env(safe-area-inset-bottom));
  }
}

/* Smooth transitions */
* {
  transition: background-color 0.2s ease, border-color 0.2s ease, color 0.2s ease;
}

/* Selection highlights */
.ring-2 {
  box-shadow: 0 0 0 2px var(--primary-blue);
}

/* Button hover states */
button:hover:not(:disabled) {
  transform: translateY(-1px);
}

button:active:not(:disabled) {
  transform: translateY(0);
}

/* Card hover effects */
.hover\:shadow-md:hover {
  transform: translateY(-2px);
  transition: all 0.2s ease;
}

/* Text truncation for mobile */
.truncate {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

/* Badge animations */
.inline-flex {
  transition: all 0.2s ease;
}

.inline-flex:hover {
  transform: scale(1.05);
}

/* Table row animations */
tbody tr {
  transition: background-color 0.2s ease;
}

/* Mobile list item transitions */
.space-y-4 > * {
  transition: all 0.3s ease;
}

/* Loading state */
.loading-shimmer {
  background: linear-gradient(90deg, var(--neutral-200) 25%, var(--neutral-300) 50%, var(--neutral-200) 75%);
  background-size: 200% 100%;
  animation: shimmer 1.5s infinite;
}

@keyframes shimmer {
  0% {
    background-position: -200% 0;
  }
  100% {
    background-position: 200% 0;
  }
}

/* Error state styling */
.error-overlay {
  backdrop-filter: blur(4px);
}

/* Mobile tag styling */
.tag-pill {
  transition: all 0.2s ease;
}

.tag-pill:hover {
  transform: scale(1.05);
}

/* Disabled state styling */
button:disabled {
  opacity: 0.6;
  cursor: not-allowed;
  transform: none !important;
}

/* Focus visible for keyboard navigation */
button:focus-visible,
input:focus-visible,
select:focus-visible {
  outline: 2px solid var(--primary-blue);
  outline-offset: 2px;
  box-shadow: 0 0 0 4px rgba(0, 132, 197, 0.1);
}


/* Reduced motion support */
@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}

/* Print styles */
@media print {
  .fixed,
  .shadow-sm,
  .shadow-md,
  .shadow-lg,
  .shadow-xl {
    display: none !important;
  }
  
  .bg-white {
    background: white !important;
  }
  
  .text-white {
    color: black !important;
  }
}

.group:hover .group-hover\:opacity-100 {
  opacity: 1;
}

.transition-opacity {
  transition-property: opacity;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
  transition-duration: 200ms;
}

/* Loading spinner animation */
@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

.animate-spin {
  animation: spin 1s linear infinite;
}

/* Hover effect untuk tombol edit */
.group:hover button {
  opacity: 1;
}

button:disabled {
  cursor: not-allowed;
  opacity: 0.7;
}
</style>