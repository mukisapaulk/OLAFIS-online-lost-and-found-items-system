import React, { useEffect, useState } from 'react';
import {
  Box,
  Stack,
  Typography,
  Grid,
  Card,
  CardContent,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
} from '@mui/material';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  PieChart, Pie, Cell,
} from 'recharts';
import AdminSidebar from './adminsidebar';
import AdminBar from './adminbar';
import StarIcon from '@mui/icons-material/Star';
import LocalSeeTwoToneIcon from '@mui/icons-material/LocalSeeTwoTone';
import RemoveRedEyeTwoToneIcon from '@mui/icons-material/RemoveRedEyeTwoTone';

function Dash() {
  const [dataLength, setDataLength] = useState(0);
  const [dataLength1, setDataLength1] = useState(0);
  const [totalUsers, setTotalUsers] = useState(0);

  const [foundItems, setFoundItems] = useState([]);
  const [lostItems, setLostItems] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response1 = await fetch('http://localhost:5000/api/items');
        const response2 = await fetch('http://localhost:5000/api/lost');
        const response3 = await fetch('http://localhost:5000/api/accountsfetch');

        if (response1.ok && response2.ok && response3.ok) {
          const data1 = await response1.json();
          const data2 = await response2.json();
          const data3 = await response3.json();

          setFoundItems(data1);
          setLostItems(data2);
          setDataLength(data1.length);
          setDataLength1(data2.length);
          setTotalUsers(data3.length);
        } else {
          console.error('Failed to fetch data');
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  const COLORS = ['#8884d8', '#82ca9d'];
  const CUSTOM_COLORS = ['rgb(220, 38, 38)', 'rgb(22, 163, 74)'];

  const data = [
    { name: 'Found', value: dataLength },
    { name: 'Lost', value: dataLength1 },
  ];

  const recentFoundItems = foundItems.slice(0, 5);
  const recentLostItems = lostItems.slice(0, 5);

  return (
    <div className='bg-slate-50 h-screen font-san'>
      <AdminBar />
      <div className='mt-16 flex'>
        <AdminSidebar />
        <Box
          
          flex={1}
          p={4}
          ml={{ xs: 0, sm: 100, md: 30 }}  // Adjusted margin for better layout
          display='flex'
          flexDirection='column'
          alignItems='center'
          
        >
          <Grid container spacing={3}>
            {/* Summary Cards */}
            <Grid item xs={12} md={4}>
              <Card className='bg-white p-6 rounded-lg '
              style={{
                /* From https://css.glass */
   boxShadow: '0 4px 30px rgba(0, 0, 0, 0.1)',
   backdropFilter: 'blur(12.2px)',
   WebkitBackdropFilter: 'blur(12.2px)',
   borderRadius:'20px',
   border: '1px solid rgba(255, 255, 255, 0.15)',
   
             }}
              >
                <CardContent>
                  <LocalSeeTwoToneIcon style={{ fontSize: 40, color: CUSTOM_COLORS[0] }} />
                  <Typography variant='h6' gutterBottom>
                    Total Found Items
                  </Typography>
                  <Typography variant='h4' component='div' style={{ color: CUSTOM_COLORS[0] }}>
                    {dataLength}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} md={4}>
              <Card className='bg-white p-6 rounded-lg ' 
              style={{
                /* From https://css.glass */
   boxShadow: '0 4px 30px rgba(0, 0, 0, 0.1)',
   backdropFilter: 'blur(12.2px)',
   WebkitBackdropFilter: 'blur(12.2px)',
   borderRadius:'20px',
   border: '1px solid rgba(255, 255, 255, 0.15)',
             }}>
                <CardContent>
                  <RemoveRedEyeTwoToneIcon style={{ fontSize: 40, color: CUSTOM_COLORS[1] }} />
                  <Typography variant='h6' gutterBottom>
                    Total Lost Items
                  </Typography>
                  <Typography variant='h4' component='div' style={{ color: CUSTOM_COLORS[1] }}>
                    {dataLength1}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} md={4}>
              <Card className='bg-white p-6 rounded-lg ' style={{
             /* From https://css.glass */
boxShadow: '0 4px 30px rgba(0, 0, 0, 0.1)',
backdropFilter: 'blur(12.2px)',
WebkitBackdropFilter: 'blur(12.2px)',
borderRadius:'20px',
border: '1px solid rgba(255, 255, 255, 0.15)',
          }}>
                <CardContent>
                  <StarIcon color='primary' style={{ fontSize: 40 }} />
                  <Typography variant='h6' gutterBottom>
                    Total Users
                  </Typography>
                  <Typography variant='h4' component='div'>
                    {totalUsers}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            {/* Reports Summary */}
            <Grid item xs={12} md={6}>
              <Card className='bg-inherit p-6 rounded-none border-none'
              style={{
                /* From https://css.glass */
   boxShadow: 'none',
   border: 'none',
   borderRadius:'20px',
             }}>
                <CardContent>
                  <Typography variant='h5' gutterBottom className='text-black text-center'>
                    Found vs. Lost Items
                  </Typography>
                  <ResponsiveContainer width='100%' height={300}>
                    <BarChart data={data}>
                      <CartesianGrid strokeDasharray='3 3' />
                      <XAxis dataKey='name' />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey='value' fill={CUSTOM_COLORS[0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} md={6}>
              <Card className='bg-white p-6 '  style={{
                /* From https://css.glass */
   boxShadow: 'none',
   border: 'none',
   borderRadius:'10px',
             }}>
                <CardContent>
                  <Typography variant='h5' gutterBottom className='text-black text-center'>
                    Item Distribution
                  </Typography>
                  <ResponsiveContainer width='100%' height={300}>
                    <PieChart>
                      <Pie
                        data={data}
                        cx='50%'
                        cy='50%'
                        outerRadius={100}
                        fill={CUSTOM_COLORS[1]}
                        dataKey='value'
                        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      >
                        {data.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={CUSTOM_COLORS[index % CUSTOM_COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </Grid>

            {/* Recent Found Items */}
            <Grid item xs={12} md={6}>
              <Card className='bg-white p-6 '
              style={{
                /* From https://css.glass */
   boxShadow: '0 4px 30px rgba(0, 0, 0, 0.1)',
   backdropFilter: 'blur(12.2px)',
   WebkitBackdropFilter: 'blur(12.2px)',
   border: '1px solid rgba(255, 255, 255, 0.15)',
   borderRadius:'20px',
             }}>
               <CardContent>
  <Typography variant='h5' gutterBottom className='text-black'>
    Recent Found Items
  </Typography>
  <Table size='small' aria-label='recent-found-items'>
    <TableHead>
      <TableRow>
        <TableCell>Item</TableCell>
        <TableCell>Location</TableCell>
      </TableRow>
    </TableHead>
    <TableBody>
      {recentFoundItems.slice(0, 4).map((item, index) => (
        <TableRow key={index}>
          <TableCell component='th' scope='row'>
            {item.itemName}
          </TableCell>
          <TableCell>{item.location}</TableCell>
        </TableRow>
      ))}
    </TableBody>
  </Table>
</CardContent>

              </Card>
            </Grid>

            {/* Recent Lost Items */}
            <Grid item xs={12} md={6}>
              <Card className='bg-white p-6 '
              style={{
                /* From https://css.glass */
   boxShadow: '0 4px 30px rgba(0, 0, 0, 0.1)',
   backdropFilter: 'blur(12.2px)',
   WebkitBackdropFilter: 'blur(12.2px)',
   border: '1px solid rgba(255, 255, 255, 0.15)',
   borderRadius:'20px',
             }}>
                <CardContent>
                  <Typography variant='h5' gutterBottom className='text-black'>
                    Recent Lost Items
                  </Typography>
                  <Table size='small' aria-label='recent-lost-items'>
                    <TableHead>
                      <TableRow>
                        <TableCell >Item</TableCell>
                        <TableCell>Location</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {recentLostItems.slice(0, 4).map((item, index) => (
                        <TableRow key={index}>
                          <TableCell component='th' scope='row'>
                            {item.itemName}
                          </TableCell>
                          <TableCell>{item.location}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </Box>
      </div>
    </div>
  );
}

export default Dash;
