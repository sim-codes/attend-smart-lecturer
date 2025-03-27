'use client';

import React, { useState, useEffect } from 'react';
import { Tab, Tabs, Box, Typography, Button, Paper, Grid } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import { classroomService, classScheduleService } from '@/lib/services';
import ClassroomForm from '@/app/components/schedules/classroomForm';
import ClassScheduleForm from '@/app/components/schedules/classScheduleForm';

const SchedulePage = () => {
  const [tabValue, setTabValue] = useState(0);
  const [classrooms, setClassrooms] = useState([]);
  const [schedules, setSchedules] = useState([]);
  const [selectedFaculty, setSelectedFaculty] = useState('');
  const [showClassroomForm, setShowClassroomForm] = useState(false);
  const [showScheduleForm, setShowScheduleForm] = useState(false);

  const classroomColumns = [
    { field: 'name', headerName: 'Name', flex: 1 },
    { field: 'capacity', headerName: 'Capacity', flex: 1 },
    { field: 'actions', headerName: 'Actions', flex: 1, renderCell: (params) => (
      <Button color="error" onClick={() => handleDeleteClassroom(params.row.id)}>
        Delete
      </Button>
    )}
  ];

  const scheduleColumns = [
    { field: 'courseTitle', headerName: 'Course', flex: 1 },
    { field: 'dayOfWeek', headerName: 'Day', flex: 1 },
    { field: 'startTime', headerName: 'Start Time', flex: 1 },
    { field: 'endTime', headerName: 'End Time', flex: 1 },
    { field: 'classroom', headerName: 'Classroom', flex: 1 },
    { field: 'actions', headerName: 'Actions', flex: 1, renderCell: (params) => (
      <>
        <Button onClick={() => handleEditSchedule(params.row)}>Edit</Button>
        <Button color="error" onClick={() => handleDeleteSchedule(params.row.id)}>
          Delete
        </Button>
      </>
    )}
  ];

  useEffect(() => {
    if (tabValue === 0) {
      loadClassSchedules();
    }
  }, [tabValue]);

  const loadClassSchedules = async () => {
    try {
      const response = await classScheduleService.getAllClassSchedules();
      setSchedules(response.data);
    } catch (error) {
      console.error('Error loading schedules:', error);
    }
  };

  const loadClassrooms = async (facultyId) => {
    try {
      const response = await classroomService.getAllClassroomsByFaculty(facultyId);
      setClassrooms(response.data);
    } catch (error) {
      console.error('Error loading classrooms:', error);
    }
  };

  const handleDeleteClassroom = async (id) => {
    try {
      await classroomService.deleteClassroom(selectedFaculty, id);
      loadClassrooms(selectedFaculty);
    } catch (error) {
      console.error('Error deleting classroom:', error);
    }
  };

  const handleDeleteSchedule = async (id) => {
    try {
      await classScheduleService.deleteClassSchedule(id);
      loadClassSchedules();
    } catch (error) {
      console.error('Error deleting schedule:', error);
    }
  };

  return (
    <Paper sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Management Dashboard
      </Typography>

      <Tabs value={tabValue} onChange={(e, newValue) => setTabValue(newValue)}>
        <Tab label="Class Schedules" />
        <Tab label="Classrooms" />
      </Tabs>

      {tabValue === 0 && (
        <Box sx={{ mt: 3 }}>
          <Button variant="contained" onClick={() => setShowScheduleForm(true)}>
            Add New Schedule
          </Button>
          <div style={{ height: 600, width: '100%', marginTop: 16 }}>
            <DataGrid
              rows={schedules}
              columns={scheduleColumns}
              pageSize={10}
              rowsPerPageOptions={[10]}
            />
          </div>
        </Box>
      )}

      {tabValue === 1 && (
        <Box sx={{ mt: 3 }}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <Button variant="contained" onClick={() => setShowClassroomForm(true)}>
                Add New Classroom
              </Button>
            </Grid>
            <Grid item xs={12}>
              <div style={{ height: 600, width: '100%' }}>
                <DataGrid
                  rows={classrooms}
                  columns={classroomColumns}
                  pageSize={10}
                  rowsPerPageOptions={[10]}
                />
              </div>
            </Grid>
          </Grid>
        </Box>
      )}

      <ClassroomForm
        open={showClassroomForm}
        onClose={() => setShowClassroomForm(false)}
        facultyId={selectedFaculty}
        onSuccess={() => loadClassrooms(selectedFaculty)}
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
