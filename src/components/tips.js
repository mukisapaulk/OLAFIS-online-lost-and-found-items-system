import { ArrowForward, ArrowBack } from '@mui/icons-material';
import { Box, Stack, Button, Typography } from '@mui/material';
import React, { useEffect, useState } from 'react';
import Navbar from './navbar';
import Footer from './footer';
import Sidebar from './sidebar';
import Accordin from './Accordin';
import './Tips.css'; // Import the CSS file for animations
import FeedbackSystem from './FeedbackSystem';

function Tips() {
  const [username, setUsername] = useState('');

  useEffect(() => {
    // Retrieve username from local storage
    const storedUsername = localStorage.getItem('username');
    if (storedUsername) {
      setUsername(storedUsername);
    }
  }, []);

  const tips = [
    "Designate specific spots for commonly misplaced items like keys, wallet, and phone",
    "Use labels or tags with your contact information on items like bags and luggage",
    "Keep a checklist when traveling to ensure you don't leave anything behind",
    "Use brightly colored cases or covers for easy visibility of gadgets and accessories",
    "Regularly clean and declutter your living and workspaces to avoid misplacing items",
  ];

  const [currentTipIndex, setCurrentTipIndex] = useState(0);

  const handleNextTip = () => {
    const nextIndex = (currentTipIndex + 1) % tips.length;
    setCurrentTipIndex(nextIndex);
  };

  const handlePreviousTip = () => {
    const nextIndex = (currentTipIndex - 1 + tips.length) % tips.length;
    setCurrentTipIndex(nextIndex);
  };

  return (
    <div className='h-[100vh] font-sans'>
      <Navbar />
      <FeedbackSystem />
      <Footer />
      <div className='mt-[100px]'>
        <Stack direction={{ xs: 'column', sm: 'row' }} className='m-2' gap="10px">
          <Sidebar />
          <Box
            className="bg-inherit mt-5 fixed w-full top-0 left-0 h-full overflow-auto"
           
          >
            <div className='flex justify-between items-center p-4 mt-20 mx-2'>
              {/* Add your title here */}
              <Typography variant="h6" gutterBottom>
                Tips to Keep Your Items Safe
              </Typography>
            </div>
            <div className='flex justify-center  mx-5'>
              <div className="tip-carousel w-full">
                <div
                  className="tip-slide w-full h-auto"
                  style={{
                    backgroundImage: 'url("tips.png")', // Replace with your actual image URL
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    position: 'relative',
                    borderRadius: '10px',
                    boxShadow: 'none',
                  }}
                >
                  <div className="overlay"></div>
                  <div className="tip-content w-full">
                    <Box className="flex justify-center mt-4">
                      <Button
                        variant="contained"
                        onClick={handlePreviousTip}
                        style={{
                          backgroundColor: 'rgb(220, 38, 38)',
                          color: 'white',
                          marginLeft: '30px',
                          borderRadius: '50%',
                        }}
                      >
                        <ArrowBack />
                      </Button>
                    </Box>
                    <div className="tip-text-container">
                      <Typography
                        variant="h6"
                        className="text-white ml-20 p-10 font-bold text-center"
                        style={{ fontSize: '20px' }}
                      >
                        {tips[currentTipIndex]}
                      </Typography>
                    </div>
                    <Box className="flex justify-center">
                      <Button
                        variant="contained"
                        onClick={handleNextTip}
                        style={{
                          backgroundColor: 'rgb(220, 38, 38)',
                          color: 'white',
                          marginLeft: '30px',
                          borderRadius: '50%',
                        }}
                      >
                        <ArrowForward />
                      </Button>
                    </Box>
                  </div>
                  <div className="pagination-dots">
                    {tips.map((_, index) => (
                      <span
                        key={index}
                        className={`dot ${index === currentTipIndex ? 'active' : ''}`}
                        onClick={() => setCurrentTipIndex(index)}
                      ></span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
            <div className='gap-4 mt-8 mb-6 items-center'>
              <Typography variant="h5" className='font-medium text-[1.5em] text-center'>
                FREQUENTLY ASKED SAFETY QUESTIONS
              </Typography>
            </div>
            <div className="items-center gap-5 my-3  justify-center p-3 h-[100vh]">
              <Accordin />
            </div>
          </Box>
        </Stack>
      </div>
    </div>
  );
}

export default Tips;