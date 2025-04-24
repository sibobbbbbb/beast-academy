<template>
  <header style="height: 12dvh; padding: 0 2%; margin: 1%; display: flex; align-items: center; justify-content: flex-start;">
    <img :src=logoImage style="height: 8dvh; display: inline-block; margin-right: 1%;">
    <h1 style="font-weight: 600; font-size: 2rem; display: inline-block;">BEAST Admin Page | {{ deviceStore.currentMode }}</h1>
  </header>
  <hr>
  <div class="content" v-if="!mobileMode">
    <span style="display: flex;">
      <FilterDropdown @filter="handleFilter" />
      <SearchBox @search="handleSearch" style="flex-grow: 1; margin: 0 2%;"/>
      <button @click="() => {refresh(0);}" id="refresh-button">Refresh!</button>
    </span>
    <button @click="() => {router.push('/add-member'); console.log('Added New Member')}">Add Member</button>
    <button v-if="!showDeleteColumn" @click="toggleDeleteColumn">Delete Member</button>
    <button v-if="showDeleteColumn" @click="toggleDeleteColumn">Cancel</button>
    <button @click="(_) => {exportToFile()}"> Export </button>
    <table>
      <thead>
        <tr>
          <th>
            <svg style="width: 2rem;" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512"><path style=" color: white" d="M64 80c-8.8 0-16 7.2-16 16l0 320c0 8.8 7.2 16 16 16l320 0c8.8 0 16-7.2 16-16l0-320c0-8.8-7.2-16-16-16L64 80zM0 96C0 60.7 28.7 32 64 32l320 0c35.3 0 64 28.7 64 64l0 320c0 35.3-28.7 64-64 64L64 480c-35.3 0-64-28.7-64-64L0 96zM200 344l0-64-64 0c-13.3 0-24-10.7-24-24s10.7-24 24-24l64 0 0-64c0-13.3 10.7-24 24-24s24 10.7 24 24l0 64 64 0c13.3 0 24 10.7 24 24s-10.7 24-24 24l-64 0 0 64c0 13.3-10.7 24-24 24s-24-10.7-24-24z"/></svg>
          </th>
          <th class="shead" style="width: 6rem;">
            <SortableHeader sortid="id" @sort="handleSort">ID</SortableHeader>
          </th>
          <th>Edit Button</th>
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
        <tr v-for="item in lastFetch" :key="item.id" :class="{ selected : selectedMembersMap.has(item.id) }">
          <td>
            <input 
              type="checkbox" 
                @change="($event) => ($event.target as HTMLInputElement).checked ? selectMember(item) : deselectMember(item)"
              :checked="selectedMembersMap.has(item.id)"
    />
          </td>
          <td>{{ item.id }}</td>
          <td>
            <button @click="editMember(item)">Edit</button>
          </td>
          <td>
            <span v-if="editingMember !== item.id">{{ item.name }}</span>
            <input v-else v-model="item.name" @keyup.enter="saveItem(item)" @keyup.esc="cancelEdit(item)" />
            </td>
            <td>{{ new Date(item.created_at).toLocaleString('en-GB', { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', second: '2-digit' }).replace(',', ',') }}</td>
          <td>
            <span v-if="editingMember !== item.id">{{ item.phone_no }}</span>
            <input v-else v-model="item.phone_no" @keyup.enter="saveItem(item)" @keyup.esc="cancelEdit(item)" />
          </td>
          <td v-if="showDeleteColumn">
            <button @click="deleteMember(item.id)">Delete</button>
          </td>
        </tr>
      </tbody>
    </table>
    <span style="float: right; margin-top: 1%;">
      <h3>Showing
        <select v-model="perPage">
          <option :value="10">10</option>
          <option :value="20">20</option>
          <option :value="50">50</option>
        </select>
        per page
      </h3>
    </span>

    <span id="pagination" class="pagination-container">
      <button class="pageButton" @click="currentPage > 0 ? refresh(currentPage - 1) : console.log('Already min!')"> Prev </button>
      <Pagination :current-page="currentPage" @go-to-page="refresh" :page-count="totalPages"/>
      <button class="pageButton" @click="!maxPage ? refresh(currentPage + 1) : console.log('Already max!')"> Next </button>
    </span>
  </div>
  
  <!-- Mobile screen mode -->
  <div v-else>
    <nav style="position: sticky; top: 0rem; background-color: rgba(190, 100, 180, 0.6); padding: 0.25rem 0.5rem; padding-top: 1rem;">
      <details>
    <summary>
      <label style="font-size: 1.5rem;">Display:</label>
      <span v-if="mobileDisplayTag.length === 0" style="margin-left: 0.5rem;">(None)</span>
      <span
  v-for="tag in mobileTagSelected"
    :key="tag"
    class="tag-pill"
    @click.stop.prevent="toggleTag(tag)"
  >
    {{ mobileTagText[tag] }}
  </span>

    </summary>

    <div class="tag-buttons">
      <button
        v-for="(label, key) in mobileTagText"
        :key="key"
        @click="toggleTag(key)"
        :class="{ selected: mobileTagSelected.includes(key) }"
      >
        {{ label }}
      </button>
    </div>
  </details>

    </nav>
    <table class="mobile_list">
      <thead>

      </thead>
      <tbody>
        <MobileListItem
        v-for="(item, idx) in dummyMobileItems"
        :key="idx"
      >
        <!-- primary slot -->
        <template #main>
          {{ item.name }}
        </template>
        <!-- non-primary slots -->
        <template #x1 v-if="mobileTagSelected[0]">
          <label>
            Skill
          </label>
          {{ item[mobileTagSelected[0]] }}
        </template>
        <template #x2 v-if="mobileTagSelected[1]">
          <label>
            Skill
          </label>
          {{ item[mobileTagSelected[1]] }}
        </template>
        <template #x3 v-if="mobileTagSelected[2]">
          <label>
            Skill
          </label>
          {{ item[mobileTagSelected[2]] }}
        </template>
      </MobileListItem>
      </tbody>
    </table>
    <nav style="position: sticky; bottom: 0; background-color: rgba(190, 100, 180, 0.6); text-align: center; padding-top: 0.025rem;">
      <hr style="
        width: 25%;
        height: 4px;
        background-color: #999;
        border: none;
        border-radius: 2px;
        margin: 0.2rem auto;
        align-self: center;
      ">
      <button>Do Something</button>
      <button>Do Else</button>
    </nav>
    <h2>
      A thick ass block of content lmao
    </h2>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'

import logoImage from '@/assets/beastLogo.png'
import SortableHeader from '@/components/SortableHeader.vue'
import SearchBox from '@/components/SearchBox.vue'
import FilterDropdown from '@/components/FilterDropdown.vue'
import Pagination from '@/components/PaginationApp.vue'

import { selectedMembersMap, selectMember, deselectMember, exportToFile } from '@/utils/memberSelection'
import { useMemberTable } from '@/utils/memberTable'
import { useDeviceModeStore } from '@/stores/deviceMode'
import MobileListItem from './MobileListItem.vue'

import dummyMobileItems from '@/utils/dummy.json'

const router = useRouter()
const {
  perPage,
  currentPage,
  lastFetch,
  maxPage,
  sortBy,
  order,
  searchQuery,
  selectedRole,
  totalPages,
  editingMember,
  showDeleteColumn,
  refresh,
  deleteMember,
  editMember,
  saveItem,
  cancelEdit,
  toggleDeleteColumn,
  handleSort,
  handleSearch,
  handleFilter,
} = useMemberTable()


const deviceStore = useDeviceModeStore()
const mobileMode = ref(false)

onMounted(() => {
  refresh(0)
  mobileMode.value = deviceStore.currentMode == "mobile"
})

const mobileTagSelected = ref<string[]>([]);

const mobileTagText: Record<string, string> = {
  "x1": "Skill",
  "x2": "Skill2",
  "x3": "Join Date",
};

const mobileDisplayTag = computed(() => {
  return mobileTagSelected.value.map(key => mobileTagText[key]);
});

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


</script>

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
    border-top : 1px solid var(--color-border);
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

.mobile_list{
  width: calc(100% - 0.2rem);
  margin: 2rem 0.1rem;
  margin-bottom: 0.5rem;
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
</style>