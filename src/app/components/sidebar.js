'use client';

import { useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import {
    Box,
    Drawer,
    List,
    ListItem,
    ListItemButton,
    ListItemIcon,
    ListItemText,
    IconButton,
    Divider,
    useMediaQuery,
    styled
} from '@mui/material';
import {
    Dashboard as DashboardIcon,
    Person as PersonIcon,
    Settings as SettingsIcon,
    Menu as MenuIcon,
    ChevronLeft as ChevronLeftIcon,
    Public as PublicIcon,
    Description as FileIcon
} from '@mui/icons-material';

const drawerWidth = 240;

const DrawerHeader = styled('div')(({ theme }) => ({
    display: 'flex',
    alignItems: 'center',
    padding: theme.spacing(0, 1),
    ...theme.mixins.toolbar,
    justifyContent: 'flex-end',
}));

const Sidebar = ({open, setOpen, onToggle}) => {
    const router = useRouter();
    const pathname = usePathname();
    const isMobile = useMediaQuery((theme) => theme.breakpoints.down('md'));

    const handleDrawerToggle = () => {
        setOpen(!open);
    };

    const navigateTo = (path) => {
        router.push(path);
        if (isMobile) setOpen(false);
    };

    const navItems = [
        { text: 'Dashboard', icon: <DashboardIcon />, path: '/dashboard' },
        { text: 'Students', icon: <PersonIcon />, path: '/dashboard/students' },
        { text: 'Settings', icon: <SettingsIcon />, path: '/dashboard/settings' },
        { text: 'Global', icon: <PublicIcon />, path: '/global' },
        { text: 'Documents', icon: <FileIcon />, path: '/documents' },
    ];

    const drawer = (
        <>
            <DrawerHeader>
                <IconButton onClick={onToggle} sx={{ display: { xs: 'block', md: 'none' }}}>
                    <ChevronLeftIcon />
                </IconButton>
            </DrawerHeader>
            <Divider />
            <List>
                {navItems.map((item) => (
                    <ListItem key={item.text} disablePadding>
                        <ListItemButton
                            selected={pathname === item.path}
                            onClick={() => navigateTo(item.path)}
                        >
                            <ListItemIcon>{item.icon}</ListItemIcon>
                            <ListItemText primary={item.text} />
                        </ListItemButton>
                    </ListItem>
                ))}
            </List>
        </>
    );

    return (
        <Box sx={{ display: 'flex' }}>
            {/* Toggle button always visible */}
            <IconButton
                color="inherit"
                aria-label="open drawer"
                edge="start"
                onClick={onToggle}
                sx={{ mr: 2 }}
            >
                {open ? <ChevronLeftIcon /> : <MenuIcon />}
            </IconButton>

            {/* Mobile drawer */}
            <Drawer
                variant="temporary"
                open={open}
                onClose={onToggle}
                ModalProps={{
                    keepMounted: true,
                }}
                sx={{
                    display: { xs: 'block', md: 'none' },
                    '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
                }}
            >
                {drawer}
            </Drawer>

            {/* Desktop drawer */}
            <Drawer
                variant="persistent"
                open={open}
                sx={{
                    display: { xs: 'none', md: 'block' },
                    width: open ? drawerWidth : 0,
                    flexShrink: 0,
                    '& .MuiDrawer-paper': { 
                        width: drawerWidth,
                        boxSizing: 'border-box',
                        transition: 'width 0.2s', // Smooth transition
                    },
                }}
            >
                {drawer}
            </Drawer>
        </Box>
    );
};

export default Sidebar;