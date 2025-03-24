<template>
  <header style="height: 12dvh; padding: 0 2%; margin: 1%; display: flex; align-items: center; justify-content: flex-start;">
    <img src="https://placehold.co/512x512" style="height: 8dvh; aspect-ratio: 1/1; display: inline-block; margin-right: 1%;">
    <h1 style="font-weight: 600; font-size: 3rem; display: inline-block;">B.E.A.S.T. Academy Admin Utils</h1>
  </header>
  <hr>
  <div class="content">
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
          <td>{{ item.created_at }}</td>
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
</template>

<script setup lang="ts">
import SortableHeader from '@/components/SortableHeader.vue';
import { ref, onMounted, watch, toValue} from 'vue';
import { deleteMemberById, updateUserData } from '../services/memberServices';
import SearchBox from '@/components/SearchBox.vue';
import FilterDropdown from '@/components/FilterDropdown.vue';
import { fetchMembers } from '@/services/templateServices';
import Pagination from '@/components/PaginationApp.vue';
import { useRouter } from 'vue-router';
import { selectedMembersMap, selectMember, deselectMember, clearSelectedMembers, selectMembers, isEmpty, selectedCount , exportToFile} from '@/utils/memberSelection';
import { type Member } from '@/types/member';

const perPage = ref(10);
const currentPage = ref(0);
const lastFetch = ref<Member[]>([]);
const maxPage = ref(false);
const sortBy = ref("id");
const order = ref("asc");
const searchQuery = ref("");
const selectedRole = ref("");
const totalPages = ref(1);
const router = useRouter();

const editingMember = ref<number | null>(null);
const originalName = ref<string | null>(null);
const originalPhone = ref<string | null>(null);
const showDeleteColumn = ref(false);

const deleteMember = async (id: number) => {
  const confirmed = confirm('Are you sure you want to delete this member?');
  if (confirmed) {
    await deleteMemberById(id);
    dataFetcher(0); // Refresh data after deletion
  }
  console.log('Delete member:', id);
};

function editMember(item: Member) {
  editingMember.value = item.id;
  originalName.value = item.name;
  originalPhone.value = item.phone_no;
}

async function saveItem(item: Member) {
  editingMember.value = null;
  originalName.value = null;
  originalPhone.value = null;
  await updateUserData(item.id, item.name, item.phone_no);
  dataFetcher(0);
  console.log('Save item:', item);
}

function cancelEdit(item: Member) {
  item.name = originalName.value ?? '';
  item.phone_no = originalPhone.value ?? '';
  editingMember.value = null;
  originalName.value = null;
  originalPhone.value = null; 
  console.log('Edit cancelled:', item);
}

function toggleDeleteColumn() {
  showDeleteColumn.value = !showDeleteColumn.value;
}

const dataFetcher = async (page: number) => {
  try {
    const response = await fetchMembers(perPage.value, page, sortBy.value, order.value, searchQuery.value, selectedRole.value);
    lastFetch.value = response.data;
    totalPages.value = response.pagination.totalPages; // 🔹 Pastikan backend mengembalikan total halaman

    // Cek apakah ini halaman terakhir
    maxPage.value = response.pagination.totalPages <= currentPage.value + 1;
  } catch (error) {
    console.error("Failed to fetch members:", error);
  }
};

//On perpage change
watch(perPage, async () => {
  currentPage.value = 0;
  await dataFetcher(0);
});

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

const refresh = async (newPage?: number) => {
  console.log('Refreshing data...',newPage);
  if (newPage !== undefined) {
    currentPage.value = newPage;
  }
  await dataFetcher(currentPage.value);

  console.log(currentPage.value);
};

onMounted(() => {
  refresh(0);
});

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

select {
  background-color: var(--color-background-mute);
  padding: 0.25rem;
}

</style>