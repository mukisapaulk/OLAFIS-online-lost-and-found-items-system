import { AccountCircleSharp, Logout,  PresentToAllOutlined, CompressRounded, Send, FeedbackOutlined, NotificationAdd, RateReview, ShareRounded, QuestionMark, PresentToAll, SafetyCheck, InfoOutlined, MessageRounded, ReportGmailerrorred, PersonRemoveAlt1, NoteAdd, RemoveRedEye } from '@mui/icons-material'
import { Box, Stack, CircularProgress, Button, Modal, IconButton, TextField, Skeleton } from '@mui/material'
import React, { useEffect, useState } from 'react'

import StarIcon from '@mui/icons-material/Star';
import StarBorderIcon from '@mui/icons-material/StarBorder';
import axios from 'axios';
import {Alert, Share, View} from 'react-native';

import { NavLink } from 'react-router-dom'

import { Settings, Money, ReceiptRounded} from '@mui/icons-material'
import { Label, RateReviewTwoTone, RemoveRedEyeTwoTone } from '@material-ui/icons';
import Navbar1 from './navbar1';
import Footer from './footer';
import Sidebar1 from './sidebar1';

function Home1() {

  const [itemName, setItemName] = useState('');
  const [description, setDescription] = useState('');
  const [contact, setContact] = useState('');
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [successModalOpen, setSuccessModalOpen] = useState(false);
  const [successModalOpen1, setSuccessModalOpen1] = useState(false);

  const [openModal1, setOpenModal1] = useState(false);
  const [openModal2, setOpenModal2] = useState(false);
  const [rating, setRating] = useState(0);


  const handleSubmit = async () => {
    setLoading(true);

    const formData = new FormData();
    formData.append('itemName', itemName);
    formData.append('description', description);
    formData.append('contact', contact);
    formData.append('image', image);

    try {
      const res = await axios.post('http://localhost:5000/api/items', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      console.log(res.data);

      // Show success modal
      setSuccessModalOpen(true);

      // Clear inputs
      setDescription('');
      setContact('');
      setImage('');
      setItemName('');
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };


  

  const handleClose = () => {
    setOpenModal2(false);
  };

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
    setSuccessModalOpen1(true)
  };

  const [username, setUsername] = useState('');

  useEffect(() => {
    // Retrieve username from local storage
    const storedUsername = localStorage.getItem('username');
    if (storedUsername) {
      setUsername(storedUsername);
    }
  }, []);


  const [dataLength, setDataLength] = useState(0);
  const [foundItems, setFoundItems] = useState([]);
  useEffect(() => {
    // Fetch data from MongoDB or your backend API here
    const fetchData = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/items');
        const data = await response.json();
        setFoundItems(data);
        console.log(data);
        setDataLength(data.length); // Log the length of the data
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);





  const [dataLength1, setDataLength1] = useState(0);
  const [foundItems1, setFoundItems1] = useState([]);
  useEffect(() => {
    // Fetch data from MongoDB or your backend API here
    const fetchData = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/Lost');
        const data = await response.json();
        setFoundItems1(data);
        console.log(data);
        setDataLength1(data.length); // Log the length of the data
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);  

  return (
    <div className='bg-slate-50 h-[100vh] font-san'>
     <Navbar1/>
     <Footer/>
      {/* Main Content */}
      <div className='mt-[100px]'> 
         <Stack direction={{ xs: 'column', sm: 'row' }} className='m-2 ' gap="10px">



       
         <Sidebar1/>

         <Box width={{ xs: '100%', sm: '80%' }} className="border border-slate-400 bg-white" height={{ sm: '75vh' }} >
                  <div className='bg-slate-50  p-2 m-1 mx-2 border border-gray-400'>
                  <div className=' flex gap-5'>
                      <Button onClick={() => setOpenModal1(true)} variant='contained' > <FeedbackOutlined/> Commentaires </Button>
                    <Button onClick={() => setOpenModal2(true)} variant='contained' color='secondary'><RateReviewTwoTone/> Évaluez Nous </Button>
                      <Button onClick={onShare} variant='contained' color='success'><ShareRounded/> Partager </Button>
                      {/* <Button variant='contained' color='error'>NOTIFICATIONS</Button> */}
                    </div>
                    </div>
              <div className='flex gap-1'>

              <div className="h-full sm:overflow-auto w-[60%]">
                 
                    <div className="flex items-center gap-5 my-3 mx-3 justify-center bg-slate-100 p-3 h-[60vh] border border-gray-400">
      
                          <form className="flex  flex-col gap-5 w-[80%]">
                          <h6 className='text-xl text-gray-800 font-extrabold mb-1 text-center '>TÉLÉCHARGER UN ARTICLE TROUVÉ</h6>

                          <hr className='border-[3px] border-gray-400'></hr>
                          <TextField value={itemName} onChange={(e) => setItemName(e.target.value)} required multiline label="Nom de l'Article" sx={{backgroundColor:'white'}}></TextField>

                          <TextField value={description} onChange={(e) => setDescription(e.target.value)} required multiline label="La Description" sx={{backgroundColor:'white'}}></TextField>

                            <TextField value={contact} onChange={(e) => setContact(e.target.value)} required multiline label="contacts" sx={{backgroundColor:'white'}}></TextField>
                           
                            <input type="file" onChange={(e) => setImage(e.target.files[0])} required accept="image/*" className="border border-gray-400 p-2 rounded-md" />
                           
                            <Button variant="contained" onClick={handleSubmit} disabled={loading}>
            {loading ? <CircularProgress size={24} /> : 'Télécharger'}
          </Button>
        </form>
      </div>

      </div>

            {/* rapport de sommaire */}


            <div className='m-2 w-[40%] '>
                              



            <div className=' w-[98%] mb-4 py-2 pb-1  border border-gray-400 bg-blue-100 p-3'>
                                      <div className='flex'>
                                        <PresentToAllOutlined style={{fontSize:'80px'}}/>
                                        <div>
                                        <h6 className='text-xl text-gray-800 font-extrabold '>ARTICLES TROUVÉS AU TOTAL</h6>
                                        <h6 className='text-sm text-gray-500 font-bold'>Articles trouvés</h6>
                                        </div>
                                      </div>

                                      <hr className='border-[3px] border-gray-400 mt-5'></hr>
                                      <div className='m-2 flex justify-center items-center shadow-xl p-2'>
                                      <h6 className='text-sm text-gray-800 text-center font-medium mt-2'> Total Trouvé<br></br><span className='text-xl font-bold text-blue-600 font-serif'>{dataLength}</span></h6>
                                     
                                      </div>


                                      {/* <div className='flex items-center justify-center'>
                                      <Button variant='contained' style={{width:'100%', margin:'5px'}}>DÉTAILS</Button>
                                      </div> */}
                                

                              </div>


                              <div className=' w-[98%] border pb-3 mt-1 border-gray-400 bg-red-50 p-3'>
                                      <div className='flex'>
                                        <CompressRounded style={{fontSize:'80px'}}/>
                                        <div>
                                        <h6 className='text-xl text-gray-800 font-extrabold '>ARTICLES PERDUS AU TOTAL</h6>
                                        <h6 className='text-sm text-gray-500 font-bold'>De tous les articles perdus </h6>
                                        </div>
                                      </div>
                                      <hr className='border-[3px] border-gray-400 mt-5'></hr>

                                      <div className='m-2 flex justify-center items-center shadow-xl p-2'>
                                      <h6 className='text-sm text-gray-800 text-center font-medium mt-2'> Total Perdu<br></br><span className='text-xl font-bold text-blue-600 font-serif'>{dataLength1}</span></h6>
                                      
                                      </div>


                                      {/* <div className='flex items-center justify-center'>
                                      <Button variant='contained' style={{width:'100%', margin:'5px'}}>DÉTAILS</Button>
                                      </div> */}
                                

                              </div>
                        </div>

              </div>
          </Box>

          
        </Stack>
      </div>


      {/* Modals */}
      <Modal open={successModalOpen} onClose={() => setSuccessModalOpen(false)}>
        <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', backgroundColor: 'white', padding: '100px' }}>
          <h2 className='text-[2em] font-extrabold text-green-600'>Téléchargé avec succès!</h2>

        <div className='mt-5 flex justify-center'>
            <p onClick={() => setSuccessModalOpen(false)} className='text-white bg-blue-600 p-2 mt-4 text-center font-medium text-lg cursor-pointer w-[30%]'>D'accord</p>
        </div>
        </div>
      </Modal>

      <Modal open={successModalOpen1} onClose={() => setSuccessModalOpen1(false)}>
        <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', backgroundColor: 'white', padding: '100px' }}>
          <h2 className='text-[2em] font-extrabold text-green-600'>Envoyé avec succès!</h2>

        <div className='mt-5 flex justify-center'>
            <p onClick={() => setSuccessModalOpen1(false)} className='text-white bg-blue-600 p-2 mt-4 text-center font-medium text-lg cursor-pointer w-[30%]'>D'accord</p>
        </div>
        </div>
      </Modal>

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
            label="Commentaires"
            multiline
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
          boxShadow: 24,
          p: 4,
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
        }}
      >
        <h2 style={{ textAlign: 'center' }} className='font-medium'>ÉVALUER NOUS</h2>
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

          
        <Button variant='contained' color='secondary' onClick={handleClose}>D'ACCORD</Button>
          
        </div>
      </Box>
    </Modal>
    </div>
  )
}

export default Home1;
