import React, { useEffect, useState } from 'react';
import {
  Box,
  List,
  ListItemIcon,
  ListItemText,
  Typography,
  Divider,
  ListItemButton,
  Drawer,
  IconButton,
} from '@mui/material';
import { NavLink, useLocation } from 'react-router-dom';
import {
  AccountCircle,
  Logout,
  Edit,
  List as ListIcon,
  Verified,
  ArrowCircleDownTwoTone,
  Menu as MenuIcon,
} from '@mui/icons-material';
import axios from 'axios';
import SearchOffIcon from '@mui/icons-material/SearchOff';
import DashboardIcon from '@mui/icons-material/Dashboard';
import FeedbackIcon from '@mui/icons-material/Feedback';


function AdminSidebar() {
  const [chats, setChats] = useState([]);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const fetchChats = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/chats');
        setChats(response.data);
      } catch (error) {
        console.error('Error fetching chats:', error);
      }
    };

    fetchChats();
  }, []);

  const navItems = [
    {
      text: 'Dashboard',
      icon: <DashboardIcon />,
      path: '/dash',
    },
    {
      text: 'Users',
      icon: <AccountCircle />,
      path: '/admin',
    },
    {
      text: 'Found',
      icon: <ListIcon />,
      path: '/adminfound',
    },
    {
      text: 'Lost',
      icon: <SearchOffIcon />,
      path: '/adminlost',
    },
    {
      text: 'Claims',
      icon: <ArrowCircleDownTwoTone />,
      path: '/claim',
    },
    {
      text: 'Feedback',
      icon: <FeedbackIcon />,
      path: '/adminfeedback',
    },
    {
      text: 'Verification',
      icon: <Verified />,
      path: '/verify',
    },
    {
      text: 'Register',
      icon: <Edit />,
      path: '/content',
    },
  ];

  const toggleDrawer = (open) => (event) => {
    if (event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
      return;
    }
    setDrawerOpen(open);
  };

  return (
    <Box>
      {/* Burger Menu Button (Mobile) */}
      <IconButton
        edge="start"
        color="inherit"
        aria-label="open drawer"
        onClick={toggleDrawer(true)}
        sx={{
          display: { sm: 'none' },
          position: 'fixed',
          top: 16,
          left: 16,
          zIndex: 2,
        }}
      >
        <MenuIcon />
      </IconButton>

      {/* Drawer (Mobile) */}
      <Drawer anchor="left" open={drawerOpen} onClose={toggleDrawer(false)}>
        <Box
          sx={{
            width: 250,
            bgcolor: '#3f51b5',
            color: 'white',
            height: '100%',
          }}
         
        >
          <Box p={3}>
            <Typography variant="h6" fontWeight="bold" mb={2}>
              Admin Dashboard
            </Typography>
            <Divider sx={{ bgcolor: 'rgba(255, 255, 255, 0.5)' }} />
            <List>
              {navItems.map((item) => (
                <NavLink
                  key={item.text}
                  to={item.path}
                  style={{ textDecoration: 'none', color: 'inherit' }}
                  onClick={toggleDrawer(false)}
                >
                  <ListItemButton
                    sx={{
                      borderRadius: 2,
                      '&:hover': { bgcolor: '#536dfe' },
                      bgcolor: location.pathname === item.path ? '#536dfe' : 'transparent',
                      transition: 'background-color 0.3s',
                    }}
                  >
                    <ListItemIcon sx={{ color: 'inherit' }}>
                      {item.icon}
                    </ListItemIcon>
                    <ListItemText primary={item.text} />
                  </ListItemButton>
                </NavLink>
              ))}
            </List>
            <Divider sx={{ bgcolor: 'rgba(255, 255, 255, 0.5)', my: 2 }} />
            <NavLink to="/" style={{ textDecoration: 'none', color: 'inherit' }} onClick={toggleDrawer(false)}>
              <ListItemButton
                sx={{
                  borderRadius: 2,
                  '&:hover': { bgcolor: '#536dfe' },
                  transition: 'background-color 0.3s',
                }}
              >
                <ListItemIcon sx={{ color: 'inherit' }}>
                  <Logout />
                </ListItemIcon>
                <ListItemText primary="Logout" />
              </ListItemButton>
            </NavLink>
          </Box>
        </Box>
      </Drawer>

      {/* Sidebar (Desktop) */}
      <Box
        sx={{
          width: { sm: 240 },
          bgcolor: 'rgb(22, 163, 74)',
          color: 'white',
          height: '100vh',
          position: 'fixed',
          top: 0,
          left: 0,
          zIndex: 999,
          overflowY: 'auto',
          boxShadow: 3,
          display: { xs: 'none', sm: 'block' },
        }}
        
      >
        <Box p={3}>
          <Typography variant="h6" fontWeight="bold" mb={2}>
            Admin Dashboard
          </Typography>
          <Divider sx={{ bgcolor: 'rgba(255, 255, 255, 0.5)' }} />
          <List>
            {navItems.map((item) => (
              <NavLink key={item.text} to={item.path} style={{ textDecoration: 'none', color: 'inherit' }}>
                <ListItemButton
                  sx={{
                    borderRadius: 2,
                    padding: '15px',
                    '&:hover': { bgcolor: 'rgb(47, 184, 96)' },
                    bgcolor: location.pathname === item.path ? 'rgb(47, 184, 96)' : 'transparent',
                    transition: 'background-color 0.1s',
                  }}
                >
                  <ListItemIcon sx={{ color: 'inherit' }}>
                    {item.icon}
                  </ListItemIcon>
                  <ListItemText primary={item.text} />
                </ListItemButton>
              </NavLink>
            ))}
          </List>
          {/* <Divider sx={{ bgcolor: 'rgba(255, 255, 255, 0.5)', my: 2 }} />
          <NavLink to="/" style={{ textDecoration: 'none', color: 'inherit' }}>
            <ListItemButton
              sx={{
                borderRadius: 2,
                '&:hover': { bgcolor: '#536dfe' },
                transition: 'background-color 0.3s',
              }}
            >
              <ListItemIcon sx={{ color: 'inherit' }}>
                <Logout />
              </ListItemIcon>
              <ListItemText primary="Logout" />
            </ListItemButton>
          </NavLink> */}
        </Box>
      </Box>
    </Box>
  );
}

export default AdminSidebar;
