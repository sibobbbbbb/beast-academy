<script setup lang="ts">
import SortableHeader from '@/components/SortableHeader.vue';
import { inject, ref } from 'vue';

    //fetch data from link
    interface data {
      id : string,
      name : string,
    }

    let dummy : data[] = [{id : "100", name : "samuel"},{id : "101" , name : "jackson"}]
</script>

<template>
    <div class="content">
        <h1>User List Test</h1>
        <table>
            <tr>
                <td class="shead">
                    <SortableHeader>ID</SortableHeader>
                </td>
                <td class="shead">
                    <SortableHeader>name</SortableHeader>
                </td>
            </tr>
            <tr v-for="item in dummy">
                <td>{{ item.id }}</td>
                <td>{{ item.name }}</td>
            </tr>
        </table>
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
  </style>
  