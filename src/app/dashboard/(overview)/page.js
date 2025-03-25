"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { authUtils } from "@/lib/utils";
import { studentService, departmentService } from "@/lib/services";
import { 
  Box, 
  Card, 
  CardContent, 
  Typography, 
  Grid, 
  TextField, 
  InputAdornment, 
  Avatar, 
  Chip, 
  Paper, 
  TableContainer, 
  Table, 
  TableHead, 
  TableBody, 
  TableRow, 
  TableCell, 
  TablePagination,
  IconButton,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  CircularProgress,
  Divider,
  Button,
  useMediaQuery,
  useTheme,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  List,
  ListItem,
  ListItemIcon,
  ListItemText
} from '@mui/material';
import {
  Search as SearchIcon,
  Person as PersonIcon,
  Email as EmailIcon,
  Phone as PhoneIcon,
  School as SchoolIcon,
  AccountBalance as DepartmentIcon,
  Badge as BadgeIcon,
  Close as CloseIcon,
  Assignment as ReportIcon
} from '@mui/icons-material';

export default function Dashboard() {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [departmentId, setDepartmentId] = useState('');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [metadata, setMetadata] = useState({
    currentPage: 1,
    totalPages: 1,
    pageSize: 10,
    totalCount: 0,
    hasPrevious: false,
    hasNext: false
  });
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [departments, setDepartments] = useState([]);

  const router = useRouter();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  useEffect(() => {
    loadStudents();
    loadDepartments();
  }, [page, rowsPerPage, departmentId]); // Added departmentId to dependencies

  const loadDepartments = async () => {
    try {
      const response = await departmentService.getAllDepartments();
      if (response.success) {
        setDepartments(response.data);
      }
    } catch (err) {
      console.error('Failed to load departments', err);
    }
  };

  const loadStudents = async () => {
    setLoading(true);
    try {
      const params = {
        pageNumber: page + 1,
        pageSize: rowsPerPage,
        searchTerm: searchTerm,
        departmentId: departmentId
      };

      const response = await studentService.getAllStudents(params);

      if (response.success) {
        setStudents(response.data.students);
        setMetadata(response.data.metadata);
      }
    } catch (error) {
      console.error("Failed to load students:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleStudentClick = (student) => {
    setSelectedStudent(student);
  };

  const handleCloseModal = () => {
    setSelectedStudent(null);
  };

  const handleSearch = () => {
    setPage(0);
    loadStudents();
  };

  const handleDepartmentChange = (e) => {
    setDepartmentId(e.target.value);
    setPage(0); // Reset to first page when department changes
    // No need to call loadStudents here - useEffect will trigger it
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const StatsCard = ({ title, value, icon }) => (
    <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <CardContent sx={{ flexGrow: 1, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Box>
          <Typography variant="h6" component="div" color="text.secondary">
            {title}
          </Typography>
          <Typography variant="h4" component="div" sx={{ fontWeight: 'bold' }}>
            {value}
          </Typography>
        </Box>
        <Avatar sx={{ bgcolor: 'primary.main', width: 56, height: 56 }}>
          {icon}
        </Avatar>
      </CardContent>
    </Card>
  );

  return (
    <Box sx={{ bgcolor: '#f5f5f5', minHeight: '100vh', p: 3 }}>
      {/* Dashboard Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3, flexDirection: isMobile ? 'column' : 'row', gap: 2 }}>
        <Typography variant="h4" component="h1" sx={{ fontWeight: 'bold' }}>
          Students
        </Typography>
      </Box>

      {/* Stats Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={24} sm={12} md={6}>
          <StatsCard
            title="Total Students"
            value={metadata.totalCount}
            icon={<PersonIcon />}
          />
        </Grid>
        <Grid item xs={24} sm={12} md={6}>
          <StatsCard
            title="Departments"
            value={departments.length}
            icon={<DepartmentIcon />}
          />
        </Grid>
      </Grid>

      {/* Search and Filters */}
      <Paper sx={{ p: 2, mb: 3 }}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              placeholder="Search by name, or email"
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
                      disabled={loading}
                    >
                      Search
                    </Button>
                  </InputAdornment>
                )
              }}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <FormControl fullWidth>
              <InputLabel>Department</InputLabel>
              <Select
                value={departmentId}
                label="Department"
                onChange={handleDepartmentChange}
              >
                <MenuItem value="">All Departments</MenuItem>
                {departments.map((dept) => (
                  <MenuItem key={dept.id} value={dept.id}>{dept.name}</MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
        </Grid>
      </Paper>

      {/* Students Table */}
      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', my: 5 }}>
          <CircularProgress />
        </Box>
      ) : students.length === 0 ? (
        <Paper sx={{ p: 5, textAlign: 'center' }}>
          <Typography variant="h6">No students found</Typography>
        </Paper>
      ) : (
        <>
          {isMobile ? (
            // Mobile card view
            <Box sx={{ mb: 3 }}>
              {students.map((student) => (
                <Card 
                  key={student.userId} 
                  sx={{ mb: 2, cursor: 'pointer' }}
                  onClick={() => handleStudentClick(student)}
                >
                  <CardContent>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                      <Avatar 
                        src={student.profileImageUrl} 
                        sx={{ width: 60, height: 60, mr: 2 }}
                      >
                        {student.firstName?.charAt(0)}{student.lastName?.charAt(0)}
                      </Avatar>
                      <Box>
                        <Typography variant="h6">
                          {student.firstName} {student.lastName}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {student.matriculationNumber}
                        </Typography>
                      </Box>
                    </Box>
                  </CardContent>
                </Card>
              ))}
            </Box>
          ) : (
            // Desktop table view
            <TableContainer component={Paper} sx={{ mb: 3 }}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Student</TableCell>
                    <TableCell>Matric Number</TableCell>
                    <TableCell>Email</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {students.map((student) => (
                    <TableRow 
                      key={student.userId} 
                      hover 
                      sx={{ cursor: 'pointer' }}
                      onClick={() => handleStudentClick(student)}
                    >
                      <TableCell>
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          <Avatar src={student.profileImageUrl} sx={{ mr: 2 }}>
                            {student.firstName?.charAt(0)}{student.lastName?.charAt(0)}
                          </Avatar>
                          <Typography>
                            {student.firstName} {student.lastName}
                          </Typography>
                        </Box>
                      </TableCell>
                      <TableCell>{student.matriculationNumber}</TableCell>
                      <TableCell>{student.email}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          )}

          {/* Pagination Controls */}
          <TablePagination
            component="div"
            count={metadata.totalCount}
            page={page}
            onPageChange={handleChangePage}
            rowsPerPage={rowsPerPage}
            onRowsPerPageChange={handleChangeRowsPerPage}
            rowsPerPageOptions={[5, 10, 25]}
          />
        </>
      )}

      {/* Student Details Modal */}
      <Dialog
        open={!!selectedStudent}
        onClose={handleCloseModal}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          <Box display="flex" justifyContent="space-between" alignItems="center">
            <Typography variant="h6">
              {selectedStudent?.firstName} {selectedStudent?.lastName}'s Profile
            </Typography>
            <IconButton onClick={handleCloseModal}>
              <CloseIcon />
            </IconButton>
          </Box>
        </DialogTitle>
        <DialogContent dividers>
          <Grid container spacing={3}>
            <Grid item xs={12} md={4}>
              <Box display="flex" flexDirection="column" alignItems="center" p={2}>
                <Avatar
                  src={selectedStudent?.profileImageUrl}
                  sx={{
                    width: 150,
                    height: 150,
                    mb: 3,
                    border: `4px solid ${theme.palette.primary.main}`
                  }}
                >
                  {selectedStudent?.firstName?.charAt(0)}{selectedStudent?.lastName?.charAt(0)}
                </Avatar>
                <Typography variant="h6" gutterBottom>
                  {selectedStudent?.firstName} {selectedStudent?.lastName}
                </Typography>
                <Chip
                  label={selectedStudent?.department || 'Not provided'}
                  color="primary"
                  sx={{ mb: 1 }}
                />
              </Box>
            </Grid>
            <Grid item xs={12} md={8}>
              <List sx={ { width: '100%' } }>
              <ListItem sx={{ px: 0 }}>
                  <ListItemIcon sx={{ minWidth: 40 }}>
                    <BadgeIcon color="primary" />
                  </ListItemIcon>
                  <ListItemText
                    primary="Matric Number"
                    secondary={selectedStudent?.matriculationNumber || 'Not provided'}
                    secondaryTypographyProps={{ variant: 'body1' }}
                  />
                </ListItem>
                <Divider component="li" />

                <ListItem sx={{ px: 0 }}>
                  <ListItemIcon sx={{ minWidth: 40 }}>
                    <BadgeIcon color="primary" />
                  </ListItemIcon>
                  <ListItemText
                    primary="Level"
                    secondary={selectedStudent?.level || 'Not provided'}
                    secondaryTypographyProps={{ variant: 'body1' }}
                  />
                </ListItem>
                <Divider component="li" />

                <ListItem sx={{ px: 0 }}>
                  <ListItemIcon sx={{ minWidth: 40 }}>
                    <EmailIcon color="primary" />
                  </ListItemIcon>
                  <ListItemText
                    primary="Email"
                    secondary={selectedStudent?.email || 'Not provided'}
                    secondaryTypographyProps={{ variant: 'body1' }}
                  />
                </ListItem>
                <Divider component="li" />
                
                <ListItem sx={{ px: 0 }}>
                  <ListItemIcon sx={{ minWidth: 40 }}>
                    <PhoneIcon color="primary" />
                  </ListItemIcon>
                  <ListItemText
                    primary="Phone Number"
                    secondary={selectedStudent?.phoneNumber || 'Not provided'}
                    secondaryTypographyProps={{ variant: 'body1' }}
                  />
                </ListItem>
              </List>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions sx={{ justifyContent: 'space-between', px: 3, py: 2 }}>
          <Button
            component={Link}
            href={`/attendance/${selectedStudent?.userId}`}
            variant="outlined"
            startIcon={<ReportIcon />}
          >
            View Attendance Report
          </Button>
          <Button 
            onClick={handleCloseModal} 
            color="primary"
            variant="contained"
          >
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
