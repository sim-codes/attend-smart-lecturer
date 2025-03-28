'use client';
import React, { useState } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, TextField, Button } from '@mui/material';
import { classScheduleService, lecturerService } from '@/lib/services';

const ClassScheduleForm = ({ open, onClose, facultyId, onSuccess }) => {
  const [formData, setFormData] = useState({
    name: '',
    capacity: '',
    topLeftLat: '',
    topLeftLon: '',
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await classroomService.createClassroom(facultyId, formData);
      onSuccess();
      onClose();
    } catch (error) {
      console.error('Error creating classroom:', error);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>Create New Classroom</DialogTitle>
      <form onSubmit={handleSubmit}>
        <DialogContent>
          <TextField
            fullWidth
            margin="normal"
            label="Name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          />
          <TextField
            fullWidth
            margin="normal"
            label="Capacity"
            type="number"
            value={formData.capacity}
            onChange={(e) => setFormData({ ...formData, capacity: e.target.value })}
          />
          {/* Add other fields for coordinates */}
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose}>Cancel</Button>
          <Button type="submit" variant="contained" color="primary">
            Save
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default ClassScheduleForm;
