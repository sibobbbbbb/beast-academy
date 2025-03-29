<template>
  <div class="events-container mx-auto p-6 bg-gray-50">
    <!-- Header -->
    <div class="flex justify-between items-center mb-8">
      <h1 class="text-3xl font-bold text-[#0099cc]">Events</h1>
      <button 
        @click="openCreateForm" 
        class="bg-[#0099cc] hover:bg-[#007aa3] text-white px-5 py-2.5 rounded-lg flex items-center font-medium transition-colors"
      >
        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
          <path fill-rule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 011-1z" clip-rule="evenodd" />
        </svg>
        Create Event
      </button>
    </div>

    <!-- Search Bar -->
    <div class="search-bar">
      <input
        v-model="searchQuery"
        @input="handleSearch"
        type="text"
        placeholder="Search events..."
        class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0099cc]"
      />
    </div>

    <!-- Error alert -->
    <div v-if="error" class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
      {{ error }}
    </div>

    <!-- Events list -->
    <div v-if="filteredEvents.length > 0" class="event-card-container flex flex-col items-center w-full">
      <div v-for="event in filteredEvents" :key="event.id" class="w-full max-w-[70%]">
        <EventCard 
          :event="event"
          @edit="openEditForm"
          @delete="openDeleteConfirm"
        />
      </div>
    </div>

    <!-- Empty state -->
    <div v-else-if="!loading" class="text-center py-16 bg-white rounded-lg shadow-sm">
      <div class="inline-flex items-center justify-center w-16 h-16 rounded-full bg-[#e6f5fa] mb-4">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8 text-[#0099cc]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v3m0 0v3m0-3h3m-3 0H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      </div>
      <h3 class="text-xl font-semibold text-gray-800 mb-2">No events found</h3>
      <p class="text-gray-600">Create your first event to get started!</p>
    </div>

    <!-- Loading indicator -->
    <div v-if="loading" class="flex justify-center py-8">
      <div class="animate-spin rounded-full h-10 w-10 border-b-2 border-[#0099cc]"></div>
    </div>

    <!-- Sentinel element for infinite scrolling -->
    <div id="sentinel" class="h-4 w-full"></div>

    <!-- Create Event Modal -->
    <EventForm
      v-if="showCreateForm"
      :event="currentEvent"
      title="Create New Event"
      @save="handleCreateEvent"
      @cancel="showCreateForm = false"
    />
    
    <!-- Edit Event Modal -->
    <EventForm
      v-if="showEditForm"
      :event="currentEvent"
      title="Edit Event"
      @save="handleEditEvent"
      @cancel="showEditForm = false"
    />
    
    <!-- Delete Confirmation Modal -->
    <ConfirmDialog
      v-if="showDeleteConfirm"
      title="Delete Event"
      message="Are you sure you want to delete this event? This action cannot be undone."
      confirm-text="Delete"
      cancel-text="Cancel"
      @confirm="handleDeleteEvent"
      @cancel="showDeleteConfirm = false"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { fetchEvents, deleteEvents, editEvents, createEvents, type EventData } from '@/services/eventServices.ts';
import EventCard from '../components/EventCard.vue';
import EventForm from '../components/EventFrom.vue';
import ConfirmDialog from '../components/ConfirmDialog.vue';

// State management
const events = ref<EventData[]>([]);
const searchQuery = ref<string>(''); // Search query
const filteredEvents = computed(() =>
  events.value.filter(event =>
    event.title.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
    event.description.toLowerCase().includes(searchQuery.value.toLowerCase())
  )
);
const page = ref(1);
const loading = ref(false);
const hasMore = ref(true);
const showCreateForm = ref(false);
const showEditForm = ref(false);
const showDeleteConfirm = ref(false);
const currentEvent = ref<EventData>({
  id: '',
  title: '',
  images: '',
  description: '',
  posted_at: ''
});
const error = ref<string | null>(null);

// Load initial events
onMounted(async () => {
  await loadEvents();
  
  // Set up intersection observer for infinite scrolling
  const observer = new IntersectionObserver(handleIntersect, {
    rootMargin: '100px',
  });
  
  const sentinel = document.querySelector('#sentinel');
  if (sentinel) {
    observer.observe(sentinel);
  }
});

// Load events function
async function loadEvents(reset = false) {
  if (loading.value || (!hasMore.value && !reset)) return;
  
  try {
    loading.value = true;
    error.value = null;
    
    if (reset) {
      page.value = 1;
      events.value = [];
    }
    
    const response = await fetchEvents(page.value);
    
    // Check if the API returns data in a specific format
    const newEvents = response.data || (response as unknown as EventData[]);
    
    if (newEvents.length === 0) {
      hasMore.value = false;
    } else {
      events.value = [...events.value, ...newEvents];
      page.value += 1;
    }
  } catch (err) {
    error.value = 'Failed to load events. Please try again.';
    console.error(err);
  } finally {
    loading.value = false;
  }
}

// Intersection observer handler for infinite scrolling
function handleIntersect(entries: IntersectionObserverEntry[]) {
  if (entries[0].isIntersecting && !loading.value && hasMore.value) {
    loadEvents();
  }
}

// Handle search input
function handleSearch() {
  // This function is triggered on every input change in the search bar
}

// Open create form
function openCreateForm() {
  currentEvent.value = {
    id: '',
    title: '',
    images: '',
    description: '',
    posted_at: ''
  } as EventData;
  showCreateForm.value = true;
}

// Open edit form
function openEditForm(event: EventData) {
  currentEvent.value = { ...event };
  showEditForm.value = true;
}

// Open delete confirmation
function openDeleteConfirm(event: EventData) {
  currentEvent.value = event;
  showDeleteConfirm.value = true;
}

// Handle create event
async function handleCreateEvent(event: EventData) {
  try {
    loading.value = true;
    error.value = null;
    
    const response = await createEvents(event);
    showCreateForm.value = false;
    
    // Get the created event with its ID from the response
    const createdEvent = response.data as EventData || response as EventData;
    
    // Add the new event to the beginning of the events array
    // If the API doesn't return a posted_at field, add the current date
    if (!createdEvent.posted_at) {
      createdEvent.posted_at = new Date().toISOString();
    }
    
    // Add the new event to the beginning of the array so it appears at the top
    events.value = [createdEvent, ...events.value];
    
  } catch (err) {
    error.value = 'Failed to create event. Please try again.';
    console.error(err);
  } finally {
    loading.value = false;
  }
}

// Handle edit event
async function handleEditEvent(eventData: EventData) {
  try {
    loading.value = true;
    error.value = null;
    
    await editEvents(eventData.id, eventData);
    showEditForm.value = false;
    
    // Update the event in the local state
    const index = events.value.findIndex(e => e.id === eventData.id);
    if (index !== -1) {
      events.value[index] = { ...eventData };
    }
  } catch (err) {
    error.value = 'Failed to update event. Please try again.';
    console.error(err);
  } finally {
    loading.value = false;
  }
}

// Handle delete event
async function handleDeleteEvent() {
  try {
    loading.value = true;
    error.value = null;
    
    if (currentEvent.value) {
      await deleteEvents(currentEvent.value.id);
    }
    showDeleteConfirm.value = false;
    
    // Remove the event from the local state
    if (currentEvent.value) {
      events.value = events.value.filter(e => e.id !== currentEvent.value!.id);
    }
  } catch (err) {
    error.value = 'Failed to delete event. Please try again.';
    console.error(err);
  } finally {
    loading.value = false;
  }
}
</script>

<style scoped>
.events-container {
  min-height: 100vh;
}

.search-bar input {
  color: black; 
}

.search-bar {
  margin: 10px;
}

.event-card-container > div {
  margin-bottom: 8px; /* Tambahkan margin bawah 8px */
}

</style>