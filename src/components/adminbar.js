import React, { useState, useEffect } from 'react';
import {
  Box,
  IconButton,
  Badge,
  Tooltip,
  Menu,
  MenuItem,
  Button,
  TextField,
  Modal,
  Typography,
  Divider, // Import Divider component from Material-UI
} from '@mui/material'; // Make sure to import from the correct location
import {
  Settings,
  Notifications as NotificationsIcon,
  ArrowDropDown as ArrowDropDownIcon,
  BorderBottom,
  Mail,
} from '@mui/icons-material';
import { NavLink } from 'react-router-dom';
import axios from 'axios';

function AdminBar() {
  const [anchorEl, setAnchorEl] = useState(null);
  const [anchorEl1, setAnchorEl1] = useState(null);
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [profilePicture, setProfilePicture] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isModalOpen1, setIsModalOpen1] = useState(false);
  const [isModalOpen2, setIsModalOpen2] = useState(false);
  const [editedUserInfo, setEditedUserInfo] = useState({ username: '', email: '', phone: '' });
  const [notifications, setNotifications] = useState([]);
  const [notifications1, setNotifications1] = useState([]);
  const [replyMessage, setReplyMessage] = useState('');
  const [successModalOpen, setSuccessModalOpen] = useState(false);

  useEffect(() => {
    // Retrieve username, email, and phone from local storage
    const storedUsername = localStorage.getItem('username');
    const storedEmail = localStorage.getItem('email');
    const storedPhone = localStorage.getItem('phone');
    const storedProfilePicture = localStorage.getItem('profilePicture');

    if (storedUsername) {
      setUsername(storedUsername);
    }
    if (storedEmail) {
      setEmail(storedEmail);
    }
    if (storedPhone) {
      setPhone(storedPhone);
    }
    if (storedProfilePicture) {
      setProfilePicture(storedProfilePicture);
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

  const handleOpenModal = () => {
    setEditedUserInfo({ username, email, phone });
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setIsModalOpen2(false);
    setIsModalOpen1(false);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditedUserInfo((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSubmit = async () => {
    try {
      // Submit edited user profile information
      await axios.put('http://localhost:5000/api/edit', editedUserInfo);
      console.log('Edited User Info:', editedUserInfo);
      window.location.reload();
      setIsModalOpen(false);
    } catch (error) {
      console.error('Error updating user data:', error);
    }
  };

  const handleReplySubmit = async () => {
    try {
      // Send the reply to the backend
      await axios.post('http://localhost:5000/api/replies', {
        username,
        message: replyMessage,
      });
      // Optionally, you can close the modal or show a success message
      setIsModalOpen1(false);
      setIsModalOpen2(false);
      setSuccessModalOpen(true);
      // Clear the message field after sending
      setReplyMessage('');
    } catch (error) {
      console.error('Error sending reply:', error);
    }
  };

  // Fetch notifications from the API
  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const response = await axios.get(
          'http://localhost:5000/verify?username=' +
            localStorage.getItem('username')
        );
        setNotifications(response.data);
      } catch (error) {
        console.error('Error fetching notifications:', error);
      }
    };

    fetchNotifications();
  }, []);

  useEffect(() => {
    const fetchNotifications1 = async () => {
      try {
        const response = await axios.get(
          'http://localhost:5000/decisions?username=' +
            localStorage.getItem('username')
        );
        setNotifications1(response.data);
      } catch (error) {
        console.error('Error fetching notifications:', error);
      }
    };

    fetchNotifications1();
  }, []);

  return (
<Box 
  width="100%"
  padding="10px"
  bgcolor="white"
  color="black"
  display="flex"
  position={'fixed'}
  zIndex={9}
  justifyContent="space-between"
  alignItems="center"
  style={{
    /* From https://css.glass */
boxShadow: '0 4px 30px rgba(0, 0, 0, 0.1)',
backdropFilter: 'blur(12.2px)',
WebkitBackdropFilter: 'blur(12.2px)',
border: '1px solid rgba(255, 255, 255, 0.15)',

 }}
>
      <Typography variant="h6"> OLAFIS ADMIN</Typography>
      
      <Box display="flex" alignItems="center">
          <NavLink to="/adminchat">
          <div className='hidden lg:flex align-baseline'>
            <IconButton size="small" aria-label="show 4 new mails" color="black">
              <Badge variant='dot' color="error"
                style={{
                  margin: '2px',
                  borderRadius:'50%',
                }}>
                <Mail sx={{
                  color: 'black', marginRight: '5px'
                }} />
              </Badge>
            </IconButton>
            </div>
          </NavLink>


        {/* User Profile */}
        <Tooltip title="Profile">
          <IconButton onClick={handleOpenUserMenu}>
            <img
              alt="User Avatar"
              src={`http://localhost:5000/` + profilePicture}
              style={{ width: '30px', height: '30px', borderRadius: '50%' }}
            />
          </IconButton>
        </Tooltip>

        {/* Profile Menu */}
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
          <Box p={2}>
            <Typography variant="subtitle1">Profile</Typography>
            <Box display="flex" justifyContent="center" my={2}>
              <img
                src={`http://localhost:5000/` + profilePicture}
                alt="Profile"
                style={{ width: '80px', height: '80px', borderRadius: '50%' }}
              />
            </Box>
            <MenuItem>Username: {username}</MenuItem>
            <MenuItem>Email: {email}</MenuItem>
            <MenuItem>Phone: {phone}</MenuItem>
            <Box display="flex" justifyContent="center" mt={2}>
              <NavLink to="/">
                <Button variant="outlined" color="error">
                  Logout
                </Button>
              </NavLink>
            </Box>
          </Box>
        </Menu>

        {/* Language Menu */}
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
        >
          <Box p={2}>
            <Typography variant="subtitle1">Language</Typography>
            <Divider />
            <MenuItem>
              <NavLink to="/found">English</NavLink>
            </MenuItem>
            <MenuItem>
              <NavLink to="/found1">French</NavLink>
            </MenuItem>
          </Box>
        </Menu>
      </Box>

      {/* Modals */}
      <Modal open={isModalOpen} onClose={handleCloseModal}>
        <Box
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            bgcolor: 'white',
            borderRadius: '8px',
            padding: '20px',
            minWidth: '300px',
            maxWidth: '80vw',
          }}
        >
          <Typography variant="h5" mb={2} align="center">
            Edit Profile
          </Typography>
          <TextField
            label="Username"
            name="username"
            value={editedUserInfo.username}
            onChange={handleInputChange}
            fullWidth
            variant="outlined"
            margin="normal"
          />
          <TextField
            label="Email"
            name="email"
            value={editedUserInfo.email}
            onChange={handleInputChange}
            fullWidth
            variant="outlined"
            margin="normal"
          />
          <TextField
            label="Phone"
            name="phone"
            value={editedUserInfo.phone}
            onChange={handleInputChange}
            fullWidth
            variant="outlined"
            margin="normal"
          />
          <Box display="flex" justifyContent="center" mt={3}>
            <Button variant="contained" onClick={handleSubmit}>
              Save Changes
            </Button>
          </Box>
        </Box>
      </Modal>

      <Modal open={isModalOpen1} onClose={handleCloseModal}>
        <Box
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            bgcolor: 'white',
            borderRadius: '8px',
            padding: '20px',
            minWidth: '300px',
            maxWidth: '80vw',
          }}
        >
          <Typography variant="h5" mb={2} align="center">
            Notifications
          </Typography>
          {/* Display notifications here */}
        </Box>
      </Modal>

      <Modal open={isModalOpen2} onClose={handleCloseModal}>
        <Box
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            bgcolor: 'white',
            borderRadius: '8px',
            padding: '20px',
            minWidth: '300px',
            maxWidth: '80vw',
          }}
        >
          <Typography variant="h5" mb={2} align="center">
            Reply
          </Typography>
          <TextField
            label="Username"
            name="username"
            defaultValue={username}
            fullWidth
            variant="outlined"
            margin="normal"
            disabled
          />
          <TextField
            label="Message"
            name="message"
            value={replyMessage}
            onChange={(e) => setReplyMessage(e.target.value)}
            fullWidth
            variant="outlined"
            margin="normal"
            multiline
            rows={4}
          />
          <Box display="flex" justifyContent="center" mt={3}>
            <Button variant="contained" onClick={handleReplySubmit}>
              Send
            </Button>
          </Box>
        </Box>
      </Modal>

      <Modal open={successModalOpen} onClose={() => setSuccessModalOpen(false)}>
        <Box
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            bgcolor: 'white',
            padding: '20px',
            minWidth: '300px',
            maxWidth: '80vw',
          }}
        >
          <Typography variant="h5" mb={2} align="center">
            Successfully Sent
          </Typography>
          <Box display="flex" justifyContent="center" mt={3}>
            <Button variant="contained" color="primary" onClick={() => setSuccessModalOpen(false)}>
              OK
            </Button>
          </Box>
        </Box>
      </Modal>
    </Box>
  );
}

export default AdminBar;
