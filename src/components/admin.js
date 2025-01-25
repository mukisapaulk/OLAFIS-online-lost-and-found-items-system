import React, { useEffect, useState } from 'react';
import {
  Box,
  Stack,
  Button,
  TextField,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
  IconButton,
  Modal,
  Grid,
  Tooltip,
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import BlockIcon from '@mui/icons-material/Block';
import AdminSidebar from './adminsidebar';
import AdminBar from './adminbar';
import Footer from './footer';
import { Breadcrumbs, Link } from '@mui/material';
import HomeIcon from '@mui/icons-material/Home';


function Admin() {
  const [loading, setLoading] = useState(true);
  const [successModalOpen, setSuccessModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editFormData, setEditFormData] = useState({
    _id: '',
    username: '',
    email: '',
    phone: '',
    password: '',
    type: '',
  });
  const [accounts, setAccounts] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [confirmModalOpen, setConfirmModalOpen] = useState(false);
  const [accountIdToBlock, setAccountIdToBlock] = useState('');

  useEffect(() => {
    const fetchAccounts = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/accountsfetch');
        if (response.ok) {
          const data = await response.json();
          setAccounts(data);
        } else {
          console.error('Failed to fetch accounts:', response.statusText);
        }
      } catch (error) {
        console.error('Error fetching accounts:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchAccounts();
  }, []);

  const handleEditModalOpen = (account) => {
    setEditFormData({
      _id: account._id,
      username: account.username,
      email: account.email,
      phone: account.phone,
      password: account.password,
      type: account.type,
    });
    setEditModalOpen(true);
  };

  const handleEditModalClose = () => {
    setEditModalOpen(false);
  };

  const handleEditSubmit = async () => {
    try {
      const response = await fetch(
        `http://localhost:5000/api/update/${editFormData._id}`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(editFormData),
        }
      );
      if (!response.ok) {
        throw new Error('Failed to update account');
      }
      console.log('Account updated successfully');
      // Update the accounts state after successful update
      setAccounts((prevAccounts) =>
        prevAccounts.map((account) =>
          account._id === editFormData._id ? editFormData : account
        )
      );
      setSuccessModalOpen(true);
      setEditModalOpen(false);
    } catch (error) {
      console.error('Error updating account:', error);
    }
  };

  const handleDelete = async (accountId) => {
    try {
      const response = await fetch(
        `http://localhost:5000/api/accounts/${accountId}`,
        {
          method: 'DELETE',
        }
      );
      if (!response.ok) {
        throw new Error('Failed to delete account');
      }
      console.log('Account deleted successfully');
      // Update the accounts state after successful delete
      setAccounts((prevAccounts) =>
        prevAccounts.filter((account) => account._id !== accountId)
      );
      setSuccessModalOpen(true);
    } catch (error) {
      console.error('Error deleting account:', error);
    }
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleBlockConfirmation = (accountId) => {
    setAccountIdToBlock(accountId);
    setConfirmModalOpen(true);
  };

  const handleBlockUser = async (accountId) => {
    try {
      const response = await fetch(
        `http://localhost:5000/api/blacklist/${accountId}`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ blacklisted: true }), // Assuming your backend expects this body
        }
      );
      if (!response.ok) {
        throw new Error('Failed to update blacklist status');
      }
      console.log('User blacklisted successfully');
      // Update the accounts state after successful blacklist
      setAccounts((prevAccounts) =>
        prevAccounts.map((account) =>
          account._id === accountId
            ? { ...account, blacklisted: true } // Update local state to reflect blacklist status
            : account
        )
      );
      setSuccessModalOpen(true);
      setConfirmModalOpen(false);
    } catch (error) {
      console.error('Error blacklisting user:', error);
    }
  };

  const filteredAccounts = searchTerm
    ? accounts.filter(
        (account) =>
          account.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
          account.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
          account.phone.toString().includes(searchTerm) ||
          account.type.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : accounts;

    const buttonStyle = {
      boxShadow: 'none',
      backgroundColor: 'rgb(22, 163, 74)',
    };

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
              Users
            </Typography>
          <Grid container alignItems="center" spacing={2} className="mt-4">
          
            <Grid item xs={12} md={6}>
            <Breadcrumbs aria-label="breadcrumb">
              <Link underline="hover" color="primary" to="/dash">
                Home
              </Link>
              <Link underline="hover" color="inherit" to="#">
                Registered Users
              </Link>
            </Breadcrumbs>
            
            </Grid>
            <Grid item xs={12} md={6}>
              <input
                type="text"
                placeholder="Search Users"
                className=" rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-600"
                value={searchTerm}
                onChange={handleSearch}
                style={{
                  /* From https://css.glass */
                  boxShadow: '0 4px 30px rgba(0, 0, 0, 0.1)',
                  backdropFilter: 'blur(12.2px)',
                  WebkitBackdropFilter: 'blur(12.2px)',
                  border: '1px solid rgba(255, 255, 255, 0.15)',
                  borderRadius:'5px',
                  width:'100%',
                  color:'black',
                  backgroundColor:'white',
                }}
                
              />
            </Grid>
          </Grid>
          {loading ? (
            <Typography className="mt-4 mb-5 p-5" variant="body1">Loading accounts...</Typography>
          ) : filteredAccounts.length > 0 ? (
            <TableContainer component={Paper} className="mt-4" style={{
              /* From https://css.glass */
              boxShadow: '0 4px 30px rgba(0, 0, 0, 0.1)',
              backdropFilter: 'blur(12.2px)',
              WebkitBackdropFilter: 'blur(12.2px)',
              border: '1px solid rgba(255, 255, 255, 0.15)',
              borderRadius:'5px',
            }}
            >
              <Table sx={{ minWidth: 650 }} aria-label="simple table" style={{ boxShadow: 'none', borderRadius: '10px' }}>
                <TableHead
                  sx={{
                    backgroundColor: 'rgb(22, 163, 74)',
                  }}
                >
                  <TableRow>
                    <TableCell sx={{ fontWeight: 'bold', color: 'white' }}>Username</TableCell>
                    <TableCell sx={{ fontWeight: 'bold', color: 'white' }}>Email</TableCell>
                    <TableCell sx={{ fontWeight: 'bold', color: 'white' }}>Phone</TableCell>
                    <TableCell sx={{ fontWeight: 'bold', color: 'white' }}>Password</TableCell>
                    <TableCell sx={{ fontWeight: 'bold', color: 'white' }}>Type</TableCell>
                    <TableCell align="right" sx={{ fontWeight: 'bold', color: 'white' }}>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {filteredAccounts.map((account) => (
                    <TableRow key={account._id}>
                      <TableCell>{account.username}</TableCell>
                      <TableCell>{account.email}</TableCell>
                      <TableCell>{account.phone}</TableCell>
                      <TableCell>{account.password}</TableCell>
                      <TableCell>{account.type}</TableCell>
                      <TableCell align="right">
                        <Tooltip title="Edit User Information">
                          <IconButton color="primary" onClick={() => handleEditModalOpen(account)}>
                            <EditIcon />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Delete User">
                          <IconButton color="error" onClick={() => handleDelete(account._id)}>
                            <DeleteIcon />
                          </IconButton>
                        </Tooltip>
                        {/* {!account.blacklisted ? (
                          <Tooltip title="Block User">
                            <IconButton color="warning" onClick={() => handleBlockConfirmation(account._id)}>
                              <BlockIcon />
                            </IconButton>
                          </Tooltip>
                        ) : (
                          <Typography variant="body2" color="error">
                            Blocked
                          </Typography>
                        )} */}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          ) : (
            <Typography variant="body1">No accounts found.</Typography>
          )}
          <Modal open={editModalOpen} onClose={handleEditModalClose}>
            <Box
              p={4}
              bgcolor="white"
              borderRadius={4}
              boxShadow={3}
              className="w-full sm:w-auto"
              sx={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                width: '90%',
                maxWidth: '500px',
                overflow: 'auto',
                maxHeight: '80vh',
              }}
            >
              <Typography variant="h6" gutterBottom>
                Edit Account
              </Typography>
              <TextField
                fullWidth
                label="Username"
                name="username"
                value={editFormData.username}
                onChange={(e) =>
                  setEditFormData({ ...editFormData, username: e.target.value })
                }
                margin="normal"
                InputLabelProps={{ style: { zIndex: 2, background: 'white', padding: '0 5px' } }}
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          '& fieldset': { borderColor: 'green' },
                          '&:hover fieldset': { borderColor: 'blue' },
                        },
                        marginBottom: '10px',
                      }}
              />
              <TextField
                fullWidth
                label="Email"
                name="email"
                value={editFormData.email}
                onChange={(e) =>
                  setEditFormData({ ...editFormData, email: e.target.value })
                }
                margin="normal"
                InputLabelProps={{ style: { zIndex: 2, background: 'white', padding: '0 5px' } }}
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          '& fieldset': { borderColor: 'green' },
                          '&:hover fieldset': { borderColor: 'blue' },
                        },
                        marginBottom: '10px',
                      }}
              />
              <TextField
                fullWidth
                label="Phone"
                name="phone"
                value={editFormData.phone}
                onChange={(e) =>
                  setEditFormData({ ...editFormData, phone: e.target.value })
                }
                margin="normal"
                InputLabelProps={{ style: { zIndex: 2, background: 'white', padding: '0 5px' } }}
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          '& fieldset': { borderColor: 'green' },
                          '&:hover fieldset': { borderColor: 'blue' },
                        },
                        marginBottom: '10px',
                      }}
              />
              <TextField
                fullWidth
                label="Password"
                name="password"
                value={editFormData.password}
                onChange={(e) =>
                  setEditFormData({ ...editFormData, password: e.target.value })
                }
                margin="normal"
                type="password"
                InputLabelProps={{ style: { zIndex: 2, background: 'white', padding: '0 5px' } }}
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          '& fieldset': { borderColor: 'green' },
                          '&:hover fieldset': { borderColor: 'blue' },
                        },
                        marginBottom: '10px',
                      }}
              />
              <TextField
                fullWidth
                label="Type"
                name="type"
                value={editFormData.type}
                onChange={(e) =>
                  setEditFormData({ ...editFormData, type: e.target.value })
                }
                margin="normal"
                InputLabelProps={{ style: { zIndex: 2, background: 'white', padding: '0 5px' } }}
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          '& fieldset': { borderColor: 'green' },
                          '&:hover fieldset': { borderColor: 'blue' },
                        },
                        marginBottom: '10px',
                      }}
              />
              <Button
                variant="contained"
                color="primary"
                onClick={handleEditSubmit}
                className="mt-4"
                style={buttonStyle}
                
              >
                Save Changes
              </Button>
            </Box>
          </Modal>
          <Modal open={confirmModalOpen} onClose={() => setConfirmModalOpen(false)}>
            <Box
              p={4}
              bgcolor="white"
              borderRadius={4}
              boxShadow={3}
              className="w-full sm:w-auto"
              sx={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                width: '90%',
                maxWidth: '400px',
                overflow: 'auto',
                maxHeight: '80vh',
              }}
            >
              <Typography variant="h6" gutterBottom>
                Confirm Block User
              </Typography>
              <Typography variant="body1" gutterBottom>
                Are you sure you want to block this user?
              </Typography>
              <Button
                variant="contained"
                color="primary"
                onClick={() => handleBlockUser(accountIdToBlock)}
                className="mt-4"
              >
                Confirm
              </Button>
            </Box>
          </Modal>
          <Modal open={successModalOpen} onClose={() => setSuccessModalOpen(false)}>
            <Box
              p={4}
              bgcolor="white"
              borderRadius={4}
              boxShadow={3}
              className="w-full sm:w-auto"
              sx={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                width: '90%',
                maxWidth: '400px',
                overflow: 'auto',
                maxHeight: '80vh',
              }}
            >
              <Typography variant="h6" className='text-center' gutterBottom>
                Success
              </Typography>
              <Typography variant="body1" className='text-center' gutterBottom>
                Operation completed successfully!
              </Typography>
              <div style={{ display: 'flex', justifyContent: 'center' }}>
  <Button
    variant="contained"
    color="primary"
    onClick={() => setSuccessModalOpen(false)}
    className="mt-4"
    style={buttonStyle}
  >
    Close
  </Button>
</div>
            </Box>
          </Modal>
        </Box>
      </Stack>
    </Box>
  );
}

export default Admin;
