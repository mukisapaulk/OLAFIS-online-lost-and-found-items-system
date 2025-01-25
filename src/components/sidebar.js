import { Home, PresentToAll, InfoOutlined, MessageRounded, PersonRemoveAlt1, NoteAdd } from '@mui/icons-material';
import { Box, IconButton, Menu, MenuItem, Tooltip, Typography } from '@mui/material';
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import PageviewIcon from '@mui/icons-material/Pageview';
import { NavLink } from 'react-router-dom';

function Sidebar() {
  // Define state variables to store chats and menu open/closed state
  const [chats, setChats] = useState([]);
  const [anchorEl, setAnchorEl] = useState(null);

  useEffect(() => {
    // Fetch chats data from the API
    const fetchChats = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/chats');
        // Update the state with the fetched chats
        setChats(response.data);
      } catch (error) {
        console.error('Error fetching chats:', error);
      }
    };

    // Call the fetchChats function
    fetchChats();
  }, []); // Empty dependency array ensures the effect runs only once

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  return (
    <>
    <Tooltip title='menu'>
      <IconButton
        sx={{ color: 'black', position: 'fixed', top: 16, left: 16, zIndex: 3 }}
        onClick={handleMenuOpen}
      >
        {/* Hamburger menu icon */}
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M4 6H20M4 12H20M4 18H20" stroke="black" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </IconButton>
      </Tooltip>
      <Typography
      sx={{ color: 'black', position: 'fixed', top: 22, left: 16, zIndex: 3, margin:'0 35px 0px 35px', fontWeight:'600', padding:'0 20px 0 10px'}}>
        Menu 
      </Typography>
      <Menu
        id="sidebar-menu"
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
        sx={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100vw',
          height: '100vh',
          bgcolor: 'transparent',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          zIndex: 3,
        }}
      >
        <Box
          className=" w-full h-full overflow-auto flex flex-col"
          sx={{
            padding: '20px',
            color: 'black',
          }}
        >
          <NavLink
            to="/homepage"
            style={({ isActive }) => ({
              padding: '10px',
              textDecoration: 'none',
              borderBottom: isActive ? '1px solid rgb(220, 38, 38)' : 'none',
              color: isActive ? 'rgb(220, 38, 38)': 'black'

            })}
            onClick={handleMenuClose}
          >
            <div className="inline-flex items-center">
              <Home sx={{ color: 'inherit', fontSize: '1.5em' }} />
              <h5 className="font-medium text-medium ml-2">Home</h5>
            </div>
          </NavLink>
          <NavLink
            to="/found"
            style={({ isActive }) => ({
              padding: '10px',
              textDecoration: 'none',
              borderBottom: isActive ? '1px solid rgb(220, 38, 38)' : 'none',
              color: isActive ? 'rgb(220, 38, 38)': 'black'

            })}
            onClick={handleMenuClose}
          >
            <div className="inline-flex items-center">
            <PageviewIcon sx={{ color: 'inherit', fontSize: '1.5em' }} />
              <h5 className="font-medium text-medium ml-2">Found Items</h5>
            </div>
          </NavLink>

          <NavLink
            to="/lostfound"
            style={({ isActive }) => ({
              color: 'black',
              padding: '10px',
              textDecoration: 'none',
              borderBottom: isActive ? '1px solid rgb(220, 38, 38)' : 'none',
              color: isActive ? 'rgb(220, 38, 38)': 'black'
            })}
            onClick={handleMenuClose}
          >
            <div className="inline-flex items-center">
              <PageviewIcon sx={{ color: 'inherit', fontSize: '1.5em' }} />
              <h5 className="font-medium text-medium ml-2">view Lost Items</h5>
            </div>
          </NavLink>

          <NavLink
            to="/lost"
            style={({ isActive }) => ({
              color: 'black',
              padding: '10px',
              textDecoration: 'none',
              borderBottom: isActive ? '1px solid rgb(220, 38, 38)' : 'none',
              color: isActive ? 'rgb(220, 38, 38)': 'black'
            })}
            onClick={handleMenuClose}
          >
            <div className="inline-flex items-center">
              <PersonRemoveAlt1 sx={{ color: 'inherit', fontSize: '1.5em' }} />
              <h5 className="font-medium text-medium ml-2">Post Lost Item</h5>
            </div>
          </NavLink>

          <NavLink
            to="/home"
            style={({ isActive }) => ({
              color: 'black',
              padding: '10px',
              textDecoration: 'none',
              borderBottom: isActive ? '1px solid rgb(220, 38, 38)' : 'none',
              color: isActive ? 'rgb(220, 38, 38)': 'black'
            })}
            onClick={handleMenuClose}
          >
            <div className="inline-flex items-center">
              <PresentToAll sx={{ color: 'inherit', fontSize: '1.5em' }} />
              <h5 className="font-medium text-medium ml-2">Post Found Item</h5>
            </div>
          </NavLink>

          <NavLink
            to="/tips"
            style={({ isActive }) => ({
              color: 'black',
              padding: '10px',
              textDecoration: 'none',
              borderBottom: isActive ? '1px solid rgb(220, 38, 38)' : 'none',
              color: isActive ? 'rgb(220, 38, 38)': 'black'
            })}
            onClick={handleMenuClose}
          >
            <div className="inline-flex items-center">
              <InfoOutlined sx={{ color: 'inherit', fontSize: '1.5em' }} />
              <h5 className="font-medium text-medium ml-2">Safety Tips</h5>
            </div>
          </NavLink>

          <NavLink
            to="/reports"
            style={({ isActive }) => ({
              color: 'black',
              padding: '10px',
              textDecoration: 'none',
              borderBottom: isActive ? '1px solid rgb(220, 38, 38)' : 'none',
              color: isActive ? 'rgb(220, 38, 38)': 'black'
            })}
            onClick={handleMenuClose}
          >
            <div className="inline-flex items-center">
              <NoteAdd sx={{ color: 'inherit', fontSize: '1.5em' }} />
              <h5 className="font-medium text-medium ml-2">Statistics</h5>
            </div>
          </NavLink>

          <NavLink
            to="/chat"
            style={({ isActive }) => ({
              color: 'black',
              padding: '10px',
              textDecoration: 'none',
              borderBottom: isActive ? '1px solid rgb(220, 38, 38)' : 'none',
              color: isActive ? 'rgb(220, 38, 38)': 'black'
            })}
            onClick={handleMenuClose}
          >
            <div className="inline-flex items-center">
              <MessageRounded sx={{ color: 'inherit', fontSize: '1.5em' }} />
              <h5 className="font-medium text-medium ml-2">
                Chat <span style={{
                  backgroundColor: 'rgb(220 38 38)',
                  borderRadius: '50%',
                  padding: '3px 8px',
                  marginLeft: '5px',
                  fontSize: '0.9em',
                  color: 'white',
                }}>{chats.length}</span>
              </h5>
            </div>
          </NavLink>
        </Box>
      </Menu>
     
    </>
  );
}

export default Sidebar;
