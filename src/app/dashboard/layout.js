'use client';

import { useState } from 'react';
import { Box, Toolbar, CssBaseline, AppBar, Typography, useTheme, useMediaQuery, Button } from '@mui/material';
import Sidebar from '../components/sidebar';
import { useRouter } from "next/navigation";
import { authUtils } from "@/lib/utils";
import TopBar from '../components/topbar';

const drawerWidth = 240;

export default function DashboardLayout({ children }) {
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const theme = useTheme();
    const router = useRouter();

    const handleSidebarToggle = () => {
        setSidebarOpen(!sidebarOpen);
    };

    const handleLogout = async () => {
        await authUtils.clearAuth();
        router.push("/");
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
                <CssBaseline />
                <TopBar open={sidebarOpen} onToggle={handleSidebarToggle} />
                <Sidebar open={sidebarOpen} setOpen={setSidebarOpen} onToggle={handleSidebarToggle} />
                {/* <Toolbar sx={{position: 'relative'}}>
                    <Sidebar
                        open={ sidebarOpen }
                        setOpen={ setSidebarOpen }
                        onToggle={handleSidebarToggle}
                    />

                    <Button
                        sx={{position: 'absolute', right: 10}}
                        variant="contained"
                        color="error"
                        onClick={handleLogout}
                    >
                        Logout
                    </Button>
                </Toolbar> */}
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
