import React, { useState, useEffect } from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper,  Box,
    Stack,Typography, } from '@mui/material';
import AdminSidebar from './adminsidebar';
import AdminBar from './adminbar';
import { Breadcrumbs, Link } from '@mui/material';


const Feedback = () => {
  const [feedbackData, setFeedbackData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/feedback'); // Replace with your API endpoint
        const data = await response.json();
        setFeedbackData(data);
      } catch (error) {
        console.error('Error fetching feedback:', error);
      }
    };

    fetchData();
  }, []);

  return (
    <Box className="bg-slate-50 min-h-screen font-san">
      <AdminBar />
      <Stack direction={{ xs: 'column', sm: 'row' }} className="mt-16">
        <AdminSidebar />
        <Box
          flex={1}
          p={4}
          display="flex"
          flexDirection="column"
          // alignItems="center"
          ml={{ xs: 0, sm: 100, md: 30 }}  // Adjusted margin for better layout
        >
         <Typography variant="h4" component="h1" gutterBottom>
              User Feedback
            </Typography>
            <Breadcrumbs aria-label="breadcrumb">
              <Link underline="hover" color="primary" to="/dash">
                Home
              </Link>
              <Link underline="hover" color="inherit" to="#">
                Feedback and rating
              </Link>
            </Breadcrumbs>
    <TableContainer component={Paper} style={{
              /* From https://css.glass */
              boxShadow: '0 4px 30px rgba(0, 0, 0, 0.1)',
              backdropFilter: 'blur(12.2px)',
              WebkitBackdropFilter: 'blur(12.2px)',
              border: '1px solid rgba(255, 255, 255, 0.15)',
              borderRadius:'5px',
            }}>
      <Table aria-label="simple table" style={{ boxShadow: 'none', borderRadius: '10px' }}>
        <TableHead
         sx={{
            backgroundColor: 'rgb(22, 163, 74)',
          }}>
          <TableRow>
            <TableCell  sx={{ fontWeight: 'bold', color: 'white' }}>Rating</TableCell>
            <TableCell  sx={{ fontWeight: 'bold', color: 'white' }}>Feedback</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {feedbackData.map((row) => (
            <TableRow key={row._id}> {/* Assuming your API response has an _id */}
              <TableCell component="th" scope="row">
                {row.rating}
              </TableCell>
              <TableCell>{row.feedback}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
    </Box>
    </Stack>
    </Box>
  );
};

export default Feedback;