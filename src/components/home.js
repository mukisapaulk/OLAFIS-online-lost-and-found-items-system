import React, { useEffect, useState } from 'react';
import { Box, Stack, Button, Modal, TextField, CircularProgress, Typography, LinearProgress } from '@mui/material';
import { useFormik } from 'formik';
import * as yup from 'yup';
import axios from 'axios';
import StarIcon from '@mui/icons-material/Star';
import StarBorderIcon from '@mui/icons-material/StarBorder';
import FeedbackOutlinedIcon from '@mui/icons-material/FeedbackOutlined';
import RateReviewTwoToneIcon from '@mui/icons-material/RateReviewTwoTone';
import Sidebar from './sidebar';
import Navbar from './navbar';
import Footer from './footer';
import { useDropzone } from 'react-dropzone';
import FeedbackSystem from './FeedbackSystem';

// Validation schema
const validationSchema = yup.object({
  itemName: yup.string().required('Item name is required'),
  description: yup.string().required('Description is required'),
  contact: yup.string().required('Contact is required'),
  location: yup.string().required('Location is required'),
  image: yup.mixed().required('Image is required'),
});

function Home() {
  const [loading, setLoading] = useState(false);
  const [successModalOpen, setSuccessModalOpen] = useState(false);
  const [openModal1, setOpenModal1] = useState(false);
  const [openModal2, setOpenModal2] = useState(false);
  const [rating, setRating] = useState(0);
  const [username, setUsername] = useState('');
  const [imagePreview, setImagePreview] = useState(null);
  const [uploadProgress, setUploadProgress] = useState(0);

  useEffect(() => {
    const storedUsername = localStorage.getItem('username');
    if (storedUsername) {
      setUsername(storedUsername);
    }
  }, []);

  const formik = useFormik({
    initialValues: {
      itemName: '',
      description: '',
      contact: '',
      location: '',
      image: null,
    },
    validationSchema: validationSchema,
    onSubmit: async (values) => {
      setLoading(true);
      const formData = new FormData();
      formData.append('itemName', values.itemName);
      formData.append('description', values.description);
      formData.append('contact', values.contact);
      formData.append('location', values.location);
      formData.append('image', values.image);
      formData.append('itemType', 'found'); // dynamically set itemType
      formData.append('finderUsername', username); // dynamically set finderUsername

      try {
        const res = await axios.post('http://localhost:5000/api/items', formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
          onUploadProgress: (progressEvent) => {
            setUploadProgress((progressEvent.loaded / progressEvent.total) * 100);
          }
        });

        console.log(res.data);
        setSuccessModalOpen(true);
        formik.resetForm();
        setImagePreview(null);
        setUploadProgress(0);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    },
  });

  const handleClose = () => {
    setOpenModal2(false);
  };

  const handleStarClick = (index) => {
    setRating(index + 1);
  };

  const handleFeedback = () => {
    setOpenModal1(false);
    setSuccessModalOpen(true);
  };

  const onDrop = (acceptedFiles) => {
    if (acceptedFiles.length > 0) {
      const file = acceptedFiles[0];
      formik.setFieldValue("image", file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: 'image/*',
  });

  return (
    <div className='h-[100vh] font-sans'>
      <Navbar />
      <FeedbackSystem/>
      <div className='mt-[100px] min-h-screen'>
        <Stack direction={{ xs: 'column', sm: 'row' }} className='m-2 ' gap="10px">
          <Sidebar />
          <Box className="fixed top-0 left-2 h-full w-full p-6 overflow-y-auto mb-20">
           
            <Box sx={{
              marginTop: '40px',
              padding: '20px',
              backgroundColor: 'transparent',
            }}>
              <form onSubmit={formik.handleSubmit} className="flex flex-col gap-5 w-full  mb-20">
                <div className="flex gap-4 mt-10 flex-col md:flex-row">
                  <div className="flex flex-col gap-2 w-full md:w-1/2">
                    <Typography variant="body1" gutterBottom>
                      Upload Image
                    </Typography>
                    <div 
                      {...getRootProps()} 
                      className="border border-dashed border-gray-400 p-4 rounded-lg text-center cursor-pointer w-full relative flex-grow" 
                      style={{ position: 'relative' }}
                    >
                      <input {...getInputProps()} />
                      {imagePreview && (
                        <img 
                          src={imagePreview} 
                          alt="Preview" 
                          className="w-full h-auto rounded-lg border-gray-100 absolute top-0 left-0"
                          style={{ maxHeight: '100%', maxWidth: '100%' }}
                        />
                      )}
                      {!imagePreview && (
                        <Typography variant="body2" style={{
                          marginTop:'50px',
                          padding:'40px',
                          color:'gray',
                          fontSize:'20px',
                        }}>
                          Drag & drop an image here, or click to select one
                        </Typography>
                      )}
                      {uploadProgress > 0 && (
                        <LinearProgress variant="determinate" value={uploadProgress} className="mt-2 absolute bottom-0 left-0 w-full" />
                      )}
                    </div>
                    {formik.touched.image && formik.errors.image ? (
                      <div className="text-red-500 text-sm">{formik.errors.image}</div>
                    ) : null}
                  </div>
                  <div className="flex flex-col gap-2  mt-9 w-full md:w-1/2">
                    <TextField
                      name="itemName"
                      label="Found Item Name"
                      variant="outlined"
                      value={formik.values.itemName}
                      onChange={formik.handleChange}
                      error={formik.touched.itemName && Boolean(formik.errors.itemName)}
                      helperText={formik.touched.itemName && formik.errors.itemName}
                      required
                      multiline
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
                    <TextField
                      name="description"
                      label="Description"
                      variant="outlined"
                      value={formik.values.description}
                      onChange={formik.handleChange}
                      error={formik.touched.description && Boolean(formik.errors.description)}
                      helperText={formik.touched.description && formik.errors.description}
                      required
                      multiline
                      rows={4}
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
                    <TextField
                      name="location"
                      label="Location"
                      variant="outlined"
                      value={formik.values.location}
                      onChange={formik.handleChange}
                      error={formik.touched.location && Boolean(formik.errors.location)}
                      helperText={formik.touched.location && formik.errors.location}
                      required
                      multiline
                      rows={2}
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
                    <TextField
                      name="contact"
                      label="Contact"
                      variant="outlined"
                      value={formik.values.contact}
                      onChange={formik.handleChange}
                      error={formik.touched.contact && Boolean(formik.errors.contact)}
                      helperText={formik.touched.contact && formik.errors.contact}
                      required
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
                  </div>
                </div>
                <div className="flex justify-center mt-3 mx-20 gap-5">
                  <Button type="submit" variant="contained" color="primary" disabled={loading} 
                  style={{
                    backgroundColor:'rgb(22, 163, 74)',
                    boxShadow:'none',
                  }}>
                    {loading ? <CircularProgress size={24} /> : 'Submit'}
                  </Button>
                </div>
              </form>
            </Box>
          </Box>
        </Stack>
      </div>
      <Footer />
      <Modal open={openModal1} onClose={() => setOpenModal1(false)} aria-labelledby="modal-modal-title" aria-describedby="modal-modal-description">
        <Box sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: 400,
          bgcolor: 'background.paper',
         
          boxShadow: 24,
          p: 4,
        }}>
          <Typography id="modal-modal-title" variant="h6" component="h2">
            Feedback
          </Typography>
          <TextField
            name="feedback"
            label="Write your feedback here"
            variant="outlined"
            fullWidth
            multiline
            rows={4}
            sx={{ mt: 2 }}
          />
          <Box sx={{ mt: 2, textAlign: 'center' }}>
            <Button variant="contained" onClick={handleFeedback}
            style={{
              backgroundColor:'rgb(22, 163, 74)'
            }}>Submit</Button>
          </Box>
        </Box>
      </Modal>
      <Modal open={openModal2} onClose={() => setOpenModal2(false)} aria-labelledby="modal-modal-title" aria-describedby="modal-modal-description">
        <Box sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: 400,
          bgcolor: 'background.paper',
        
          boxShadow: 24,
          p: 4,
        }}>
          <Typography id="modal-modal-title" variant="h6" component="h2" gutterBottom>
            Rate Us
          </Typography>
          <Box sx={{ display: 'flex', justifyContent: 'center', mb: 2 }}>
            {[...Array(5)].map((star, index) => (
              <Button
                key={index}
                onClick={() => handleStarClick(index)}
                color="inherit"
              >
                {index < rating ? <StarIcon /> : <StarBorderIcon />}
              </Button>
            ))}
          </Box>
          <Box sx={{ textAlign: 'center' }}>
            <Button variant="contained" onClick={handleClose}
            style={{
              backgroundColor:'rgb(22, 163, 74)'
            }}>Submit</Button>
          </Box>
        </Box>
      </Modal>
      <Modal open={successModalOpen} onClose={() => setSuccessModalOpen(false)}>
        <Box sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: 400,
          bgcolor: 'background.paper',
          
          boxShadow: 24,
          p: 4,
        }}>
          <Typography variant="h6" component="h2" gutterBottom className='text-center'> 
            Success!
          </Typography>
          <Typography variant="body1" gutterBottom className='text-center'>
            Your item has been successfully submitted.
          </Typography>
          <Box sx={{ textAlign: 'center' }}>
            <Button variant="contained" onClick={() => setSuccessModalOpen(false)} style={{
              backgroundColor:'rgb(22, 163, 74)'
            }}>Close</Button>
          </Box>
        </Box>
      </Modal>
    </div>
  );
}

export default Home;