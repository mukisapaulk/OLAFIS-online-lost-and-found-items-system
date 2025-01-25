import React, { useEffect, useState } from 'react';
import { Box, Stack, CircularProgress, Button, Modal, TextField } from '@mui/material';
import StarIcon from '@mui/icons-material/Star';
import { FeedbackOutlined, RateReviewTwoTone } from '@mui/icons-material';
import StarBorderIcon from '@mui/icons-material/StarBorder';
import axios from 'axios';
import Navbar from './navbar';
import Sidebar from './sidebar';
import ImageIcon from '@mui/icons-material/Image';
import FeedbackSystem from './FeedbackSystem';
import AdminSidebar from './adminsidebar';
import AdminBar from './adminbar';
import Footer from './footer';


function AdminChat() {
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [openModal1, setOpenModal1] = useState(false);
  const [openModal2, setOpenModal2] = useState(false);
  const [rating, setRating] = useState(0);
  const [username, setUsername] = useState('');
  const [profilePicture, setProfilePicture] = useState('');
  const [chats, setChats] = useState([]);
  const [users, setUsers] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [successModalOpen, setSuccessModalOpen] = useState(false);
  const [selectedChatPartner, setSelectedChatPartner] = useState(null);
  const [unreadCounts, setUnreadCounts] = useState({});
  const [image, setImage] = useState(null); // State to hold the selected image file
  const [imagePreview, setImagePreview] = useState(null); // State to hold image preview URL


  const buttonStyle = {
        boxShadow: 'none',
        backgroundColor: 'rgb(22, 163, 74)',
      };
    
      const buttonStyled = {
        backgroundColor: 'white',
        color: 'black',
        border: 'none',
        boxShadow: '0px 0px 10px rgba(0,0,0,0.5)',
        transition: 'background-color 0.3s, color 0.3s, box-shadow 0.3s',
        padding: '10px 20px',
        borderRadius: '5px',
        cursor: 'pointer',
      };

  useEffect(() => {
    const storedUsername = localStorage.getItem('username');
    if (storedUsername) {
      setUsername(storedUsername);
    }
  }, []);

  useEffect(() => {
    const storedProfilePicture = localStorage.getItem('profilePicture');
    if (storedProfilePicture) {
      setProfilePicture(storedProfilePicture);
    }
  }, []);

  const fetchUnreadCounts = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/unreadCounts', {
        params: { username }
      });
      const counts = response.data.reduce((acc, { _id, count }) => {
        acc[_id] = count;
        return acc;
      }, {});
      setUnreadCounts(counts);
    } catch (error) {
      console.error('Error fetching unread counts:', error);
    }
  };

  useEffect(() => {
    fetchUnreadCounts();
  }, [username]);

  useEffect(() => {
    const fetchChats = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/chats', {
          params: { username, partner: selectedChatPartner }
        });
        setChats(response.data);

        // Mark messages as read
        await axios.post('http://localhost:5000/api/markAsRead', { username, partner: selectedChatPartner });

        // Update unread counts
        fetchUnreadCounts();
      } catch (error) {
        console.error('Error fetching chats:', error);
      }
    };

    if (selectedChatPartner) {
      fetchChats();
    }
  }, [selectedChatPartner, username]);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/accountsfetch');
        setUsers(response.data);
      } catch (error) {
        console.error('Error fetching users:', error);
      }
    };

    const intervalId = setInterval(fetchUsers, 5000);

    return () => clearInterval(intervalId);
  }, []);

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append('message', message);
      formData.append('username', username);
      formData.append('partner', selectedChatPartner);
      if (image) {
        formData.append('image', image);
      }

      await axios.post('http://localhost:5000/api/chats', formData);

      const response = await axios.get('http://localhost:5000/api/chats', {
        params: { username, partner: selectedChatPartner }
      });
      setChats(response.data);
      setMessage('');
      setImage(null);
      setImagePreview(null);

      // Update unread counts
      fetchUnreadCounts();
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleImageChange = (e) => {
    const selectedImage = e.target.files[0];
    setImage(selectedImage);

    // Display image preview
    const reader = new FileReader();
    reader.onload = () => {
      setImagePreview(reader.result);
    };
    reader.readAsDataURL(selectedImage);
  };

  const handleFeedback = () => {
    setSuccessModalOpen(true);
    setOpenModal1(false);
  };

  const handleStarClick = (index) => {
    setRating(index + 1);
  };

  const handleClose = () => {
    setOpenModal2(false);
  };

  const filteredUsers = users.filter(user =>
    user.username.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const formatDate = (dateString) => {
    const options = {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: 'numeric'
    };
    return new Date(dateString).toLocaleDateString('en-US', options);
  };

  return (
    <div className='h-[100vh] font-sans'>
       <AdminBar />
{/* <FeedbackSystem/> */}
      <div className='mt-[80px]'>
        <Stack direction={{ xs: 'column', sm: 'row' }} className='m-2' gap="10px">
        <AdminSidebar />

          <Box className="bg-inherit flex-grow overflow-y-auto" p={4}  ml={{ xs: 0, sm: 100, md: 30 }}>
            <div className='flex gap-5 p-2 mt-10 '>
              <div className='flex gap-5'>
                {/*  */}
              </div>
            </div>

            <div className='flex flex-col h-[70vh] overflow-y-auto' style={{ marginLeft: '75px', marginRight: '75px' }}>
              <div className='w-full p-2'>
                {chats.map((chat, index) => (
                  <div key={index} className={`flex ${chat.username === username ? 'justify-end' : 'justify-start'} mb-4`}>
                    <div className={`max-w-md p-4 rounded-lg ${chat.username === username ? 'bg-green-600 text-white' : 'bg-gray-200 text-black'}`} style={{ borderRadius: '12px 20px 4px', padding: '10px' }}>
                      <div className="flex justify-between items-center">
                        <h1 className="text-sm font-semibold">{chat.username}</h1>
                        <h1 className="text-xs text-gray-500 ml-2">{formatDate(chat.date)}</h1>
                      </div>
                      {chat.message && <p className="mt-2">{chat.message}</p>}
                      {chat.image && (
                        <div className="mt-2">
                          <img src={`http://localhost:5000/${chat.image}`} alt="Sent by user" style={{ 
                            maxWidth: '100%', 
                            maxHeight: '200px' ,
                            borderRadius:'5px',
                            objectFit:'cover',
                            border:'none',
                          }} 
                            />
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              {selectedChatPartner && (
                <div className="w-full flex justify-center items-center mt-auto p-3">
                  <form className="flex gap-3 w-full">
                  <div className="flex gap-3 w-full">
  <TextField
    value={message}
    onChange={(e) => setMessage(e.target.value)}
    variant="outlined"
    label={`Message ${selectedChatPartner}`}
    fullWidth
    InputLabelProps={{
      style: { zIndex: 2, background: 'white', padding: '0 5px' }
    }}
    sx={{
      '& .MuiOutlinedInput-root': {
        '& fieldset': { borderColor: 'green' },
        '&:hover fieldset': { borderColor: 'blue' },
      },
      marginBottom: '10px',
    }}
  />
  <div className="relative">
    <input
      type="file"
      accept="image/*"
      onChange={handleImageChange}
      style={{ display: 'none' }}
      id="upload-image"
    />
     {imagePreview && (
    <img
    className="absolute right-20 top-1/2 transform -translate-y-1/2 cursor-pointer mb-2 p-1"
      src={imagePreview}
      alt="Preview"
      style={{ 
        maxWidth: '90px',
        maxHeight: '90px',
        // Remove borderRadius for a non-circular preview:
        borderRadius:'5px',
        objectFit: 'cover',
        border:'none',
   }}   
    />
  )}
    <label htmlFor="upload-image"
       className="absolute right-3 top-1/2 transform -translate-y-1/2 cursor-pointer p-3 mb-2" 
        variant="outlined"
        component="span"
        style={{ color: 'rgb(220, 38, 38)', border: 'none', cursor: 'pointer' }}
      >
        <ImageIcon style={{ fontSize: 35 }}/> 
      
    </label>
  </div>
  <Button
    variant="contained"
    color="primary"
    onClick={handleSubmit}
    disabled={loading || !message.trim()}
    style={{ backgroundColor: 'rgb(22, 163, 74)', height: '57px' }}
  >
    {loading ? <CircularProgress size={24} /> : 'Send'}
  </Button>
</div>

                  </form>
                </div>
              )}
            </div>
          </Box>

          <Box
            className="bg-white flex flex-col items-center"
            sx={{
              padding: '10px',
              width: '250px',
              
            }}
          >
            <div style={{ marginBottom: '10px' }}>
              <input
                type="text"
                placeholder="Search users..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{
                  width: '100%',
                  padding: '10px',
                  border: '1px solid black',
                  borderRadius: '5px',
                  outline: 'none',
                }}
              />
            </div>
            <div className="w-full">
              {filteredUsers.map((user, index) => (
                <div
                  key={index}
                  className={`flex items-center gap-3 p-2 border-b border-bl-200 mb-2 ${user.username === selectedChatPartner ? 'bg-gray-200 rounded-md' : ''}`}
                  onClick={() => setSelectedChatPartner(user.username)}
                  style={{ cursor: 'pointer' }}
                >
                  <div className="relative">
                    <img
                      src={`http://localhost:5000/${user.profilePicture || 'default_profile.jpg'}`}
                      alt={user.username}
                      className="w-10 h-10 rounded-full"
                      onError={(e) => { e.target.src = "https://via.placeholder.com/150"; }}
                    />
                    {user.isActive && (
                      <span className="absolute top-0 right-0 w-3 h-3 rounded-full animate-pulse" style={{
                        backgroundColor: 'green',
                        boxShadow: '0 0 10px green',
                      }}></span>
                    )}
                    {unreadCounts[user.username] > 0 && (
                      <span className="absolute top-2 right-2 bg-red-500 text-white rounded-full px-2 py-1 text-xs font-bold">
                        {unreadCounts[user.username]}
                      </span>
                    )}
                  </div>
                  <span style={{
                    color:'black'
                  }}>{user.username}</span>
                </div>
              ))}
            </div>
          </Box>
        </Stack>
      </div>

      <Modal open={openModal1} onClose={() => setOpenModal1(false)}>
        <Box
          className="w-[350px] rounded-[10px] fixed top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%] p-4 bg-white"
          display="flex"
          flexDirection="column"
          alignItems="center"
        >
          <h2 className="text-lg mb-5">Leave Feedback</h2>
          <TextField
            label="Your Feedback"
            multiline
            rows={4}
            fullWidth
            variant='outlined'
            InputLabelProps={{
              style: { zIndex: 2, background: 'white', padding: '0 5px' }
            }}
            sx={{
              '& .MuiOutlinedInput-root': {
                '& fieldset': { borderColor: 'green' },
                '&:hover fieldset': { borderColor: 'blue' },
              },
              marginBottom: '10px',
            }}
          />
          <Button variant="contained" color="primary" onClick={handleFeedback} style={buttonStyle}>
            Submit
          </Button>
        </Box>
      </Modal>

      <Modal open={successModalOpen} onClose={() => setSuccessModalOpen(false)}>
        <Box
          className="w-[300px] rounded-[10px] fixed top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%] p-4 bg-white text-center"
          display="flex"
          flexDirection="column"
          alignItems="center"
        >
          <h2 className="text-medium m-5">Thank you for your feedback!</h2>
          <Button variant="contained" color="primary" onClick={() => setSuccessModalOpen(false)} style={buttonStyle}>
            Close
          </Button>
        </Box>
      </Modal>

      <Modal open={openModal2} onClose={handleClose}>
        <Box className="w-[300px] rounded-[10px] fixed top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%] p-4 bg-white" display="flex" flexDirection="column" alignItems="center">
          <h2 className="text-lg mb-5">Rate Us</h2>
          <Box display="flex" justifyContent="center" mb={2}>
            {[...Array(5)].map((_, index) => (
              <div
                key={index}
                onClick={() => handleStarClick(index)}
                style={{ cursor: 'pointer', marginRight: '4px', marginBottom: '5px' }}
              >
                {index < rating ? <StarIcon /> : <StarBorderIcon />}
              </div>
            ))}
          </Box>
          <Button variant="contained" color="primary" onClick={handleClose} style={{ boxShadow: 'none', backgroundColor: 'rgb(22, 163, 74)' }}>
            Submit
          </Button>
        </Box>
      </Modal>
    </div>
  );
}

export default AdminChat;