<!-- filepath: c:\Users\Axel Santadi\Documents\Cool_Yeah\Tingkat_3\Semester_6\PPL\Tubes\beast-academy\frontend\src\views\EventDetails.vue -->
<template>
  <div class="container">
    <div class="header">
      <button @click="goBack" class="back-button">←</button>
      <h1>Event Details</h1>
    </div>
    <hr />
    <div v-if="event" class="event-details">
      <h2>{{ event.title }}</h2>
      <p>{{ event.description }}</p>
      <img 
        v-if="event.images" 
        :src="event.images" 
        :alt="event.title" 
        class="event-image"
      />
    </div>
    <div v-else>
      <p>Loading event details...</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';

interface Event {
  id: number;
  title: string;
  images: string;
  description: string;
  posted_at: string;
}

const route = useRoute();
const router = useRouter();
const event = ref<Event | null>(null);
const error = ref<string | null>(null);

const fetchEventDetails = async (id: string) => {
  try {
    const response = await fetch(`http://localhost:3000/api/eventDetails/${id}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch event details: ${response.statusText}`);
    }

    const data = await response.json();

    if (data.success && data.data) {
      event.value = data.data;
    } else {
      throw new Error(data.message || 'Unexpected API response');
    }
  } catch (err) {
    console.error('Error fetching event details:', err);
    error.value = 'Failed to load event details. Please try again later.';
  }
};

const goBack = () => {
  router.push('/events');
};

onMounted(() => {
  const eventId = route.params.id as string;
  fetchEventDetails(eventId);
});
</script>

<style scoped>
.container {
  max-width: 600px;
  margin: 0 auto;
  padding: 20px;
}

.header {
  display: flex;
  align-items: center;
}

.back-button {
  background: none;
  border: none;
  font-size: 24px;
  cursor: pointer;
  margin-right: 10px;
}

h1 {
  margin: 0;
  font-size: 24px;
}

hr {
  margin: 20px 0;
  border: none;
  border-top: 1px solid #ccc;
}

.event-details {
  background-color: #f9f9f9;
  padding: 20px;
  border-radius: 10px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
}

.event-details h2 {
  margin-top: 0;
  font-size: 28px;
}

.event-details p {
  margin: 10px 0;
}
</style>