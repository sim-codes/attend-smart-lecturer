'use client';
import React, { useState } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, TextField, Button } from '@mui/material';

const ClassroomForm = ({ open, onClose, facultyId, onSuccess }) => {
  const [formData, setFormData] = useState({
    name: '',
    topLeftLat: '',
    topLeftLon: '',
    topRightLat: '',
    topRightLon: '',
    bottomLeftLat: '',
    bottomLeftLon: '',
    bottomRightLat: '',
    bottomRightLon: ''
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
          
          {/* Top Left Coordinates */}
          <TextField
            fullWidth
            margin="normal"
            label="Top Left Latitude"
            type="number"
            value={formData.topLeftLat}
            onChange={(e) => setFormData({ ...formData, topLeftLat: e.target.value })}
          />
          <TextField
            fullWidth
            margin="normal"
            label="Top Left Longitude"
            type="number"
            value={formData.topLeftLon}
            onChange={(e) => setFormData({ ...formData, topLeftLon: e.target.value })}
          />

          {/* Top Right Coordinates */}
          <TextField
            fullWidth
            margin="normal"
            label="Top Right Latitude"
            type="number"
            value={formData.topRightLat}
            onChange={(e) => setFormData({ ...formData, topRightLat: e.target.value })}
          />
          <TextField
            fullWidth
            margin="normal"
            label="Top Right Longitude"
            type="number"
            value={formData.topRightLon}
            onChange={(e) => setFormData({ ...formData, topRightLon: e.target.value })}
          />

          {/* Bottom Left Coordinates */}
          <TextField
            fullWidth
            margin="normal"
            label="Bottom Left Latitude"
            type="number"
            value={formData.bottomLeftLat}
            onChange={(e) => setFormData({ ...formData, bottomLeftLat: e.target.value })}
          />
          <TextField
            fullWidth
            margin="normal"
            label="Bottom Left Longitude"
            type="number"
            value={formData.bottomLeftLon}
            onChange={(e) => setFormData({ ...formData, bottomLeftLon: e.target.value })}
          />

          {/* Bottom Right Coordinates */}
          <TextField
            fullWidth
            margin="normal"
            label="Bottom Right Latitude"
            type="number"
            value={formData.bottomRightLat}
            onChange={(e) => setFormData({ ...formData, bottomRightLat: e.target.value })}
          />
          <TextField
            fullWidth
            margin="normal"
            label="Bottom Right Longitude"
            type="number"
            value={formData.bottomRightLon}
            onChange={(e) => setFormData({ ...formData, bottomRightLon: e.target.value })}
          />
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

export default ClassroomForm;
