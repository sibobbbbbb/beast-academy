<template>
    <div>
      <h1>Data dari Backend:</h1>
      <div v-if="data">
        <p class="text-red-500">Nama: {{ data }}</p>
      </div>
      <div v-else>
        <p>Memuat data...</p>
      </div>
    </div>
  </template>
  
  <script setup lang="ts">
  import { ref, onMounted } from 'vue';
  import { getData } from '../services/templateServices';

  const data = ref<string | null>(null);

  const fetchData = async () => {
    data.value = await getData();
  };

  onMounted(fetchData);
  </script>
  
  <style scoped>
  h1 {
    color: #42b983;
  }
  </style>
  