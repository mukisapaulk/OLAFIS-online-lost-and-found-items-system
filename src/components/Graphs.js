import { AccountCircleSharp, Logout, RemoveRedEyeSharp, Report, Home, Send, FeedbackOutlined, NotificationAdd, RateReview, ShareRounded, QuestionMark, PresentToAll, SafetyCheck, InfoOutlined, MessageRounded, ReportGmailerrorred, PersonRemoveAlt1, NoteAdd, RemoveRedEye } from '@mui/icons-material';
import { Box, Stack, CircularProgress, Button, Modal, IconButton, TextField, Skeleton } from '@mui/material';
import React, { useEffect, useState } from 'react';

import StarIcon from '@mui/icons-material/Star';
import StarBorderIcon from '@mui/icons-material/StarBorder';
import axios from 'axios';
import { Alert, Share, View } from 'react-native';

import { NavLink } from 'react-router-dom';

import { RateReviewTwoTone, RemoveRedEyeTwoTone } from '@material-ui/icons';
import Navbar from './navbar';
import Footer from './footer';
import Sidebar from './sidebar';

function Chat() {
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [successModalOpen, setSuccessModalOpen] = useState(false);
  const [openModal1, setOpenModal1] = useState(false);
  const [openModal2, setOpenModal2] = useState(false);
  const [rating, setRating] = useState(0);
  const [username, setUsername] = useState('');

  useEffect(() => {
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

  const handleFeedback = () => {
    setOpenModal1(false);
    setSuccessModalOpen(true);
  };

  const [chats, setChats] = useState([]);

  useEffect(() => {
    const fetchChats = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/chats');
        setChats(response.data);
      } catch (error) {
        console.error('Error fetching chats:', error);
      }
    };

    fetchChats();
  }, []);

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const res = await axios.post('http://localhost:5000/api/chats', { message, username });
      console.log(res.data);
      const response = await axios.get('http://localhost:5000/api/chats');
      setChats(response.data);
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

  const [isHovered, setIsHovered] = useState(false);

  const buttonStyle = {
    backgroundColor: '#1a73e8',
    color: 'white',
    borderRadius: '4px',
    transition: 'background-color 0.3s, transform 0.3s',
    transform: isHovered ? 'scale(1.05)' : 'scale(1)',
  };

  const [isHover, setIsHover] = useState(false);

  const buttonStyled = {
    backgroundColor: '#34a853',
    color: 'white',
    borderRadius: '4px',
    transition: 'background-color 0.3s, transform 0.3s',
    transform: isHover ? 'scale(1.05)' : 'scale(1)',
  };

  return (
    <div className='bg-slate-50 h-[100vh] font-sans'>
      <Navbar />

      <div className='mt-[100px]'>
        <Stack direction={{ xs: 'column', sm: 'row' }} className='m-2 ' gap="10px">
          <Sidebar />

          <Box className="bg-inherit fixed top-0 left-80 h-full" sx={{ marginTop: '80px', padding: '10px' }}>
            <div className='bg-slate-50 flex gap-5 p-2 m-1 mx-2'>
              <Button onClick={() => setOpenModal1(true)} variant='contained' style={buttonStyle} onMouseEnter={() => setIsHovered(true)} onMouseLeave={() => setIsHovered(false)}>
                <FeedbackOutlined /> Feedback
              </Button>
              <Button onClick={() => setOpenModal2(true)} variant='contained' style={buttonStyled} onMouseEnter={() => setIsHover(true)} onMouseLeave={() => setIsHover(false)}>
                <RateReviewTwoTone /> Rate Us
              </Button>
            </div>
            <div className='flex overflow-y-auto'>
              <div className="w-[60%]">
                <div className="flex items-center gap-5 my-3 mx-3 justify-center bg-slate-100 p-3 h-[60vh]"
                  style={{
                    background: '#d5b3ff',
                    border: '2px solid black',
                    minWidth: '300px',
                    borderRadius: '30px',
                  }}>
                  <form className="flex flex-col gap-5 w-[80%]">
                    <div className='flex gap-2 items-center'>
                      <Skeleton variant="circular" width={10} height={10} />
                      <p className='font-medium text-blue-600'> Online: @{username}</p>
                    </div>
                    <h6 className='text-xl text-gray-800 font-extrabold mb-5 text-center' style={{ color: '#FFFFFF', textShadow: '-5px 5px 0px #00e6e6, -10px 10px 0px #01cccc, -15px 15px 0px #00bdbd' }}>CHAT DISCORD</h6>
                    <TextField value={message} onChange={(e) => setMessage(e.target.value)} variant="filled" label="chat" sx={{ backgroundColor: 'inherit', borderBottom: '2px solid black' }} />
                    <Button variant="contained" onClick={handleSubmit} disabled={loading} style={{ borderRadius: '4px', border: '2px solid black', color: 'white', backgroundColor: '#34a853' }}>
                      {loading ? <CircularProgress size={24} /> : 'SEND'}
                    </Button>
                  </form>
                </div>
              </div>

              <div className='m-10 w-[60%] overflow-y-auto h-[70vh] mt-1' style={{ minWidth: '350px' }}>
                <p className='text-center font-medium' style={{ backgroundColor: '#fbffa7', border: '2px solid black', padding: '20px', fontWeight: 'bold', fontSize: '1.3rem', marginBottom: '8px' }}>MESSAGES</p>
                {chats.map((chat, index) => (
                  <div key={index} className={`flex ${chat.isUser ? 'justify-end' : 'justify-start'} mb-4`}>
                    <div className={`max-w-xs md:max-w-md p-4 rounded-lg ${chat.isUser ? 'bg-blue-500 text-white' : 'bg-gray-200 text-black'}`} style={{ border: '2px solid black', padding: '10px' }}>
                      <div className="flex justify-between items-center">
                        <h1 className="text-sm font-semibold">{chat.username}</h1>
                        <h1 className="text-xs text-gray-500 ml-2">{chat.date}</h1>
                      </div>
                      <p className="mt-2">{chat.message}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </Box>
        </Stack>
      </div>

      <Modal open={successModalOpen} onClose={() => setSuccessModalOpen(false)}>
        <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', backgroundColor: 'white', padding: '40px', border: '2px solid black', borderRadius: '8px' }}>
          <h2 className='text-[1.5em] font-medium' style={{ color: '#ff764d', textAlign: 'center' }}>Feedback sent!</h2>
          <div className='mt-5 flex justify-center'>
            <p onClick={() => setSuccessModalOpen(false)} className='text-white bg-blue-600 p-2 mt-4 text-center font-medium text-lg rounded cursor-pointer w-[30%]'>OK</p>
          </div>
        </div>
      </Modal>

      <Modal open={openModal1} onClose={() => setOpenModal1(false)} aria-labelledby="modal-modal-title" aria-describedby="modal-modal-description">
        <Box sx={{ position: 'absolute', width: 400, bgcolor: 'white', boxShadow: 24, p: 4, top: '50%', left: '50%', transform: 'translate(-50%, -50%)', borderRadius: '8px' }}>
          <h6 className='text-[1.2em] text-center mb-3 p-3 text-gray-800 font-medium'> ENTER YOUR FEEDBACK MESSAGE</h6>
          <hr style={{ height: '2.5px', background: 'black' }}></hr>
          <TextField label="feedback" variant="filled" required fullWidth margin="normal" style={{ borderBottom: '2px solid black' }} />
          <Button variant="contained" onClick={handleFeedback} style={buttonStyled} onMouseEnter={() => setIsHover(true)} onMouseLeave={() => setIsHover(false)}>SEND</Button>
        </Box>
      </Modal>

      <Modal open={openModal2} onClose={handleClose} aria-labelledby="modal-modal-title" aria-describedby="modal-modal-description">
        <Box sx={{ position: 'absolute', width: 400, bgcolor: 'white', boxShadow: 24, p: 4, top: '50%', left: '50%', transform: 'translate(-50%, -50%)', borderRadius: '8px' }}>
          <h2 style={{ textAlign: 'center' }} className='font-bold'>RATE US</h2>
          <hr style={{ height: '2.5px', background: 'black' }}></hr>
          <div style={{ display: 'flex', justifyContent: 'center', gap: '5px' }} className='my-5'>
            {[...Array(5)].map((_, index) => (
              <div key={index} onClick={() => handleStarClick(index)} style={{ cursor: 'pointer' }}>
                {index < rating ? (
                  <StarIcon sx={{ fontSize: 50, color: '#ff764d' }} />
                ) : (
                  <StarBorderIcon sx={{ fontSize: 50, color: 'gray' }} />
                )}
              </div>
            ))}
          </div>
          <hr style={{ height: '2.5px', background: 'black' }}></hr>
          <div className='flex justify-center mt-4'>
            <Button variant='contained' style={buttonStyled} onMouseEnter={() => setIsHover(true)} onMouseLeave={() => setIsHover(false)} onClick={handleClose}>OK</Button>
          </div>
        </Box>
      </Modal>
    </div>
  );
}

export default Chat;
