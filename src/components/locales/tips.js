import { FeedbackOutlined,ShareRounded, ArrowForward, ArrowBack } from '@mui/icons-material'
import { Box, Stack, Button, Modal,  TextField } from '@mui/material'
import React, { useEffect, useState } from 'react'

import StarIcon from '@mui/icons-material/Star';
import StarBorderIcon from '@mui/icons-material/StarBorder';

import {Alert, Share} from 'react-native';


import { RateReviewTwoTone } from '@material-ui/icons';
import Navbar1 from './navbar1';
import Footer from './footer';
import Sidebar1 from './sidebar1';


function Tips1() {


  const [successModalOpen, setSuccessModalOpen] = useState(false);
  const [openModal1, setOpenModal1] = useState(false);
  const [openModal2, setOpenModal2] = useState(false);


 


  const handleClose = () => {
    setOpenModal2(false);
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
  
  const [username, setUsername] = useState('');
  
  useEffect(() => {
    // Retrieve username from local storage
    const storedUsername = localStorage.getItem('username');
    if (storedUsername) {
      setUsername(storedUsername);
    }
  }, []);


  
const conseils = [
    "Désignez des endroits spécifiques pour les objets couramment égarés comme les clés, le portefeuille et le téléphone",
    "Utilisez des étiquettes avec vos coordonnées sur des objets comme les sacs et les bagages",
    "Investissez dans des solutions de stockage de qualité comme des organisateurs, des tiroirs et des étagères",
    "Utilisez des dispositifs de suivi ou des applications pour les objets de valeur comme les ordinateurs portables ou les tablettes",
    "Faites des copies numériques de documents importants et stockez-les en toute sécurité",
    "Tenez une liste de contrôle lorsque vous voyagez pour vous assurer de ne rien oublier",
    "Utilisez des étuis ou des couvertures de couleur vive pour une visibilité facile des gadgets et accessoires",
    "Nettoyez régulièrement et désencombrez vos espaces de vie et de travail pour éviter de perdre des objets",
    ];

  const [currentTipIndex, setCurrentTipIndex] = useState(0);
  const [openModal, setOpenModal] = useState(false);
  const [rating, setRating] = useState(0);

  const handleNextTip = () => {
    const nextIndex = (currentTipIndex + 1) % conseils.length;
    setCurrentTipIndex(nextIndex);
  };

  const handlePreviousTip = () => {
    const nextIndex = (currentTipIndex - 1) % conseils.length;
    setCurrentTipIndex(nextIndex);
  };


  const handleStarClick = (index) => {
    setRating(index + 1);
  };
  return (
    <div className='bg-slate-50 h-[100vh] font-san'>
    <Navbar1/>
    <Footer/>

      {/* Main Content */}
      <div className='mt-[100px]'>
        <Stack direction={{ xs: 'column', sm: 'row' }} className='m-2 ' gap="10px">



       <Sidebar1/>


          <Box width={{ xs: '100%', sm: '80%' }} className="border border-slate-400 bg-white " height={{ sm: '75vh' }} >
                  <div className='flex justify-between items-center border border-gray-100 shadow-md bg-slate-50  p-2 m-1 mx-2'>
                  <div className=' flex gap-5'>
                    <Button onClick={() => setOpenModal1(true)} variant='contained' > <FeedbackOutlined/> Commentaires </Button>
                    <Button onClick={() => setOpenModal2(true)} variant='contained' color='secondary'><RateReviewTwoTone/> Évaluez Nous </Button>
                    <Button onClick={onShare} variant='contained' color='success'><ShareRounded/> Partager </Button>
                                    {/* <Button variant='contained' color='error'>NOTIFICATIONS</Button> */}
                    </div>


                   

                    
                  </div>



              <div className='flex overflow-y-auto'>

              <div className="  w-[100%] shadow-2xl">
                 
                    <div className=" items-center overflow-y-auto gap-5 my-3 mx-3 justify-center bg-slate-100 shadow-2xl p-3 h-[60vh] ">


                    <div className='gap-4 mt-3 items-center'>
                    <p className='font-bold text-[1.4em] text-center '>CONSEILS DE SÉCURITÉ DES ARTICLES</p>
                    <hr></hr>
                     
                    </div>
                       

                
                    <div className="flex items-center gap-5 my-3 mx-3 justify-center bg-slate-100  p-3 h-[35vh]">
                    <Box className="flex justify-center mt-4">
        <Button variant="contained" color="primary" onClick={handlePreviousTip}><ArrowBack/>CONSEIL PRÉCÉDENT </Button>
      </Box>

      <div style={{ borderRadius: '14px 70px 14px 70px' }} className="  bg-white border-[15px] border-slate-900">
      <p className="mt-10 font-extrabold mx-4 text-[2em] font-mono text-center">{conseils[currentTipIndex]}</p>
    </div>

    {/* Bouton CONSEIL SUIVANT */}
  <Box className="flex justify-center mt-4">
    <Button variant="contained" color="primary" onClick={handleNextTip}>CONSEIL SUIVANT <ArrowForward/></Button>
  </Box>
      </div>

      

                         

         
                  </div>

      </div>

            {/* report summarry */}


                     



                                

                      

              </div>
          </Box>

          
        </Stack>
      </div>


      {/* Modals */}
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



      {/* rate modal */}

      {/* Modalité de récompense */}

    </div>
  )
}

export default Tips1;
