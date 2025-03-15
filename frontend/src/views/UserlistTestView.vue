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
      <div class="table-container">
        <button v-if="!showDeleteColumn" @click="toggleDeleteColumn">Delete Member</button>
        <button v-if="showDeleteColumn" @click="toggleDeleteColumn">Cancel</button>
        <table>
            <tr>
                <td class="shead">
                    <SortableHeader>ID</SortableHeader>
                </td>
                <td class="shead">
                    <SortableHeader>Edit</SortableHeader>
                </td>
                <td class="shead">
                    <SortableHeader>name</SortableHeader>
                </td>
                <td class="shead">
                    <SortableHeader>joined</SortableHeader>
                </td>
                <td v-if="showDeleteColumn" class="shead">
                    <SortableHeader>Delete</SortableHeader>
                </td>
            </tr>
            <tr v-for="item in lastFetch" :key="item.id">
                <td>{{ item.id }}</td>
                <td>
                    <button @click="editItem(item)">Edit</button>
                </td>
                <td>
                    <span v-if="editingItem !== item.id">{{ item.name }}</span>
                    <input v-else v-model="item.name" @blur="saveItem(item)" @keyup.enter="saveItem(item)" @keyup.esc="cancelEdit(item)" />
                </td>
                <td>{{ item.joinDate }}</td>
                <td v-if="showDeleteColumn">
                    <button @click="deleteMember(item.id)">Delete</button>
                </td>
            </tr>
        </table>
      </div>
      <span id="pagination">
        <button @click="() => { currentPage > 0 ? refresh(currentPage - 1) : console.log('Already min!')}"> Prev </button>
        <button @click="() => { maxPage ? console.log('Already max!') : refresh(currentPage + 1)}"> Next </button>
      </span>
  </div>
</template>

<script setup lang="ts">
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