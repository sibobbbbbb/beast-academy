<template>
  <main class="main-container">
    <button v-if="!showDeleteColumn" @click="toggleDeleteColumn">Delete Member</button>
    <button v-if="showDeleteColumn" @click="toggleDeleteColumn">Cancel</button>
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
            <button @click="editMember(data)">Edit</button>
          </td>
          <td>
              <span v-if="editingMember !== data.id">{{ data.name }}</span>
              <input v-else v-model="data.name" @keyup.enter="saveItem(data)" @keyup.esc="cancelEdit(data)" />
          </td>
          <td>{{ data.created_at }}</td>
          <td>{{ data.phone_no }}</td>
          <td v-if="showDeleteColumn">
              <button @click="deleteMember(data.id)">Delete</button>
          </td>
        </tr>
      </tbody>
    </table>
  </main>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { getMember, deleteMemberById, updateUserData } from '../services/memberServices';

const data = ref<string | null>(null);

const fetchData = async () => {
  data.value = await getMember();
};

const deleteMember = async (id: string) => {
  const confirmed = confirm('Are you sure you want to delete this member?');
  if (confirmed) {
    await deleteMemberById(id);
    fetchData(); // Refresh data after deletion
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
  fetchData();
  console.log('Save item:', item);
}

function cancelEdit(item: dataItem) {
  item.name = originalName.value;
  editingMember.value = null;
  originalName.value = null;
  console.log('Edit cancelled:', item);
}

const editingMember = ref<string | null>(null);
const originalName = ref<string | null>(null);
const showDeleteColumn = ref(false);

function toggleDeleteColumn() {
  showDeleteColumn.value = !showDeleteColumn.value;
}

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