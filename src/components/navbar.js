import React, { useState, useEffect } from 'react';
import { Box, IconButton, Badge, Tooltip, Menu, MenuItem, Button, TextField, Modal, Toolbar } from '@mui/material';
import { Language, Notifications, Mail } from '@mui/icons-material';
import { NavLink } from 'react-router-dom';
import axios from 'axios';
import Translate from './Translate';

function Navbar() {
  const [anchorEl, setAnchorEl] = useState(null);
  const [anchorEl1, setAnchorEl1] = useState(null);
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [profilePicture, setProfilePicture] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isModalOpen1, setIsModalOpen1] = useState(false);
  const [isModalOpen2, setIsModalOpen2] = useState(false);
  const [isModalOpen3, setIsModalOpen3] = useState(false); // Modal for profile picture
  const [editedUserInfo, setEditedUserInfo] = useState({ username: '', email: '', phone: '' });
  const [notifications, setNotifications] = useState([]);
  const [notifications1, setNotifications1] = useState([]);
  const [replyMessage, setReplyMessage] = useState('');
  const [successModalOpen, setSuccessModalOpen] = useState(false);
  const [chats, setChats] = useState([]);
  const [currentNotification, setCurrentNotification] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);

  useEffect(() => {
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

  const handleOpenProfilePictureModal = () => {
    setIsModalOpen3(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setIsModalOpen2(false);
    setIsModalOpen1(false);
    setIsModalOpen3(false);
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
      await axios.put('http://localhost:5000/api/edit', editedUserInfo);
      console.log('Edited User Info:', editedUserInfo);
      // window.location.reload(); // Remove this line
      setIsModalOpen(false);
    } catch (error) {
      console.error('Error updating user data:', error);
    }
  };

  const handleReplySubmit = async () => {
    try {
      const response = await axios.post('http://localhost:5000/api/replies', {
        username,
        message: replyMessage,
        notificationId: currentNotification._id,
      });

      // Assuming `response.data.deletedNotification` contains the deleted notification details
      
      // Update notifications state to remove the replied notification
      setNotifications(prevNotifications => prevNotifications.filter(notification => notification._id !== currentNotification._id));

      setIsModalOpen1(false);
      setIsModalOpen2(false);
      setSuccessModalOpen(true);
      setReplyMessage('');
    } catch (error) {
      console.error('Error sending reply:', error);
    }
  };

  const handleImageChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedImage(e.target.files[0]);
    }
  };

  const uploadProfilePicture = async () => {
    const formData = new FormData();
    formData.append('image', selectedImage);
    formData.append('username', username);
    try {
      await axios.post('http://localhost:5000/api/profile-picture', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      setProfilePicture(selectedImage.name);
      // window.location.reload(); // Remove this line
      handleCloseModal();
    } catch (error) {
      console.error('Error uploading profile picture:', error);
    }
  };

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

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const response = await axios.get('http://localhost:5000/verify?username=' + localStorage.getItem('username'));
        setNotifications(response.data);
      } catch (error) {
        console.error('Error fetching notifications:', error);
      }
    };

    fetchNotifications();
  }, []);
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
useEffect(() => {
  const fetchNotifications1 = async () => {
   try {
     const response = await axios.get('http://localhost:5000/decisions?username=' + localStorage.getItem('username'));
     setNotifications1(response.data);
   } catch (error) {
     console.error('Error fetching notifications:', error);
   }
 };
 fetchNotifications1();
}, []);
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  return (
    <Box className=' pt-2 pl-20'
      sx={{
        position: 'fixed',
        width: '100%',
        minHeight: '13%',
        margin: 0,
        background: 'white',
        zIndex: 3,

      }}
      style={{
        /* From https://css.glass */
    boxShadow: '0 4px 30px rgba(0, 0, 0, 0.1)',
    backdropFilter: 'blur(12.2px)',
    WebkitBackdropFilter: 'blur(12.2px)',
    border: '1px solid rgba(255, 255, 255, 0.15)',
    
     }}
    >
      <div className='flex justify-between items-center'>
        <div>
          <img src='./o.png' alt='logo' style={{
            border: 'none',
            borderRadius: 'none',
            width: '300px',
            height: 'auto',
            marginLeft:'30px',
          }} />
        </div>

        <Box display="flex" alignItems="center">
          <NavLink to="/chat">
            <IconButton size="small" aria-label="show 4 new mails" color="black">
              <Badge badgeContent={chats.length} color="error"
                style={{
                  margin: '2px',
                }}>
                <Mail sx={{
                  color: 'black',
                }} />
              </Badge>
            </IconButton>
          </NavLink>
          <IconButton
            size="small"
            aria-label="show 17 new notifications"
            color="inherit"
            onClick={() => setIsModalOpen1(true)}
          >
            <Badge
              anchorOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              badgeContent={notifications.length + notifications1.length} color='error'
              style={{
                margin: '2px',
              }}>
              <Notifications sx={{ color: 'black' }} />
            </Badge>
          </IconButton>

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
            sx={{ paddingTop: '8px',
            }}
          >
            <div className='m-5'>
              <p className='text-center font-meidum'>LANGUAGE</p>
            </div>
            
            <MenuItem>
              <Translate />
            </MenuItem>
            
            
            {/* <MenuItem>
              <NavLink to="/found1">FRENCH</NavLink>
            </MenuItem> */}
          </Menu>

          <Tooltip title='change langauge'>
          <div className='flex align-baseline'>
            <IconButton size="medium" color='inherit'>
              <Language onClick={handleOpenUserMenu1} sx={{ color: 'black', fontSize: '1.2em' }} />
            </IconButton>
          </div>
          </Tooltip>

          <div className='flex gap-3'>
            <Tooltip title="View profile">
              <IconButton onClick={handleOpenUserMenu} sx={{ p: 0, marginRight: '20px' }}>
                <img alt="" src={`http://localhost:5000/` + profilePicture} style={{
                  border: 'none',
                  width: '40px',
                  height: '40px',
                }} />
              </IconButton>
            </Tooltip>
          </div>

          <div className='flex align-baseline mr-10'>
            <Button variant="contained"
              style={{
                backgroundColor: 'rgb(220 38 38)',
                border: '2px solid rgb(220 38 38)',
                color: 'white',
                boxShadow: 'none',
              }}
              href='https://lostandfounditems.createaforum.com/' target="_blank">Forum</Button>

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
              <p className='text-center'>PROFILE</p>
            </div>
            <hr />
            <div className='flex justify-center m-3'><img className='rounded-none' src={`http://localhost:5000/` + profilePicture} /></div>
            <MenuItem>Username: {username}</MenuItem>
            <MenuItem>E-mail: {email}</MenuItem>
            <MenuItem>Phone: {phone}</MenuItem>
            <MenuItem onClick={handleOpenProfilePictureModal}>Edit Profile Picture</MenuItem>
            <div className='flex justify-between m-2'>
              <MenuItem>
                <NavLink to="/"><Button variant='outlined' color='error'>Logout</Button></NavLink>
              </MenuItem>
            </div>
          </Menu>

        </Box>
      </div>

      {/* Edit Profile Modal */}
      <Modal open={isModalOpen} onClose={handleCloseModal}>
        <Box sx={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', backgroundColor: 'white', padding: '20px', borderRadius: '8px' }}>
          <h2>Edit Profile</h2>
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
          <Button variant="contained" onClick={handleSubmit}>Save</Button>
        </Box>
      </Modal>

      {/* Notifications Modal */}
      <Modal open={isModalOpen1} onClose={handleCloseModal}>
        <Box sx={{ position: 'absolute', top: '30%', left: '60%', transform: 'translate(-50%, -50%)', backgroundColor: 'white', padding: '20px', borderRadius: '5px' }}>
          <h2 className='uppercase text-center font-bold'>Notifications</h2>
          <hr></hr>
          

          {notifications.map((notification, index) => (
            <div key={index}>
              <div className='flex gap-3 m-3'>
                <p className='m-2'>{notification.message}</p>
                <Button  variant='contained' onClick={() => { setIsModalOpen2(true); setCurrentNotification(notification); }}
                  style={{
                    backgroundColor: 'rgb(22, 163, 74)',
                    color: 'white',
                    border: 'none',
                    boxShadow:'none',
                  }}
                > REPLY</Button>
              </div>
            </div>
          ))}


{notifications1.map((notification, index) => (
            <div key={index}>
              <hr></hr>
           <div className='flex justify-between mt-4 m-3'>
           <p className='text-black'><span className='font-bold text-black'>{notification.username}  </span>
            <span className='text-black'>{notification.message} </span> 
           
           </p>
          
           </div>
            </div>
          ))}



        </Box>
      </Modal>

      {/* Reply Modal */}
      <Modal open={isModalOpen2} onClose={handleCloseModal}>
        <Box className='overflow-auto-y' sx={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', backgroundColor: 'white', padding: '20px', borderRadius: '5px' }}>
          <h2 style={{
            margin:'5px 0px 10px 0px',
          }}>REPLY</h2>

          <TextField
            label="message"
            name="message"
            value={replyMessage}
            onChange={(e) => setReplyMessage(e.target.value)}
            fullWidth
            rows={4}
      variant='outlined'
      InputLabelProps={{ 
        style: { 
          zIndex: 2, 
          background: 'white', 
          padding: '0 5px', 
        } 
      }}
      sx={{
        '& .MuiOutlinedInput-root': {
          '& fieldset': {
            borderColor: 'green', // Change the outline color here
          },
          '&:hover fieldset': {
            borderColor: 'blue', // Change the outline color on hover
          },
        },
        marginBottom:'10px',
      }}
          />
          <Button variant="contained" onClick={handleReplySubmit}
            style={{
              backgroundColor: 'rgb(22, 163, 74)',
              color: 'white',
              border: 'none',
              boxShadow:'none',
            }}
          >Send</Button>
        </Box>
      </Modal>

      {/* Profile Picture Modal */}
      <Modal open={isModalOpen3} onClose={handleCloseModal}>
        <Box sx={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', backgroundColor: 'white', padding: '20px', borderRadius: '5px' }}>
          <h2>Upload Profile Picture</h2>
          <input type="file" accept="image/*" onChange={handleImageChange} />
          <Button variant="contained" onClick={uploadProfilePicture}>Upload</Button>
        </Box>
      </Modal>

      {/* Success Modal */}
      <Modal open={successModalOpen} onClose={() => setSuccessModalOpen(false)}>
        <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', backgroundColor: 'white', padding: '50px', borderRadius:'10px' }}>
          <h2 className='text-[1.2em] font-medium text-black'> Successfully sent</h2>
          <div className='mt-5 flex justify-center'>
            <p onClick={() => setSuccessModalOpen(false)} className='text-white bg-green-600 p-2 mt-4 text-center rounded-md font-medium text-lg cursor-pointer w-[40%]'>OK</p>
          </div>
        </div>
      </Modal>
    </Box>
  );
}

export default Navbar;