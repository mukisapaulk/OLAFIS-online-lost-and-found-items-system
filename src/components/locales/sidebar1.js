import React, { useEffect, useState } from 'react';
import { Home, PresentToAll, InfoOutlined, MessageRounded, PersonRemoveAlt1, NoteAdd } from '@mui/icons-material';
import { Box } from '@mui/material';

import axios from 'axios';
import { NavLink } from 'react-router-dom';

function Sidebar1() {
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

  return (
    <Box width={{ xs: '100%', sm: '20%' }} className="border border-gray-400 bg-slate-900" height={{ sm: '75vh' }}>
      <Box margin="10px">
        <NavLink to="/found1">
          <div className='flex items-center gap-3 mt-2 hover:bg-blue-800 hover:ml-3 p-3 transition-[0.5s]'>
            <Home sx={{ color: 'white', fontSize: '2.2em' }} />
            <h5 className='text-white font-medium text-lg'>TABLEAU DE BORD</h5>
          </div>
        </NavLink>
        <NavLink to="/lost1">
          <div className='flex items-center gap-3 mt-2 hover:bg-blue-800 hover:ml-3 p-3 transition-[0.5s]'>
            <PersonRemoveAlt1 sx={{ color: 'white', fontSize: '2.2em' }} />
            <h5 className='text-white font-medium text-lg uppercase'>Publier un objet perdu</h5>
          </div>
        </NavLink>
        <NavLink to="/home1">
          <div className='flex items-center gap-3 mt-2 hover:bg-blue-800 hover:ml-3 p-3 transition-[0.5s]'>
            <PresentToAll sx={{ color: 'white', fontSize: '2.2em' }} />
            <h5 className='text-white font-medium text-lg uppercase'>Publier un objet trouvé</h5>
          </div>
        </NavLink>
        <NavLink to="/tips1">
          <div className='flex items-center gap-3 mt-2 hover:bg-blue-800 hover:ml-3 p-3 transition-[0.5s]'>
            <InfoOutlined sx={{ color: 'white', fontSize: '2.2em' }} />
            <h5 className='text-white font-medium text-lg uppercase'>Conseils de sécurité pour les biens</h5>
          </div>
        </NavLink>
        <NavLink to="/reports1">
          <div className='flex items-center gap-3 mt-2 hover:bg-blue-800 hover:ml-3 p-3 transition-[0.5s]'>
            <NoteAdd sx={{ color: 'white', fontSize: '2.2em' }} />
            <h5 className='text-white font-medium text-lg uppercase'>Rapports</h5>
          </div>
        </NavLink>
        <NavLink to="/chat1">
          <div className='flex items-center gap-3 mt-2 hover:bg-blue-800 hover:ml-3 p-3 transition-[0.5s]'>
            <MessageRounded sx={{ color: 'white', fontSize: '2.2em' }} />
            <h5 className='text-white font-medium text-lg uppercase'>Chat <span className='bg-red-800 text-white rounded-full px-3'>{chats.length}</span></h5>
          </div>
        </NavLink>
      </Box>
    </Box>
  );
}

export default Sidebar1;
