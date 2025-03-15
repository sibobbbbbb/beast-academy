<script setup lang="ts">
import SortableHeader from '@/components/SortableHeader.vue';
import { inject, ref , reactive, computed, onMounted, watch} from 'vue';
import { dummyFetchUserData, deleteUserData, updateUserData, type dataItem, type filterItem } from '@/services/datafetch';
import type { ComputedRefSymbol } from '@vue/reactivity';
import { deleteMemberById } from '@/services/memberServices';
import SearchBox from '@/components/SearchBox.vue';
import FilterDropdown from '@/components/FilterDropdown.vue';
import { fetchMembers, type Member } from '@/services/templateServices';


    //fetch data from link
    interface data {
      id : string,
      name : string,
    }

    // State utama
  const perPage = ref(3);
  const currentPage = ref(0);
  const lastFetch = ref<Member[]>([]);
  const maxPage = ref(false);
  const sortBy = ref("created_at"); // Default sorting
  const order = ref("asc"); // "asc" atau "desc"
  const searchQuery = ref("");
  const selectedRole = ref("");
  var pageCount = ref(0); 

    const editingItem = ref<string | null>(null);
    const originalName = ref<string | null>(null);

    const showDeleteColumn = ref(false);

    //On perpage change
    watch(perPage, async (newValue, oldValue) => {
      // for the time being, fetch from 0
      let fetchValues : dataItem[] = await dataFetcher(0);
      lastFetch.value = fetchValues;
      currentPage.value = 0

      // wait until new data is fetcheda
    })

    function editItem(item: dataItem) {
      editingItem.value = item.id;
      originalName.value = item.name;
    }

    async function saveItem(item: dataItem) {
      editingItem.value = null;
      originalName.value = null;
      await updateUserData(item.id, item.name);
      refresh();
      console.log('Save item:', item);
    }

    function cancelEdit(item: dataItem) {
      item.name = originalName.value;
      editingItem.value = null;
      originalName.value = null;
      console.log('Edit cancelled:', item);
    }

    const deleteMember = async (id: number) => {
      const confirmed = confirm('Are you sure you want to delete this member?');
      if (confirmed) {
        await deleteMemberById(id);
        refresh(currentPage.value)
      }
    };

    function toggleDeleteColumn() {
      showDeleteColumn.value = !showDeleteColumn.value;
    }

    //Pagination and frineds
    var pageCount = ref(0);

async function dataFetcher(page : number) {
  return dummyFetchUserData(perPage.value, page)
}

async function dataMaxFetcher() {
  return dummyFetchUserPages(perPage.value)
}

//On perpage change
watch(perPage, async (newValue, oldValue) => {
  // for the time being, fetch from 0
  let fetchValues : dataItem[] = await dataFetcher(0);
  lastFetch.value = fetchValues;
  await refresh(0,true)

  // wait until new data is fetcheda
})

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


//I might need to make a filter watcher aswell ngl

async function refresh(newPage? : number, filterChanged? : boolean) {
  //
  if (newPage === undefined) {
    newPage = currentPage.value
  } else {
    currentPage.value = newPage
  }

  // fetch page
  lastFetch.value = await dataFetcher(newPage);

  if (lastFetch.value.length < perPage.value) {
    maxPage = true
    console.log("Edge!!! %d %d",lastFetch.value.length , perPage.value)
  } else {
    maxPage = false
    console.log("Yup go on")
  }

  // here we reset pagination stuff
  // Handle specifically amt-reducing actions to reset pagination numbers
  if (filterChanged) {
    pageCount.value = await dataMaxFetcher();

    console.log("There are",pageCount.value,"pages lol")
  }
}

onMounted(() => {
  refresh(0);
});
</script>

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

    <table>
      <thead>
        <tr>
          <th class="shead">
            <SortableHeader sortid="id" @sort="handleSort">ID</SortableHeader>
          </th>
          <th class="shead">
            <SortableHeader sortid="name" @sort="handleSort">Name</SortableHeader>
          </th>
          <th class="shead">
            <SortableHeader sortid="created_at" @sort="handleSort">Joined</SortableHeader>
          </th>
        </tr>
      </thead>

      <tbody>
        <tr v-for="item in lastFetch" :key="item.id">
          <td>{{ item.id }}</td>
          <td>{{ item.name }}</td>
          <td>{{ item.created_at }}</td>
        </tr>
      </tbody>
    </table>

    <span id="pagination">
      <button @click="currentPage > 0 ? refresh(currentPage - 1) : console.log('Already min!')"> Prev </button>
      <button @click="maxPage ? console.log('Already max!') : refresh(currentPage + 1)"> Next </button>
    </span>
  </div>
</template>

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
</style>