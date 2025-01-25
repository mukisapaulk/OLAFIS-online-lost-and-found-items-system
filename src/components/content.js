import React, { useState } from 'react';
import {
  Box,
  Modal,
  CircularProgress,
  Button,
  Stack,
  Typography,
  TextField,
  MenuItem,
  Breadcrumbs,
  Link,
  Select,
  FormControl,
  InputLabel,
  Avatar,
} from '@mui/material';
import { NavLink, useNavigate } from 'react-router-dom';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import axios from 'axios';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined'; 
import AdminSidebar from './adminsidebar';
import AdminBar from './adminbar';

function Content() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [successModalOpen, setSuccessModalOpen] = useState(false);
  const [type, setType] = useState('user');
  const [profilePicture, setProfilePicture] = useState(null);

  const validationSchema = Yup.object().shape({
    username: Yup.string().required('Username is required'),
    password: Yup.string().required('Password is required'),
    email: Yup.string().email('Invalid email').required('Email is required'),
    phone: Yup.string().required('Phone number is required'),
  });

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setProfilePicture(file);
  };

  const handleRegister = async (values, { resetForm }) => {
    setLoading(true);
    try {
      const formDataToSend = new FormData();
      formDataToSend.append('username', values.username);
      formDataToSend.append('password', values.password);
      formDataToSend.append('email', values.email);
      formDataToSend.append('phone', values.phone);
      formDataToSend.append('profilePicture', profilePicture);
      formDataToSend.append('type', type);

      await axios.post('http://localhost:5000/api/accounts', formDataToSend);
      setSuccessModalOpen(true);
      resetForm();
      setProfilePicture(null);
      setType('user');
    } catch (error) {
      console.error('Error registering:', error);
      alert('Error registering. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setSuccessModalOpen(false);
    // navigate('/');
  };

  return (
    <Box className="bg-slate-50 min-h-screen font-san">
      <AdminBar />
      <Stack direction={{ xs: 'column', sm: 'row' }} className="mt-16">
        <AdminSidebar />
        <Box flex={1} p={4} ml={{ xs: 0, sm: 100, md: 30 }}>
          <Typography variant="h5" gutterBottom>
            User Registration
          </Typography>
          <Breadcrumbs aria-label="breadcrumb">
            <Link underline="hover" color="primary" to="/dash">
              Home
            </Link>
            <Link underline="hover" color="inherit" to="#">
              Register
            </Link>
          </Breadcrumbs>
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'center',
              minHeight: '80vh',
              fontFamily: 'Arial, sans-serif', // Consistent font
            }}
          >
            <Box
              sx={{
                maxWidth: 700,
                padding: 5,
                bgcolor: 'inherit', // Ensure white background
              }}
            >
              <Formik
                initialValues={{
                  username: '',
                  password: '',
                  email: '',
                  phone: '',
                }}
                validationSchema={validationSchema}
                onSubmit={handleRegister}
              >
                {({ setFieldValue }) => (
                  <Form>
                    <Field
                      as={TextField}
                      label="Username"
                      name="username"
                      fullWidth
                      margin="normal"
                      required
                      InputLabelProps={{
                        style: {
                          zIndex: 2,
                          background: 'white',
                          padding: '0 5px',
                        },
                      }}
                      helperText={<ErrorMessage name="username" />}
                    />
                    <Field
                      as={TextField}
                      label="Password"
                      name="password"
                      type="password"
                      fullWidth
                      margin="normal"
                      required
                      InputLabelProps={{
                        style: {
                          zIndex: 2,
                          background: 'white',
                          padding: '0 5px',
                        },
                      }}
                      helperText={<ErrorMessage name="password" />}
                    />
                    <Field
                      as={TextField}
                      label="Email"
                      name="email"
                      type="email"
                      fullWidth
                      margin="normal"
                      required
                      InputLabelProps={{
                        style: {
                          zIndex: 2,
                          background: 'white',
                          padding: '0 5px',
                        },
                      }}
                      helperText={<ErrorMessage name="email" />}
                    />
                    <Field
                      as={TextField}
                      label="Phone"
                      name="phone"
                      fullWidth
                      margin="normal"
                      required
                      InputLabelProps={{
                        style: {
                          zIndex: 2,
                          background: 'white',
                          padding: '0 5px',
                        },
                      }}
                      helperText={<ErrorMessage name="phone" />}
                    />
                    <FormControl fullWidth margin="normal">
                      <InputLabel id="type-label">Account Type</InputLabel>
                      <Select
                        labelId="type-label"
                        id="type"
                        value={type}
                        onChange={(event) => setType(event.target.value)}
                        label="Account Type"
                      >
                        <MenuItem value="admin">Admin</MenuItem>
                        <MenuItem value="user">User</MenuItem>
                      </Select>
                    </FormControl>
                    <input
                      accept="image/*"
                      id="profilePicture"
                      type="file"
                      onChange={(e) => {
                        handleFileChange(e);
                        setFieldValue('profilePicture', e.target.files[0]);
                      }}
                      style={{ display: 'none' }}
                    />
                    <label htmlFor="profilePicture">
                      <Button
                        variant="contained"
                        component="span"
                        startIcon={<CloudUploadIcon />}
                        fullWidth
                        sx={{ borderRadius: 1, textTransform: 'capitalize', padding: 2 }}
                      >
                        Upload Profile Picture
                      </Button>
                    </label>
                    {profilePicture && (
                      <Typography
                        variant="caption"
                        display="block"
                        align="center"
                        mt={1}
                        color="text.secondary"
                      >
                        Selected: {profilePicture.name}
                      </Typography>
                    )}
                    <Button
                      variant="contained"
                      color="primary"
                      type="submit"
                      disabled={loading}
                      fullWidth
                      sx={{
                        mt: 3,
                        borderRadius: 1,
                        textTransform: 'capitalize',
                        backgroundColor: 'rgb(22, 163, 74)',
                        boxShadow: 'none',
                        borderRadius: '10px',
                        padding: '5px',
                      }}
                    >
                      {loading ? (
                        <CircularProgress size={24} color="inherit" />
                      ) : (
                        'Sign Up'
                      )}
                    </Button>
                  </Form>
                )}
              </Formik>
            </Box>
          </Box>
          <Modal open={successModalOpen} onClose={handleClose}>
            <Box
              sx={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                bgcolor: 'background.paper',
                boxShadow: 24,
                p: 4,
                borderRadius: '20px',
                textAlign: 'center',
              }}
            >
              <Typography variant="h6" component="h2" align="center">
                Registered Successfully!
              </Typography>
              <Button
                variant="contained"
                color="primary"
                onClick={handleClose}
                sx={{ mt: 3 }}
                style={{
                  backgroundColor: 'rgb(22, 163, 74)',
                  boxShadow: 'none',
                  borderRadius: '5px',
                  width: '30%',
                }}
              >
                OK
              </Button>
            </Box>
          </Modal>
        </Box>
      </Stack>
    </Box>
  );
}

export default Content;
