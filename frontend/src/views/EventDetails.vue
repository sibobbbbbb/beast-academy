<template>
    <div class="container">
      <!-- Header -->
      <div class="header">
        <button @click="goBack" class="back-button">←</button>
        <h1>Event</h1>
      </div>
      <hr />
  
      <!-- Event Details -->
      <div class="event-details">
        <h2>{{ event.title }}</h2>
        <p>{{ event.description }}</p>
        <p><strong>Date:</strong> {{ event.date }}</p>
        <p><strong>Location:</strong> {{ event.location }}</p>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref, onMounted } from 'vue';
  import { useRoute, useRouter } from 'vue-router';
  
  const route = useRoute();
  const router = useRouter();
  const event = ref({
    title: '',
    description: '',
    date: '',
    location: ''
  });
  
  const fetchEventDetails = async (id) => {
    // Fetch event details from API or data source
    // This is a placeholder for the actual data fetching logic
    event.value = {
      title: `Turnamen hiya hiya hiya`,
      description: `anda mau menang? sini aku temberang.`,
      date: '2025-03-26',
      location: 'Location for event'
    };
  };
  
  const goBack = () => {
    router.push('/eventView');
  };
  
  onMounted(() => {
    const eventId = route.params.id;
    fetchEventDetails(eventId);
  });
  </script>
  
  <style scoped>
  .container {
    max-width: 600px;
    margin: 0 auto;
    padding: 20px;
    font-family: Arial, sans-serif;
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