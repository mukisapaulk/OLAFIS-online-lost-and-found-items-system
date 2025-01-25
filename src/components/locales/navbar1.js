import React, { useState, useEffect } from 'react';
import { Box, IconButton, Badge, Avatar, Tooltip, Menu, MenuItem } from '@mui/material';
import { AccountCircle, Notifications, Mail, ArrowDropDown, SettingsApplications, Settings } from '@mui/icons-material';
import { NavLink } from 'react-router-dom';
import axios from 'axios';

function Navbar1() {
  const [anchorEl, setAnchorEl] = useState(null);
  const [anchorEl1, setAnchorEl1] = useState(null);
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [profilePicture, setProfilePicture] = useState('');

  useEffect(() => {
    // Retrieve username, email, and phone from local storage
    const storedUsername = localStorage.getItem('username');
    const storedEmail = localStorage.getItem('email');
    const storedPhone = localStorage.getItem('phone');
    const storedProfilePicture = localStorage.getItem('profilePicture');
    
    if (storedUsername) {
      setUsername(storedUsername);
      console.log(storedUsername)
    }
    if (storedEmail) {
      setEmail(storedEmail);
    }
    if (storedPhone) {
      setPhone(storedPhone);
      
      console.log(storedPhone)
    }
    if (storedProfilePicture) {
      setProfilePicture(storedProfilePicture);
      
      console.log(storedProfilePicture)
    }
  }, []);
  

  const handleOpenUserMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleOpenUserMenu1 = (event) => {
    setAnchorEl1(event.currentTarget);
  };


  const handleCloseUserMenu = () => {
    setAnchorEl(null);
    setAnchorEl1(null);
  };

  // Define state variables to store chats
  const [chats, setChats] = useState([]);

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

  return (
    <Box bgcolor='#070429' position="fixed" width="100%" paddingBottom="7px" boxShadow="0 0 10px gray" className='p-2'>
      <div className='flex justify-between items-center'>
        <h6 className='text-[1.6em]  text-gray-100  font-bold'>SYSTÈME D'OBJETS PERDUS ET TROUVÉS</h6>
        <Box display="flex" alignItems="center" >
        
        <NavLink to="/chat1">
          <IconButton size="large" aria-label="show 4 new mails" color="inherit">
            <Badge badgeContent={chats.length} color="error">
           
                <Mail sx={{ color: 'white', }} />
            
            </Badge>
          </IconButton>
          </NavLink>

          <IconButton
            size="large"
            aria-label="show 17 new notifications"
            color="inherit"
          >
            <Badge badgeContent="0" color="error">
              <Notifications sx={{ color: 'white', }} />
            </Badge>
          </IconButton>

          <div className='flex gap-3 '>
            <Tooltip title="Ouvrir les paramètres">
              <IconButton onClick={handleOpenUserMenu} sx={{ p: 0, marginLeft: '20px' }}>
                <img alt="User Avatar"  src={`http://localhost:5000/` + profilePicture} />
              </IconButton>
            </Tooltip>
            <div onClick={handleOpenUserMenu} className='flex items-baseline mt-8'>
              <p  className='text-white font-medium'>{username}</p>
              <div><ArrowDropDown sx={{color:'white',}}/></div>
            </div>

            <div className='flex align-baseline'><IconButton     size="large" color='inherit'>
        <Settings onClick={handleOpenUserMenu1} sx={{ color: 'white', fontSize:'1.2em' }}  />
        </IconButton></div> 
          </div>
          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleCloseUserMenu}
            anchorOrigin={{
              vertical: 'top',
              horizontal: 'right',
            }}
            transformOrigin={{
              vertical: 'top',
              horizontal: 'right',
            }}
          >
            <div>
              <p className='text-center '>PROFIL</p>
            </div>
            <hr></hr>
            <MenuItem>NOM D'UTILISATEUR: {username}</MenuItem>
            <MenuItem>E-MAIL: {email}</MenuItem>
            <MenuItem>TÉL: {phone}</MenuItem>
            <hr></hr>
            <MenuItem>
              <NavLink to="/">Se déconnecter</NavLink>
            </MenuItem>
          </Menu>



          <Menu
            anchorEl={anchorEl1}
            open={Boolean(anchorEl1)}
            onClose={handleCloseUserMenu}
            anchorOrigin={{
              vertical: 'top',
              horizontal: 'right',
            }}
            transformOrigin={{
              vertical: 'top',
              horizontal: 'right',
            }}
            sx={{paddingTop:'10px'}}
          >
            <div className='m-5 '>
              <p className='text-center font-medium '>LANGUAGE</p>
            </div>
            <hr></hr>
            <MenuItem>
              <NavLink to="/found">ENGLISH</NavLink>
            </MenuItem>
         
            <hr></hr>
            <MenuItem>
              <NavLink to="/found1">FRENCH</NavLink>
            </MenuItem>
          </Menu>


        </Box>
      </div>
    </Box>
  );
}

export default Navbar1;
