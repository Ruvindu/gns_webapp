import React, { useState } from 'react';
import logo from './../../logo.svg';
import { AppBar, Box, Toolbar, Typography, IconButton, Drawer, List, ListItemText, Divider, ListItemButton, ListItemIcon } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import DashboardIcon from '@mui/icons-material/Dashboard';
import NotificationsNoneIcon from '@mui/icons-material/NotificationsNone';
import DescriptionIcon from '@mui/icons-material/Description';
import LayersIcon from '@mui/icons-material/Layers';
import SettingsIcon from '@mui/icons-material/Settings';
import { useNavigate } from "react-router-dom"


const Sidebar = () => {
    const [drawerOpen, setDrawerOpen] = useState(false);

    const toggleDrawer = (open) => (event) => {
        if (event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
            return;
        }
        setDrawerOpen(open);
    };

    const navigate = useNavigate();

    const handleNavigation = (path) => {
        navigate(path);
    };


    const list = () => (
        <Box
            sx={{
                width: 300,
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between'
            }}
            role="presentation"
            onClick={toggleDrawer(false)}
            onKeyDown={toggleDrawer(false)}
        >
            <Box>
                <Box
                    sx={{
                        display: 'flex',
                        alignItems: 'center',
                        padding: 2,
                    }}
                >
                    <img src={logo} alt="Logo" style={{ width: '100%', height: 'auto', maxWidth: '150px' }} />
                </Box>
                <Divider />
                <List>
                    <ListItemButton onClick={() => handleNavigation('/')}>
                        <ListItemIcon>
                            <DashboardIcon />
                        </ListItemIcon>
                        <ListItemText primary='DashBoard' />
                    </ListItemButton>

                    <ListItemButton onClick={() => handleNavigation('/NotificationManager')}>
                        <ListItemIcon>
                            <NotificationsNoneIcon />
                        </ListItemIcon>
                        <ListItemText primary='Notification Manager' />
                    </ListItemButton>

                    <ListItemButton onClick={() => handleNavigation('/Templates')}>
                        <ListItemIcon>
                            <DescriptionIcon />
                        </ListItemIcon>
                        <ListItemText primary='Templates' />
                    </ListItemButton>

                    <ListItemButton onClick={() => handleNavigation('/Cache')}>
                        <ListItemIcon>
                            <LayersIcon />
                        </ListItemIcon>
                        <ListItemText primary='Cache' />
                    </ListItemButton>

                    <ListItemButton onClick={() => handleNavigation('/Settings')}>
                        <ListItemIcon>
                            <SettingsIcon />
                        </ListItemIcon>
                        <ListItemText primary='Settings' />
                    </ListItemButton>
                </List>
            </Box>
            <Box>
                <Typography variant="caption" sx={{ display: 'block', padding: 2, textAlign: 'left', color: 'GrayText' }}>
                    CopyRights © GNS 2024
                </Typography>
            </Box>
        </Box>
    );

    return (
        <Box sx={{ flexGrow: 1 }}>
            <AppBar position="static" color="default" elevation={0}>
                <Toolbar>
                    <IconButton
                        size="large"
                        edge="start"
                        color="inherit"
                        aria-label="menu"
                        sx={{ mr: 1 }}
                        onClick={toggleDrawer(true)}
                    >
                        <MenuIcon />
                    </IconButton>
                    <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                        GNS Control Panel
                    </Typography>
                </Toolbar>
            </AppBar>

            <Drawer
                anchor="left"
                open={drawerOpen}
                onClose={toggleDrawer(false)}
            >
                {list()}
            </Drawer>

        </Box>
    );
};

export default Sidebar;
