'use client';

import { 
    AppBar, 
    Toolbar, 
    Typography, 
    IconButton, 
    Badge, 
    Box, 
    Avatar, 
    Menu,
    MenuItem
} from '@mui/material';
import {
    Menu as MenuIcon,
    Notifications as NotificationsIcon,
    Logout as LogoutIcon
} from '@mui/icons-material';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { authUtils } from '@/lib/utils';
import MenuOpenIcon from '@mui/icons-material/MenuOpen';

export default function TopBar({ open, onToggle }) {
    const router = useRouter();
    const [anchorEl, setAnchorEl] = useState(null);
    const [user, setUser] = useState(null);

    const handleProfileMenuOpen = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleMenuClose = () => {
        setAnchorEl(null);
    };

    const handleLogout = async () => {
        await authUtils.clearAuth();
        router.push('/login');
    };

    return (
        <AppBar
            position="fixed"
            sx={{
                zIndex: (theme) => theme.zIndex.drawer + 1,
                width: { sm: `calc(100% - ${open ? 240 : 0}px)` },
                ml: { sm: `${open ? 240 : 0}px` },
                transition: 'width 0.2s, margin 0.2s'
            }}
        >
            <Toolbar>
                <IconButton
                    color="inherit"
                    aria-label="open drawer"
                    edge="start"
                    onClick={onToggle}
                    sx={{ mr: 2 }}
                >
                    {open ? <MenuOpenIcon /> : <MenuIcon />}
                </IconButton>
                <Typography variant="h6" noWrap component="div" sx={{ flexGrow: 1 }}>
                    Smart Attendance System
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <IconButton
                        color="inherit"
                        onClick={handleProfileMenuOpen}
                    >
                        <Avatar sx={{ width: 32, height: 32 }}>
                            {user?.firstName?.charAt(0) || 'U'}
                        </Avatar>
                    </IconButton>
                </Box>
                <Menu
                    anchorEl={anchorEl}
                    open={Boolean(anchorEl)}
                    onClose={handleMenuClose}
                >
                    <MenuItem onClick={() => router.push('/dashboard/profile')}>
                        Profile
                    </MenuItem>
                    <MenuItem onClick={handleLogout}>
                        <LogoutIcon sx={{ mr: 1 }} /> Logout
                    </MenuItem>
                </Menu>
            </Toolbar>
        </AppBar>
    );
}
