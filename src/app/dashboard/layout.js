'use client';

import { useState } from 'react';
import { Box, Toolbar, CssBaseline, AppBar, Typography, useTheme, useMediaQuery } from '@mui/material';
import Sidebar from '../components/sidebar';

const drawerWidth = 240;

export default function DashboardLayout({ children }) {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const theme = useTheme();

    const handleSidebarToggle = () => {
        setSidebarOpen(!sidebarOpen);
    };

    return (
        <Box sx={{ display: 'flex' }}>
            <CssBaseline />
            <AppBar
                position="fixed"
                sx={{
                    width: {
                        xs: '100%',
                        md: sidebarOpen ? `calc(100% - ${drawerWidth}px)` : '100%'
                    },
                    transition: theme => theme.transitions.create(['margin', 'width'], {
                        easing: theme.transitions.easing.sharp,
                        duration: theme.transitions.duration.leavingScreen,
                    }),
                }}
            >
                <Toolbar>
                    <Sidebar
                        open={ sidebarOpen }
                        setOpen={ setSidebarOpen }
                        onToggle={handleSidebarToggle}
                    />
                </Toolbar>
            </AppBar>
            <Box
                component="main"
                sx={{
                    flexGrow: 1,
                    p: 3,
                    width: {
                        xs: '100%',
                        md: sidebarOpen ? `calc(100% - ${drawerWidth}px)` : '100%' 
                    },
                    ml: {
                        xs: 0,
                        md: sidebarOpen ? `${drawerWidth}px` : 0
                    },
                    transition: theme => theme.transitions.create(['margin', 'width'], {
                        easing: theme.transitions.easing.sharp,
                        duration: theme.transitions.duration.leavingScreen,
                    }),
                }}
            >
                <Toolbar />
                {children}
            </Box>
        </Box>
    );
}
