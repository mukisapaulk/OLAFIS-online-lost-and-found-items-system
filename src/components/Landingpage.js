import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Box, Stack, CircularProgress, Button, TextField, Typography, Modal } from '@mui/material';
import axios from 'axios'; // Import axios for API requests
import Slider from "react-slick"; // Import the image slider library
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css"; // Import Slick's CSS
import Banner from './Banner';

function LandingPage() {
  const [foundItems, setFoundItems] = useState([]);
  const [lostItems, setLostItems] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [loginError, setLoginError] = useState(''); // State for login error
  const [loading, setLoading] = useState(false); // State for loading indicator
  const [formData, setFormData] = useState({
    username: '',
    password: ''
  });

  const navigate = useNavigate();

  useEffect(() => {
    // Fetch recent found items from your API
    fetch('http://localhost:5000/api/items')
      .then(res => res.json())
      .then(data => {
        // Sort the data based on the date found
        data.sort((a, b) => new Date(b.dateFound) - new Date(a.dateFound));
        setFoundItems(data.slice(0, 3)); // Display only the top 3
      })
      .catch(error => console.error('Error fetching found items:', error));

    // Fetch recent lost items from your API
    fetch('http://localhost:5000/api/lost')
      .then(res => res.json())
      .then(data => {
        // Sort the data based on the date lost
        data.sort((a, b) => new Date(b.dateLost) - new Date(a.dateLost));
        setLostItems(data.slice(0, 3)); // Display only the top 3
      })
      .catch(error => console.error('Error fetching lost items:', error));
  }, []);

  const handleOpenModal = () => {
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setLoginError(''); // Clear login error when closing the modal
  };

  // Handle login form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Handle login form submission
  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await axios.post('http://localhost:5000/api/login', formData);
      // Store user data in localStorage
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
      // Redirect based on user type
      if (response.data.userType === 'admin') {
        navigate('/admin');
      } else {
        navigate('/found');
      }
      handleCloseModal(); // Close the modal
    } catch (error) {
      console.error('Error logging in:', error);
      setLoginError('Wrong username or password');
    }
    setLoading(false);
  };

  // Slider settings
  const sliderSettings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
    pauseOnHover: true
  };

  // Image URLs for the slider
  const images = [
    {
      title: 'Lost & Found',
      description: 'Find lost items or reunite with your missing belongings. Our system connects people who have lost something with those who have found it.',
      image: './slider4.png', 
    },
    {
      title: 'Easy to Use',
      description: 'Our platform is simple and intuitive, making it easy to report lost items or search for found items.',
      image: './slider2.jpg',
    },
    {
      title: 'Secure and Reliable',
      description: 'We prioritize the security of your information and ensure a reliable platform for reuniting lost items.',
      image: './slider3.jpg', 
    },
  ];

  return (
    <div className="bg-gray-100 min-h-screen font-sans">
      {/* Header */}
      <header className="bg-white shadow-md py-4 px-6 flex justify-between items-center">
        <img src='./o.png' alt='logo' style={{
          border: 'none',
          borderRadius: 'none',
          width: '300px',
          height: 'auto',
          marginLeft:'30px',
        }} />
        <nav>
  <ul className="flex space-x-6 list-none">
    <li>
      <Link to="/login" className="px-4 py-2 text-white bg-green-600 rounded-md shadow hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-300 no-underline">
        Login
      </Link>
    </li>
    <li>
      <Link to="/register" className="px-4 py-2 text-white bg-red-600 rounded-md shadow hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-300 no-underline">
        Register
      </Link>
    </li>
  </ul>
</nav>

      </header>

      {/* Hero Section */}
      <section className=" flex flex-col items-center">
        <Banner/>
      </section>

      {/* Recently Found Items Section */}
      <section className="py-16 px-6">
        <h2 className="text-2xl font-bold mb-4 text-center">
          Recently Found Items
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {foundItems.map((item, index) => (
            <div key={index} className="bg-white rounded-md shadow-lg p-4">
              <div className="relative">
                {item.imagePath && (
                  <img
                    src={`http://localhost:5000/${item.imagePath}`}
                    alt={item.itemName}
                    className="w-full h-48 object-cover rounded-lg mb-4"
                    style={{
                        border:'none',
                        borderRadius:'10px',
                    }}
                  />
                )}
                <div className="absolute bottom-4 left-4 bg-white rounded-md px-2 py-1 text-gray-700 shadow">
                  <Typography variant="body2">Found</Typography>
                </div>
              </div>
              <h3 className="text-xl font-bold mb-2">
                {item.itemName}
              </h3>
              
              <Button
                onClick={handleOpenModal}
                className="bg-blue-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                style={{
                    boxShadow:'none',
                    backgroundColor: 'rgb(22, 163, 74)',
                    color: 'white',
                    padding: '5px',
                  }}
              >
                claim
              </Button>
            </div>
          ))}
        </div>
      </section>

      {/* Report Lost Item Hero Section */}
      <section className="bg-slate-200 py-16 px-6 flex flex-col items-center">
        <div className="max-w-screen-xl w-full">
          <div className="text-center">
            <h2 className="text-3xl font-bold mb-4 ">
              Have you lost something precious?
            </h2>
            <p className="text-lg mb-8">
              Report your lost item here and let us help you find it.
            </p>
            <Button
              onClick={handleOpenModal}
              variant="contained"
              color="primary"
              size="large"
              className="focus:outline-none focus:ring-2 focus:ring-blue-300"
              style={{
                boxShadow:'none',
                backgroundColor: 'rgb(22, 163, 74)',
                color: 'white',
                padding: '10px',
              }}
            >
              Report Lost Item
            </Button>
          </div>
        </div>
      </section>

      {/* Recently Lost Items Section */}
      <section className="py-16 px-6">
        <h2 className="text-2xl font-bold mb-4 text-center">
          Recently Lost Items
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {lostItems.map((item, index) => (
            <div key={index} className="bg-white rounded-lg shadow-lg p-4">
              <div className="relative">
                {item.imagePath && (
                  <img
                    src={`http://localhost:5000/${item.imagePath}`}
                    alt={item.itemName}
                    className="w-full h-48 object-cover rounded-lg mb-4"
                    style={{
                        border:'none',
                        borderRadius:'10px',
                    }}
                  />
                )}
                <div className="absolute bottom-4 left-4 bg-white rounded-md px-2 py-1 text-gray-700 shadow">
                  <Typography variant="body2">Lost</Typography>
                </div>
              </div>
              <h3 className="text-xl font-bold mb-2">
                {item.itemName}
              </h3>
    
              <Button
                onClick={handleOpenModal}
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                style={{
                    boxShadow:'none',
                    backgroundColor: 'rgb(22, 163, 74)',
                    color: 'white',
                    padding: '5px',
                  }}
              >
                view more
              </Button>
            </div>
          ))}
        </div>
      </section>
      {/* Footer */}
      <footer className="bg-white py-6 px-6 text-center shadow-md">
        <Typography variant="body2" color="textSecondary">
          &copy; 2024 Online Lost And Found Items System. All rights reserved.
        </Typography>
      </footer>

      {/* Login Modal */}
      <Modal open={showModal} onClose={handleCloseModal}>
        <Box
          className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md fixed top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%]"
          
        >
          <h2 className="text-2xl font-bold mb-4">Login</h2>
          {loginError && (
            <Typography variant="caption" color="error" className="mb-2">
              {loginError}
            </Typography>
          )}
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
            />
            <Button
              type="submit"
              variant="contained"
              color="primary"
              fullWidth
              disabled={loading}
              className="mt-4"
              style={{
                backgroundColor: 'rgb(22, 163, 74)',
                boxShadow: 'none',
              }}
            >
              {loading ? (
                <CircularProgress size={24} />
              ) : (
                'Login'
              )}
            </Button>
          </form>
          <Typography variant="body2" color="textSecondary" className="mt-4 text-center">
            Don't have an account?{' '}
            <Link to="/register" className="text-blue-500">
              Register
            </Link>
          </Typography>
        </Box>
      </Modal>
    </div>
  );
}

export default LandingPage;
