<template>
  <div class="notes-container">
    <div class="back-button" @click="goBack">
      <span class="back-arrow">←</span>
    </div>
    
    <div class="notes-header">
      <h1>Member Notes - {{ memberName }}</h1>
      <button @click="showAddNoteModal = true" class="add-note-btn">Add New Note</button>
    </div>

    <div v-if="loading" class="loading">
      Loading notes...
    </div>
    
    <div v-else-if="notes.length === 0" class="no-notes">
      No notes found for this member. Add a new note to get started.
    </div>
    
    <div v-else class="notes-grid">
      <div v-for="note in notes" :key="note.id" class="note-card">
        <div class="note-date">{{ formatDate(note.created_at) }}</div>
        <div class="note-content">{{ note.notes }}</div>
        <div class="note-footer">
          <span class="note-status" :class="note.status">{{ note.status }}</span>
          <div class="note-actions">
            <button @click="editNote(note)" class="edit-btn">Edit</button>
            <button @click="confirmDelete(note.id)" class="delete-btn">Delete</button>
          </div>
        </div>
      </div>
    </div>

    <!-- Add Note Modal -->
    <div v-if="showAddNoteModal" class="modal">
      <div class="modal-content">
        <span class="close" @click="showAddNoteModal = false">&times;</span>
        <h2>Add New Note</h2>
        <div class="form-group">
          <label for="noteContent">Note Content:</label>
          <textarea 
            id="noteContent" 
            v-model="newNote.notes" 
            rows="5" 
            placeholder="Enter your note here..."
          ></textarea>
        </div>
        <div class="form-group">
          <label for="noteStatus">Status:</label>
          <select id="noteStatus" v-model="newNote.status">
            <option value="active">Active</option>
            <option value="completed">Completed</option>
            <option value="on-hold">On Hold</option>
          </select>
        </div>
        <div class="form-actions">
          <button @click="showAddNoteModal = false" class="cancel-btn">Cancel</button>
          <button @click="addNote" class="submit-btn">Add Note</button>
        </div>
      </div>
    </div>

    <!-- Edit Note Modal -->
    <div v-if="showEditNoteModal" class="modal">
      <div class="modal-content">
        <span class="close" @click="showEditNoteModal = false">&times;</span>
        <h2>Edit Note</h2>
        <div class="form-group">
          <label for="editNoteContent">Note Content:</label>
          <textarea 
            id="editNoteContent" 
            v-model="editingNote.notes" 
            rows="5" 
            placeholder="Enter your note here..."
          ></textarea>
        </div>
        <div class="form-group">
          <label for="editNoteStatus">Status:</label>
          <select id="editNoteStatus" v-model="editingNote.status">
            <option value="active">Active</option>
            <option value="completed">Completed</option>
            <option value="on-hold">On Hold</option>
          </select>
        </div>
        <div class="form-group" v-if="editingNote.status === 'completed'">
          <label for="endDate">End Date:</label>
          <input 
            type="date" 
            id="endDate" 
            v-model="editingNote.end_date"
          >
        </div>
        <div class="form-actions">
          <button @click="showEditNoteModal = false" class="cancel-btn">Cancel</button>
          <button @click="saveNote" class="submit-btn">Save Changes</button>
        </div>
      </div>
    </div>

    <!-- Delete Confirmation Modal -->
    <div v-if="showDeleteModal" class="modal">
      <div class="modal-content delete-modal">
        <h2>Confirm Delete</h2>
        <p>Are you sure you want to delete this note? This action cannot be undone.</p>
        <div class="form-actions">
          <button @click="showDeleteModal = false" class="cancel-btn">Cancel</button>
          <button @click="removeNote" class="delete-btn">Delete</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { 
  createNote, 
  updateNote as updateNoteService, 
  deleteNote as deleteNoteService, 
  fetchMemberNotes, 
  getNoteById 
} from '@/services/noteServices';

// We need to import a service function for fetching member details
import { getMemberById } from '@/services/memberServices';

const route = useRoute();
const router = useRouter(); // Add router for navigation
const memberId = route.params.id;
const memberName = ref('');
const notes = ref([]);
const loading = ref(true);

// Modal states
const showAddNoteModal = ref(false);
const showEditNoteModal = ref(false);
const showDeleteModal = ref(false);

// Note data
const newNote = ref({
  notes: '',
  status: 'active',
});

const editingNote = ref({
  id: null,
  notes: '',
  status: '',
  end_date: null
});

const noteIdToDelete = ref(null);

// Back button function
const goBack = () => {
  router.push({ name: 'userlisttest' });
};

// Format date to display
const formatDate = (dateString) => {
  if (!dateString) return "Tanggal tidak tersedia";
  
  // Validasi tanggal
  const timestamp = Date.parse(dateString);
  if (isNaN(timestamp)) return "Format tanggal tidak valid";
  
  const date = new Date(timestamp);
  return new Intl.DateTimeFormat('id-ID', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
  }).format(date);
};

// Fetch member notes
const fetchNotes = async () => {
  try {
    loading.value = true;
    // Use the service function for notes
    const notesData = await fetchMemberNotes(memberId);
    notes.value = notesData;
    
    // Use service function for member details instead of direct fetch
    const memberData = await getMemberById(memberId);
    memberName.value = memberData.name;
  } catch (error) {
    console.error('Error fetching notes:', error);
  } finally {
    loading.value = false;
  }
};

// Add new note
const addNote = async () => {
  try {
    if (!newNote.value.notes.trim()) {
      alert('Note cannot be empty');
      return;
    }
    
    // Use the service function
    const createdNote = await createNote(memberId, newNote.value.notes, newNote.value.status);
    
    showAddNoteModal.value = false;
    newNote.value = { notes: '', status: 'active' };
    await fetchNotes();
  } catch (error) {
    console.error('Error adding note:', error);
    alert('Failed to add note');
  }
};

// Open edit modal with note data
const editNote = (note) => {
  editingNote.value = {
    id: note.id,
    notes: note.notes,
    status: note.status,
    end_date: note.end_date ? note.end_date.slice(0, 10) : null // Format to YYYY-MM-DD
  };
  showEditNoteModal.value = true;
};

// Update note
const saveNote = async () => {
  try {
    if (!editingNote.value.notes.trim()) {
      alert('Note cannot be empty');
      return;
    }
    
    const noteData = {
      notes: editingNote.value.notes,
      status: editingNote.value.status,
      end_date: editingNote.value.status === 'completed' ? editingNote.value.end_date : null
    };
    
    // Use the service function
    await updateNoteService(editingNote.value.id, noteData);
    
    showEditNoteModal.value = false;
    await fetchNotes();
  } catch (error) {
    console.error('Error updating note:', error);
    alert('Failed to update note');
  }
};

// Show delete confirmation
const confirmDelete = (id) => {
  noteIdToDelete.value = id;
  showDeleteModal.value = true;
};

// Delete note
const removeNote = async () => {
  try {
    // Use the service function
    await deleteNoteService(noteIdToDelete.value);
    
    showDeleteModal.value = false;
    noteIdToDelete.value = null;
    await fetchNotes();
  } catch (error) {
    console.error('Error deleting note:', error);
    alert('Failed to delete note');
  }
};

onMounted(() => {
  fetchNotes();
});
</script>

<style scoped>
.notes-container {
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
  position: relative;
}

/* Back Button Styles */
.back-button {
  position: fixed;
  top: 20px;
  left: 20px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  transition: background-color 0.2s, transform 0.2s;
  z-index: 100;
}

.back-button:hover {
  transform: scale(1.10);
}

.back-arrow {
  font-size: 35px;
  font-weight: bold;
  color: var(--color-text, #070707);
}

.notes-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30px;
}

.add-note-btn {
  background-color: var(--color-primary, #4caf50);
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 4px;
  cursor: pointer;
  font-weight: bold;
}

.add-note-btn:hover {
  background-color: var(--color-primary-dark, #388e3c);
}

.loading, .no-notes {
  text-align: center;
  margin: 50px 0;
  font-size: 18px;
  color: var(--color-text-secondary, #666);
}

.notes-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 20px;
}

@media (max-width: 1200px) {
  .notes-grid {
    grid-template-columns: repeat(3, 1fr);
  }
}

@media (max-width: 900px) {
  .notes-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 600px) {
  .notes-grid {
    grid-template-columns: 1fr;
  }
}

.note-card {
  background-color: var(--color-background-soft, #f9f9f9);
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  padding: 16px;
  display: flex;
  flex-direction: column;
  height: 100%;
  min-height: 200px;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.note-card:hover {
  transform: translateY(-3px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.note-date {
  font-size: 14px;
  color: var(--color-text-light, #888);
  margin-bottom: 10px;
}

.note-content {
  flex-grow: 1;
  margin-bottom: 15px;
  white-space: pre-wrap;
  overflow-wrap: break-word;
}

.note-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: auto;
}

.note-status {
  padding: 4px 8px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 500;
}

.note-status.active {
  background-color: #e8f5e9;
  color: #2e7d32;
}

.note-status.completed {
  background-color: #e3f2fd;
  color: #1565c0;
}

.note-status.on-hold {
  background-color: #fff3e0;
  color: #e65100;
}

.note-actions {
  display: flex;
  gap: 8px;
}

.edit-btn, .delete-btn {
  background: none;
  border: none;
  font-size: 14px;
  cursor: pointer;
  padding: 4px 8px;
  border-radius: 4px;
}

.edit-btn {
  color: var(--color-primary, #2196f3);
}

.edit-btn:hover {
  background-color: rgba(33, 150, 243, 0.1);
}

.delete-btn {
  color: var(--color-error, #f44336);
}

.delete-btn:hover {
  background-color: rgba(244, 67, 54, 0.1);
}

/* Modal Styles */
.modal {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: 1000;
  display: flex;
  justify-content: center;
  align-items: center;
}

.modal-content {
  background-color: white;
  padding: 25px;
  border-radius: 8px;
  width: 90%;
  max-width: 500px;
  position: relative;
}

.delete-modal {
  max-width: 400px;
  text-align: center;
}

.close {
  position: absolute;
  top: 15px;
  right: 20px;
  font-size: 24px;
  cursor: pointer;
  color: #666;
}

.form-group {
  margin-bottom: 20px;
}

.form-group label {
  display: block;
  margin-bottom: 6px;
  font-weight: 500;
}

.form-group textarea, 
.form-group select,
.form-group input {
  width: 100%;
  padding: 10px;
  border-radius: 4px;
  border: 1px solid #ddd;
  font-family: inherit;
}

.form-actions {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  margin-top: 20px;
}

.cancel-btn, .submit-btn {
  padding: 8px 16px;
  border-radius: 4px;
  font-weight: 500;
  cursor: pointer;
}

.cancel-btn {
  background-color: #f5f5f5;
  border: 1px solid #ddd;
  color: #333;
}

.submit-btn {
  background-color: var(--color-primary, #4caf50);
  border: none;
  color: white;
}

.submit-btn:hover {
  background-color: var(--color-primary-dark, #388e3c);
}
</style>