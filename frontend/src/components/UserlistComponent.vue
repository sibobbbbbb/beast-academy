<script setup lang="ts">
import { ref, computed, watch, onMounted, nextTick, onUnmounted } from 'vue'
import { fetchMembers } from '@/services/templateServices';
import { type Member } from '@/types/member';
import { selectedMembersMap, selectMember, deselectMember } from '@/utils/memberSelection';
import SortableHeader from '@/components/SortableHeader.vue';
import SearchBox from '@/components/SearchBox.vue';
// import FilterDropdown from '@/components/FilterDropdown.vue';
import { useDeviceModeStore } from '@/stores/deviceMode'
import MobileListItem from '@/components/MobileListItem.vue'
import NormalHeader from './NormalHeader.vue';
import { type memberlistOp } from '@/types/memberlistOperation';
import Pagination from '@/components/PaginationApp.vue';
const deviceStore = useDeviceModeStore()

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
const sortBy = ref("id");
const order = ref("asc");
const searchQuery = ref("");
const selectedRole = ref("");
const totalPages = ref(1);

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
  console.log('Refreshing data...', newPage);
  if (newPage !== undefined) {
    currentPage.value = newPage;
  }

  await dataFetcher(currentPage.value, append);

};

// Fungsi untuk menangani sorting dari SortableHeader
const handleSort = (column: string, reverse: boolean) => {
  sortBy.value = column;
  order.value = reverse ? "desc" : "asc";
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

onMounted(() => {
  mobileMode.value = deviceStore.currentMode === 'mobile'
  console.log(mobileMode.value , deviceStore.currentMode)

  // set up the observer exactly once
  observer = new IntersectionObserver(([entry]) => {
    if (entry.isIntersecting && !maxPage.value) {
      console.log('🌀 load more…', currentPage.value+1)
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
}>();

function longPressBarrier(memberid : number) {
  let longTapped = localTapMap.has(memberid) ? localTapMap.get(memberid) : false;

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
}

export interface SlotProps {
  item?: Member;
}

// Report long press
function reportLongPress(item : Member) {
  
  emit('mobileLongPress',item)

  nextTick(() => {
    props.multiSelect ? toggleSelect(item) : processSingleMember(item)
    localTapMap.set(item.id, true);
    // To help wait emit actions to resolve
    console.log("Has :", selectedMembersMap.value.has(item.id))
  });

  console.log("HOLD PROC")
}

// Prevent doubling from mobile presses
const localTapMap = new Map<number, boolean>()

defineExpose({
  processSelectedMembers
})


</script>

<template>
  <h1> {{ mobileMode }} || {{ deviceStore.currentMode }} </h1>
  <section v-if="!mobileMode">
    <!-- Search and Filter UI -->
    <div class="controls">
    <SearchBox @search="handleSearch" style="flex-grow: 1; margin: 0 2%;"/>
      <!-- <select v-model="selectedCategory">
        <option value="all">All Categories</option>
        <option value="member">Member</option>
        <option value="trainer">Trainer</option>
      </select>
      <select v-model="selectedFilter">
        <option value="none">No Filter</option>
        <option value="active">Active</option>
        <option value="inactive">Inactive</option>
      </select> Filters -->
    <span style="float: right; margin-top: 1%;">
    <h3>Showing
      <select v-model="perPage">
        <option :value="1">1</option>
        <option :value="10">10</option>
        <option :value="20">20</option>
        <option :value="50">50</option>
      </select>
      per page
    </h3>
    </span>

    <button @click="refresh(currentPage)">Refresh</button>
    </div>


    <!-- Member List Display -->
    <table>
      <thead>
        <tr>
          <th v-show="props.multiSelect">
            <svg style="width: 2rem;" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512">
              <path style=" color: white"
                d="M64 80c-8.8 0-16 7.2-16 16l0 320c0 8.8 7.2 16 16 16l320 0c8.8 0 16-7.2 16-16l0-320c0-8.8-7.2-16-16-16L64 80zM0 96C0 60.7 28.7 32 64 32l320 0c35.3 0 64 28.7 64 64l0 320c0 35.3-28.7 64-64 64L64 480c-35.3 0-64-28.7-64-64L0 96zM200 344l0-64-64 0c-13.3 0-24-10.7-24-24s10.7-24 24-24l64 0 0-64c0-13.3 10.7-24 24-24s24 10.7 24 24l0 64 64 0c13.3 0 24 10.7 24 24s-10.7 24-24 24l-64 0 0 64c0 13.3-10.7 24-24 24s-24-10.7-24-24z" />
            </svg>
          </th>
          <th class="shead" style="width: 6rem;">
            <SortableHeader sortid="id" @sort="handleSort">ID</SortableHeader>
          </th>
          <th class="shead">
            <SortableHeader sortid="name" @sort="handleSort">Name</SortableHeader>
          </th>
          <th class="shead" v-if="$slots.default">
            <NormalHeader>Action</NormalHeader>
          </th>
          <th class="shead">
            <SortableHeader sortid="created_at" @sort="handleSort">Joined</SortableHeader>
          </th>
          <th class="contact">
            <SortableHeader sortid="phone_no" @sort="handleSort">Contact</SortableHeader>
          </th>
          <th class="activeness">
            <SortableHeader sortid="activity_score" @sort="handleSort">Activeness</SortableHeader>
          </th>
        </tr>
      </thead>

      <tbody>
        <tr v-for="item in lastFetch" :key="item.id" :class="{ selected: selectedMembersMap.has(item.id) }">
          <td v-show="props.multiSelect">
            <input type="checkbox"
              @change="($event) => {let operation : boolean = !($event.target as HTMLInputElement).checked; toggleSelect(item, operation)}"
              :checked="selectedMembersMap.has(item.id)" />
          </td>
          <td>{{ item.id }}</td>
          <td>
            <span>{{ item.name }}</span>
          </td>
          <td v-if="$slots.default">
            <slot :item="item">
              <!-- Context actions if any-->
            </slot>
          </td>
          <td>{{ new Date(item.created_at).toLocaleString('en-GB', {
            year: 'numeric', month: '2-digit', day: '2-digit',
            hour: '2-digit', minute: '2-digit', second: '2-digit'
          }).replace(',', ',') }}</td>
          <td>
            <span>{{ item.phone_no }}</span>
          </td>
          <td>
            <span>{{ item.activity_score || "NULL" }}</span>
          </td>
        </tr>
      </tbody>
    </table>
    <span id="pagination" class="pagination-container">
      <button class="pageButton" @click="currentPage > 0 ? refresh(currentPage - 1) : console.log('Already min!')"> Prev
      </button>
      <Pagination :current-page="currentPage" @go-to-page="refresh" :page-count="totalPages" />
      <button class="pageButton" @click="!maxPage ? refresh(currentPage + 1) : console.log('Already max!')"> Next
      </button>
    </span>

  </section>

  <section v-else>
    <nav
      style="position: sticky; top: 0rem; background-color: rgba(190, 100, 180, 0.6); padding: 0.25rem 0.5rem; padding-top: 0.5rem;">
      <details>
        <summary>
          <label style="font-size: 1.5rem;">Display:</label>
          <span v-if="mobileDisplayTag.length === 0" style="margin-left: 0.5rem; display: inline-block;">(None)</span>
          <span v-for="tag in mobileTagSelected" :key="tag" class="tag-pill" @click.stop.prevent="toggleTag(tag)">
            {{ mobileTagText[tag] }}
          </span>
        </summary>

        <div class="tag-buttons">
          <button v-for="(label, key) in mobileTagText" :key="key" @click="toggleTag(key)"
            :class="{ selected: mobileTagSelected.includes(key) }">
            {{ label }}
          </button>
        </div>
      </details>
    </nav>
    <span class="search_bar">
      <SearchBox @search="handleSearch" style="flex-grow: 1;" />
    </span>
    <table class="mobile_list">
      <!-- <thead>
        Search bar
      </thead> -->
      <tbody>
        <MobileListItem v-for="item in lastFetch"
          :key="item.id" @click="props.multiSelect ? toggleSelect(item) : processSingleMember(item)"
          :class="{ selected: selectedMembersMap.has(item.id) }" 
          v-use-longpress="500" @longpress="reportLongPress(item)" >
          <!-- primary slot, main text -->
          <template #main>
            {{ item.name }}
          </template>
          <!-- Sub slot -->
          <template #sub>
            ID : {{ item.id }}
          </template>
          <!-- non-primary slots -->
          <template #x1 v-if="mobileTagSelected[0]">
            <label>
              {{ mobileTagText[mobileTagSelected[0]] }}
            </label>
            {{ (item as Record<string, any>)[mobileTagSelected[0]] }}
          </template>
          <template #x2 v-if="mobileTagSelected[1]">
            <label>
              {{ mobileTagText[mobileTagSelected[1]] }}
            </label>
            {{ (item as Record<string, any>)[mobileTagSelected[1]] }}
          </template>
          <template #x3 v-if="mobileTagSelected[2]">
            <label>
              {{ mobileTagText[mobileTagSelected[2]] }}
            </label>
            {{ (item as Record<string, any>)[mobileTagSelected[2]] }}
          </template>
        </MobileListItem>
                  <!-- Infinite scroll trigger sentinel -->
        <tr v-if="!maxPage" ref="loadMoreRef">
          <td colspan="4" style="text-align: center; padding: 1rem;">Loading more...</td>
        </tr>
        <tr v-else>
          <td colspan="4" style="text-align: center; padding: 1rem;">No more to display</td>
        </tr>
      </tbody>
    </table>
    <nav class="bottom_nav">
      <hr style="
        width: 25%;
        height: 4px;
        background-color: #999;
        border: none;
        border-radius: 2px;
        margin: 0.2rem auto;
        align-self: center;
      ">
      <slot name="mobile-actions">
        <!-- Context actions if any-->
      </slot>
    </nav>
  </section>
  <Teleport to="body">
    <div v-if="errorMessage || errorTitle" class="error-overlay">
      <div class="error-content">
        <h3>{{ errorTitle }}</h3>
        <p>{{ errorMessage }}</p>
        <button @click="{errorMessage = '' ; errorTitle = ''}">Close</button>
      </div>
    </div>
  </Teleport>
</template>

<style>

.bottom_nav {
  position: sticky;
  bottom: 0;
  background-color: rgba(190, 100, 180, 0.6);
  text-align: center;
  padding-top: 0.025rem;
}
.error-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.error-content {
  background: white;
  padding: 1rem;
  border-radius: 0.5rem;
  text-align: center;
  width: 90%;
  max-width: 400px;
}

.error-content button {
  margin-top: 1rem;
  padding: 0.5rem 1rem;
  background: red;
  color: white;
  border: none;
  border-radius: 0.25rem;
  cursor: pointer;
}

.error-content button:hover {
  background: darkred;
}
</style>

<style>
@media (min-width: 1024px) {
  .content {
    min-height: 100vh;
    display: block;
    align-items: center;
  }
}

.content {
  padding: 1dvh 2dvw;
}

.shead {
  min-height: 2dvh;
  margin-right: 5dvw;
}

span {
  display: block;

  * {
    display: inline;
  }

  h1 {
    margin-right: 1rem;
  }
}

.table-container {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
}

.table-container button {
  margin-bottom: 10px;
}

.dripping {
  position: sticky;
  bottom: 0;
  box-shadow: 0 -1dvh 2dvh 2dvh var(--color-background);
  margin-top: 4dvh;
  border-top: medium solid var(--color-background);
  min-height: 5dvh;
  background-color: var(--color-background-soft);
  padding: 2dvh;
  /* box-shadow: inset 0px 0px 40px 40px var(--color-background); */
}

.pagination-container {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-top: 10px;
}

button {
  padding: 8px 12px;
  border: none;
  cursor: pointer;
  background-color: var(--color-background-soft);
  border-radius: 5px;
  transition: background 0.3s ease;
}

button:hover {
  background-color: var(--color-background-mute);
}

table {

  padding: 2dvw 1dvw;
  width: 100%;
  border: 4px solid var(--color-border);

  thead {


    th {

      padding: 0.5%;
    }
  }

  tbody td {
    border-top: 1px solid var(--color-border);
    padding: 0 1%;
  }

  tr {
    height: 1rem;
  }

  tr.selected {
    background-color: var(--color-background-mute);
  }
}

/*
.pageButton {

}
*/

.mobile_list {
  width: calc(100% - 0.2rem);
  margin: 0rem 0.1rem;
  margin-bottom: 0.5rem;
}

.search_bar {
  margin: 1rem 0.5rem;
}

select {
  background-color: var(--color-background-mute);
  padding: 0.25rem;
}


/* Tags for mobile */
.tag-buttons {
  padding: 0.5rem;
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

button {
  padding: 0.4rem 0.8rem;
  border-radius: 1rem;
  border: 1px solid #ccc;
  background: white;
  cursor: pointer;
  transition: 0.2s;
}

button.selected {
  background: #4caf50;
  color: white;
  border-color: #388e3c;
}

.tag-pill {
  margin-left: 0.5rem;
  background: #eee;
  border: 1px solid #aaa;
  border-radius: 1rem;
  padding: 0.2rem 0.6rem;
  font-size: 0.9rem;
  cursor: pointer;
  display: inline-block;
  transition: 0.2s;
}

.tag-pill:hover {
  background: #ccc;
}

.overlay {
  position: fixed;
  inset: 0;
  background: rgba(0,0,0,0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}
.modal-content {
  background: #fff;
  padding: 1rem;
  border-radius: 0.5rem;
  width: 90%;
  max-height: 90%;
  overflow-y: auto;
}

.edit {
  background-color: var(--primary-blue);
  color: white;
}

.editting {
  background-color: white;
  color: var(--primary-blue);
}

.delete {
  background-color: red;
  color: white;
}

.deleting {
  background-color: white;
  color: red
}
</style>