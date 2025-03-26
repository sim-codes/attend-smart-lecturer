'use client';

import { useState, useEffect } from 'react';
import {
    Tabs,
    Tab,
    Box,
    TextField,
    Button,
    Select,
    MenuItem,
    InputLabel,
    FormControl,
    Typography,
    Paper,
    CircularProgress
} from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import {
    facultyService,
    departmentService,
    courseService,
    levelService
} from '@/lib/services';

const ManagementPage = () => {
  const [activeTab, setActiveTab] = useState(0);
  const [faculties, setFaculties] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [courses, setCourses] = useState([]);
  const [levels, setLevels] = useState([]);
  const [selectedFaculty, setSelectedFaculty] = useState('');
  const [selectedDepartment, setSelectedDepartment] = useState('');
  const [selectedLevel, setSelectedLevel] = useState('');

  // Loading states
  const [isLoading, setIsLoading] = useState({
    faculties: false,
    departments: false,
    courses: false,
    levels: false,
    createFaculty: false,
    createDepartment: false,
    createCourse: false
  });

  // Form states
  const [newFaculty, setNewFaculty] = useState({ name: '', code: '' });
  const [newDepartment, setNewDepartment] = useState({ name: '', code: '' });
  const [newCourse, setNewCourse] = useState({ 
    title: '', 
    code: '', 
    description: '',
    creditUnits: 0 
  });

  // Fetch initial data
  useEffect(() => {
    fetchFaculties();
    fetchAllDepartments();
    fetchLevels();
  }, []);

  const fetchFaculties = async () => {
    setIsLoading(prev => ({ ...prev, faculties: true }));
    try {
      const response = await facultyService.getAllFaculties();
      setFaculties(response.data);
    } catch (error) {
      console.error('Error fetching faculties:', error);
    } finally {
      setIsLoading(prev => ({ ...prev, faculties: false }));
    }
  };

  const fetchAllDepartments = async () => {
    setIsLoading(prev => ({ ...prev, departments: true }));
    try {
      const response = await departmentService.getAllDepartments();
      setDepartments(response.data);
    } catch (error) {
      console.error('Error fetching departments:', error);
    } finally {
      setIsLoading(prev => ({ ...prev, departments: false }));
    }
  };

  const fetchLevels = async () => {
    setIsLoading(prev => ({ ...prev, levels: true }));
    try {
      const response = await levelService.getAllLevels();
      setLevels(response.data);
    } catch (error) {
      console.error('Error fetching levels:', error);
    } finally {
      setIsLoading(prev => ({ ...prev, levels: false }));
    }
  };

  const fetchCourses = async (departmentId) => {
    setIsLoading(prev => ({ ...prev, courses: true }));
    try {
      const response = await courseService.getAllCoursesByDepartment(departmentId);
      if (response.success) setCourses(response.data.courses);
    } catch (error) {
      console.error('Error fetching courses:', error);
    } finally {
      setIsLoading(prev => ({ ...prev, courses: false }));
    }
  };

  // Handle form submissions
  const handleCreateFaculty = async () => {
    setIsLoading(prev => ({ ...prev, createFaculty: true }));
    try {
      await facultyService.createFaculty(newFaculty);
      setNewFaculty({ name: '', code: '' });
      await fetchFaculties();
    } catch (error) {
      console.error('Error creating faculty:', error);
    } finally {
      setIsLoading(prev => ({ ...prev, createFaculty: false }));
    }
  };

  const handleCreateDepartment = async () => {
    setIsLoading(prev => ({ ...prev, createDepartment: true }));
    try {
      await departmentService.createDepartment(selectedFaculty, newDepartment);
      setNewDepartment({ name: '', code: '' });
      await fetchAllDepartments();
    } catch (error) {
      console.error('Error creating department:', error);
    } finally {
      setIsLoading(prev => ({ ...prev, createDepartment: false }));
    }
  };

  const handleCreateCourse = async () => {
    setIsLoading(prev => ({ ...prev, createCourse: true }));
    try {
      // Prepare course object with levelId
      const courseData = {
        ...newCourse,
        levelId: selectedLevel
      };
      
      await courseService.createCourseForDepartment(selectedDepartment, courseData);
      
      // Reset form states
      setNewCourse({
        title: '',
        code: '',
        description: '',
        creditUnits: 0
      });
      setSelectedLevel('');
      
      // Refresh courses
      await fetchCourses(selectedDepartment);
    } catch (error) {
      console.error('Error creating course:', error);
    } finally {
      setIsLoading(prev => ({ ...prev, createCourse: false }));
    }
  };

  // DataGrid columns
  const facultyColumns = [
    { field: 'name', headerName: 'Name', flex: 1 },
    { field: 'code', headerName: 'Code', width: 120 }
  ];

  const departmentColumns = [
    { field: 'name', headerName: 'Name', flex: 1 },
    { field: 'code', headerName: 'Code', width: 120 }
  ];

  const courseColumns = [
    { field: 'title', headerName: 'Title', flex: 1 },
    { field: 'code', headerName: 'Code', width: 120 },
    { field: 'creditUnits', headerName: 'Credits', width: 100 }
  ];

  return (
    <Paper sx={{ p: 3, m: 2 }}>
      <Typography variant="h4" gutterBottom>
        Academic Management
      </Typography>

      <Tabs value={activeTab} onChange={(e, newValue) => setActiveTab(newValue)}>
        <Tab label="Faculties" />
        <Tab label="Departments" />
        <Tab label="Courses" />
      </Tabs>

      {/* Faculties Tab */}
      {activeTab === 0 && (
        <Box sx={{ mt: 3 }}>
          <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
            <TextField
              label="Faculty Name"
              value={newFaculty.name}
              onChange={(e) => setNewFaculty({ ...newFaculty, name: e.target.value })}
            />
            <TextField
              label="Faculty Code"
              value={newFaculty.code}
              onChange={(e) => setNewFaculty({ ...newFaculty, code: e.target.value })}
            />
            <Button 
              variant="contained" 
              onClick={handleCreateFaculty}
              disabled={!newFaculty.name || !newFaculty.code || isLoading.createFaculty}
            >
              {isLoading.createFaculty ? <CircularProgress size={24} /> : 'Create Faculty'}
            </Button>
          </Box>
          <div style={{ height: 400, width: '100%' }}>
            <DataGrid
              rows={faculties}
              columns={facultyColumns}
              pageSize={5}
              rowsPerPageOptions={[5]}
              getRowId={(row) => row.id}
              loading={isLoading.faculties}
            />
          </div>
        </Box>
      )}

      {/* Departments Tab */}
      {activeTab === 1 && (
        <Box sx={{ mt: 3 }}>
          <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
            <FormControl sx={{ minWidth: 200 }}>
              <InputLabel>Select Faculty</InputLabel>
              <Select
                value={selectedFaculty}
                onChange={(e) => setSelectedFaculty(e.target.value)}
                label="Select Faculty"
              >
                {faculties.map((faculty) => (
                  <MenuItem key={faculty.id} value={faculty.id}>
                    {faculty.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <TextField
              label="Department Name"
              value={newDepartment.name}
              onChange={(e) => setNewDepartment({ ...newDepartment, name: e.target.value })}
            />
            <TextField
              label="Department Code"
              value={newDepartment.code}
              onChange={(e) => setNewDepartment({ ...newDepartment, code: e.target.value })}
            />
            <Button 
              variant="contained" 
              onClick={handleCreateDepartment}
              disabled={!selectedFaculty || !newDepartment.name || !newDepartment.code || isLoading.createDepartment}
            >
              {isLoading.createDepartment ? <CircularProgress size={24} /> : 'Create Department'}
            </Button>
          </Box>
          <div style={{ height: 400, width: '100%' }}>
            <DataGrid
              rows={departments}
              columns={departmentColumns}
              pageSize={5}
              rowsPerPageOptions={[5]}
              getRowId={(row) => row.id}
              loading={isLoading.departments}
            />
          </div>
        </Box>
      )}

      {/* Courses Tab */}
      {activeTab === 2 && (
        <Box sx={{ mt: 3 }}>
          <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
            <FormControl sx={{ minWidth: 200 }}>
              <InputLabel>Select Department</InputLabel>
              <Select
                value={selectedDepartment}
                onChange={(e) => {
                  setSelectedDepartment(e.target.value);
                  fetchCourses(e.target.value);
                }}
                label="Select Department"
              >
                {departments.map((department) => (
                  <MenuItem key={department.id} value={department.id}>
                    {department.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <FormControl sx={{ minWidth: 200 }}>
              <InputLabel>Select Level</InputLabel>
              <Select
                value={selectedLevel}
                onChange={(e) => setSelectedLevel(e.target.value)}
                label="Select Level"
                disabled={!selectedDepartment}
              >
                {levels.map((level) => (
                  <MenuItem key={level.id} value={level.id}>
                    {level.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <TextField
              label="Course Title"
              value={newCourse.title}
              onChange={(e) => setNewCourse({ ...newCourse, title: e.target.value })}
            />
            <TextField
              label="Course Code"
              value={newCourse.code}
              onChange={(e) => setNewCourse({ ...newCourse, code: e.target.value })}
            />
            <TextField
              label="Description"
              value={newCourse.description}
              onChange={(e) => setNewCourse({ ...newCourse, description: e.target.value })}
            />
            <TextField
              label="Credit Units"
              type="number"
              value={newCourse.creditUnits}
              onChange={(e) => setNewCourse({ ...newCourse, creditUnits: parseInt(e.target.value) || 0 })}
            />
            <Button 
              variant="contained" 
              onClick={handleCreateCourse}
              disabled={
                !selectedDepartment || 
                !selectedLevel || 
                !newCourse.title || 
                !newCourse.code || 
                isLoading.createCourse
              }
            >
              {isLoading.createCourse ? <CircularProgress size={24} /> : 'Create Course'}
            </Button>
          </Box>
          <div style={{ height: 400, width: '100%' }}>
            <DataGrid
              rows={courses}
              columns={courseColumns}
              pageSize={5}
              rowsPerPageOptions={[5]}
              getRowId={(row) => row.id}
              loading={isLoading.courses}
            />
          </div>
        </Box>
      )}
    </Paper>
  );
};

export default ManagementPage;
