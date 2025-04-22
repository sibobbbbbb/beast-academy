export const createNote = async (req, res) => {
    try {
        const { userId, role } = req.user;
        const { memberId, notes } = req.body;
        
        // Validate input
        if (!memberId || !notes) {
        return res.status(400).json({ error: 'Member ID and notes are required' });
        }
        
        // Create new assignment with notes
        const newAssignment = await prisma.training_assignments.create({
        data: {
            trainer_id: parseInt(userId),
            member_id: parseInt(memberId),
            start_date: new Date(),
            notes: notes,
            status: 'active'
        }
        });
        
        return res.status(201).json({
        message: 'Note created successfully',
        data: newAssignment
        });
    } catch (error) {
        console.error('Error creating note:', error);
        return res.status(500).json({ error: 'Server error' });
    }
};


export const getMemberNotes = async (req, res) => {
    try {
      const memberId = parseInt(req.params.memberId);
      
      const notes = await prisma.training_assignments.findMany({
        where: {
          member_id: memberId
        },
        orderBy: {
          created_at: 'desc'
        },
        include: {
          users_training_assignments_trainer_idTousers: {
            select: {
              id: true,
              name: true
            }
          }
        }
      });
      
      return res.status(200).json(notes);
    } catch (error) {
      console.error('Error getting member notes:', error);
      return res.status(500).json({ error: 'Server error' });
    }
};


export const getNoteById = async (req, res) => {
    try {
      const noteId = parseInt(req.params.id);
      
      const note = await prisma.training_assignments.findUnique({
        where: {
          id: noteId
        },
        include: {
          users_training_assignments_trainer_idTousers: {
            select: {
              id: true,
              name: true
            }
          },
          users_training_assignments_member_idTousers: {
            select: {
              id: true,
              name: true
            }
          }
        }
      });
      
      if (!note) {
        return res.status(404).json({ error: 'Note not found' });
      }
      
      return res.status(200).json(note);
    } catch (error) {
      console.error('Error getting note:', error);
      return res.status(500).json({ error: 'Server error' });
    }
};

export const updateNote = async (req, res) => {
    try {
      const { userId, role } = req.user;
      const noteId = parseInt(req.params.id);
      const { notes, status, end_date } = req.body;
      
      // Check if note exists
      const existingNote = await prisma.training_assignments.findUnique({
        where: {
          id: noteId
        }
      });
      
      if (!existingNote) {
        return res.status(404).json({ error: 'Note not found' });
      }
      
      // Only allow trainer who created the note or admin to update
      if (role !== 'admin' && existingNote.trainer_id !== parseInt(userId)) {
        return res.status(403).json({ error: 'Not authorized to update this note' });
      }
      
      // Update note
      const updatedNote = await prisma.training_assignments.update({
        where: {
          id: noteId
        },
        data: {
          notes: notes || existingNote.notes,
          status: status || existingNote.status,
          end_date: end_date ? new Date(end_date) : existingNote.end_date,
          updated_at: new Date()
        }
      });
      
      return res.status(200).json({
        message: 'Note updated successfully',
        data: updatedNote
      });
    } catch (error) {
      console.error('Error updating note:', error);
      return res.status(500).json({ error: 'Server error' });
    }
};

// Delete a note
export const deleteNote = async (req, res) => {
    try {
      const { userId, role } = req.user;
      const noteId = parseInt(req.params.id);
      
      // Check if note exists
      const existingNote = await prisma.training_assignments.findUnique({
        where: {
          id: noteId
        }
      });
      
      if (!existingNote) {
        return res.status(404).json({ error: 'Note not found' });
      }
      
      // Only allow trainer who created the note or admin to delete
      if (role !== 'admin' && existingNote.trainer_id !== parseInt(userId)) {
        return res.status(403).json({ error: 'Not authorized to delete this note' });
      }
      
      // Delete note
      await prisma.training_assignments.delete({
        where: {
          id: noteId
        }
      });
      
      return res.status(200).json({
        message: 'Note deleted successfully'
      });
    } catch (error) {
      console.error('Error deleting note:', error);
      return res.status(500).json({ error: 'Server error' });
    }
  };
  
  // Get all notes for a trainer
  export const getTrainerNotes = async (req, res) => {
    try {
      const { userId } = req.user;
      
      const notes = await prisma.training_assignments.findMany({
        where: {
          trainer_id: parseInt(userId)
        },
        orderBy: {
          created_at: 'desc'
        },
        include: {
          users_training_assignments_member_idTousers: {
            select: {
              id: true,
              name: true
            }
          }
        }
      });
      
      return res.status(200).json(notes);
    } catch (error) {
      console.error('Error getting trainer notes:', error);
      return res.status(500).json({ error: 'Server error' });
    }
};
