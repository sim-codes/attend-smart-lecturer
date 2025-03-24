import { Box, Toolbar, CssBaseline, AppBar, Typography } from '@mui/material';
// import Sidebar from '../components/sidebar';

const drawerWidth = 240;

export default function DashboardLayout({ children }) {
    return (
        <Box sx={{ display: 'flex' }}>
            <CssBaseline />
            <AppBar
                position="fixed"
                sx={{
                    width: { md: `calc(100% - ${drawerWidth}px)` },
                    ml: { md: `${drawerWidth}px` },
                }}
            >
                <Toolbar>
                {/* <Sidebar /> */}
                {/* <Typography variant="h6" noWrap component="div">
                    Dashboard
                </Typography> */}
                </Toolbar>
            </AppBar>
            <Box
                component="main"
                sx={{
                flexGrow: 1,
                p: 3,
                width: { md: `calc(100% - ${drawerWidth}px)` },
                ml: { md: `${drawerWidth}px` },
                }}
            >
                <Toolbar />
                {children}
            </Box>
        </Box>
    );
}
