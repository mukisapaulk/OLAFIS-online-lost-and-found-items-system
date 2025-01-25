import {  Logout, FeedbackOutlined, ShareRounded, Print, CompressRounded, PresentToAllOutlined } from '@mui/icons-material'
import { Box, Stack, Button, Modal,TextField } from '@mui/material'
import React, { useEffect, useState } from 'react'

import StarIcon from '@mui/icons-material/Star';
import StarBorderIcon from '@mui/icons-material/StarBorder';

import {Alert, Share, View} from 'react-native';



import {  RateReviewTwoTone} from '@material-ui/icons';
import { BarChart, Bar, Rectangle, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

import jsPDF from 'jspdf';
import Navbar1 from './navbar1';
import Footer from './footer';
import Sidebar1 from './sidebar1';


function Reports1() {


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




  const handleClose = () => {
    setOpenModal2(false);
  };


  const handleFeedback = () => {
    setOpenModal1(false);
    setSuccessModalOpen(true)
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



  const data = [
    {
      name: 'Rapports',
      Totaltrouvé: dataLength,
      Totalperdu: dataLength1,
      amt: 2400,
    },
   
   
  ];


  const generatePDF = async () => {
    const doc = new jsPDF();

    // Set initial y position for the content
    let yPos = 20;

    // Add title to the PDF
    doc.setFontSize(20);
    doc.text('Found Items Report', 105, yPos, { align: 'center' });

    // Increase y position for the next content
    yPos += 10;

    // Add table headers
    doc.setFontSize(12);
    doc.text('Contact', 20, yPos);
    doc.text('Description', 80, yPos);
    doc.text('Image', 150, yPos);

    // Increase y position for the next content
    yPos += 10;

    // Add data rows
    for (const item of foundItems) {
      // Check if the text exceeds the page height
      if (yPos > 290) {
        doc.addPage(); // Add a new page
        yPos = 20; // Reset y position
      }

      // Add contact and description
      doc.text((item.contact || '').toString(), 20, yPos);
      doc.text((item.description || '').toString(), 60, yPos, { maxWidth: 80});

      // Load image data
      try {
        const response = await fetch(`http://localhost:5000/${item.imagePath}`);
        const imageDataBlob = await response.blob();

        // Convert image data to base64 string
        const reader = new FileReader();
        reader.readAsDataURL(imageDataBlob);
        reader.onloadend = () => {
          const imageDataBase64 = reader.result;

          // Add image to the PDF
          doc.addImage(imageDataBase64, 'JPEG', 150, yPos, 50, 50);
        };
      } catch (error) {
        console.error('Error loading image:', error);
      }

      // Increase y position for the next row
      yPos += 60;
    }

    // Save the PDF
    doc.save('found_items_report.pdf');
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
                  <div className='flex justify-between items-center border border-gray-400 bg-slate-50  p-2 m-1 mx-2'>
                  <div className=' flex gap-5'>
                  <Button onClick={() => setOpenModal1(true)} variant='contained' > <FeedbackOutlined/> Commentaires </Button>
                    <Button onClick={() => setOpenModal2(true)} variant='contained' color='secondary'><RateReviewTwoTone/> Évaluez Nous </Button>
                    <Button onClick={onShare} variant='contained' color='success'><ShareRounded/> Partager </Button>
                                
                      {/* <Button variant='contained' color='error'>NOTIFICATIONS</Button> */}
                    </div>


                    <div className='flex gap-4 items-center'>
                          <p className='font-medium text-[1.4em]'>RAPPORTS DU SYSTÈME</p>
                          <Button  variant='contained' onClick={generatePDF} > <Print/> EXPORTER PDF </Button>


                    </div>
                  </div>



              <div className='flex overflow-y-auto'>

              <div className="  w-[6100%] shadow-2xl">
                 
                    <div className="flex  gap-5 my-3 mx-3  bg-slate-10 shadow-2xl p-3 h-[60vh] ">
      
                    <div className='mx-2 w-[40%] '>
                              



                              <div className=' w-[98%] mb-4 py-2 pb-1  border border-gray-400 bg-blue-100 p-3'>
                                      <div className='flex'>
                                        <PresentToAllOutlined style={{fontSize:'80px'}}/>
                                        <div>
                                        <h6 className='text-xl text-gray-800 font-extrabold '>TOTAL D'ARTICLES TROUVÉS</h6>
                                        <h6 className='text-sm text-gray-500 font-bold'>Articles trouvés</h6>
                                        </div>
                                      </div>

                                      <hr className='border-[3px] border-gray-400'></hr>
                                      <div className='m-2 flex justify-center items-center shadow-xl p-2'>
                                      <h6 className='text-sm text-gray-800 text-center font-medium mt-2'> Total trouvé<br></br><span className='text-xl font-bold text-blue-600 font-serif'>{dataLength}</span></h6>
                                     
                                      </div>


                                      {/* <div className='flex items-center justify-center'>
                                      <Button variant='contained' style={{width:'100%', margin:'5px'}}>DETAILS</Button>
                                      </div> */}
                                

                              </div>


                              <div className=' w-[98%] border pb-5 mt-1 border-gray-400 bg-red-100 p-3'>
                                      <div className='flex'>
                                        <CompressRounded style={{fontSize:'80px'}}/>
                                        <div>
                                        <h6 className='text-xl text-gray-800 font-extrabold '>TOTAL D'ARTICLES PERDUS</h6>
                                        <h6 className='text-sm text-gray-500 font-bold'>De tous les articles perdus</h6>
                                        </div>
                                      </div>
                                      <hr className='border-[3px] border-gray-400'></hr>

                                      <div className='m-2 flex justify-center items-center shadow-xl p-2'>
                                      <h6 className='text-sm text-gray-800 text-center font-medium mt-2'> Total perdu<br></br><span className='text-xl font-bold text-blue-600 font-serif'>{dataLength1}</span></h6>
                                      
                                      </div>


                                      {/* <div className='flex items-center justify-center'>
                                      <Button variant='contained' style={{width:'100%', margin:'5px'}}>DETAILS</Button>
                                      </div> */}
                                

                              </div>

                      </div>
 

                      <div className='bg-gray-100 w-[60%] h-[58vh]'>
 
                      <div className="bar-graph-container">
      <h2 className='text-center font-medium'>Graphique en barres montrant les articles perdus et trouvés</h2>


      <div className='w-[600px] h-[45vh]'>
        <ResponsiveContainer width="100%" height="100%">
        <p>.</p>
        <BarChart
          width={500}
          height={300}
          data={data}
          margin={{
            top: 5,
            right: 30,
            left: 20,
            bottom: 5,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="Totaltrouvé" fill="#8884d8" activeBar={<Rectangle fill="pink" stroke="blue" />} />
          <Bar dataKey="Totalperdu" fill="#82ca9d" activeBar={<Rectangle fill="gold" stroke="purple" />} />
        </BarChart>
      </ResponsiveContainer>
      </div>
    
     
    </div>

                      </div>
                     <div>
                          {/* Total Lost Items: {TotalperduItems} */}
                     </div>

         
                  </div>

      </div>

         
                     



                                

                      

              </div>
          </Box>

          
        </Stack>
      </div>


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

export default Reports1;
