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

const Sidebar = () => {
    const router = useRouter();
    const pathname = usePathname();
    const [open, setOpen] = useState(false);
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
        { text: 'Profile', icon: <PersonIcon />, path: '/profile' },
        { text: 'Settings', icon: <SettingsIcon />, path: '/settings' },
        { text: 'Global', icon: <PublicIcon />, path: '/global' },
        { text: 'Documents', icon: <FileIcon />, path: '/documents' },
    ];

  const drawer = (
    <>
      <DrawerHeader>
        <IconButton onClick={handleDrawerToggle}>
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
    <>
      <IconButton
        color="inherit"
        aria-label="open drawer"
        edge="start"
        onClick={handleDrawerToggle}
        sx={{ mr: 2, display: { md: 'none' } }}
      >
        <MenuIcon />
      </IconButton>
      <Box component="nav" sx={{ width: { md: drawerWidth }, flexShrink: { md: 0 } }}>
        {/* Mobile drawer */}
        <Drawer
          variant="temporary"
          open={open}
          onClose={handleDrawerToggle}
          ModalProps={{
            keepMounted: true, // Better open performance on mobile
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
          variant="permanent"
          sx={{
            display: { xs: 'none', md: 'block' },
            '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
          }}
          open
        >
          {drawer}
        </Drawer>
      </Box>
    </>
  );
};

export default Sidebar;
