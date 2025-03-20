<template>
  <div class="content">
    <SearchBox @search="handleSearch" />
    <FilterDropdown @filter="handleFilter" />

    <span>
      <h1>User List Test</h1>
      <h3>Showing
        <select v-model="perPage">
          <option :value="10">10</option>
          <option :value="20">20</option>
          <option :value="50">50</option>
        </select>
        per page
      </h3>
    </span>
    <button @click="() => {router.push('/add-member'); console.log('BABIK')}">Add Member</button>
    <button v-if="!showDeleteColumn" @click="toggleDeleteColumn">Delete Member</button>
    <button v-if="showDeleteColumn" @click="toggleDeleteColumn">Cancel</button>
    <table>
      <thead>
        <tr>
          <th class="shead">
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
        <tr v-for="item in lastFetch" :key="item.id">
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

    <span id="pagination" class="pagination-container">
      <button @click="currentPage > 0 ? refresh(currentPage - 1) : console.log('Already min!')"> Prev </button>
      <Pagination :current-page="currentPage" @go-to-page="refresh" :page-count="totalPages"/>
      <button @click="!maxPage ? refresh(currentPage + 1) : console.log('Already max!')"> Next </button>
    </span>
  </div>
</template>

<script setup lang="ts">
import SortableHeader from '@/components/SortableHeader.vue';
import { inject, ref , reactive, computed, onMounted, watch} from 'vue';
import { dummyFetchUserData, deleteUserData, type dataItem, type filterItem } from '@/services/datafetch';
import type { ComputedRefSymbol } from '@vue/reactivity';
import { deleteMemberById, updateUserData } from '../services/memberServices';
import SearchBox from '@/components/SearchBox.vue';
import FilterDropdown from '@/components/FilterDropdown.vue';
import { fetchMembers, type Member } from '@/services/templateServices';
import Pagination from '@/components/Pagination.vue';
import { useRouter } from 'vue-router';

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

const editingMember = ref<string | null>(null);
const originalName = ref<string | null>(null);
const showDeleteColumn = ref(false);

const deleteMember = async (id: string) => {
  const confirmed = confirm('Are you sure you want to delete this member?');
  if (confirmed) {
    await deleteMemberById(id);
    dataFetcher(0); // Refresh data after deletion
  }
  console.log('Delete member:', id);
};

function editMember(item: dataItem) {
  editingMember.value = item.id;
  originalName.value = item.name;
}

async function saveItem(item: dataItem) {
  editingMember.value = null;
  originalName.value = null;
  await updateUserData(item.id, item.name);
  dataFetcher(0);
  console.log('Save item:', item);
}

function cancelEdit(item: dataItem) {
  item.name = originalName.value;
  editingMember.value = null;
  originalName.value = null;
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
  if (newPage !== undefined) {
    currentPage.value = newPage;
  }
  await dataFetcher(currentPage.value);
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
</style>