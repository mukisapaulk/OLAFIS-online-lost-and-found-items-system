import { AccountCircleSharp, Logout,  RemoveRedEyeSharp, Report, Home, Send, FeedbackOutlined, NotificationAdd, RateReview, ShareRounded, QuestionMark, PresentToAll, SafetyCheck, InfoOutlined, MessageRounded, ReportGmailerrorred, PersonRemoveAlt1, NoteAdd, RemoveRedEye } from '@mui/icons-material'
import { Box, Stack, CircularProgress, Button, Modal, IconButton, TextField, Skeleton } from '@mui/material'
import React, { useEffect, useState } from 'react'

import StarIcon from '@mui/icons-material/Star';
import StarBorderIcon from '@mui/icons-material/StarBorder';
import axios from 'axios';
import {Alert, Share, View} from 'react-native';

import { NavLink } from 'react-router-dom'

import { RateReviewTwoTone, RemoveRedEyeTwoTone } from '@material-ui/icons';
import Navbar1 from './navbar1';
// import Footer from './footer';
import Sidebar1 from './sidebar1';


function Chat1() {

  const [message, setMessage] = useState('');

  const [loading, setLoading] = useState(false);
  const [successModalOpen, setSuccessModalOpen] = useState(false);
  const [openModal1, setOpenModal1] = useState(false);
  const [openModal2, setOpenModal2] = useState(false);
  const [rating, setRating] = useState(0);

  const [username, setUsername] = useState('');

  useEffect(() => {
    // Retrieve username from local storage
    const storedUsername = localStorage.getItem('username');
    if (storedUsername) {
      setUsername(storedUsername);
    }
  }, []);


  
  

  const handleStarClick = (index) => {
    setRating(index + 1);
  };


  const onShare = async () => {
    try {
      const result = await Share.share({
        message:
          'Lost and found sysytem',
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



   // Define state variables to store chats
   const [chats, setChats] = useState([]);

  
   useEffect(() => {
    // Fetch chats data from the API
    const fetchChats = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/chats');
        // Update the state with the fetched chats
        setChats(response.data);
      } catch (error) {
        console.error('Error fetching chats:', error);
      }
    };

    // Call the fetchChats function
    fetchChats();
  }, []); // Empty dependency array ensures the effect runs only once

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const res = await axios.post('http://localhost:5000/api/chats', { message,username });
      console.log(res.data);
      // Fetch updated chats after successful insertion
      const response = await axios.get('http://localhost:5000/api/chats');
      setChats(response.data);
      // Clear message input
      setMessage('');
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };


   const handleClose = () => {
    setOpenModal2(false);
   
  };




  return (
    <div className='bg-slate-50 h-[100vh] font-san'>
      <Navbar1/>

      {/* Main Content */}
      <div className='mt-[100px]'>
        <Stack direction={{ xs: 'column', sm: 'row' }} className='m-2 ' gap="10px">



      <Sidebar1/>


          <Box width={{ xs: '100%', sm: '80%' }} className="border border-slate-400 bg-white " height={{ sm: '75vh' }} >
                  <div className='bg-slate-50 flex gap-5 p-2 m-1 mx-2 border border-gray-400'>
                  <Button onClick={() => setOpenModal1(true)} variant='contained' > <FeedbackOutlined/> Commentaires </Button>
      <Button onClick={() => setOpenModal2(true)} variant='contained' color='secondary'><RateReviewTwoTone/> Évaluez Nous </Button>
      <Button onClick={onShare} variant='contained' color='success'><ShareRounded/> Partager </Button>
                      {/* <Button variant='contained' color='error'>NOTIFICATIONS</Button> */}
                    </div>
              <div className='flex overflow-y-auto'>

              <div className="  w-[60%] shadow-2xl">
                 
                    <div className="flex items-center gap-5 my-3 mx-3 justify-center bg-slate-100 p-3 h-[60vh] border border-gray-400">
      

                         

         
                    <form className="flex flex-col gap-5 w-[80%]">
          <div className='flex gap-2 items-center'>
            <Skeleton
              variant="circular"
              width={40} // ajuster la taille si nécessaire
              height={40} // ajuster la taille si nécessaire
              sx={{backgroundColor:'green', borderRadius:'50%'}}
            />
            <p className='font-medium text-blue-700'> En ligne : @{username}</p>
          </div>
          <h6 className='text-xl text-gray-800 font-extrabold mb-5 text-center '>CHAT </h6>
          <hr className='border-[1px] border-gray-400'></hr>
          <TextField value={message} onChange={(e) => setMessage(e.target.value)} multiline label="chat" sx={{backgroundColor:'white'}}></TextField>
          <Button variant="contained" onClick={handleSubmit} disabled={loading}>
            {loading ? <CircularProgress size={24} /> : 'ENVOYER'}
          </Button>
        </form>
      </div>
    </div>
    <div className='m-2 w-[40%] overflow-y-auto h-[60vh] mt-1'>
      <p className='text-center font-medium bg-green-300 p-2 m-2 rounded'>MESSAGES</p>
      {/* Mapper à travers les chats et afficher chaque chat */}
      {chats.map((chat, index) => (
        <div key={index}>
          <p className='mt-3 ml-5'>{chat.username}</p>
          <div className='flex justify-between items-center bg-slate-700 text-gray-200 p-4 rounded-xl shadow-xl border border-slate-300'>
            <h1>{chat.message}</h1>
            <h1 className='text-[0.6em]'>{chat.date} {chat.time}</h1>
          </div>
        </div>
      ))}


                                

                        </div>

              </div>
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

    {/* <Footer/> */}
    </div>
  )
}

export default Chat1;
