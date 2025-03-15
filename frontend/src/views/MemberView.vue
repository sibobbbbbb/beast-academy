<template>
  <main class="main-container">
    <table class="center-table">
      <thead>
        <tr>
          <th>ID</th>
          <th>Edit Button</th>
          <th>Nama</th>
          <th>Join Date</th>
          <th>Contact</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="data in data" :key="data.id">
          <td>{{ data.id }}</td>
          <td>
            <button @click="deleteMember(data.id)">Delete</button>
          </td>
          <td>{{ data.name }}</td>
          <td>{{ data.created_at }}</td>
          <td>{{ data.phone_no }}</td>
        </tr>
      </tbody>
    </table>
  </main>
</template>

<script setup lang="ts">
  import { ref, onMounted } from 'vue';
  import { getMember, deleteMemberById } from '../services/memberServices';

  const data = ref<string | null>(null);

  const fetchData = async () => {
    data.value = await getMember();
  };

  const deleteMember = async (id: string) => {
    await deleteMemberById(id);
    fetchData();
  };

  onMounted(fetchData);
</script>

<style scoped>
.main-container {
  background-color: white;
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
}

.center-table {
  border-collapse: collapse;
  width: 50%;
}

.center-table th, .center-table td {
  border: 1px solid black;
  padding: 8px;
  text-align: center;
  color: black; /* Menambahkan warna hitam untuk teks */
}

.center-table th {
  background-color: #f2f2f2;
}

.center-table tr:nth-child(even) {
  background-color: #f9f9f9;
}

p {
  color: #42b983;
}
</style>