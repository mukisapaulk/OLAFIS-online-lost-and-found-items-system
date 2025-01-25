import { FeedbackOutlined, RateReviewTwoTone, Star, StarBorder } from '@mui/icons-material';
import { Box, Stack, CircularProgress, Button, Modal, TextField, Grid, Typography, Divider } from '@mui/material';
import React, { useEffect, useState } from 'react';
import '../App.css';
import axios from 'axios';
import Navbar from './navbar';
import Footer from './footer';
import Sidebar from './sidebar';
import FeedbackSystem from './FeedbackSystem';

function Lost() {
  // Button hover states
  const [isHovered, setIsHovered] = useState(false);
  const [isHover, setIsHover] = useState(false);
  const [isHov, setIsHov] = useState(false);

  // Button styles
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
  const buttonSty = {
    backgroundColor: '#ffc107',
    color: 'black',
    borderRadius: '5px',
    border: isHov ? '2px dashed #e0a800' : '2px solid #e0a800',
    transition: 'border 0.3s ease',
  };

  const [loading, setLoading] = useState(false);
  const [successModalOpen, setSuccessModalOpen] = useState(false);
  const [openModal1, setOpenModal1] = useState(false);
  const [openModal2, setOpenModal2] = useState(false);
  const [rating, setRating] = useState(0);
  const [errors, setErrors] = useState({});
  const [username, setUsername] = useState('');

  useEffect(() => {
    const storedUsername = localStorage.getItem('username');
    if (storedUsername) {
      setUsername(storedUsername);
    }
  }, []);

  const [formData, setFormData] = useState({
    itemName: '',
    description: '',
    location: '',
    reward: '', // Removed required
    imagePath: null,
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });

    // Validate reward on input change
    if (name === 'reward' && value !== '') {
      if (isNaN(value)) {
        setErrors({ ...errors, reward: 'Reward must be a number' });
      } else {
        setErrors({ ...errors, reward: '' }); // Clear error if it's a valid number
      }
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setFormData({ ...formData, imagePath: file });
  };

  const validateForm = () => {
    let formErrors = {};
    if (!formData.itemName) formErrors.itemName = 'Lost Item Name is required';
    if (!formData.description) formErrors.description = 'Description is required';
    if (!formData.location) formErrors.location = 'Location is required';
    if (!formData.imagePath) formErrors.imagePath = 'Image is required';

    setErrors(formErrors);
    return Object.keys(formErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    setLoading(true);
    try {
      const formDataToSend = new FormData();
      formDataToSend.append('itemName', formData.itemName);
      formDataToSend.append('description', formData.description);
      formDataToSend.append('reward', formData.reward); // Send the reward even if not required
      formDataToSend.append('location', formData.location);
      formDataToSend.append('imagePath', formData.imagePath);
      formDataToSend.append('itemType', 'lost');
      formDataToSend.append('username', username);

      await axios.post('http://localhost:5000/api/lost', formDataToSend);
      setSuccessModalOpen(true);
      setFormData({
        itemName: '',
        description: '',
        reward: '', // Reset reward field
        location: '',
        imagePath: null,
      });
    } catch (error) {
      console.error('Error posting item:', error);
      alert('Error posting item. Please try again later.');
    }
    setLoading(false);
  };

  const handleClose = () => {
    setOpenModal2(false);
  };

  const handleStarClick = (index) => {
    setRating(index + 1);
  };

  const handleFeedback = () => {
    setOpenModal1(false);
    setSuccessModalOpen(true);
  };

  return (
    <div className="w-full h-full font-sans">
      <Navbar />
      <FeedbackSystem />
      <div className="flex flex-col min-h-screen">
        <Stack direction={{ xs: 'column', sm: 'row' }} className="m-2" gap="10px">
          <Sidebar />
          <Box className="bg-inherit flex-1 mt-5 p-5 overflow-y-auto"
           
          >
            <Grid container spacing={2} justifyContent="center" alignItems="center" mt={2}>
              <Grid item xs={12} md={6}>
                <Box width="100%">
                  <form className="flex flex-col gap-5 my-10 overflow-y-auto">
                    <TextField
                      value={formData.itemName}
                      onChange={handleInputChange}
                      name="itemName"
                      required
                      label="Lost Item Name"
                      fullWidth
                      variant="outlined"
                      error={!!errors.itemName}
                      helperText={errors.itemName}
                      InputLabelProps={{ style: { zIndex: 2, background: 'white', padding: '0 5px' } }}
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          '& fieldset': { borderColor: 'green' },
                          '&:hover fieldset': { borderColor: 'blue' },
                        },
                        marginBottom: '10px',
                      }}
                    />
                    <TextField
                      value={formData.description}
                      onChange={handleInputChange}
                      name="description"
                      required
                      label="Description"
                      multiline
                      rows={4}
                      fullWidth
                      variant="outlined"
                      error={!!errors.description}
                      helperText={errors.description}
                      InputLabelProps={{ style: { zIndex: 2, background: 'white', padding: '0 5px' } }}
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          '& fieldset': { borderColor: 'green' },
                          '&:hover fieldset': { borderColor: 'blue' },
                        },
                        marginBottom: '10px',
                      }}
                    />
                    <TextField
                      value={formData.location}
                      onChange={handleInputChange}
                      name="location"
                      required
                      label="Location where you lost your item"
                      fullWidth
                      variant="outlined"
                      error={!!errors.location}
                      helperText={errors.location}
                      InputLabelProps={{ style: { zIndex: 2, background: 'white', padding: '0 5px' } }}
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          '& fieldset': { borderColor: 'green' },
                          '&:hover fieldset': { borderColor: 'blue' },
                        },
                        marginBottom: '10px',
                      }}
                    />
                    <input
                      type="file"
                      name="imagePath"
                      required
                      onChange={handleFileChange}
                      accept="image/*"
                       className="block w-full text-sm text-black-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-black hover:file:bg-blue-100"
                    />
                    {errors.imagePath && (
                      <p style={{ color: 'red', marginTop: '5px', marginBottom: '-10px' }}>{errors.imagePath}</p>
                    )}
                    <TextField
                      value={formData.reward}
                      onChange={handleInputChange}
                      name="reward"
                      label="Reward (Optional - must be in UGX)"
                      fullWidth
                      variant="outlined"
                      error={!!errors.reward}
                      helperText={errors.reward}
                      InputLabelProps={{ style: { zIndex: 2, background: 'white', padding: '0 5px' } }}
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          '& fieldset': { borderColor: 'green' },
                          '&:hover fieldset': { borderColor: 'blue' },
                        },
                        marginBottom: '10px',
                      }}
                    />
                    <Button
                      variant="contained"
                      onClick={handleSubmit}
                      disabled={loading}
                      style={buttonStyle}
                      onMouseEnter={() => setIsHov(true)}
                      onMouseLeave={() => setIsHov(false)}
                    >
                      {loading ? <CircularProgress size={24} /> : 'Post Lost Item'}
                    </Button>
                  </form>
                </Box>
              </Grid>
              <Grid item xs={12} md={6}>
                <Box width="100%" textAlign="center">
                  <img
                    src="./lostitem.jpg"
                    alt="Illustration"
                    style={{
                      minWidth: '100%',
                      height: 'auto',
                      border: 'none',
                      borderRadius: 'none',
                      margin: '0px 40px 0px 0px',
                    }}
                  />
                </Box>
              </Grid>
            </Grid>
          </Box>
        </Stack>
      </div>
      <Footer />

      {/* Success Modal */}
      <Modal open={successModalOpen} onClose={() => setSuccessModalOpen(false)}>
        <Box
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            backgroundColor: 'white',
            padding: '40px',
            borderRadius: '10px',
            textAlign: 'center',
          }}
        >
          <Typography variant="h5" className="text-medium text-center mb-4">
            Lost Item Posted Successfully
          </Typography>
          <Button
            variant="contained"
            onClick={() => setSuccessModalOpen(false)}
            style={{ backgroundColor: 'rgb(22, 163, 74)', color: 'white', borderRadius:'5px', boxShadow:'none' }}
          >
            OK
          </Button>
        </Box>
      </Modal>

      {/* Feedback Modal */}
      <Modal open={openModal1} onClose={() => setOpenModal1(false)}>
        <Box
          className="w-[350px] rounded-[10px] fixed top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%] p-4 bg-white"
          display="flex"
          flexDirection="column"
          alignItems="center"
        >
          <Typography variant="h6" className="font-bold text-center mb-4">
            Leave Feedback
          </Typography>
          <TextField
            label="Your Feedback"
            multiline
            rows={4}
            fullWidth
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
          <Button variant="contained" color="primary" onClick={handleFeedback} style={buttonStyle}>
            Submit
          </Button>
        </Box>
      </Modal>

      {/* Rate Us Modal */}
      <Modal open={openModal2} onClose={handleClose}>
        <Box className="w-[300px] rounded-[10px] fixed top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%] p-4 bg-white" display="flex" flexDirection="column" alignItems="center">
          <Typography variant="h6" className="font-bold text-center mb-4">
            Rate Us
          </Typography>
          <Box display="flex" justifyContent="center" mb={2}>
            {[...Array(5)].map((_, index) => (
              <div
                key={index}
                onClick={() => handleStarClick(index)}
                style={{ cursor: 'pointer', marginRight: '4px', marginBottom: '5px' }}
              >
                {index < rating ? <Star /> : <StarBorder />}
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

export default Lost;