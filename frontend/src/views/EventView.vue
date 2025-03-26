<template>
  <div class="events-container max-w-2xl mx-auto p-4">
    <div class="flex justify-between items-center mb-6">
      <h1 class="text-2xl font-bold">Events</h1>
      <button 
        @click="openCreateForm" 
        class="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center"
      >
        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
          <path fill-rule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clip-rule="evenodd" />
        </svg>
        Create Event
      </button>
    </div>
    
    <!-- Error alert -->
    <div v-if="error" class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
      {{ error }}
    </div>
    
    <!-- Events list -->
    <div v-if="events.length > 0" class="space-y-6">
      <EventCard 
        v-for="event in events" 
        :key="event.id" 
        :event="event"
        @edit="openEditForm"
        @delete="openDeleteConfirm"
      />
    </div>
    
    <!-- Empty state -->
    <div v-else-if="!loading" class="text-center py-10">
      <p class="text-gray-500">No events found. Create your first event!</p>
    </div>
    
    <!-- Loading indicator -->
    <div v-if="loading" class="flex justify-center py-4">
      <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
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
import { ref, onMounted, computed } from 'vue';
import { fetchEvents, deleteEvents, editEvents, createEvents, type EventData} from '@/services/eventServices.ts';
import EventCard from '@/components/EventCard.vue';
import EventForm from '@/components/EventFrom.vue';
import ConfirmDialog from '@/components/ConfirmDialog.vue';

// State management
const events = ref<EventData[]>([]);
const page = ref(1);
const loading = ref(false);
const hasMore = ref(true);
const showCreateForm = ref(false);
const showEditForm = ref(false);
const showDeleteConfirm = ref(false);
const currentEvent = ref<EventData | null>(null);
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
async function handleCreateEvent(eventData: EventData) {
  try {
    loading.value = true;
    error.value = null;
    
    await createEvents(eventData);
    showCreateForm.value = false;
    
    // Reload events to show the new one
    await loadEvents(true);
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
</style>