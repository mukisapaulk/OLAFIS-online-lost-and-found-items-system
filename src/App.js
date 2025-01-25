import * as React from 'react';

import {BrowserRouter, Route, Routes} from 'react-router-dom'
import {Stack} from '@mui/material';

import Login from './components/login';

import Home from './components/home';

import Found from './components/found';
import Dash from './components/dash';

import Content from './components/content';
import Chat from './components/chat';
import Lost from './components/lost';
import Register from './components/register';
import Reports from './components/reports';
import Tips from './components/tips';
import ViewLost from './components/viewlost';
import Example from './components/chart';
import ChatApp from './components/ai';
import Navbar from './components/navbar';
// import Footer from './components/footer';
import Sidebar from './components/sidebar';
import Home1 from './components/locales/home1';
import Found1 from './components/locales/found1';
import ViewLost1 from './components/locales/viewlost';
import Chat1 from './components/locales/chat';
import Tips1 from './components/locales/tips';
import Reports1 from './components/locales/report';
import Lost1 from './components/locales/lost1';
import Admin from './components/admin';
import AdminFound from './components/adminfound';
import AdminLost from './components/adminlost';
import Claim from './components/claim';
import Verify from './components/verify';
import FeedbackSystem from './components/FeedbackSystem';
import AdminChat from './components/Adminchat';
import Feedback from './components/feedback';
import LandingPage from './components/Landingpage';
import Homepage from './components/Homepage';

export default function App() {
  return (
    <Stack>
   
    <BrowserRouter>

  <Routes>
   <Route path='/login' element={<Login/>}/>
   <Route path='/register' element={<Register/>}/>
   <Route path='/found' element={<Found/>}/>
   <Route path='/admin' element={<Admin/>}/>

   <Route path='/home' element={<Home/>}/>
   <Route path='/dash' element={<Dash/>}/>
  
   <Route path='/content' element={<Content/>}/>
   <Route path='/chat' element={<Chat/>}/>
   <Route path='/lost' element={<Lost/>}/>
   <Route path='/reports' element={<Reports/>}/>
   <Route path='/tips' element={<Tips/>}/>
   <Route path='/lostfound' element={<ViewLost/>}/>
   <Route path='/chart' element={<Example/>}/>
   <Route path='/ai' element={<ChatApp/>}/>
   <Route path='/navbar' element={<Navbar/>}/>
   {/* <Route path='/footer' element={<Footer/>}/> */}
   <Route path='/sidebar' element={<Sidebar/>}/>
   <Route path='/home1' element={<Home1/>}/>
   <Route path='/found1' element={<Found1/>}/>
   <Route path='/viewlost1' element={<ViewLost1/>}/>
   <Route path='/chat1' element={<Chat1/>}/>
   <Route path='/tips1' element={<Tips1/>}/>
   <Route path='/reports1' element={<Reports1/>}/>
   <Route path='/lost1' element={<Lost1/>}/>
   <Route path='/adminfound' element={<AdminFound/>}/>
   <Route path='/adminlost' element={<AdminLost/>}/>
   <Route path='/claim' element={<Claim/>}/>
   <Route path='/feedback' element={<FeedbackSystem/>}/>
   <Route path='/verify' element={<Verify/>}/>
   <Route path='/adminchat' element={<AdminChat/>}/>
   <Route path='/adminfeedback' element={<Feedback/>}/>
   <Route path='/' element={<LandingPage/>}/>
   <Route path='/homepage' element={<Homepage/>}/>


  </Routes>
 
  
</BrowserRouter>
 </Stack>  
  );
}






