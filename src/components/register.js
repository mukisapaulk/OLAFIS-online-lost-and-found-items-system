import React, { useState } from 'react';
import {
  Box,
  Modal,
  CircularProgress,
  Button,
  Typography,
  TextField,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  Avatar,
} from '@mui/material';
import { NavLink, useNavigate } from 'react-router-dom';
import axios from 'axios';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined'; 

function Register() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [successModalOpen, setSuccessModalOpen] = useState(false);
  const [type, setType] = useState('user');
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    email: '',
    phone: '',
    profilePicture: null,
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleTypeChange = (event) => {
    setType(event.target.value);
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setFormData({ ...formData, profilePicture: file });
  };

  const handleRegister = async () => {
    setLoading(true);
    try {
      const formDataToSend = new FormData();
      formDataToSend.append('username', formData.username);
      formDataToSend.append('password', formData.password);
      formDataToSend.append('email', formData.email);
      formDataToSend.append('phone', formData.phone);
      formDataToSend.append('profilePicture', formData.profilePicture);
      formDataToSend.append('type', type);

      await axios.post('http://localhost:5000/api/accounts', formDataToSend);
      setSuccessModalOpen(true);
      setFormData({
        username: '',
        password: '',
        email: '',
        phone: '',
        profilePicture: null,
      });
      setType('user');
    } catch (error) {
      console.error('Error registering:', error);
      alert('Error registering. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setSuccessModalOpen(false);
    navigate('/');
  };

  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '100vh',
        bgcolor: 'rgb(220, 38, 38)', 
        fontFamily: 'Arial, sans-serif',
      }}
    >
      <Box
        sx={{
          maxWidth: 500,
          padding: 5,
          borderRadius: 5, 
          bgcolor: 'white',
          boxShadow: 10, 
          textAlign: 'center', 
        }}
      >
        <Avatar sx={{ bgcolor: 'rgb(220, 38, 38)', margin: 'auto', mb: 2 }}>
          <LockOutlinedIcon /> 
        </Avatar>
        <Typography variant="h4" component="h2" gutterBottom>
          Create an Account
        </Typography>

        <form onSubmit={(e) => e.preventDefault()}>
          <TextField
            label="Username"
            name="username"
            value={formData.username}
            onChange={handleInputChange}
            fullWidth
            margin="normal"
            required
            sx={{ input: { borderRadius: 2 } }} 
            InputLabelProps={{ 
              style: { 
                zIndex: 2, 
                background: 'white', 
                padding: '0 5px', 
              } 
            }}
          />
          <TextField
            label="Password"
            name="password"
            type="password"
            value={formData.password}
            onChange={handleInputChange}
            fullWidth
            margin="normal"
            required
            sx={{ input: { borderRadius: 2 } }} 
            InputLabelProps={{ 
              style: { 
                zIndex: 2, 
                background: 'white', 
                padding: '0 5px', 
              } 
            }}
          />
          <TextField
            label="Email"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleInputChange}
            fullWidth
            margin="normal"
            required
            sx={{ input: { borderRadius: 2 } }} 
            InputLabelProps={{ 
              style: { 
                zIndex: 2, 
                background: 'white', 
                padding: '0 5px', 
              } 
            }}
          />
          <TextField
            label="Phone"
            name="phone"
            value={formData.phone}
            onChange={handleInputChange}
            fullWidth
            margin="normal"
            required
            sx={{ input: { borderRadius: 2 } }} 
            InputLabelProps={{ 
              style: { 
                zIndex: 2, 
                background: 'white', 
                padding: '0 5px', 
              } 
            }}
          />
          <FormControl fullWidth margin="normal">
            <InputLabel id="type-label" InputLabelProps={{ 
                style: { 
                  zIndex: 2, 
                  background: 'white', 
                  padding: '0 5px', 
                } 
              }}>Account Type</InputLabel> 
            <Select
              labelId="type-label"
              id="type"
              value={type}
              onChange={handleTypeChange}
              label="Account Type" 
              sx={{ borderRadius: 2 }} 
              
            >
              <MenuItem value="admin">Admin</MenuItem>
              <MenuItem value="user">User</MenuItem>
            </Select>
          </FormControl>

          <input
            accept="image/*"
            id="profilePicture"
            type="file"
            onChange={handleFileChange}
            style={{ display: 'none' }}
          />
          <label htmlFor="profilePicture">
            <Button
              variant="contained"
              component="span"
              startIcon={<CloudUploadIcon />}
              fullWidth
              sx={{ borderRadius: 2, textTransform: 'capitalize', padding: 2 }}
            >
              Upload Profile Picture
            </Button>
          </label>
          {formData.profilePicture && (
            <Typography
              variant="caption"
              display="block"
              align="center"
              mt={1}
              color="text.secondary"
            >
              Selected: {formData.profilePicture.name}
            </Typography>
          )}

          <Button
            variant="contained"
            color="primary" 
            onClick={handleRegister}
            disabled={loading}
            fullWidth
            sx={{
              mt: 3,
              borderRadius: 2, 
              textTransform: 'capitalize',
             
            }}
            style={{
              backgroundColor:'rgb(22, 163, 74)',
              boxShadow:'none',
              borderRadius:'10px',
              padding:'5px'
             
            }}
          >
            {loading ? (
              <CircularProgress size={24} color="inherit" />
            ) : (
              'Sign Up'
            )}
          </Button>

          <Typography align="center" mt={2}>
            Already have an account?{' '}
            <NavLink to="/">
              <span style={{ color: '#3f51b5', cursor: 'pointer' }}>
                Log In
              </span>
            </NavLink>
          </Typography>
        </form>
      </Box>

      {/* Success Modal */}
      <Modal open={successModalOpen} onClose={handleClose}>
        <Box
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            bgcolor: 'background.paper',
            boxShadow: 24,
            p: 4,
            borderRadius: 2,
            textAlign:'center'
          }}
        >
          <Typography variant="h6" component="h2" color="success.main" align="center">
            Registered Successfully!
          </Typography>
          <Button
            variant="contained"
            color="primary"
            onClick={handleClose}
            fullWidth 
            sx={{ mt: 3 }}
            style={{
              backgroundColor:'rgb(22, 163, 74)',
              boxShadow:'none',
              borderRadius:'10px',
             
            }}
          >
            OK
          </Button>
        </Box>
      </Modal>
    </Box>
  );
}

export default Register;