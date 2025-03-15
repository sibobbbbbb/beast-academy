<!-- <script setup lang="ts">
import SortableHeader from '@/components/SortableHeader.vue';
import { inject, ref , reactive, computed, onMounted, watch} from 'vue';
import { dummyFetchUserData, deleteUserData, updateUserData, type dataItem, type filterItem } from '@/services/datafetch';
import type { ComputedRefSymbol } from '@vue/reactivity';
import { deleteMemberById } from '@/services/memberServices';

    //fetch data from link
    interface data {
      id : string,
      name : string,
    }

    let dummy : data[] = [{id : "100", name : "samuel"},{id : "101" , name : "jackson"}]

    const perPage = ref(10)

    const currentPage = ref(0)

    var maxPage = false;

    const lastFetch = ref<dataItem[]>([]);

    const editingItem = ref<string | null>(null);
    const originalName = ref<string | null>(null);

    const showDeleteColumn = ref(false);

    async function dataFetcher(page : number) {
      return dummyFetchUserData(perPage.value, page)
    }

    //On perpage change
    watch(perPage, async (newValue, oldValue) => {
      // for the time being, fetch from 0
      let fetchValues : dataItem[] = await dataFetcher(0);
      lastFetch.value = fetchValues;
      currentPage.value = 0

      // wait until new data is fetcheda
    })

    async function refresh(newPage? : number) {
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
    }

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
        fetchData(); // Refresh data after deletion
      }
    };

    function toggleDeleteColumn() {
      showDeleteColumn.value = !showDeleteColumn.value;
    }

    onMounted(() => {
      // Get page information here from url/link if any
      perPage.value = 10
      refresh(0);
    })

</script>

<template>
    <div class="content">
       <button @click="() => {currentPage += 1}">Add</button>
       <button @click="() => {currentPage += 1}">Add</button>
        <span>
          <h1>User List Test</h1>
          <h3>Showing 
            <select v-model="perPage">
              <option :value="10">10</option>
              <option :value="20">20</option>
              <option :value="50">50</option>
            </select>
            per page</h3>
        </span>
        <table>
            <tr>
                <td class="shead">
                    <SortableHeader>ID</SortableHeader>
                </td>
                <td class="shead">
                    <SortableHeader>name</SortableHeader>
                </td>
                <td class="shead">
                    <SortableHeader>joined</SortableHeader>
                </td>
            </tr>
            <tr v-for="item in lastFetch">
                <td>{{ item.id }}</td>
                <td>{{ item.name }}</td>
                <td>{{ item.joinDate }}</td>
            </tr>
        </table>
        <span id="pagination">
          <button @click="() => { currentPage > 0 ? refresh(currentPage - 1) : console.log('Already min!')}"> Prev </button>
          <button @click="() => { maxPage ? console.log('Already max!') : refresh(currentPage + 1)}"> Next </button>
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
</style> -->


<script setup lang="ts">
import { ref, watch, onMounted } from 'vue';
import SortableHeader from '@/components/SortableHeader.vue';
import SearchBox from '@/components/SearchBox.vue';
import FilterDropdown from '@/components/FilterDropdown.vue';
import { fetchMembers, type Member } from '@/services/templateServices';

// State utama
const perPage = ref(3);
const currentPage = ref(0);
const lastFetch = ref<Member[]>([]);
const maxPage = ref(false);
const sortBy = ref("created_at"); // Default sorting
const order = ref("asc"); // "asc" atau "desc"
const searchQuery = ref("");
const selectedRole = ref("");

// Fungsi untuk mengambil data dari API
const dataFetcher = async (page: number) => {
  try {
    const response = await fetchMembers(perPage.value, page, sortBy.value, order.value, searchQuery.value, selectedRole.value);
    lastFetch.value = response.data;

    // Cek apakah ini halaman terakhir
    maxPage.value = response.pagination.totalPages <= currentPage.value + 1;
  } catch (error) {
    console.error("Failed to fetch members:", error);
  }
};

// Watch perubahan jumlah perPage → Fetch ulang data
watch(perPage, async () => {
  currentPage.value = 0;
  await dataFetcher(0);
});

// Fungsi refresh data berdasarkan halaman & sorting
const refresh = async (newPage?: number) => {
  if (newPage !== undefined) {
    currentPage.value = newPage;
  }
  await dataFetcher(currentPage.value);
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
</style>