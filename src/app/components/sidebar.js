'use client';

import { useState, useEffect } from 'react';
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
    School as SchoolIcon,
    Assignment as AssignmentIcon,
    Settings as SettingsIcon,
    Menu as MenuIcon,
    ChevronLeft as ChevronLeftIcon,
    Public as PublicIcon,
    Description as FileIcon,
    Group as GroupIcon
} from '@mui/icons-material';
import { authUtils } from '@/lib/utils';

const drawerWidth = 240;

const DrawerHeader = styled('div')(({ theme }) => ({
    display: 'flex',
    alignItems: 'center',
    padding: theme.spacing(0, 1),
    ...theme.mixins.toolbar,
    justifyContent: 'flex-end',
}));

const Sidebar = ({ open, setOpen, onToggle }) => {
    const router = useRouter();
    const pathname = usePathname();
    const isMobile = useMediaQuery((theme) => theme.breakpoints.down('md'));

    const [userRoles, setUserRoles] = useState([]);

    useEffect(() => {
        loadUserData();
    }, []);

    const loadUserData = async () => {
        const userData = await authUtils.getUserData();
        if (userData) {
            setUserRoles(userData.roles || []);
        }
    }

    const navigateTo = (path) => {
        router.push(path);
        if (isMobile) setOpen(false);
    };

    const commonNavItems = [
        { text: 'Dashboard', icon: <DashboardIcon />, path: '/dashboard' },
    ];

    const adminNavItems = [
        // { text: 'Students', icon: <PersonIcon />, path: '/dashboard/students' },
        // { text: 'Lecturers', icon: <GroupIcon />, path: '/dashboard/lecturers' },
        { text: 'Management', icon: <AssignmentIcon />, path: '/dashboard/management' },
        { text: 'Class Schedules', icon: <SchoolIcon />, path: '/dashboard/schedules' },
    ];

    const lecturerNavItems = [
        { text: 'Attendance', icon: <FileIcon />, path: '/dashboard/attendance' },
    ];

    let navItems = [...commonNavItems];
    if (userRoles.includes('Administrator')) {
        navItems = [...navItems, ...adminNavItems];
    }
    if (userRoles.includes('Lecturer')) {
        navItems = [...navItems, ...lecturerNavItems];
    }

    const drawer = (
        <>
            <DrawerHeader>
                <IconButton onClick={onToggle} sx={{ display: { xs: 'block', md: 'none' } }}>
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
            <IconButton
                color="inherit"
                aria-label="open drawer"
                edge="start"
                onClick={onToggle}
                sx={{ mr: 2 }}
            >
                {open ? <ChevronLeftIcon /> : <MenuIcon />}
            </IconButton>

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
                        transition: 'width 0.2s',
                    },
                }}
            >
                {drawer}
            </Drawer>
        </Box>
    );
};

export default Sidebar;
