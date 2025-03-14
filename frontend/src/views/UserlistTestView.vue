<script setup lang="ts">
import SortableHeader from '@/components/SortableHeader.vue';
import { inject, ref , reactive, computed, onMounted, watch} from 'vue';
import { dummyFetchUserData, type dataItem, type filterItem } from '@/services/datafetch';
import type { ComputedRefSymbol } from '@vue/reactivity';

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
</style>
  