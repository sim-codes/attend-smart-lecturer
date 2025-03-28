"use client";
import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Paper,
  TableContainer,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  TablePagination,
  TextField,
  InputAdornment,
  Button,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Grid,
  CircularProgress,
  Modal,
  Chip,
  Tooltip,
  IconButton
} from '@mui/material';
import {
  Search as SearchIcon,
  Download as DownloadIcon,
  CalendarToday as CalendarIcon,
  People as PeopleIcon,
  Percent as PercentIcon,
  Close as CloseIcon
} from '@mui/icons-material';
import * as XLSX from 'xlsx';

import { attendanceService, studentService, facultyService, courseService, departmentService } from '@/lib/services';

// Utility function to export table to CSV
const exportToExcel = (data, filename, isDetailedExport = false) => {
  let exportData;

  if (isDetailedExport) {
    // Detailed student-level export
    exportData = data.flatMap(course =>
      course.students.map(student => ({
        Course: course.courseName,
        StudentName: student.studentName,
        TotalClasses: student.totalCount,
        AttendedClasses: student.presentCount,
        AttendancePercentage: `${Math.round((student.presentCount / student.totalCount) * 100)}%`
      }))
    );
  } else {
    // Summary export
    exportData = data.map(record => ({
      Course: record.courseName,
      TotalStudents: record.totalStudents,
      AverageAttendance: `${record.averageAttendance}%`,
      TotalSessions: record.totalSessions
    }));
  }

  const worksheet = XLSX.utils.json_to_sheet(exportData);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Attendance Data');

  XLSX.writeFile(workbook, filename);
};

// Modal style
const modalStyle = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: '80%',
  maxWidth: 1000,
  maxHeight: '90vh',
  overflow: 'auto',
  bgcolor: 'background.paper',
  boxShadow: 24,
  p: 4,
  borderRadius: 2
};

export default function AttendancePage() {
  const [courseAttendance, setCourseAttendance] = useState([]);
  const [loading, setLoading] = useState(true);
  const [students, setStudents] = useState([]);
  const [faculties, setFaculties] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [courses, setCourses] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);

  // Filters
  const [searchTerm, setSearchTerm] = useState('');
  const [facultyId, setFacultyId] = useState('');
  const [departmentId, setDepartmentId] = useState('');
  const [courseId, setCourseId] = useState('');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [studentAttendanceDetails, setStudentAttendanceDetails] = useState([]);
  const [detailedModalOpen, setDetailedModalOpen] = useState(false);

  // Pagination and Metadata
  const [metadata, setMetadata] = useState({
    currentPage: 1,
    totalPages: 1,
    pageSize: 10,
    totalCount: 0,
    hasPrevious: false,
    hasNext: false
  });

  // Load initial data
  useEffect(() => {
    const loadInitialData = async () => {
      try {
        setLoading(true);
        
        // Load faculties
        const facultyResponse = await facultyService.getAllFaculties();
        if (facultyResponse.success && facultyResponse.data.length > 0) {
          setFaculties(facultyResponse.data);
          setFacultyId(facultyResponse.data[0].id); // Set first faculty as default
        }

        // Load students
        const studentResponse = await studentService.getAllStudents();
        if (studentResponse.success) {
          setStudents(studentResponse.data.students);
        }
      } catch (error) {
        console.error("Failed to load initial data:", error);
      } finally {
        setLoading(false);
      }
    };

    loadInitialData();
  }, []);

  // Load departments when faculty changes
  useEffect(() => {
    if (facultyId) {
      const loadDepts = async () => {
        try {
          const response = await departmentService.getAllDepartmentsByFaculty(facultyId);
          if (response.success && response.data.length > 0) {
            setDepartments(response.data);
            setDepartmentId(response.data[0].id); // Set first department as default
          } else {
            setDepartments([]);
            setDepartmentId('');
          }
        } catch (error) {
          console.error("Failed to load departments:", error);
        }
      };
      loadDepts();
    } else {
      setDepartments([]);
      setDepartmentId('');
    }
  }, [facultyId]);

  // Load courses when department changes
  useEffect(() => {
    if (departmentId) {
      const loadCrs = async () => {
        try {
          const response = await courseService.getAllCoursesByDepartment(departmentId);
          if (response.success) {
            setCourses(response.data.courses);
            setCourseId('');
            loadAttendanceRecords(response.data.courses.map(c => c.id));
          } else {
            setCourses([]);
            setCourseId('');
          }
        } catch (error) {
          console.error("Failed to load courses:", error);
        }
      };
      loadCrs();
    } else {
      setCourses([]);
      setCourseId('');
    }
  }, [departmentId]);

  // Load attendance records when filters change
  useEffect(() => {
    if (departmentId) {
      if (courseId) {
        loadAttendanceRecords([courseId]);
      } else if (courses.length > 0) {
        loadAttendanceRecords(courses.map(c => c.id));
      }
    }
  }, [page, rowsPerPage, courseId, departmentId]);

  const loadAttendanceRecords = async (courseIds) => {
    setLoading(true);
    try {
      // Defensive check for no courses
      if (courseIds.length === 0) {
        setCourseAttendance([]);
        setStudentAttendanceDetails([]);
        setMetadata({ totalCount: 0 });
        return;
      }

      const allRecords = [];
      for (const courseId of courseIds) {
        const params = {
          pageNumber: page + 1,
          pageSize: rowsPerPage === -1 ? 1000 : rowsPerPage,
          searchTerm: searchTerm,
          courseId: courseId
        };

        const response = await attendanceService.getAllAttendance(params);

        if (response.success) {
          allRecords.push(...response.data.reports);
        }
      }

      // Process records
      const processedRecords = processCourseAttendance(allRecords);
      setCourseAttendance(processedRecords);

      // Prepare detailed student attendance for modal and export
      const studentDetails = processedRecords.flatMap(course =>
        course.students.map(student => ({
          courseId: course.courseId,
          courseName: course.courseName,
          studentId: student.studentId,
          studentName: student.studentName,
          totalClasses: student.totalCount,
          attendedClasses: student.presentCount,
          attendancePercentage: Math.round((student.presentCount / student.totalCount) * 100)
        }))
      );
      setStudentAttendanceDetails(studentDetails);

      setMetadata({
        ...metadata,
        totalCount: courses.length
      });
    } catch (error) {
      console.error("Failed to load attendance records:", error);
    } finally {
      setLoading(false);
    }
  };

  const processCourseAttendance = (records) => {
    // Group by course first
    const courseGroups = {};

    records.forEach(record => {
      const courseName = getCourseName(record.courseId);
      const studentName = getStudentName(record.studentId);

      if (!courseGroups[record.courseId]) {
        courseGroups[record.courseId] = {
          courseId: record.courseId,
          courseName: courseName,
          students: {},
          attendanceDates: new Set(),
          totalPresent: 0,
          totalRecords: 0
        };
      }

      // Track unique attendance dates
      const dateStr = new Date(record.recordedAt).toDateString();
      courseGroups[record.courseId].attendanceDates.add(dateStr);

      if (!courseGroups[record.courseId].students[record.studentId]) {
        courseGroups[record.courseId].students[record.studentId] = {
          studentId: record.studentId,
          studentName: studentName,
          presentCount: 0,
          totalCount: 0
        };
      }

      // Count attendance for each student
      courseGroups[record.courseId].students[record.studentId].totalCount++;
      courseGroups[record.courseId].totalRecords++;

      if (record.status === 'Present') {
        courseGroups[record.courseId].students[record.studentId].presentCount++;
        courseGroups[record.courseId].totalPresent++;
      }
    });

    // Calculate metrics for each course
    return Object.values(courseGroups).map(course => {
      const studentCount = Object.keys(course.students).length;
      const sessionCount = course.attendanceDates.size;
      const avgAttendance = course.totalRecords > 0 
        ? Math.round((course.totalPresent / course.totalRecords) * 100)
        : 0;

      return {
        courseId: course.courseId,
        courseName: course.courseName,
        totalStudents: studentCount,
        totalSessions: sessionCount,
        averageAttendance: avgAttendance,
        students: Object.values(course.students)
      };
    });
  };

  const getStudentName = (studentId) => {
    const student = students.find(s => s.userId === studentId);
    return student 
      ? `${student.firstName} ${student.lastName}` 
      : 'Unknown Student';
  };

  const getCourseName = (courseId) => {
    const course = courses.find(c => c.id === courseId);
    return course ? course.title : 'Unknown Course';
  };

  const handleSearch = () => {
    setPage(0);
    if (departmentId) {
      if (courseId) {
        loadAttendanceRecords([courseId]);
      } else {
        loadAttendanceRecords(courses.map(c => c.id));
      }
    }
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const openCourseDetails = async (course) => {
    setSelectedCourse(course);
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setSelectedCourse(null);
  };

  const handleDetailedExport = () => {
    exportToExcel(
      courseAttendance,
      `detailed_attendance_${new Date().toISOString().split('T')[0]}.xlsx`,
      true
    );
  };

  const openDetailedAttendanceModal = () => {
    setDetailedModalOpen(true);
  };

  const closeDetailedAttendanceModal = () => {
    setDetailedModalOpen(false);
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" sx={{ mb: 3 }}>
        Attendance Overview
      </Typography>

      {/* Filters */}
      <Paper sx={{ p: 2, mb: 3 }}>
        <Grid container spacing={2}>
          <Grid item xs={12} md={3}>
            <FormControl fullWidth>
              <InputLabel>Faculty</InputLabel>
              <Select
                value={facultyId}
                label="Faculty"
                onChange={(e) => {
                  setFacultyId(e.target.value);
                  setDepartmentId('');
                  setCourseId('');
                }}
              >
                {faculties.map((faculty) => (
                  <MenuItem key={faculty.id} value={faculty.id}>
                    {faculty.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} md={3}>
            <FormControl fullWidth disabled={!facultyId}>
              <InputLabel>Department</InputLabel>
              <Select
                value={departmentId}
                label="Department"
                onChange={(e) => {
                  setDepartmentId(e.target.value);
                  setCourseId('');
                }}
              >
                {departments.map((department) => (
                  <MenuItem key={department.id} value={department.id}>
                    {department.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} md={3}>
            <FormControl fullWidth disabled={!departmentId}>
              <InputLabel>Course</InputLabel>
              <Select
                value={courseId}
                label="Course"
                onChange={(e) => setCourseId(e.target.value)}
              >
                <MenuItem value="">
                  <em>All Courses</em>
                </MenuItem>
                {courses.map((course) => (
                  <MenuItem key={course.id} value={course.id}>
                    {course.title}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} md={3}>
            <TextField
              fullWidth
              placeholder="Search course name"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon />
                  </InputAdornment>
                ),
                endAdornment: (
                  <InputAdornment position="end">
                    <Button
                      variant="contained"
                      onClick={handleSearch}
                      disabled={loading || !departmentId}
                    >
                      Search
                    </Button>
                  </InputAdornment>
                )
              }}
            />
          </Grid>
        </Grid>
      </Paper>

      {/* Export Button */}
      <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 2, gap: 2 }}>
        <Button
          variant="outlined"
          startIcon={<DownloadIcon />}
          onClick={handleDetailedExport}
          disabled={courseAttendance.length === 0}
        >
          Export Summary
        </Button>
        <Button
          variant="contained"
          startIcon={<PeopleIcon />}
          onClick={openDetailedAttendanceModal}
          disabled={studentAttendanceDetails.length === 0}
        >
          Student Attendance Details
        </Button>
      </Box>

      {/* Course Attendance Table */}
      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', my: 5 }}>
          <CircularProgress />
        </Box>
      ) : courseAttendance.length === 0 ? (
        <Paper sx={{ p: 5, textAlign: 'center' }}>
          <Typography variant="h6">No attendance records found</Typography>
        </Paper>
      ) : (
        <>
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Course</TableCell>
                  <TableCell align="center">Students</TableCell>
                  <TableCell align="center">Sessions</TableCell>
                  <TableCell align="center">Avg Attendance</TableCell>
                  <TableCell align="right">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {courseAttendance
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((course) => (
                    <TableRow key={course.courseId} hover>
                      <TableCell>
                        <Typography fontWeight="medium">{course.courseName}</Typography>
                      </TableCell>
                      <TableCell align="center">
                        <Chip 
                          icon={<PeopleIcon />} 
                          label={course.totalStudents} 
                          variant="outlined"
                        />
                      </TableCell>
                      <TableCell align="center">
                        <Chip 
                          icon={<CalendarIcon />} 
                          label={course.totalSessions} 
                          variant="outlined"
                        />
                      </TableCell>
                      <TableCell align="center">
                        <Tooltip title={`${course.averageAttendance}% of sessions attended`}>
                          <Chip 
                            icon={<PercentIcon />}
                            label={`${course.averageAttendance}%`}
                            color={
                              course.averageAttendance >= 80 ? 'success' :
                              course.averageAttendance >= 50 ? 'warning' : 'error'
                            }
                          />
                        </Tooltip>
                      </TableCell>
                      <TableCell align="right">
                        <Button 
                          variant="outlined" 
                          onClick={() => openCourseDetails(course)}
                        >
                          View Details
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
              </TableBody>
            </Table>
          </TableContainer>

          {/* Pagination - now based on number of courses */}
          <TablePagination
            component="div"
            count={courses.length} // Total number of courses
            page={page}
            onPageChange={handleChangePage}
            rowsPerPage={rowsPerPage}
            onRowsPerPageChange={handleChangeRowsPerPage}
            rowsPerPageOptions={[10, 25, 50, { value: -1, label: 'All' }]}
          />
        </>
      )}

      {/* Course Details Modal */ }
      <Modal
        open={detailedModalOpen}
        onClose={closeDetailedAttendanceModal}
        aria-labelledby="student-attendance-details"
      >
        <Box sx={modalStyle}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
            <Typography id="modal-title" variant="h5" component="h2">
              Student Attendance Details
            </Typography>
            <Box>
              <Button 
                variant="contained" 
                onClick={handleDetailedExport}
                startIcon={<DownloadIcon />}
                sx={{ mr: 2 }}
              >
                Export to Excel
              </Button>
              <IconButton onClick={closeDetailedAttendanceModal}>
                <CloseIcon />
              </IconButton>
            </Box>
          </Box>
          
          <TableContainer component={Paper}>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell>Course</TableCell>
                  <TableCell>Student Name</TableCell>
                  <TableCell align="center">Total Classes</TableCell>
                  <TableCell align="center">Attended Classes</TableCell>
                  <TableCell align="center">Attendance %</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {studentAttendanceDetails.map((detail, index) => (
                  <TableRow key={index}>
                    <TableCell>{detail.courseName}</TableCell>
                    <TableCell>{detail.studentName}</TableCell>
                    <TableCell align="center">{detail.totalClasses}</TableCell>
                    <TableCell align="center">{detail.attendedClasses}</TableCell>
                    <TableCell align="center">
                      <Chip
                        size="small"
                        label={`${detail.attendancePercentage}%`}
                        color={
                          detail.attendancePercentage >= 80 ? 'success' :
                          detail.attendancePercentage >= 50 ? 'warning' : 'error'
                        }
                      />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Box>
      </Modal>
    </Box>
  );
}
