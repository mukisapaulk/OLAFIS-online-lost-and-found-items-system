import { Logout, FeedbackOutlined, ShareRounded, QuestionMark, PresentToAll, SafetyCheck, InfoOutlined, MessageRounded, ReportGmailerrorred, PersonRemoveAlt1, NoteAdd, RemoveRedEye, Print, CompressRounded, PresentToAllOutlined } from '@mui/icons-material';
import { Box, Stack, Button, Modal, IconButton, TextField } from '@mui/material';
import React, { useEffect, useState } from 'react';
import '../App.css';
import StarIcon from '@mui/icons-material/Star';
import StarBorderIcon from '@mui/icons-material/StarBorder';
import axios from 'axios';
import { Alert, Share } from 'react-native';

import { NavLink } from 'react-router-dom';

import { LocalSeeTwoTone, RateReviewTwoTone, RemoveRedEyeTwoTone } from '@material-ui/icons';
import { BarChart, Bar, Rectangle, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts';
import jsPDF from 'jspdf';
import Navbar from './navbar';
import Footer from './footer';
import Sidebar from './sidebar';
import FeedbackSystem from './FeedbackSystem';

function Reports() {
  const COLORS = ['#8884d8', '#82ca9d']; // Define colors for the pie slices

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


  const [isHov, setIsHov] = useState(false);
  const buttonSty = {
    backgroundColor: '#fbffa7',
    color: 'black',
    borderRadius: 'none',
    border: isHov ? '2px dashed #000' : '2px solid #000',
  };

  const [description, setDescription] = useState('');
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [successModalOpen, setSuccessModalOpen] = useState(false);
  const [openModal1, setOpenModal1] = useState(false);
  const [openModal2, setOpenModal2] = useState(false);
  const [rating, setRating] = useState(0);
  const [successModalOpen1, setSuccessModalOpen1] = useState(false);
  

  const [username, setUsername] = useState('');

  useEffect(() => {
    const storedUsername = localStorage.getItem('username');
    if (storedUsername) {
      setUsername(storedUsername);
    }
  }, []);

  const [dataLength, setDataLength] = useState(0);
  const [foundItems, setFoundItems] = useState([]);
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/items');
        const data = await response.json();
        setFoundItems(data);
        setDataLength(data.length);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  const [dataLength1, setDataLength1] = useState(0);
  const [foundItems1, setFoundItems1] = useState([]);
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/Lost');
        const data = await response.json();
        setFoundItems1(data);
        setDataLength1(data.length);
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
    setSuccessModalOpen(true);
  };

  const handleStarClick = (index) => {
    setRating(index + 1);
  };

  const onShare = async () => {
    try {
      const result = await Share.share({
        message: 'Lost and found system',
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
      name: 'Reports',
      TotalFound: dataLength,
      TotalLost: dataLength1,
      amt: 2400,
    },
  ];

  const generatePDF = async () => {
    const doc = new jsPDF();
    let yPos = 30;
    doc.setFontSize(22);
    doc.setTextColor(40);
    doc.text('Found Items Report', 105, yPos, { align: 'center' });
    yPos += 20;
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(0);
    doc.text('Contact', 20, yPos);
    doc.text('Description', 80, yPos);
    doc.text('Image', 150, yPos);
    doc.line(20, yPos + 2, 190, yPos + 2);
    yPos += 10;
    doc.setFont('helvetica', 'normal');

    const addNewPage = () => {
      doc.addPage();
      yPos = 30;
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(0);
      doc.text('Contact', 20, yPos);
      doc.text('Description', 80, yPos);
      doc.text('Image', 150, yPos);
      doc.line(20, yPos + 2, 190, yPos + 2);
      yPos += 10;
      doc.setFont('helvetica', 'normal');
    };

    for (const item of foundItems) {
      if (yPos > 260) {
        addNewPage();
      }
      doc.text((item.contact || '').toString(), 20, yPos);
      doc.text((item.description || '').toString(), 80, yPos, { maxWidth: 60 });
      try {
        const response = await fetch(`http://localhost:5000/${item.imagePath}`);
        const imageDataBlob = await response.blob();
        const reader = new FileReader();
        reader.readAsDataURL(imageDataBlob);
        reader.onloadend = () => {
          const imageDataBase64 = reader.result;
          if (yPos + 50 > 290) {
            addNewPage();
          }
          doc.addImage(imageDataBase64, 'JPEG', 150, yPos, 40, 40);
        };
      } catch (error) {
        console.error('Error loading image:', error);
      }
      yPos += 50;
    }

    const pageCount = doc.internal.getNumberOfPages();
    for (let i = 1; i <= pageCount; i++) {
      doc.setPage(i);
      doc.setFontSize(10);
      doc.text(`Page ${i} of ${pageCount}`, 105, 290, { align: 'center' });
    }
    doc.save('found_items_report.pdf');
  };

  return (
    <div className='bg-slate-50 h-[100vh] font-san'>
      <Navbar />
      <FeedbackSystem/>
      <Footer />
      <div className='mt-[100px] '>
        <Stack direction={{ xs: 'column', sm: 'row' }} className='m-2 ' gap='10px'>
          <Sidebar />
          <Box
            className='w-full fixed top-0 left-0  overflow-y-auto  h-full'
      
          >
           <div className='flex justify-between items-center  mt-10 mb-10 p-3 mx-20'>
                  <div className=' flex gap-5'>
                    
                    </div>
            
            </div>
            <div className='flex flex-col md:flex-row space-x-4 mx-10 mb-10'>
  <div className='bg-white p-6 w-full md:w-1/2 rounded-lg flex items-center'
  style={{
    /* From https://css.glass */
background: 'rgba(255, 255, 255, 1)',
boxShadow: '0 4px 30px rgba(0, 0, 0, 0.1)',
backdropfilter: 'blur(0px)',
webkitBackdropFilter: 'blur(0px)',
BorderBottom: '1px solid rgba(255, 255, 255, 0.3)',
      }}>
    <div className='mr-4'
    >
      <LocalSeeTwoTone color='primary' style={{ fontSize: 40, color: 'rgb(220, 38, 38)' }} />
    </div>
    <div>
      <p className='text-gray-600 font-medium'>Total Found Items</p>
      <h2 className='text-3xl font-bold'>{dataLength}</h2>
    </div>
  </div>
  <div className='bg-white p-6 w-full md:w-1/2 rounded-lg  flex items-center mt-4 md:mt-0'
  style={{
    /* From https://css.glass */
background: 'rgba(255, 255, 255, 1)',
boxShadow: '0 4px 30px rgba(0, 0, 0, 0.1)',
backdropfilter: 'blur(0px)',
webkitBackdropFilter: 'blur(0px)',
BorderBottom: '1px solid rgba(255, 255, 255, 0.3)',
      }}>
    <div className='mr-4'>
      <RemoveRedEyeTwoTone color='secondary' style={{ fontSize: 40, color: 'rgb(22, 163, 74)' }} />
    </div>
    <div>
      <p className='text-gray-600 font-medium'>Total Lost Items</p>
      <h2 className='text-3xl font-bold'>{dataLength1}</h2>
    </div>
  </div>
</div>


            <div className='mt-10'>
              <h2 className='text-left font-medium mb-10 ml-20 text-2xl text-black'>Reports Summary</h2>
              <div className='mt-10 mb-20 ml-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4'>
                <ResponsiveContainer width='100%' height={300}>
                  <BarChart data={data}>
                    <CartesianGrid strokeDasharray='3 3' />
                    <XAxis dataKey='name' />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey='TotalFound' fill='rgb(220, 38, 38)'/>
                    <Bar dataKey='TotalLost' fill='rgb(22, 163, 74)' />
                  </BarChart>
                </ResponsiveContainer>
                <ResponsiveContainer width='100%' height={300}>
                  <PieChart>
                    <Pie
                      data={[
                        { name: 'Found', value: dataLength },
                        { name: 'Lost', value: dataLength1 },
                      ]}
                      cx='50%'
                      cy='50%'
                      outerRadius={100}
                      // fill='rgb(220, 38, 38)'
                      label
                    >
                      <Cell key={`cell-0`} fill='rgb(220, 38, 38)' />
                      <Cell key={`cell-1`} fill='rgb(22, 163, 74)'/>
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              
            </div>
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
          className="w-[300px] rounded-[10px] fixed top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%] p-4 bg-white text-center"
          display="flex"
          flexDirection="column"
          alignItems="center"
        >
          <h2 className="text-lg mb-5">Item successfully claimed!</h2>
          
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
    </div>
  );
}

export default Reports;