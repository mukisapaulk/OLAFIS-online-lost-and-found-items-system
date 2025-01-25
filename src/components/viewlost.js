
import {  Logout,  FeedbackOutlined, ShareRounded, PresentToAll,  InfoOutlined, MessageRounded,  PersonRemoveAlt1, NoteAdd, RemoveRedEye, Print, Search } from '@mui/icons-material'
import { Box, Stack,  Button, Modal, Breadcrumbs, TextField, Skeleton } from '@mui/material'
import React, { useEffect, useState } from 'react'
import '../App.css'
import StarIcon from '@mui/icons-material/Star';
import StarBorderIcon from '@mui/icons-material/StarBorder';
import axios from 'axios';
import {Alert, Share, View} from 'react-native';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';
import {CardActionArea, CardActions } from '@mui/material';
import { NavLink , Link} from 'react-router-dom'


import Sidebar from './sidebar';
import { RateReviewTwoTone } from '@material-ui/icons';
import Navbar from './navbar';
import Footer from './footer';
import Banner from './Banner';
import Ribboned from './Ribboned';
import FeedbackSystem from './FeedbackSystem';
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


function ViewLost() {
  const [loading, setLoading] = useState(true);
  const [foundItems, setFoundItems] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/Lost');
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

  const [successModalOpen, setSuccessModalOpen] = useState(false);
  const [openModal1, setOpenModal1] = useState(false);
  const [openModal2, setOpenModal2] = useState(false);
  const [openModal3, setOpenModal3] = useState(false);
  const [rating, setRating] = useState(0);
  const [selectedReward, setSelectedReward] = useState('');
  const [openShareModal, setOpenShareModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null); // State to store selected item details

   // Dynamic link for sharing
   const [shareLink, setShareLink] = useState('');


  const handleClose = () => {
    setOpenModal2(false);
  };

  const handleStarClick = (index) => {
    setRating(index + 1);
  };


  // const onShare = async (itemName, description) => {
  //   try {
  //     const message = `Item Name: ${itemName}\nDescription: ${description}`;
  //     const result = await Share.share({
  //       message: message,
  //     });
  //     if (result.action === Share.sharedAction) {
  //       if (result.activityType) {
  //         // shared with activity type of result.activityType
  //       } else {
  //         // shared
  //       }
  //     } else if (result.action === Share.dismissedAction) {
  //       // dismissed
  //     }
  //   } catch (error) {
  //     Alert.alert(error.message);
  //   }
  // };
  


  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);

  
  const handleSearch = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/searchlost', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ searchQuery })
      });
      const data = await response.json();
      setSearchResults(data);
      console.log('Search results:', data);
    } catch (error) {
      console.error('Error searching items:', error);
    }
  };




const handleRewardButtonClick = (reward) => {
  setSelectedReward(reward);
  setOpenModal3(true);
};




   //my button 1
   const [isHovered, setIsHovered] = useState(false);

   const buttonStyle = {
     backgroundColor: '#b1c5ff',
     color: 'black',
     borderRadius:'none',
     border: isHovered ? '2px dashed #000' : '2px solid #000',
   };
 
   //my button 2
   const [isHover, setIsHover] = useState(false);
 
   const buttonStyled= {
     backgroundColor: '#b6ffc0',
     color: 'black',
     borderRadius:'none',
     border: isHover ? '2px dashed #000' : '2px solid #000',
   };

   const onShare = (itemName, description, imagePath) => {
    setSelectedItem({ itemName, description, imagePath });
    // Create dynamic share link based on item details and current URL
    const shareUrl = `${window.location.origin}/lost?itemName=${itemName}`; // Assuming your Found component handles query params
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




                  <div className='flex justify-between items-center'>
                  <div className=' flex gap-5'>
                  <Typography variant='h5' sx={{
      fontFamily: 'serif',
      fontWeight: 600,
      color: '#333',
      textShadow: '0px 1px 2px rgba(0, 0, 0, 0.2)',
      marginBottom: '1rem',
      textAlign: 'center', // Center align for smaller screens
    }}>
      Lost Items
    </Typography>
                    </div>

               

 <div className=''>
                    {/* <Breadcrumbs aria-label="breadcrumb">
                    <Link underline="hover" color="primary" to="/found">
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
                   
                  </Breadcrumbs>
                          */}


                    </div>

                  <div className='p-1 bg-white border-black border-2 px-7  flex gap-3 items-center'style={{
                    marginRight:'25px',
                  }}>
                    <input className='outline-none p-1 bg-white'   value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)} placeholder="search items" type='text'/>
                  <Search color='primary' onClick={handleSearch} sx={{fontSize:'2em', cursor:'pointer',color:'#ff764d'}}/>
                  </div>
                  </div>

                  <Box className='border-none p-3 ' display='grid' gridTemplateColumns='repeat(4, 1fr)' gap={3} p={1} m={2}>
         {/* Render cards dynamically */}
          {/* Render search results or Skeleton while loading */}
          {(loading ? Array.from(new Array(8)) : (searchResults.length > 0 ? searchResults : foundItems)).map((item, index) => (
              <Card key={index} 
              sx={{ maxWidth: 345,
                position: 'relative', 
                maxWidth: { xs: 345, md: 345 }, 
                borderRadius: '10px',
                boxShadow: 'none',
                border: 'none',
                minHeight: 320,
                margin:'10px 20px 20px 30px',
               
               }}>
              {loading ? (
                <Skeleton variant="rectangular" sx={{backgroundColor:'rgb(248 250 252)'}} width="100%" height={300} />
              ) : (
                <>
                 <CardActionArea>
                  {/* Image */}
                   {item.imagePath && <img src={`http://localhost:5000/` + item.imagePath} alt={`Image ${index + 1}`} className='w-full h-[30vh] rounded-none border-none mb-0' />} 
       {/* Description */}
      
                  {/* Contact */}
                  <Ribboned>Lost</Ribboned>
                

                  <CardContent>
                  <Typography gutterBottom variant="h5" component="div"sx={{
                    color:'black',
                    fontSize:'20px'
                  }}>
                    {item.itemName}
                  </Typography>
                  
                </CardContent>
                  </CardActionArea>
                 <div>
                 
                 <CardActions style={{
                  display:'flex',
                  justifyContent:'space-between',
           
                 }}>
                  <Button onClick={() => onShare(item.itemName)}  size="small" color="primary"
                  >
                  <ShareRounded />Share
                  </Button>


                       
                 {item.reward !== '' && (
          <Button variant='contained' onClick={() => handleRewardButtonClick(item.reward)}
          
          style={{
            boxShadow:'none',
            backgroundColor: 'rgb(220, 38, 38)',
            color: 'white',
            padding: '5px',
           

          }}
          >REWARD</Button>
          
        )}

                </CardActions>

                  
        
             

          
                 </div>
                </>
              )}
          </Card>
          ))}


        </Box>
          </Box>

          
        </Stack>
      </div>


      {/* Modals */}
      



         {/* Modal */}
         <Modal
        open={openModal1}
        onClose={() => setOpenModal1(false)}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box
          sx={{
            position: 'absolute',
            width: 400,
            bgcolor: 'white',
            p: 4,
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
          }}
        >
          {/* Form Inside Modal */}
          <h6 className='text-[1.2em] text-center mb-3 p-3 text-gray-800  font-medium'> ENTER YOUR FEEDBACK BELOW</h6>
          <hr style={{
                    height: '2.5px',
                     background: 'black',
                  }}></hr>
          <TextField
            label="feedback"
            multiline
            // value={feedback}
            // onChange={(e) => setFeedback(e.target.value)}
            fullWidth
            margin="normal"
          />
          
          <Button variant="contained">
           SEND
          </Button>
        </Box>
      </Modal>



      {/* rate modal */}

      {/* Modals */}
      <Modal open={successModalOpen} onClose={() => setSuccessModalOpen(false)}>
        <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', backgroundColor: 'white', padding: '100px', border:'2px solid black'}}>
          <h2 className='text-[1.5em] font-medium 'style={{
            color:'#ff764d',
          }}>Feedback sent!</h2>
         

         <div className='mt-5 flex justify-center'>
            <p onClick={() => setSuccessModalOpen(false)} className='text-black p-2 mt-4 text-center font-medium text-md cursor-pointer rounded-lg w-[50%]'
            style={{
              border:'2px solid black',
              backgroundColor:'#b1c5ff',
            }}>OK</p>
        </div>
        </div>
      </Modal>



      {/* rate modal */}

        {/* Modal */}
        <Modal
      open={openModal2}
      onClose={handleClose}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
      
    >
      <Box
        sx={{
          position: 'absolute',
          width: 400,
          bgcolor: 'white',
        
          p: 4,
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
        }}
      >
        <h2 style={{ textAlign: 'center' }} className='font-bold'>RATE US</h2>
        <hr style={{
                    height: '2.5px',
                     background: 'black',
                  }}></hr>
        <div style={{ display: 'flex', justifyContent: 'center', gap: '5px' }} className='my-5'>
          {[...Array(5)].map((_, index) => (
            <div key={index} onClick={() => handleStarClick(index)}>
              {index < rating ? (
                <StarIcon sx={{ fontSize: 50, color: '#ff764d' }} />
              ) : (
                <StarBorderIcon sx={{ fontSize: 40, color: 'blue' }} />
              )}
            </div>
          ))}
        </div>
        <hr style={{
                    height: '2.5px',
                     background: 'black',
                  }}></hr>
        <div className='flex justify-center mt-4'>

          
        <Button variant='contained' color='secondary' onClick={handleClose}
         style={buttonStyled}
         onMouseEnter={() => setIsHover(true)}
         onMouseLeave={() => setIsHover(false)}
        
        >OK</Button>
        </div>
      </Box>
    </Modal>


      {/* rate modal */}

        {/* Reward Modal */}
        <Modal
        open={openModal3}
        onClose={() => setOpenModal3(false)}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box
          sx={{
            position: 'absolute',
            width: 300,
            bgcolor: 'white',
          borderRadius:'20px',
            p: 4,
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
          }}
        >
          <h2 style={{ textAlign: 'center', color:'black' }} className='font-bold'>REWARD</h2>

          <p className='text-base text-center text-gray-600 p-10'>The reward for {selectedItem?.itemName} is  {selectedReward} UGX</p>
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
    
    </div>
  )
}

export default ViewLost;
