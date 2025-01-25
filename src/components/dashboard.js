import { AccountCircleSharp, Logout, Menu, ChevronLeft, Close, Add, Delete, RemoveRedEyeSharp, Report, MessageRounded, Send, Home, VideoCallSharp, NotificationAdd } from '@mui/icons-material'
import { Box, Stack, CircularProgress, Button,  Modal, TextField } from '@mui/material'
import React, { useEffect, useState } from 'react'
import '../App.css'
import axios from 'axios';

import { NavLink } from 'react-router-dom'

import { Settings, Money, ReceiptRounded} from '@mui/icons-material'

function Admin() {

    const [description, setDescription] = useState('');
    const [image, setImage] = useState(null);
    const [openModal, setOpenModal] = useState(false);
    const [openModal1, setOpenModal1] = useState(false);

 
  return (
    <div className='bg-slate-50 h-[100vh] font-san'>
      <Box bgcolor='#070429' position="fixed" width="100%" boxShadow="0 0 10px gray" zIndex={9999} className='p-2'>
        <div className='flex justify-between items-center'>
        <h6 className='text-[1.2em]   text-gray-200  font-medium'>ADMIN DASHBOARD</h6>
          <h6 className='text-[1.6em]  text-gray-100  font-bold'>STRESS MANAGEMENT SYSTEM</h6>
       
           <div className='flex gap-3'>

           <p className='  text-white  '>Welcome, @jimmyprologgedin</p>
            <NavLink to="/">
              <p className='text-base text-center text-white font-medium'>
                <Logout />
                Logout
              </p>
             </NavLink>
           </div>
             

            
         
        </div>
      </Box>

      

      {/* Main Content */}
      <div className='mt-[120px]'>
        <Stack direction={{ xs: 'column', sm: 'row' }} className='mr-3 ' gap="10px">

            <Box width={{ xs: '100%', sm: '20%' }} className="border border-gray-400 bg-slate-900 "  height={{ sm: '82vh' }}>
              <Box margin="10px" >
                        


                        <div className='flex items-center gap-3 mt-4 hover:bg-blue-800 p-3 transition-[0.5s]'>
                            <NotificationAdd sx={{color:'white', fontSize:'1.7em'}}/>
                        <NavLink to="">
                            <h5 className='text-white font-medium text-lg'>MESSAGES <span className='bg-red-800 text-white rounded-full px-3'>5</span></h5>
                        </NavLink>
                        </div>




                        <div className='flex items-center gap-3 mt-4 hover:bg-blue-800 p-3 transition-[0.5s]'>
                            <VideoCallSharp sx={{color:'white', fontSize:'1.7em'}}/>
                        
                            <h5 onClick={() => setOpenModal(true)} className='text-white font-medium text-lg'>UPLOAD CONTENTS</h5>
                        
                        </div>



                        <div className='flex items-center gap-3 mt-4 hover:bg-blue-800 p-3 transition-[0.5s]'>
                            <Settings sx={{color:'white', fontSize:'1.7em'}}/>
                        <NavLink to="">
                            <h5 className='text-white font-medium text-lg'>SETTINGS</h5>
                        </NavLink>
                        </div>



                        <div className='flex items-center gap-3 mt-4 hover:bg-blue-800 p-3 transition-[0.5s]'>
                            <Logout sx={{color:'white', fontSize:'1.7em'}}/>
                        <NavLink to="">
                            <h5 className='text-white font-medium text-lg'>LOGOUT</h5>
                        </NavLink>
                        </div>
              </Box>

                  
            </Box>



          <Box width={{ xs: '100%', sm: '80%' }} className="border border-slate-400 bg-white" height={{ sm: '82vh' }} >
          <h6 className='text-[1.2em] text-center mb-3  bg-slate-300 p-3 text-gray-800  font-medium'>RECEIVED MESSAGES</h6>

           
              <div className='flex gap-1'>

                 

                 <div className="h-full sm:overflow-auto w-[100%]">
                 
                    <div className=" my-3 mx-3 overflow-y-auto  p-3 h-[72vh] border border-gray-200">
      
                        
                         



                           {/* MESSAGES
                                 */}

                                <Box className='overflow-y-auto bg-white' height='72vh' display='grid' gridTemplateColumns='repeat(3, 1fr)' gap={5} p={3} m={1}>
                                        {/* Cards */}
                                        <div className='bg-gray-50 p-3 shadow-xl rounded-lg'>
                                           
                                            {/* Description */}
                                            <p className='text-lg text-gray-800 font-semibold mb-2'>FROM: TOM DAVID</p>
                                            <p className='text-lg text-gray-800 font-semibold mb-2'>DESC: <span className='text-base text-gray-600'>stress Information here .................................................</span></p>
                                            {/* Contact */}
                                            <p className='text-base text-gray-600 mt-11'>CONTACTS:07846747747</p>

                                            <hr className='my-5'></hr>
                                            <Button variant='contained' onClick={() => setOpenModal1(true)}>REPLY</Button>
                                        </div>
                                        <div className='bg-gray-50 p-3 shadow-xl rounded-lg'>
                                           
                                            {/* Description */}
                                            <p className='text-lg text-gray-800 font-semibold mb-2'>FROM: TOM DAVID</p>
                                            <p className='text-lg text-gray-800 font-semibold mb-2'>DESC: <span className='text-base text-gray-600'>stress Information here .................................................</span></p>
                                            {/* Contact */}
                                            <p className='text-base text-gray-600 mt-11'>CONTACTS:07846747747</p>

                                            <hr className='my-5'></hr>
                                            <Button variant='contained' onClick={() => setOpenModal1(true)}>REPLY</Button>
                                        </div>


                                       <div className='bg-gray-50 p-3 shadow-xl rounded-lg'>
                                           
                                            {/* Description */}
                                            <p className='text-lg text-gray-800 font-semibold mb-2'>FROM: TOM DAVID</p>
                                            <p className='text-lg text-gray-800 font-semibold mb-2'>DESC: <span className='text-base text-gray-600'>stress Information here .................................................</span></p>
                                            {/* Contact */}
                                            <p className='text-base text-gray-600 mt-11'>CONTACTS:07846747747</p>

                                            <hr className='my-5'></hr>
                                            <Button variant='contained' onClick={() => setOpenModal1(true)}>REPLY</Button>
                                        </div>
                                        <div className='bg-gray-50 p-3 shadow-xl rounded-lg'>
                                           
                                            {/* Description */}
                                            <p className='text-lg text-gray-800 font-semibold mb-2'>Item Description 4</p>
                                            {/* Contact */}
                                            <p className='text-base text-gray-600'>Contact Information 4</p>
                                        </div>
                                        <div className='bg-gray-50 p-3 shadow-xl rounded-lg'>
                                           
                                            {/* Description */}
                                            <p className='text-lg text-gray-800 font-semibold mb-2'>Item Description 5</p>
                                            {/* Contact */}
                                            <p className='text-base text-gray-600'>Contact Information 5</p>
                                        </div>
                                        <div className='bg-gray-50 p-3 shadow-xl rounded-lg'>
                                           
                                            {/* Description */}
                                            <p className='text-lg text-gray-800 font-semibold mb-2'>Item Description 6</p>
                                            {/* Contact */}
                                            <p className='text-base text-gray-600'>Contact Information 6</p>
                                        </div>
                                        </Box>
             
                    </div>
                </div>


    


           
              </div>
          </Box>

      
         
        </Stack>
      </div>


      {/* modal Upload */}
       {/* Modal */}
       <Modal
        open={openModal}
        onClose={() => setOpenModal(false)}
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
          <h6 className='text-[1.2em] text-center mb-3 p-3 text-gray-800  font-medium'>UPLOAD STRESS RELIEVE CONTENT</h6>
          <hr></hr>
          <TextField
            label="Description"
            multiline
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            fullWidth
            margin="normal"
          />
          <input className='my-3' type="file" />
          <Button variant="contained">
           UPLOAD
          </Button>
        </Box>
      </Modal>




       {/* modal Upload */}
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
          <h6 className='text-[1.2em] text-center mb-3 p-3 text-gray-800  font-medium'> REPLY TO: TOM DAVID</h6>
          <hr></hr>
          <TextField
            label="Reply"
            multiline
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            fullWidth
            margin="normal"
          />
          
          <Button variant="contained">
           SEND
          </Button>
        </Box>
      </Modal>
    </div>
  )
}

export default Admin;
