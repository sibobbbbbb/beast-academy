<script setup lang="ts">
import { ref } from 'vue';

const searchQuery = ref('');
const emit = defineEmits<{
  (e: 'search', query: string): void;
}>();

const onSearch = () => {
  emit('search', searchQuery.value);
};
</script>

<template>
  <div class="search-box">
    <input
      v-model="searchQuery"
      @input="onSearch"
      type="text"
      placeholder="Search by name, email, or phone..."
    />
  </div>
</template>

<style scoped>
.search-box {
  margin-bottom: 10px;
}
input {
  width: 100%;
  padding: 8px;
  font-size: 14px;
  border: 1px solid #ccc;
  border-radius: 4px;
}
</style>
