import React, { useEffect, useState } from 'react';
import {
  Box,
  Stack,
  Button,
  Modal,
  TextField,
  Typography,
  Breadcrumbs,
  Link,
  CircularProgress,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Tooltip,
  Grid,
  Avatar,
  InputAdornment,
} from '@mui/material';
import { Search, Edit, Delete } from '@mui/icons-material';
import DownloadIcon from '@mui/icons-material/Download';
import StarIcon from '@mui/icons-material/Star';
import StarBorderIcon from '@mui/icons-material/StarBorder';
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';
import AdminSidebar from './adminsidebar';
import AdminBar from './adminbar';
import Footer from './footer';

function AdminFound() {
  const [loading, setLoading] = useState(true);
  const [foundItems, setFoundItems] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [successModalOpen, setSuccessModalOpen] = useState(false);
  const [ratingModalOpen, setRatingModalOpen] = useState(false);
  const [rating, setRating] = useState(0);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editFormData, setEditFormData] = useState({
    _id: '',
    itemName: '',
    description: '',
    contact: '',
    imagePath: '',
    finderUsername: '',
    location: '',  // Add location to editFormData
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/items');
        const data = await response.json();
        setFoundItems(data);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleSearch = async () => {
    try {
      if (searchQuery.trim() === '') {
        setSearchResults([]);
        return;
      }

      const response = await fetch('http://localhost:5000/api/search', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ searchQuery }),
      });
      const data = await response.json();
      setSearchResults(data);
    } catch (error) {
      console.error('Error searching items:', error);
    }
  };

  const handleEditModalOpen = (item) => {
    setEditFormData({
      _id: item._id,
      itemName: item.itemName,
      description: item.description,
      contact: item.contact,
      imagePath: item.imagePath,
      finderUsername: item.finderUsername,
      location: item.location,  // Set location from item
    });
    setEditModalOpen(true);
  };

  const handleEditModalClose = () => {
    setEditModalOpen(false);
  };

  const handleEditSubmit = async () => {
    try {
      const response = await fetch(
        `http://localhost:5000/api/items/${editFormData._id}`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(editFormData),
        }
      );
      if (response.ok) {
        const updatedItems = foundItems.map((item) =>
          item._id === editFormData._id ? editFormData : item
        );
        setFoundItems(updatedItems);
        setSuccessModalOpen(true);
        setEditModalOpen(false);
      } else {
        console.error('Failed to update item');
        // Handle error, e.g., display an error message to the user
      }
    } catch (error) {
      console.error('Error updating item:', error);
      // Handle error, e.g., display an error message to the user
    }
  };

  const handleDelete = async (itemId) => {
    try {
      const response = await fetch(
        `http://localhost:5000/api/items/${itemId}`,
        {
          method: 'DELETE',
        }
      );
      if (response.ok) {
        setFoundItems(foundItems.filter((item) => item._id !== itemId));
        setSuccessModalOpen(true);
      } else {
        console.error('Failed to delete item');
        // Handle error, e.g., display an error message to the user
      }
    } catch (error) {
      console.error('Error deleting item:', error);
      // Handle error, e.g., display an error message to the user
    }
  };

  const handleStarClick = (index) => {
    setRating(index + 1);
  };

  ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////// 
  
  const generatePDF = async () => {
    const doc = new jsPDF({
      orientation: 'landscape',
      unit: 'pt',
      format: 'a4',
    });
  
    const startX = 50;
    const startY = 50;
    const columnWidths = [100, 80, 150, 80, 80, 80]; // Adjusted widths
    const pageWidth = doc.internal.pageSize.width;
  
    // Function to add header
    const addHeader = () => {
      doc.setFontSize(16);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(255, 255, 255);
      doc.setFillColor(0, 102, 204); // Dark blue background
      doc.rect(startX - 5, startY - 20, pageWidth - 100, 30, 'F');
  
      const headers = ['Item Name', 'Contact', 'Description', 'Finder Username', 'Location', 'Image'];
      headers.forEach((header, index) => {
        doc.text(header, startX + columnWidths.slice(0, index).reduce((a, b) => a + b, 0), startY);
      });
    };
  
    // Add header
    addHeader();
  
    let yPos = startY + 30;
  
    const loadImage = async (url) => {
      return new Promise((resolve) => {
        const img = new Image();
        img.crossOrigin = 'Anonymous';
        img.src = url;
        img.onload = () => resolve(img);
        img.onerror = () => resolve(null);
      });
    };
  
    const addItemRow = async (item, isAlternate) => {
      doc.setFontSize(12);
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(0);
  
      if (isAlternate) {
        doc.setFillColor(240, 240, 240); // Light grey background for alternate rows
        doc.rect(startX - 5, yPos - 10, pageWidth - 100, 50, 'F'); // Increased row height
      }
  
      const itemName = item.itemName || '';
      const contact = item.contact || '';
      const description = item.description || '';
      const imagePath = item.imagePath || '';
      const finderUsername = item.finderUsername || '';
      const location = item.location || '';
  
      // Wrap description text
      const descriptionLines = doc.splitTextToSize(description, columnWidths[2]);
  
      // Display fields
      doc.text(itemName, startX, yPos);
      doc.text(contact, startX + columnWidths[0], yPos);
      descriptionLines.forEach((line, index) => {
        doc.text(line, startX + columnWidths[0] + columnWidths[1], yPos + index * 10);
      });
      doc.text(finderUsername, startX + columnWidths[0] + columnWidths[1] + columnWidths[2], yPos);
      doc.text(location, startX + columnWidths[0] + columnWidths[1] + columnWidths[2] + columnWidths[3], yPos);
  
      // Display image
      if (imagePath) {
        const img = await loadImage(imagePath);
        if (img) {
          doc.addImage(img, 'JPEG', startX + columnWidths[0] + columnWidths[1] + columnWidths[2] + columnWidths[3] + columnWidths[4], yPos - 15, 60, 40);
        } else {
          doc.text('Image not found', startX + columnWidths[0] + columnWidths[1] + columnWidths[2] + columnWidths[3] + columnWidths[4], yPos);
        }
      }
  
      yPos += 60; // Increased row height
      if (yPos > doc.internal.pageSize.height - 30) {
        doc.addPage();
        yPos = startY;
        addHeader();
      }
    };
  
    for (let i = 0; i < foundItems.length; i++) {
      await addItemRow(foundItems[i], i % 2 === 0);
    }
  
    doc.save('found_items_report.pdf');
  };
  
  
  /////////////////////////////////////////////////////////////////////////////////////////////////////////
  const buttonStyle = {
    boxShadow: 'none',
    backgroundColor: 'rgb(22, 163, 74)',
  };

  return (
    <Box sx={{ display: 'flex' }}>
      <AdminSidebar />
      <Box sx={{ flexGrow: 1 }}>
        <AdminBar />
        <Box sx={{ p: 3 }}  
         ml={{ xs: 0, sm: 100, md: 30 }}  // Adjusted margin for better layout
        >
          <Stack direction="row" justifyContent="space-between" alignItems="center"className="mt-16">
            <Typography variant="h4" component="h1" gutterBottom>
              Found Items
            </Typography>
            <Button variant="contained" color="primary" onClick={generatePDF} startIcon={<DownloadIcon />} 
            style={buttonStyle}>
              Generate Report
            </Button>
          </Stack>
          <Stack direction="row" justifyContent="flex-start" alignItems="center" spacing={2} sx={{ mb: 3 }}>
            <Breadcrumbs aria-label="breadcrumb">
              <Link color="primary" href="/">
                Home
              </Link>
              <Typography color="textPrimary">Found Items</Typography>
            </Breadcrumbs>
            <input
  variant="outlined"
  size="small"
  type="text"
  placeholder="Search for found items"
  value={searchQuery}
  onChange={(e) => {
    setSearchQuery(e.target.value);
    handleSearch(e.target.value); // Call the search function with the new value
  }}
  style={{
    /* From https://css.glass */
    boxShadow: '0 4px 30px rgba(0, 0, 0, 0.1)',
    backdropFilter: 'blur(12.2px)',
    WebkitBackdropFilter: 'blur(12.2px)',
    border: '1px solid rgba(255, 255, 255, 0.15)',
    borderRadius:'5px',
    width:'50%',
    color:'black',
    backgroundColor:'white', 
  }}
   className=" rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-600"

/>        
          </Stack>
          {loading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '60vh' }}>
              <CircularProgress />
            </Box>
          ) : (
            <TableContainer component={Paper}
            style={{
              /* From https://css.glass */
              boxShadow: '0 4px 30px rgba(0, 0, 0, 0.1)',
              backdropFilter: 'blur(12.2px)',
              WebkitBackdropFilter: 'blur(12.2px)',
              border: '1px solid rgba(255, 255, 255, 0.15)',
              borderRadius:'5px',
            }}>
              <Table>
                <TableHead
                 sx={{
                  backgroundColor: 'rgb(22, 163, 74)',
                }}>
                  <TableRow>
                    <TableCell sx={{ fontWeight: 'bold', color: 'white' }}>Item Name</TableCell>
                    <TableCell sx={{ fontWeight: 'bold', color: 'white' }}>Contact</TableCell>
                    <TableCell sx={{ fontWeight: 'bold', color: 'white' }}>Description</TableCell>
                    <TableCell sx={{ fontWeight: 'bold', color: 'white' }}>Image</TableCell>
                    <TableCell sx={{ fontWeight: 'bold', color: 'white' }}>Finder</TableCell>
                    <TableCell sx={{ fontWeight: 'bold', color: 'white' }}>Location</TableCell> {/* Add location column */}
                    <TableCell sx={{ fontWeight: 'bold', color: 'white' }}>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {searchResults.length > 0 ? (
                    searchResults.map((item) => (
                      <TableRow key={item._id}>
                        <TableCell>{item.itemName}</TableCell>
                        <TableCell>{item.contact}</TableCell>
                        <TableCell>{item.description}</TableCell>
                        <TableCell>
                          <Avatar
                            src={`http://localhost:5000/${item.imagePath}`}
                            alt={item.itemName}
                            variant="square"
                            sx={{ width: 90, height: 90, border:'none' }}
                          />
                        </TableCell>
                        <TableCell>{item.finderUsername}</TableCell>
                        <TableCell>{item.location}</TableCell> {/* Display location */}
                        <TableCell>
                          <Tooltip title="Edit">
                            <IconButton color="primary"  onClick={() => handleEditModalOpen(item)} >
                              <Edit/>
                            </IconButton >
                          </Tooltip>
                          <Tooltip title="Delete">
                            <IconButton  color="error" onClick={() => handleDelete(item._id)} >
                              <Delete/>
                            </IconButton>
                          </Tooltip>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    foundItems.map((item) => (
                      <TableRow key={item._id}>
                        <TableCell>{item.itemName}</TableCell>
                        <TableCell>{item.contact}</TableCell>
                        <TableCell>{item.description}</TableCell>
                        <TableCell component="th" scope="row">
                          {item.imagePath && (
                            <Avatar
                              variant="square"
                              border='none'
                              alt={item.itemName}
                              src={`http://localhost:5000/${item.imagePath}`}
                              sx={{ width: 90, height: 90 }}
                              style={{
                                border:'none',
                                borderRadius:'1px'
                              }}
                              
                            />
                          )}
                        </TableCell>

                        <TableCell>{item.finderUsername}</TableCell>
                        <TableCell>{item.location}</TableCell> {/* Display location */}
                        <TableCell>
                          <Tooltip title="Edit">
                            <IconButton  color="primary" onClick={() => handleEditModalOpen(item)}>
                              <Edit />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="Delete">
                            <IconButton  color="error" onClick={() => handleDelete(item._id)}>
                              <Delete />
                            </IconButton>
                          </Tooltip>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          )}

          <Modal open={editModalOpen} onClose={handleEditModalClose}>
            <Box sx={{ ...modalStyle, width: 400 }}>
              <Typography variant="h6" gutterBottom>
                Edit Found Item
              </Typography>
              <Stack spacing={2}>
                <TextField
                  label="Item Name"
                  value={editFormData.itemName}
                  onChange={(e) =>
                    setEditFormData({ ...editFormData, itemName: e.target.value })
                  }
                  fullWidth
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
                  label="Description"
                  value={editFormData.description}
                  onChange={(e) =>
                    setEditFormData({ ...editFormData, description: e.target.value })
                  }
                  fullWidth
                  multiline
                  rows={4}
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
                  label="Contact"
                  value={editFormData.contact}
                  onChange={(e) =>
                    setEditFormData({ ...editFormData, contact: e.target.value })
                  }
                  fullWidth
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
                  label="Location"
                  value={editFormData.location}
                  onChange={(e) =>
                    setEditFormData({ ...editFormData, location: e.target.value })
                  }
                  fullWidth
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
                  label="Finder Username"
                  value={editFormData.finderUsername}
                  onChange={(e) =>
                    setEditFormData({ ...editFormData, finderUsername: e.target.value })
                  }
                  fullWidth
                  InputLabelProps={{ style: { zIndex: 2, background: 'white', padding: '0 5px' } }}
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          '& fieldset': { borderColor: 'green' },
                          '&:hover fieldset': { borderColor: 'blue' },
                        },
                        marginBottom: '10px',
                      }}
                />
                <Button variant="contained" color="primary" onClick={handleEditSubmit}
                 style={buttonStyle}>
                  Save Changes
                </Button>
              </Stack>
            </Box>
          </Modal>

          <Modal open={successModalOpen} onClose={() => setSuccessModalOpen(false)}>
            <Box sx={{ ...modalStyle, width: 300 }}>
              <Typography variant="h6" gutterBottom className='text-center'>
                Success
              </Typography>
              <Typography variant="body1" className='text-center'>
                The operation was completed successfully.
              </Typography>
              <Button
                variant="contained"
                color="primary"
                onClick={() => setSuccessModalOpen(false)}
                sx={{ mt: 2, textAlign: 'center' }}
                style={{
                  backgroundColor:'rgb(22, 163, 74)',
                  boxShadow:'none',
                  alignItems:'center'
                }}
                

              >
                Close
              </Button>
            </Box>
          </Modal>

          <Modal open={ratingModalOpen} onClose={() => setRatingModalOpen(false)}>
            <Box sx={{ ...modalStyle, width: 300 }}>
              <Typography variant="h6" gutterBottom>
                Rate Us
              </Typography>
              <Box sx={{ display: 'flex', justifyContent: 'center', mb: 2 }}>
                {[0, 1, 2, 3, 4].map((index) => (
                  <IconButton
                    key={index}
                    onClick={() => handleStarClick(index)}
                    sx={{ color: index < rating ? 'gold' : 'grey' }}
                  >
                    {index < rating ? <StarIcon /> : <StarBorderIcon />}
                  </IconButton>
                ))}
              </Box>
              <Button
                variant="contained"
                color="primary"
                onClick={() => setRatingModalOpen(false)}
              >
                Submit Rating
              </Button>
            </Box>
          </Modal>
        </Box>
        <Footer />
      </Box>
    </Box>
  );
}

const modalStyle = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  bgcolor: 'background.paper',
  boxShadow: 24,
  p: 4,
  borderRadius: 1,
};

export default AdminFound;
