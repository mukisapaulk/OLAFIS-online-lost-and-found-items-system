import React, { useState } from 'react';
import { Box, Stack, CircularProgress, Button, TextField, Typography } from '@mui/material';
import { NavLink, useNavigate } from 'react-router-dom';
import axios from 'axios';

function Login() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    username: '',
    password: ''
  });
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await axios.post('http://localhost:5000/api/login', formData);
      localStorage.setItem('username', formData.username);
      localStorage.setItem('userId', response.data._id);
      if (response.data.email) {
        localStorage.setItem('email', response.data.email);
      }
      if (response.data.phone) {
        localStorage.setItem('phone', response.data.phone);
      }
      if (response.data.profilePicture) {
        localStorage.setItem('profilePicture', response.data.profilePicture);
      }
      if (response.data.userType === 'admin') {
        navigate('/admin');
      } else {
        navigate('/homepage');
      }
    } catch (error) {
      console.error('Error logging in:', error);
      setError("Wrong username and password");
    }
    setLoading(false);
  };

  return (
    <div className="h-screen flex items-center justify-center">
      <Stack direction={{ xs: 'column', md: 'row' }} className="w-full max-w-screen-xl px-4">

         {/* Right Column: Image and Overlay */}
         <Box className="w-full h-full md:w-2/3 ">
          <div className=" flex items-center justify-center bg-green bg-opacity-50 mt-40 ml-10">
          <Typography
  variant="h3"
  color="white"
  className="text-center font-bold z-10"
  style={{ fontSize: '2.5rem', fontWeight: 'bold', marginLeft: '20px' }}
>
  Welcome!
  <br />
  <span style={{ fontSize: '2rem', color:"white" }}>To The</span>
  <br />
  <span style={{ fontSize: '2rem', color:"white" }}>Online Lost And Found Items System</span>
</Typography>
            
          </div>
          <img 
            src="./test.jpg"
            alt="Lost and Found Items"
            className="absolute inset-0 w-2/3 h-full object-cover border-none rounded-none border-none  bg-opacity-25"
           
          />
        </Box>
        {/* Left Column: Login Form */}
        <Box className="bg-white h-full p-8 w-full md:w-1/3">
          <Typography variant="h4" gutterBottom className="text-gray-800 font-bold mb-4 text-center">
            Login
          </Typography>
          
          <form onSubmit={handleLogin}>
            <TextField
              label="Username"
              name="username"
              value={formData.username}
              onChange={handleInputChange}
              fullWidth
              margin="normal"
              variant="outlined"
              className="mb-4"
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
            <TextField
              label="Password"
              type="password"
              name="password"
              value={formData.password}
              onChange={handleInputChange}
              fullWidth
              margin="normal"
              variant="outlined"
              className="mb-4"
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
            <Button
              type="submit"
              variant="contained"
              color="primary"
              fullWidth
              disabled={loading}
              className="mt-4"
              style={{
                backgroundColor:'rgb(22, 163, 74)',
                boxShadow:'none',
              }}
            >
              {loading ? (
                <CircularProgress size={24} />
              ) : (
                'Login'
              )}
            </Button>
            {error && (
              <Typography variant="caption" color="error" className="mt-2">
                {error}
              </Typography>
            )}
            <Typography variant="body2" color="textSecondary" className="mt-10 text-center">
              Don't have an account? <NavLink to="/register" className="text-blue-500 mt-10">Register</NavLink>
            </Typography>
          </form>
        </Box>

       
      </Stack>
    </div>
  );
}

export default Login;
