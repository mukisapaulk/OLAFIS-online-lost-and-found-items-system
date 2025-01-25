import { FeedbackOutlined, ShareRounded, Search } from '@mui/icons-material'
import { Box, Stack,  Button, Modal, TextField, Skeleton, Breadcrumbs, Alert, AlertTitle } from '@mui/material'
import React, { useEffect, useState } from 'react'
import '../App.css'
import StarIcon from '@mui/icons-material/Star';
import StarBorderIcon from '@mui/icons-material/StarBorder';
import {
  FacebookShareButton,
  TwitterShareButton,
  LinkedinShareButton,
  WhatsappShareButton,
  FacebookIcon,
  TwitterIcon,
  LinkedinIcon,
  WhatsappIcon
} from 'react-share';

// import AsyncStorage from '@react-native-async-storage/async-storage';

import {  Link } from 'react-router-dom'
import { RateReviewTwoTone } from '@material-ui/icons';
import Sidebar from './sidebar';
import Navbar from './navbar';
import Footer from './footer';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
// import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';
import {CardActionArea, CardActions } from '@mui/material';
import Ribbon from './Ribbon';
import Divider from '@mui/material/Divider';
import Banner from './Banner';
import FeedbackSystem from './FeedbackSystem';


function Found() {


  //my button 1
  const [isHovered, setIsHovered] = useState(false);

  const buttonStyle = {
    boxShadow:'none',
    backgroundColor:'rgb(22, 163, 74)',
  };

  //my button 2
  const [isHover, setIsHover] = useState(false);

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




  const [loading, setLoading] = useState(true);
  const [foundItems, setFoundItems] = useState([]);


  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [searchCounts, setSearchCounts] = useState({});
  const [successModalOpen, setSuccessModalOpen] = useState(false);
  const [successModalOpen1, setSuccessModalOpen1] = useState(false);
  const [openModal1, setOpenModal1] = useState(false);
  const [openModal2, setOpenModal2] = useState(false);
  const [rating, setRating] = useState(0);
  const [openShareModal, setOpenShareModal] = useState(false);
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [username, setUsername] = useState('');
  const [selectedItem, setSelectedItem] = useState(null); // State to store selected item details
  const [showClaimForm, setShowClaimForm] = useState(false); // State to control claim form visibility
  const [claimedItem, setClaimedItem] = useState(null); // State to store claimed item details
  const [formErrors, setFormErrors] = useState({}); // State to store validation errors

  // Dynamic link for sharing
  const [shareLink, setShareLink] = useState('');

  // State for the claim form
  const [locationLost, setLocationLost] = useState('');
  const [dateLost, setDateLost] = useState('');
  const [description, setDescription] = useState('');
  const [uniqueFeature, setUniqueFeature] = useState('');

  useEffect(() => {
    // Retrieve username, email, and phone from local storage
    const storedUsername = localStorage.getItem('username');
    const storedEmail = localStorage.getItem('email');
    const storedPhone = localStorage.getItem('phone');

    if (storedUsername) {
      setUsername(storedUsername);
    }
    if (storedEmail) {
      setEmail(storedEmail);
    }
    if (storedPhone) {
      setPhone(storedPhone);
    }

  }, []);

  const handleClaim = async (itemName, description, contact) => {
    // Open the claim form and store the item details
    setClaimedItem({ itemName, description, contact });
    setShowClaimForm(true);
  };

  const handleCloseClaimForm = () => {
    setShowClaimForm(false);
    setFormErrors({}); // Clear errors when closing the form
  };

  // Function to submit the claim form
  const handleSubmitClaim = async () => {
    // Basic Validation
    const errors = {};
    if (!locationLost.trim()) {
      errors.locationLost = "Location Lost is required";
    }
    if (!dateLost) {
      errors.dateLost = "Date Lost is required";
    }
    if (!description.trim()) {
      errors.description = "Description is required";
    }
    setFormErrors(errors); 

    // If there are no errors, proceed with the claim
    if (Object.keys(errors).length === 0) {
      try {
        const response = await fetch('http://localhost:5000/claim', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            itemName: claimedItem.itemName,
            description: claimedItem.description,
            username,
            phone,
            contact: claimedItem.contact,
            locationLost, 
            dateLost,
            description, 
            uniqueFeature 
          })
        });
        const data = await response.json();
        console.log('Claim successful:', data);
        setSuccessModalOpen1(true); // Show the success modal
        handleCloseClaimForm(); // Close the claim form
      } catch (error) {
        console.error('Error claiming item:', error);
      }
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/items');
        let data = await response.json();
  
        // Sort the data based on searchNumber in descending order
        data.sort((a, b) => b.searchNumber - a.searchNumber);
  
        setFoundItems(data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching data:', error);
        setLoading(false);
      }
    };
  
    fetchData();
  }, []);
  

  // Search function triggered on input change
  const handleSearch = async () => {
    try {
      setLoading(true); 
      if (searchQuery.trim() === '') {
        // If search query is empty, reset search results and stop loading
        setSearchResults([]);
        setLoading(false);
        return; 
      }

      const response = await fetch('http://localhost:5000/api/search', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ searchQuery }),
      });
      const data = await response.json();
      setSearchResults(data);
      setLoading(false); 
      console.log('Search results:', data);
    } catch (error) {
      console.error('Error searching items:', error);
      setLoading(false); 
    }
  };

  // Trigger search when searchQuery changes
  useEffect(() => {
    handleSearch(); 
  }, [searchQuery]); 



  const handleClose = () => {
    setOpenModal2(false);
  };

  const handleStarClick = (index) => {
    setRating(index + 1);
  };


  const onShare = (itemName, description, imagePath) => {
    setSelectedItem({ itemName, description, imagePath });
    // Create dynamic share link based on item details and current URL
    const shareUrl = `${window.location.origin}/found?itemName=${itemName}`; // Assuming your Found component handles query params
    setShareLink(shareUrl);
    setOpenShareModal(true);
  };

  const handleFeedback = () => {
    setOpenModal1(false);
    setSuccessModalOpen(true);
  };
  

  return (
    <div className='w-full bg-slate-100 h-[100vh] font-san'>
     <Navbar/>
     
     <Footer/>
     <FeedbackSystem/>
    
      {/* Main Content */}
      <div className='mt-[70px]'>
        <Stack direction={{ xs: 'column', sm: 'row' }}  gap="10px">


        <Sidebar/>
    


          <Box className="bg-inherit w-full h-full overflow-y-scroll" >

{/* Hero Section */}
<section className=" flex flex-col items-center">
        <Banner/>
      </section>






<div className='flex flex-col justify-between items-center border border-black-100 rounded-lg my-1 p-3 ml-0  md:flex-row md:items-center'> 
  <div className='flex flex-col gap-5 md:flex-row md:gap-5'> 
    <Typography variant='h5' sx={{
      fontFamily: 'serif',
      fontWeight: 600,
      color: '#333',
      textShadow: '0px 1px 2px rgba(0, 0, 0, 0.2)', 
      marginBottom: '1rem',
      textAlign: 'center', // Center align for smaller screens
    }}>
      Found Items
    </Typography>
  </div>

               


                    <div className=''>
                    {/* <Breadcrumbs aria-label="breadcrumb">
                    <Link underline="hover" color="primary" to="#">
                      <p className=' text-[1em] hover:border-dashed active:border-2 active:border-black  focus:border-2 focus:border-black hover:underline' style={{
                        color:'#b1c5ff',
                        // fontWeight:'bold',
                        webkitTextStrokeWidth: '0.3px', 
                        webkitTextStrokeColor: 'black',
                      }}>Found Items</p>
                    </Link>
                    <Link underline="hover" color="inherit" to="/lostfound">
                    <p className=' text-[0.9em] hover:border-dashed active:border-2 active:border-black  focus:border-2 focus:border-black hover:underline'style={{
                        color:'#d5b3ff',
                        // fontWeight:'bold',
                        webkitTextStrokeWidth: '0.3px', 
                        webkitTextStrokeColor: 'black',
                      }}>Lost Items</p>
                    </Link>
                   
                  </Breadcrumbs> */}
                         


                    </div>

                  <div className='p-1 bg-white border-black border border-black-200 rounded-lg px-5  flex gap-3 items-center'style={{
                    marginRight:'25px',
                  }}>

              <input className='outline-none p-1 bg-white'   value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)} placeholder="Search For Found Items" type='text'/>
                  {/* <Search onClick={handleSearch} sx={{fontSize:'2em', cursor:'pointer', color:'rgb(220, 38, 38)'}}/> */}

                  
                  </div>
                  </div>

    <Box className='p-4' display={{ xs: 'grid', md: 'grid' }} gridTemplateColumns={{ xs: '1fr', md: 'repeat(4, 1fr)' }} gap={1} p={1} m={2}>
      {loading ? (
        // Display skeletons while loading
        Array.from(new Array(8)).map((_, index) => (
          <Card key={index} sx={{
            position: 'relative', 
            maxWidth: { xs: 345, md: 345 }, 
            borderRadius: '10px',
            boxShadow: 'none',
            border: 'none',
            minHeight: 320,
            margin:'10px 20px 20px 10px',
          }}>
            <Skeleton variant="rectangular" sx={{ backgroundColor: 'rgb(248 250 252)' }} width="100%" height={200} />
            <Skeleton variant="rectangular" sx={{ backgroundColor: 'rgb(248 250 252)' }} width="100%" height={100} />
          </Card>
        ))
      ) : (
        // Display all foundItems (initial display) or searchResults
        (searchQuery.trim() === '' || searchResults.length === 0) ? (
          foundItems.map((item, index) => (
            <Card key={index} sx={{
              position: 'relative',
              maxWidth: { xs: 345, md: 500 },
              borderRadius: '10px',
              boxShadow: 'none',
              border: 'none',
              minHeight: 320,
              margin:'10px 20px 20px 10px',
            }}>
              <CardActionArea>
                {/* Image with overlay */}
                <div style={{ position: 'relative' }}>
                  {item.imagePath && (
                    <>
                      <img src={`http://localhost:5000/` + item.imagePath} alt={`Image ${index + 1}`} className='w-full h-[30vh] mb-0 rounded-none border-0' />
                      <div style={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        width: '100%',
                        height: '100%',
                        backgroundColor: '#4CAF5036', 
                        borderRadius: 'inherit', 
                      }}></div>
                    </>
                  )}
                  <Ribbon>Found</Ribbon>
                </div>
                <CardContent>
                  <Typography gutterBottom variant="h5" component="div" sx={{
                    color: 'black',
                    fontSize: { xs: '15px', md: '17px' },
                    textTransform: 'capitalize',
                  }}>
                    {item.itemName}
                  </Typography>
                </CardContent>
              </CardActionArea>
              <div>
                <CardActions style={{ padding: '10px' }}>
                  <div className='grid grid-cols-3 divide-x'>
                    <Button onClick={() => onShare(item.itemName, item.description, item.imagePath)} size="small" color="primary" style={{
                      color: 'black',
                      padding: '5px',
                    }}>
                      <ShareRounded />Share
                    </Button>
                    <Divider orientation="vertical" variant="middle" flexItem style={{
                      color: 'transparent',
                      backgroundColor: 'transparent',
                    }} />
                    <Button variant="contained" color="primary" onClick={() => handleClaim(item.itemName, item.description, item.contact)} style={{
                      boxShadow:'none',
                      backgroundColor: 'rgb(22, 163, 74)',
                      color: 'white',
                      padding: '5px',
                    }}>
                      Claim
                    </Button>
                  </div>
                </CardActions>
              </div>
            </Card>
          ))
        ) : (
          // Display search results (if any)
          searchResults.map((item, index) => (
            <Card key={index} sx={{
              position: 'relative', 
              maxWidth: { xs: 345, md: 345 }, 
              borderRadius: '10px',
              boxShadow: 'none',
              border: 'none',
              minHeight: 320,
              margin:'10px 10px 10px 10px',
            }}>
              <CardActionArea>
                {/* Image with overlay */}
                <div style={{ position: 'relative' }}>
                  {item.imagePath && (
                    <>
                      <img src={`http://localhost:5000/` + item.imagePath} alt={`Image ${index + 1}`} className='w-full h-[20vh] mb-0 rounded-none border-0' />
                      <div style={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        width: '100%',
                        height: 'auto',
                        backgroundColor: '#4CAF5036', 
                        borderRadius: 'inherit', 
                      }}></div>
                    </>
                  )}
                  <Ribbon>Found</Ribbon>
                </div>
                <CardContent>
                  <Typography gutterBottom variant="h5" component="div" sx={{
                    color: 'black',
                    fontSize: { xs: '15px', md: '17px' },
                    textTransform: 'capitalize',
                  }}>
                    {item.itemName}
                  </Typography>
                </CardContent>
              </CardActionArea>
              <div>
                <CardActions style={{ padding: '10px' }}>
                  <div className='grid grid-cols-3 divide-x'>
                    <Button onClick={() => onShare(item.itemName, item.description, item.imagePath)} size="small" color="primary" style={{
                      color: 'black',
                      padding: '5px',
                    }}>
                      <ShareRounded />Share
                    </Button>
                    <Divider orientation="vertical" variant="middle" flexItem style={{
                      color: 'white',
                      backgroundColor: 'white',
                    }} />
                    <Button variant="contained" color="primary" onClick={() => handleClaim(item.itemName, item.description, item.contact)} style={{
                      boxShadow:'none',
                      backgroundColor: 'rgb(22, 163, 74)',
                      color: 'white',
                      padding: '5px',
                     
                    }}>
                      Claim
                    </Button>
                  </div>
                </CardActions>
              </div>
            </Card>
          ))
        )
      )}
    </Box>
  



   
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

      <Modal open={successModalOpen1} onClose={() => setSuccessModalOpen1(false)}>
        <Box
          className="w-[350px] rounded-[10px] fixed top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%] p-4 bg-white text-center"
          display="flex"
          flexDirection="column"
          alignItems="center"
        >
          <h2 className="text-lg mb-3 mt-3 text-green-600">Item successfully claimed!</h2>
          <h2 className="text-lg mb-5 ">Please wait for feedback from the admin</h2>

          <Button variant="contained" color="primary" onClick={() => setSuccessModalOpen1(false)} style={buttonStyle}>
            Close
          </Button>
        </Box>
      </Modal>

      <Modal open={openModal2} onClose={handleClose}>
        <Box
          className="w-[300px] rounded-[10px] fixed top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%] p-4 bg-white "
          display="flex"
          flexDirection="column"
          alignItems="center"
        >
          <h2 className="text-lg mb-5">Rate Us</h2>
          <Box display="flex" justifyContent="center" mb={2}>
            {[...Array(5)].map((_, index) => (
              <div
                key={index}
                onClick={() => handleStarClick(index)}
                style={{ cursor: 'pointer', marginRight: '4px', marginBottom:'5px'}}
              >
                {index < rating ? <StarIcon /> : <StarBorderIcon />}
              </div>
            ))}
          </Box>
          <Button variant="contained" color="primary" onClick={handleClose} style={buttonStyle}>
            Submit
          </Button>
        </Box>
      </Modal>

      {/* Share Modal */}
      <Modal open={openShareModal} onClose={() => setOpenShareModal(false)}>
      <Box
        className="bg-white p-4 rounded-lg shadow-lg"
        sx={{ maxWidth: 400, margin: 'auto', mt: '10%' }}
      >
        <Typography variant="h6" gutterBottom className="text-center mb-10">
          Share {selectedItem?.itemName}
        </Typography>
        <div className="flex justify-center items-center space-x-4 mb-8"> {/* Center buttons with space */}
          <FacebookShareButton
            url={shareLink}
            quote={`Check out this item: ${selectedItem?.itemName}`}
            hashtag="#FoundItems"
          >
            <FacebookIcon size={32} round />
          </FacebookShareButton>
          <TwitterShareButton
            url={shareLink}
            title={`Check out this item: ${selectedItem?.itemName}`}
          >
            <TwitterIcon size={32} round />
          </TwitterShareButton>
          <LinkedinShareButton
            url={shareLink}
            summary={`Check out this item: ${selectedItem?.itemName}`}
            source="Lost and Found"
          >
            <LinkedinIcon size={32} round />
          </LinkedinShareButton>
          <WhatsappShareButton
            url={shareLink}
            title={`Check out this item: ${selectedItem?.itemName}`}
          >
            <WhatsappIcon size={32} round />
          </WhatsappShareButton>
        </div>
        {selectedItem?.imagePath && (
         <img
         src={`http://localhost:5000/${selectedItem?.imagePath}`}
         alt={selectedItem?.itemName}
         className="w-full h-auto max-h-80 object-cover border-none rounded-lg"
         style={{ maxHeight: "20rem" }} // Ensures the image does not exceed a certain height
       />
        )}
      </Box>
    </Modal>

    {/* Claim Form Modal */}
    <Modal open={showClaimForm} onClose={handleCloseClaimForm}>
      <Box
        className="w-[400px] rounded-[10px] fixed top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%] p-4 bg-white"
        display="flex"
        flexDirection="column"
        alignItems="center"
      >
        <h2 className="text-lg mb-3 mt-3">Claiming {claimedItem?.itemName}</h2>
        {formErrors.locationLost && (
          <Alert severity="error" style={{ marginBottom: '10px' }}>
            {formErrors.locationLost}
          </Alert>
        )}
        <TextField
          label="Location Lost"
          variant="outlined"
          fullWidth
          margin="normal"
          value={locationLost}
          onChange={(e) => setLocationLost(e.target.value)}
          InputLabelProps={{ 
            style: { 
              zIndex: 2, 
              background: 'white', 
              padding: '0 5px', 
            } 
          }}
        />
        {formErrors.dateLost && (
          <Alert severity="error" style={{ marginBottom: '10px' }}>
            {formErrors.dateLost}
          </Alert>
        )}
        <TextField
          label="Date Item Lost"
          variant="outlined"
          fullWidth
          margin="normal"
          type="date"
          value={dateLost}
          onChange={(e) => setDateLost(e.target.value)}
          InputLabelProps={{ 
            style: { 
              zIndex: 2, 
              background: 'white', 
              padding: '0 5px', 
            } 
          }}
        />
        {formErrors.description && (
          <Alert severity="error" style={{ marginBottom: '10px' }}>
            {formErrors.description}
          </Alert>
        )}
        <TextField
          label="Description"
          variant="outlined"
          fullWidth
          margin="normal"
          multiline
          rows={4}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          InputLabelProps={{ 
            style: { 
              zIndex: 2, 
              background: 'white', 
              padding: '0 5px', 
            } 
          }}
        />
        <TextField
          label="Unique Feature"
          variant="outlined"
          fullWidth
          margin="normal"
          value={uniqueFeature}
          onChange={(e) => setUniqueFeature(e.target.value)}
          InputLabelProps={{ 
            style: { 
              zIndex: 2, 
              background: 'white', 
              padding: '0 5px', 
            } 
          }}
        />
        <Button
          variant="contained"
          color="primary"
          onClick={handleSubmitClaim}
          style={buttonStyle}
        >
          Submit Claim
        </Button>
        {/* <Button
          variant="outlined"
          color="primary"
          onClick={handleCloseClaimForm}
          style={{ marginTop: '10px' }}
        >
          Cancel
        </Button> */}
      </Box>
    </Modal>
    </div>
  );
}

export default Found;