import {  Logout,  FeedbackOutlined, ShareRounded,  PresentToAll,  InfoOutlined, MessageRounded,  PersonRemoveAlt1, NoteAdd, RemoveRedEye, Print, Search } from '@mui/icons-material'
import { Box, Stack,  Button, Modal, TextField, Skeleton, Breadcrumbs } from '@mui/material'
import React, { useEffect, useState } from 'react'

import StarIcon from '@mui/icons-material/Star';
import StarBorderIcon from '@mui/icons-material/StarBorder';

import {Alert, Share} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

import {  Link } from 'react-router-dom'

import Sidebar1 from './sidebar1';
import { RateReviewTwoTone } from '@material-ui/icons';
import Navbar1 from './navbar1';
import Footer from './footer';

function Found1() {
  const [loading, setLoading] = useState(true);
  const [foundItems, setFoundItems] = useState([]);


  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [searchCounts, setSearchCounts] = useState({});
  const [successModalOpen, setSuccessModalOpen] = useState(false);
  const [openModal1, setOpenModal1] = useState(false);
  const [openModal2, setOpenModal2] = useState(false);
  const [rating, setRating] = useState(0);

 

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
  

  const handleSearch = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/search', {
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

 



  const handleClose = () => {
    setOpenModal2(false);
  };

  const handleStarClick = (index) => {
    setRating(index + 1);
  };


  const onShare = async (itemName, description) => {
    try {
      const message = `Item Name: ${itemName}\nDescription: ${description}`;
      const result = await Share.share({
        message: message,
      });
      if (result.action === Share.sharedAction) {
        if (result.activityType) {
          // shared with activity type of result.activityType
        } else {
          // shared
        }
      } else if (result.action === Share.dismissedAction) {
        // dismissed
      }
    } catch (error) {
      Alert.alert(error.message);
    }
  };
  



 

  
const handleFeedback = () => {
  setOpenModal1(false);
  setSuccessModalOpen(true)
};

const [username, setUsername] = useState('');

useEffect(() => {
  // Retrieve username from local storage
  const storedUsername = localStorage.getItem('username');
  if (storedUsername) {
    setUsername(storedUsername);
  }
}, []);

  return (
    <div className='bg-slate-50 h-[100vh] font-san'>
     <Navbar1/>
     <Footer/>
    
      {/* Main Content */}
      <div className='mt-[100px]'>
        <Stack direction={{ xs: 'column', sm: 'row' }} className='m-2 ' gap="10px">


        <Sidebar1/>
    


        <Box width={{ xs: '100%', sm: '80%' }} className="border border-slate-400 bg-white " height={{ sm: '75vh' }}>
  <div className='flex justify-between items-center border border-gray-100 bg-slate-50  m-1 mx-2'>
    <div className=' flex gap-5'>
      <Button onClick={() => setOpenModal1(true)} variant='contained' > <FeedbackOutlined/> Commentaires </Button>
      <Button onClick={() => setOpenModal2(true)} variant='contained' color='secondary'><RateReviewTwoTone/> Évaluez Nous </Button>
      <Button onClick={onShare} variant='contained' color='success'><ShareRounded/> Partager </Button>
      {/* <Button variant='contained' color='error'>NOTIFICATIONS</Button> */}
    </div>

    <div className=''>
      <Breadcrumbs aria-label="breadcrumb">
        <Link underline="hover" color="primary" to="#">
          <p className='text-blue-700 text-[1.3em] hover:underline'>Articles Trouvés</p>
        </Link>
        <Link underline="hover" color="inherit" to="/viewlost1">
          <p className=' text-[1.3em] hover:underline'>Articles Perdus</p>
        </Link>
      </Breadcrumbs>
    </div>

    <div className='p-1 border bg-gray-400 px-7 border-gray-300 flex rounded-2xl gap-3 items-center'>
      <input className='outline-none p-1 rounded-lg' value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} placeholder="Rechercher des articles" type='text'/>
      <Search color='white' onClick={handleSearch} sx={{fontSize:'2em', color:'white', cursor:'pointer'}}/>
    </div>
  </div>

  <Box className='border border-gray-400 overflow-y-auto bg-white' height='62vh' display='grid' gridTemplateColumns='repeat(3, 1fr)' gap={3} p={1} m={2}>
    {/* Render cards dynamically */}
    {/* Render search results or Skeleton while loading */}
    {(loading ? Array.from(new Array(8)) : (searchResults.length > 0 ? searchResults : foundItems)).map((item, index) => (
      <div key={index} className='bg-gray-100 p-3 border border-gray-300 shadow-lg '>
        {loading ? (
          <Skeleton variant="rectangular" sx={{backgroundColor:'darkblue'}} width="100%" height={250} />
        ) : (
          <>
            {/* Image */}
            {item.imagePath && <img src={`http://localhost:5000/` + item.imagePath} alt={`Image ${index + 1}`} className='w-full h-60 border border-white rounded-none mb-2' />} 
            {/* Description */}
            <hr></hr>
            <p className='text-lg text-gray-700 font-semibold mt-3 mb-4 '>NOM DE L'ARTICLE: {item.itemName}</p>
            <p className='text-lg text-gray-700 font-semibold mt-5 mb-4 '>DESCRIPTION: {item.description}</p>
            <p className='text-lg text-gray-700 font-semibold mt-5 mb-4 '>CONTACT: {item.contact}</p>
            {/* Contact */}
            <hr></hr>
            <div className='flex justify-center mx-2 items-center  p-3'>
              <Button variant='contained' color='primary'><ShareRounded onClick={() => onShare(item.itemName, item.description)} sx={{cursor:'pointer'}}/> </Button>
            </div>
          </>
        )}
      </div>
    ))}
  </Box>
</Box>


          
        </Stack>
      </div>


      {/* Modals */}
      <Modal open={successModalOpen} onClose={() => setSuccessModalOpen(false)}>
  <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', backgroundColor: 'white', padding: '100px' }}>
    <h2 className='text-[2em] font-extrabold text-green-600'>Envoyé avec succès!</h2>
    <div className='mt-5 flex justify-center'>
      <p onClick={() => setSuccessModalOpen(false)} className='text-white bg-blue-600 p-2 mt-4 text-center font-medium text-lg cursor-pointer w-[30%]'>OK</p>
    </div>
  </div>
</Modal>

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
      boxShadow: 24,
      p: 4,
      top: '50%',
      left: '50%',
      transform: 'translate(-50%, -50%)',
    }}
  >
    {/* Form Inside Modal */}
    <h6 className='text-[1.2em] text-center mb-3 p-3 text-gray-800  font-medium'>ENTREZ VOTRE COMMENTAIRE CI-DESSOUS</h6>
    <hr></hr>
    <TextField
      label="commentaire"
      multiline
      required
      // value={feedback}
      // onChange={(e) => setFeedback(e.target.value)}
      fullWidth
      margin="normal"
    />
    
    <Button variant="contained" onClick={handleFeedback}>
     ENVOYER
    </Button>
  </Box>
</Modal>

{/* Modal for rating */}

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
      boxShadow: 24,
      p: 4,
      top: '50%',
      left: '50%',
      transform: 'translate(-50%, -50%)',
    }}
  >
    <h2 style={{ textAlign: 'center' }} className='font-medium'>ÉVALUEZ NOUS</h2>
    <hr></hr>
    <div style={{ display: 'flex', justifyContent: 'center', gap: '5px' }} className='my-5'>
      {[...Array(5)].map((_, index) => (
        <div key={index} onClick={() => handleStarClick(index)}>
          {index < rating ? (
            <StarIcon sx={{ fontSize: 50, color: 'blue' }} />
          ) : (
            <StarBorderIcon sx={{ fontSize: 40, color: 'blue' }} />
          )}
        </div>
      ))}
    </div>
    <hr></hr>

    <div className='flex justify-center mt-4'>
      <Button variant='contained' color='secondary' onClick={handleClose}>OK</Button>
    </div>
  </Box>
</Modal>


    </div>
  )
}

export default Found1;