'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { 
  Tab, 
  Tabs, 
  Box, 
  Typography, 
  Button, 
  Paper, 
  Select, 
  MenuItem, 
  FormControl, 
  InputLabel 
} from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import { classroomService, classScheduleService, facultyService, lecturerService } from '@/lib/services';
import ClassroomForm from '@/app/components/schedules/classroomForm';
import ClassScheduleForm from '@/app/components/schedules/classScheduleForm';

const SchedulePage = () => {
  const [tabValue, setTabValue] = useState(0);
  const [faculties, setFaculties] = useState([]);
  const [classrooms, setClassrooms] = useState({});
  const [schedules, setSchedules] = useState([]);
  const [lecturers, setLecturers] = useState([]);
  const [paginationModels, setPaginationModels] = useState({});
  
  const [selectedFaculty, setSelectedFaculty] = useState(null);
  const [showClassroomForm, setShowClassroomForm] = useState(false);
  const [showScheduleForm, setShowScheduleForm] = useState(false);

  // Fetch lecturers along with other initial data
  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        // Fetch lecturers
        const lecturerResponse = await lecturerService.getAllLecturers();
        if (lecturerResponse.success) {
            console.log('Lecturers:', lecturerResponse.data);
          setLecturers(lecturerResponse.data);
        }

        // Load faculties when component mounts
        if (tabValue === 1) {
          await loadFaculties();
        } else if (tabValue === 0) {
          await loadClassSchedules();
        }
      } catch (error) {
        console.error('Error fetching initial data:', error);
      }
    };

    fetchInitialData();
  }, [tabValue]);

  // Memoized schedule columns with lecturer name lookup
  const scheduleColumns = useMemo(() => [
    { 
      field: 'courseTitle', 
      headerName: 'Course', 
      flex: 1 
    },
    { 
      field: 'dayOfWeek', 
      headerName: 'Day', 
      flex: 1 
    },
    { 
      field: 'startTime', 
      headerName: 'Start Time', 
      flex: 1 
    },
    { 
      field: 'endTime', 
      headerName: 'End Time', 
      flex: 1 
    },
    { 
      field: 'lecturerName', 
      headerName: 'Lecturer', 
      flex: 1,
      valueGetter: (params) => {
        const lecturer = lecturers.find(l => l.id === params.row.lecturerId);
        return lecturer ? `${lecturer.firstName} ${lecturer.lastName}` : 'Unknown';
      }
    },
    {
      field: 'actions', 
      headerName: 'Actions', 
      flex: 1, 
      renderCell: (params) => (
        <Box sx={{ display: 'flex', gap: 1 }}>
          <Button 
            size="small" 
            variant="outlined" 
            onClick={() => handleEditSchedule(params.row)}
          >
            Edit
          </Button>
          <Button 
            size="small" 
            color="error" 
            variant="outlined" 
            onClick={() => handleDeleteSchedule(params.row.id)}
          >
            Delete
          </Button>
        </Box>
      )
    }
  ], [lecturers]);

  // Classroom columns with only name
  const classroomColumns = [
    { 
      field: 'name', 
      headerName: 'Classroom Name', 
      flex: 1 
    },
    { 
      field: 'actions', 
      headerName: 'Actions', 
      flex: 1,
      renderCell: (params) => (
        <Button 
          color="error" 
          variant="outlined"
          size="small"
          onClick={() => handleDeleteClassroom(selectedFaculty, params.row.id)}
        >
          Delete
        </Button>
      )
    }
  ];

  // Load faculties and initialize classrooms
  const loadFaculties = async () => {
    try {
      const response = await facultyService.getAllFaculties();
      if (response.success) {
        const facultyData = response.data;
        setFaculties(facultyData);

        // Initialize pagination and select first faculty if exists
        const initialPagination = {};
        facultyData.forEach(faculty => {
          initialPagination[faculty.id] = { page: 0, pageSize: 10 };
        });
        setPaginationModels(initialPagination);

        // Set first faculty as selected if exists
        if (facultyData.length > 0) {
          setSelectedFaculty(facultyData[0].id);
          loadClassroomsForFaculty(facultyData[0].id, 0, 10);
        }
      }
    } catch (error) {
      console.error('Error loading faculties:', error);
    }
  };

  // Load classrooms for a specific faculty
  const loadClassroomsForFaculty = async (facultyId, page, pageSize) => {
    try {
      const response = await classroomService.getAllClassroomsByFaculty(facultyId, page + 1, pageSize);
      if (response.success) {
        setClassrooms(prev => ({
          ...prev,
          [facultyId]: {
            data: response.data,
            total: response.data.length
          }
        }));
      }
    } catch (error) {
      console.error(`Error loading classrooms for faculty ${facultyId}:`, error);
    }
  };

  // Classroom pagination handler
  const handlePaginationModelChange = (facultyId, model) => {
    setPaginationModels(prev => ({
      ...prev,
      [facultyId]: model
    }));
    loadClassroomsForFaculty(facultyId, model.page, model.pageSize);
  };

  // Classroom deletion handler
  const handleDeleteClassroom = async (facultyId, classroomId) => {
    try {
      await classroomService.deleteClassroom(facultyId, classroomId);
      const currentModel = paginationModels[facultyId];
      loadClassroomsForFaculty(facultyId, currentModel.page, currentModel.pageSize);
    } catch (error) {
      console.error('Error deleting classroom:', error);
    }
  };

  // Schedule loading
  const loadClassSchedules = async () => {
    try {
      const response = await classScheduleService.getAllClassSchedules();
      setSchedules(response.data);
    } catch (error) {
      console.error('Error loading schedules:', error);
    }
  };

  // Schedule deletion handler
  const handleDeleteSchedule = async (id) => {
    try {
      await classScheduleService.deleteClassSchedule(id);
      loadClassSchedules();
    } catch (error) {
      console.error('Error deleting schedule:', error);
    }
  };

  // Edit schedule handler (placeholder)
  const handleEditSchedule = (schedule) => {
    console.log('Edit schedule:', schedule);
    // Implement edit logic
  };

  // Handle faculty selection change
  const handleFacultyChange = (facultyId) => {
    setSelectedFaculty(facultyId);
    loadClassroomsForFaculty(facultyId, 0, 10);
  };

  return (
    <Paper sx={{ p: 3, maxWidth: 1200, margin: 'auto' }}>
      <Typography variant="h4" gutterBottom>
        Academic Management Dashboard
      </Typography>

      <Tabs 
        value={tabValue} 
        onChange={(e, newValue) => setTabValue(newValue)}
        sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}
      >
        <Tab label="Class Schedules" />
        <Tab label="Classrooms" />
      </Tabs>

      {tabValue === 0 && (
        <Box>
          <Button 
            variant="contained" 
            color="primary" 
            onClick={() => setShowScheduleForm(true)}
            sx={{ mb: 2 }}
          >
            Add New Schedule
          </Button>
          <DataGrid
            rows={schedules}
            columns={scheduleColumns}
            pageSizeOptions={[10, 25, 50]}
            autoHeight
            disableSelectionOnClick
          />
        </Box>
      )}

      {tabValue === 1 && (
        <Box>
          {/* Faculty Dropdown */}
          <FormControl fullWidth sx={{ mb: 2 }}>
            <InputLabel>Select Faculty</InputLabel>
            <Select
              value={selectedFaculty || ''}
              label="Select Faculty"
              onChange={(e) => handleFacultyChange(e.target.value)}
            >
              {faculties.map(faculty => (
                <MenuItem key={faculty.id} value={faculty.id}>
                  {faculty.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          {selectedFaculty && (
            <Box>
              <Button
                variant="contained"
                color="primary"
                onClick={() => setShowClassroomForm(true)}
                sx={{ mb: 2 }}
              >
                Add Classroom
              </Button>
              <DataGrid
                rows={classrooms[selectedFaculty]?.data || []}
                columns={classroomColumns}
                rowCount={classrooms[selectedFaculty]?.total || 0}
                paginationMode="server"
                paginationModel={paginationModels[selectedFaculty] || { page: 0, pageSize: 10 }}
                onPaginationModelChange={(model) => handlePaginationModelChange(selectedFaculty, model)}
                pageSizeOptions={[10, 25, 50]}
                autoHeight
                disableSelectionOnClick
              />
            </Box>
          )}
        </Box>
      )}

      <ClassroomForm
        open={showClassroomForm}
        onClose={() => setShowClassroomForm(false)}
        facultyId={selectedFaculty}
        onSuccess={() => {
          if (selectedFaculty) {
            const model = paginationModels[selectedFaculty] || { page: 0, pageSize: 10 };
            loadClassroomsForFaculty(selectedFaculty, model.page, model.pageSize);
          }
        }}
      />

      <ClassScheduleForm
        open={showScheduleForm}
        onClose={() => setShowScheduleForm(false)}
        onSuccess={loadClassSchedules}
      />
    </Paper>
  );
};

export default SchedulePage;
