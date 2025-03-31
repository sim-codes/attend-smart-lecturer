'use client';
import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  MenuItem,
  Grid,
  Typography
} from '@mui/material';
import { classScheduleService, lecturerService, departmentService, courseService, levelService, classroomService } from '@/lib/services';

const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];

const ClassScheduleForm = ({ open, onClose, facultyId, onSuccess, classrooms }) => {
  const [formData, setFormData] = useState({
    dayOfWeek: '',
    startTime: '',
    endTime: '',
    lecturerId: '',
    courseId: '',
    levelId: '',
    departmentId: '',
    classroomId: ''
  });

  const [lecturers, setLecturers] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [courses, setCourses] = useState([]);
  const [levels, setLevels] = useState([]);

  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        const [lecturersRes, departmentsRes] = await Promise.all([
          lecturerService.getAllLecturers(),
          departmentService.getAllDepartments()
        ]);
        setLecturers(lecturersRes?.data);
        setDepartments(departmentsRes?.data);
      } catch (error) {
        console.error('Error fetching initial data:', error);
      }
    };

    fetchInitialData();
  }, []);

  useEffect(() => {
    const fetchDependentData = async () => {
      if (formData.departmentId) {
        try {
          const [coursesRes, levelsRes] = await Promise.all([
            courseService.getAllCoursesByDepartment(formData.departmentId),
            levelService.getAllLevels(formData.departmentId)
          ]);
          if (coursesRes.success) {
            setCourses(coursesRes.data.courses);
            setLevels(levelsRes?.data);
          }
        } catch (error) {
          console.error('Error fetching dependent data:', error);
        }
      }
    };

    fetchDependentData();
  }, [formData.departmentId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await classScheduleService.create(formData);
      onSuccess();
      onClose();
    } catch (error) {
      console.error('Error creating class schedule:', error);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>Create New Class Schedule</DialogTitle>
      <form onSubmit={handleSubmit}>
        <DialogContent>
          <Typography variant="h6" gutterBottom>Schedule Details</Typography>
          <Grid container spacing={2}>
            <Grid item xs={12} md={4}>
              <TextField
                select
                fullWidth
                margin="normal"
                label="Day of Week"
                value={formData.dayOfWeek}
                onChange={(e) => setFormData({ ...formData, dayOfWeek: e.target.value })}
              >
                {daysOfWeek.map((day) => (
                  <MenuItem key={day} value={day}>{day}</MenuItem>
                ))}
              </TextField>
            </Grid>
            <Grid item xs={6} md={4}>
              <TextField
                fullWidth
                margin="normal"
                label="Start Time"
                type="time"
                InputLabelProps={{ shrink: true }}
                value={formData.startTime}
                onChange={(e) => setFormData({ ...formData, startTime: e.target.value })}
              />
            </Grid>
            <Grid item xs={6} md={4}>
              <TextField
                fullWidth
                margin="normal"
                label="End Time"
                type="time"
                InputLabelProps={{ shrink: true }}
                value={formData.endTime}
                onChange={(e) => setFormData({ ...formData, endTime: e.target.value })}
              />
            </Grid>
          </Grid>

          <Typography variant="h6" gutterBottom sx={{ mt: 3 }}>Course Information</Typography>
          <Grid container spacing={2}>
            <Grid item xs={12} md={4}>
              <TextField
                select
                fullWidth
                margin="normal"
                label="Department"
                value={formData.departmentId}
                onChange={(e) => setFormData({ ...formData, departmentId: e.target.value, courseId: '', levelId: '' })}
              >
                {departments.map((dept) => (
                  <MenuItem key={dept.id} value={dept.id}>{dept.name}</MenuItem>
                ))}
              </TextField>
            </Grid>
            <Grid item xs={6} md={4}>
              <TextField
                select
                fullWidth
                margin="normal"
                label="Course"
                value={formData.courseId}
                onChange={(e) => setFormData({ ...formData, courseId: e.target.value })}
              >
                {courses.map((course) => (
                  <MenuItem key={course.id} value={course.id}>{course.title}</MenuItem>
                ))}
              </TextField>
            </Grid>
            <Grid item xs={6} md={4}>
              <TextField
                select
                fullWidth
                margin="normal"
                label="Level"
                value={formData.levelId}
                onChange={(e) => setFormData({ ...formData, levelId: e.target.value })}
              >
                {levels.map((level) => (
                  <MenuItem key={level.id} value={level.id}>{level.name}</MenuItem>
                ))}
              </TextField>
            </Grid>
          </Grid>

          <Typography variant="h6" gutterBottom sx={{ mt: 3 }}>Location & Instructor</Typography>
          <Grid container spacing={2}>
            <Grid item xs={12} md={6}>
              <TextField
                select
                fullWidth
                margin="normal"
                label="Classroom"
                value={formData.classroomId}
                onChange={(e) => setFormData({ ...formData, classroomId: e.target.value })}
              >
                {classrooms.map((classroom) => (
                  <MenuItem key={classroom.id} value={classroom.id}>{classroom.name}</MenuItem>
                ))}
              </TextField>
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                select
                fullWidth
                margin="normal"
                label="Lecturer"
                value={formData.lecturerId}
                onChange={(e) => setFormData({ ...formData, lecturerId: e.target.value })}
              >
                {lecturers.map((lecturer) => (
                  <MenuItem key={lecturer.userId} value={lecturer.userId}>{lecturer.firstName} {lecturer.lastName}</MenuItem>
                ))}
              </TextField>
            </Grid>
          </Grid>
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
