<script setup lang="ts">
import { ref, computed, watch, onMounted, nextTick, onUnmounted } from 'vue'
import { fetchMembers } from '@/services/templateServices';
import { type Member } from '@/types/member';
import { selectedMembersMap, selectMember, deselectMember, exportToFile} from '@/utils/memberSelection';
import SortableHeader from '@/components/SortableHeader.vue';
import SearchBox from '@/components/SearchBox.vue';
import FilterDropdown from '@/components/FilterDropdown.vue';
import { useDeviceModeStore } from '@/stores/deviceMode'
import MobileListItem from '@/components/MobileListItem.vue'

const deviceStore = useDeviceModeStore()

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
});

async function dataFetcher(page: number, append = false) {
  try {
    const response = await fetchMembers(perPage.value, page, sortBy.value, order.value, searchQuery.value, selectedRole.value);
    
    if (append) {
      lastFetch.value = [...lastFetch.value, ...response.data]; // append mode
    } else {
      lastFetch.value = response.data; // reset mode
    }
  
    totalPages.value = response.pagination.totalPages;

    // Cek apakah ini halaman terakhir
    maxPage.value = response.pagination.totalPages <= currentPage.value + 1;
  } catch (error) {
    console.error("Failed to fetch members:", error);
  }
};


const refresh = async (newPage?: number, append = false) => {
  console.log('Refreshing data...',newPage);
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

// State management for search and filters
const search = ref('')
const selectedCategory = ref('all')
const selectedFilter = ref('none')

// This is kept to preserve mobile interactions
const tapContext = ref<'default' | 'custom'>("default")

// Watchers to react to changes in search/filter
// watch(search, (newSearch) => {
//   memberStore.filterMembers({ search: newSearch, category: selectedCategory.value, filter: selectedFilter.value })
// })

// watch([selectedCategory, selectedFilter], () => {
//   memberStore.filterMembers({ search: search.value, category: selectedCategory.value, filter: selectedFilter.value })
// })

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
  // "x1": "Skill",
  // "x2": "Skill2",
  // "x3": "Join Date",
  "email" : "E-Mail",
  "phone_no" : "Phone no.",
  "created_at" : "Created at",
  "last_activity" : "Last activity",
};

const mobileDisplayTag = computed(() => {
  return mobileTagSelected.value.map(key => mobileTagText[key]);
});

// Emits for parent
const emit = defineEmits<{
  (event: 'processMembers', members: Member | Member[]): void;
}>();

function processSelectedMembers() {
  const selectedMembers = Array.from(selectedMembersMap.value.values());
  emit('processMembers', selectedMembers);
}

function processSingleMember(member: Member) {
  emit('processMembers', member);
}

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
          <th class="shead">
            <SortableHeader sortid="created_at" @sort="handleSort">Joined</SortableHeader>
          </th>
          <th class="contact">
            <SortableHeader sortid="phone_no" @sort="handleSort">Contact</SortableHeader>
          </th>
        </tr>
      </thead>

      <tbody>
        <tr v-for="item in lastFetch" :key="item.id" :class="{ selected: selectedMembersMap.has(item.id) }">
          <td v-show="props.multiSelect">
            <input type="checkbox"
              @change="($event) => ($event.target as HTMLInputElement).checked ? selectMember(item) : deselectMember(item)"
              :checked="selectedMembersMap.has(item.id)" />
          </td>
          <td>{{ item.id }}</td>
          <td>
            <span>{{ item.name }}</span>
          </td>
          <td>{{ new Date(item.created_at).toLocaleString('en-GB', {
            year: 'numeric', month: '2-digit', day: '2-digit',
            hour: '2-digit', minute: '2-digit', second: '2-digit'
          }).replace(',', ',') }}</td>
          <td>
            <span>{{ item.phone_no }}</span>
          </td>
        </tr>
      </tbody>
    </table>

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
        <MobileListItem v-for="item in lastFetch" :key="item.id" @click="() => {processSingleMember(item)}">
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
    <nav
      style="position: sticky; bottom: 0; background-color: rgba(190, 100, 180, 0.6); text-align: center; padding-top: 0.025rem;">
      <hr style="
        width: 25%;
        height: 4px;
        background-color: #999;
        border: none;
        border-radius: 2px;
        margin: 0.2rem auto;
        align-self: center;
      ">
      <!-- toggle the overlay -->
      <!-- <button @click="showAddOverlay = true">Add Member</button>
      <button @click="() => {toggleActionContext(mobileActions.Edit)}" :class="{ 'editting': isAction(mobileActions.Edit), 'edit': !isAction(mobileActions.Edit) }">Edit</button>
      <button @click="() => {toggleActionContext(mobileActions.Delete)}" :class="{ 'deleting': isAction(mobileActions.Delete), 'delete': !isAction(mobileActions.Delete) }">Delete</button>
      <button>Export</button> -->
    </nav>
  </section>
</template>

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