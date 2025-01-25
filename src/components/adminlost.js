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
  Tooltip,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Avatar,
} from '@mui/material';
import { Search, Edit, Delete } from '@mui/icons-material';
import StarIcon from '@mui/icons-material/Star';
import StarBorderIcon from '@mui/icons-material/StarBorder';
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';
import AdminSidebar from './adminsidebar';
import DownloadIcon from '@mui/icons-material/Download';
import AdminBar from './adminbar';
import Footer from './footer';
import { Link as RouterLink } from 'react-router-dom';
import VisibilityIcon from '@mui/icons-material/Visibility';

function AdminLost() {
  const [loading, setLoading] = useState(true);
  const [lostItems, setLostItems] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [successModalOpen, setSuccessModalOpen] = useState(false);
  const [rewardModalOpen, setRewardModalOpen] = useState(false);
  const [selectedReward, setSelectedReward] = useState('');
  const [ratingModalOpen, setRatingModalOpen] = useState(false);
  const [rating, setRating] = useState(0);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editFormData, setEditFormData] = useState({
    _id: '',
    itemName: '',
    description: '',
    reward: '',
    location: '',
    username: '',
    imagePath: '',
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/Lost');
        const data = await response.json();
        setLostItems(data);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    const debounceTimeout = setTimeout(() => {
      handleSearch();
    }, 500);

    return () => clearTimeout(debounceTimeout);
  }, [searchQuery]);

  const handleSearch = async () => {
    try {
      if (searchQuery.trim() === '') {
        setSearchResults([]);
        return;
      }

      const response = await fetch('http://localhost:5000/api/searchlost', {
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
      reward: item.reward,
      location: item.location,
      username: item.username,
      imagePath: item.imagePath,
    });
    setEditModalOpen(true);
  };

  const handleEditModalClose = () => {
    setEditModalOpen(false);
  };

  const handleEditSubmit = async () => {
    try {
      const response = await fetch(
        `http://localhost:5000/api/Lost/${editFormData._id}`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(editFormData),
        }
      );
      if (response.ok) {
        const updatedItems = lostItems.map((item) =>
          item._id === editFormData._id ? editFormData : item
        );
        setLostItems(updatedItems);
        setSuccessModalOpen(true);
        setEditModalOpen(false);
      } else {
        console.error('Failed to update item');
      }
    } catch (error) {
      console.error('Error updating item:', error);
    }
  };

  const handleDelete = async (itemId) => {
    try {
      const response = await fetch(`http://localhost:5000/api/Lost/${itemId}`, {
        method: 'DELETE',
      });
      if (response.ok) {
        setLostItems(lostItems.filter((item) => item._id !== itemId));
        setSuccessModalOpen(true);
      } else {
        console.error('Failed to delete item');
      }
    } catch (error) {
      console.error('Error deleting item:', error);
    }
  };

  const handleStarClick = (index) => {
    setRating(index + 1);
  };

  const handleRewardButtonClick = (reward) => {
    setSelectedReward(reward);
    setRewardModalOpen(true);
  };

  const generatePDF = async () => {
    const doc = new jsPDF({
      orientation: 'landscape',
      unit: 'pt',
      format: 'a4',
    });

    const brandColor = '#007bff';
    const brandFont = 'helvetica';

    doc.setFontSize(12);
    doc.setTextColor(0);

    doc.setFontSize(24);
    doc.setTextColor(brandColor);
    doc.setFont(brandFont, 'bold');
    doc.text('Lost Items Report', 300, 50, { align: 'center' });
    doc.setFontSize(12);

    doc.setFont(brandFont, 'bold');
    doc.text('Item Name', 100, 80);
    doc.text('Description', 250, 80);
    doc.text('Location', 400, 80);
    doc.text('Loser Username', 550, 80);

    doc.setLineWidth(1);
    doc.line(50, 90, 700, 90);

    let yPos = 100;

    for (const item of lostItems) {
      if (yPos > 750) {
        doc.addPage();
        yPos = 100;
        doc.setFont(brandFont, 'bold');
        doc.text('Item Name', 100, 80);
        doc.text('Description', 250, 80);
        doc.text('Location', 400, 80);
        doc.text('Loser Username', 550, 80);
        doc.setLineWidth(1);
        doc.line(50, 90, 700, 90);
        yPos = 100;
      }

      doc.setFont(brandFont, 'normal');

      doc.setLineWidth(0.5);
      doc.rect(50, yPos, 630, 60, 'S');

      doc.text((item.itemName || '').toString(), 100, yPos + 20);
      doc.text((item.description || '').toString(), 250, yPos + 20, { maxWidth: 120 });
      doc.text((item.location || '').toString(), 400, yPos + 20);
      doc.text((item.loserUsername || '').toString(), 550, yPos + 20);

      yPos += 70;
    }

    const pageCount = doc.internal.getNumberOfPages();
    for (let i = 1; i <= pageCount; i++) {
      doc.setPage(i);
      doc.setFont(brandFont, 'normal');
      doc.setFontSize(10);
      doc.setTextColor(brandColor);
      doc.text(`Page ${i} of ${pageCount}`, 550, 800, { align: 'right' });
      doc.text('© online lost and found items system', 50, 800);
    }

    doc.save('lost_items_report.pdf');
  };



  const buttonStyle = {
    boxShadow: 'none',
    backgroundColor: 'rgb(22, 163, 74)',
  };

  return (
    <Box className="bg-slate-50 min-h-screen font-san">
      <AdminBar />
      <Stack direction={{ xs: 'column', sm: 'row' }} className="mt-16">
        <AdminSidebar />
        <Box flex={1} p={4} 
         ml={{ xs: 0, sm: 100, md: 30 }}  // Adjusted margin for better layout
        
        >
           <Typography variant="h4" component="h1" gutterBottom>
              Lost Items
            </Typography>
          <Stack
            direction="row"
            justifyContent="space-between"
            alignItems="center"
            mb={4}
          >
           
            <Breadcrumbs aria-label="breadcrumb">
              <Link underline="hover" color="primary" to="/dash">
                Home
              </Link>
              <Link underline="hover" color="inherit" to="#">
                Lost Items
              </Link>
            </Breadcrumbs>
            <input
              className="outline-none p-1 bg-white"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search  For Lost items"
              style={{
                boxShadow: '0 4px 30px rgba(0, 0, 0, 0.1)',
                backdropFilter: 'blur(12.2px)',
                WebkitBackdropFilter: 'blur(12.2px)',
                border: '1px solid rgba(255, 255, 255, 0.15)',
                borderRadius: '10px',
                padding: '10px',
                color: 'black',
                backgroundColor: 'white',
              }}
            />
            <Button
              variant="contained"
              color="primary"
              onClick={generatePDF}
              sx={{ display: 'flex', alignItems: 'center' }}
              style={buttonStyle}
            >
              <DownloadIcon sx={{ mr: 1 }} />
              Download PDF
            </Button>
          </Stack>
          {loading ? (
            <CircularProgress />
          ) : (
            <TableContainer component={Paper}
            
            style={{
              /* From https://css.glass */
              boxShadow: '0 4px 30px rgba(0, 0, 0, 0.1)',
              backdropFilter: 'blur(12.2px)',
              WebkitBackdropFilter: 'blur(12.2px)',
              border: '1px solid rgba(255, 255, 255, 0.15)',
              borderRadius:'5px',
            }}
            >
              <Table>
                <TableHead
                 sx={{
                  backgroundColor: 'rgb(22, 163, 74)',
                }}
                >
                  <TableRow>
                    <TableCell sx={{ fontWeight: 'bold', color: 'white' }}>Item Name</TableCell>
                    <TableCell sx={{ fontWeight: 'bold', color: 'white' }}>Description</TableCell>
                    <TableCell sx={{ fontWeight: 'bold', color: 'white' }}>Location</TableCell>
                    <TableCell sx={{ fontWeight: 'bold', color: 'white' }}>Loser</TableCell>
                    <TableCell sx={{ fontWeight: 'bold', color: 'white' }}>Image</TableCell>
                    <TableCell sx={{ fontWeight: 'bold', color: 'white' }}>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {(searchResults.length > 0 ? searchResults : lostItems).map(
                    (item) => (
                      <TableRow key={item._id}>
                        <TableCell>{item.itemName}</TableCell>
                        <TableCell>{item.description}</TableCell>
                        <TableCell>{item.location}</TableCell>
                        <TableCell>{item.username}</TableCell>
                        <TableCell>
                          <Avatar src={`http://localhost:5000/${item.imagePath}`} alt={item.itemName}
                          
                          sx={{ width: 90, height: 90 }}
                          style={{
                            border:'none',
                            borderRadius:'1px'
                          }}
                          
                          />
                        </TableCell>
                        <TableCell>
                        <Tooltip title="view reward">
                        <IconButton
                            color="secondary"
                            onClick={() => handleRewardButtonClick(item.reward)}
                          >
                            <VisibilityIcon />
                          </IconButton>
                          </Tooltip>

                          <Tooltip title="Edit">
                          <IconButton
                            color="primary"
                            onClick={() => handleEditModalOpen(item)}
                          >
                            <Edit />
                          </IconButton>
                          </Tooltip>

                          <Tooltip title="Delete lost item">
                          <IconButton
                            color="error"
                            onClick={() => handleDelete(item._id)}
                          >
                            <Delete />
                          </IconButton>
                          </Tooltip>
                          
                        </TableCell>
                      </TableRow>
                    )
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          )}

          <Modal
            open={editModalOpen}
            onClose={handleEditModalClose}
            aria-labelledby="edit-modal-title"
            aria-describedby="edit-modal-description"
          >
            <Box
              sx={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                bgcolor: 'background.paper',
                boxShadow: 24,
                p: 4,
                borderRadius: '10px',
                maxWidth: '500px',
                width: '90%',
              }}
            >
              <Typography
                variant="h6"
                id="edit-modal-title"
                sx={{ mb: 2 }}
              >
                Edit Lost Item
              </Typography>
              <TextField
                label="Item Name"
                variant="outlined"
                fullWidth
                sx={{ mb: 2 }}
                value={editFormData.itemName}
                onChange={(e) =>
                  setEditFormData({ ...editFormData, itemName: e.target.value })
                }
                InputLabelProps={{ style: { zIndex: 2, background: 'white', padding: '0 5px' } }}
                     
              />
              <TextField
                label="Description"
                variant="outlined"
                fullWidth
                multiline
                rows={4}
                sx={{ mb: 2 }}
                value={editFormData.description}
                onChange={(e) =>
                  setEditFormData({
                    ...editFormData,
                    description: e.target.value,
                  })
                }
                InputLabelProps={{ style: { zIndex: 2, background: 'white', padding: '0 5px' } }}
                     
              />
              <TextField
                label="Reward"
                variant="outlined"
                fullWidth
                sx={{ mb: 2 }}
                value={editFormData.reward}
                onChange={(e) =>
                  setEditFormData({ ...editFormData, reward: e.target.value })
                }
                InputLabelProps={{ style: { zIndex: 2, background: 'white', padding: '0 5px' } }}
                     
              />
              <TextField
                label="Location"
                variant="outlined"
                fullWidth
                sx={{ mb: 2 }}
                value={editFormData.location}
                onChange={(e) =>
                  setEditFormData({ ...editFormData, location: e.target.value })
                }
                InputLabelProps={{ style: { zIndex: 2, background: 'white', padding: '0 5px' } }}
                    
              />
              <TextField
                label="Loser Username"
                variant="outlined"
                fullWidth
                sx={{ mb: 2 }}
                value={editFormData.loserUsername}
                onChange={(e) =>
                  setEditFormData({
                    ...editFormData,
                    loserUsername: e.target.value,
                  })
                }
                InputLabelProps={{ style: { zIndex: 2, background: 'white', padding: '0 5px' } }}
                     
              />
              <Stack
                direction="row"
                spacing={2}
                justifyContent="flex-end"
                mt={2}
              >
                <Button
                  variant="contained"
                  color="primary"
                  onClick={handleEditSubmit}
                  style={buttonStyle}>

                  Save
                </Button>
                <Button
                  variant="outlined"
                  color="error"
                  onClick={handleEditModalClose}
                  
                >
                  Cancel
                </Button>
              </Stack>
            </Box>
          </Modal>

          <Modal
            open={successModalOpen}
            onClose={() => setSuccessModalOpen(false)}
            aria-labelledby="success-modal-title"
            aria-describedby="success-modal-description"
          >
            <Box
              sx={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                bgcolor: 'background.paper',
                boxShadow: 24,
                p: 4,
                borderRadius: '10px',
                maxWidth: '400px',
                width: '90%',
              }}
            >
              <Typography
                variant="h6"
                id="success-modal-title"
                sx={{ mb: 2 }}
                className='text-center'
              >
                Success!
              </Typography>
              <Typography
                variant="body1"
                id="success-modal-description"
                sx={{ mb: 2 }}
                className='text-center'
              >
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

          <Modal
            open={rewardModalOpen}
            onClose={() => setRewardModalOpen(false)}
            aria-labelledby="reward-modal-title"
            aria-describedby="reward-modal-description"
          >
            <Box
              sx={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                bgcolor: 'background.paper',
                boxShadow: 24,
                p: 4,
                borderRadius: '10px',
                maxWidth: '400px',
                width: '90%',
              }}
            >
              <Typography
                variant="h6"
                id="reward-modal-title"
                sx={{ mb: 2 }}
              >
                Reward
              </Typography>
              <Typography
                variant="body1"
                id="reward-modal-description"
                sx={{ mb: 2 }}
              >
                {selectedReward || 'No reward specified.'}
              </Typography>
              <Button
                variant="contained"
                color="primary"
                onClick={() => setRewardModalOpen(false)}
              >
                Close
              </Button>
            </Box>
          </Modal>

          <Modal
            open={ratingModalOpen}
            onClose={() => setRatingModalOpen(false)}
            aria-labelledby="rating-modal-title"
            aria-describedby="rating-modal-description"
          >
            <Box
              sx={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                bgcolor: 'background.paper',
                boxShadow: 24,
                p: 4,
                borderRadius: '10px',
                maxWidth: '400px',
                width: '90%',
              }}
            >
              <Typography
                variant="h6"
                id="rating-modal-title"
                sx={{ mb: 2 }}
              >
                Rate Us
              </Typography>
              <Box sx={{ display: 'flex', justifyContent: 'center', mb: 2 }}>
                {[...Array(5)].map((_, index) => (
                  <IconButton
                    key={index}
                    onClick={() => handleStarClick(index)}
                  >
                    {index < rating ? (
                      <StarIcon color="primary" />
                    ) : (
                      <StarBorderIcon />
                    )}
                  </IconButton>
                ))}
              </Box>
              <Stack
                direction="row"
                spacing={2}
                justifyContent="flex-end"
                mt={2}
              >
                <Button
                  variant="contained"
                  color="primary"
                  onClick={() => setRatingModalOpen(false)}
                >
                  Submit
                </Button>
                <Button
                  variant="outlined"
                  color="secondary"
                  onClick={() => setRatingModalOpen(false)}
                >
                  Cancel
                </Button>
              </Stack>
            </Box>
          </Modal>
        </Box>
      </Stack>
      <Footer />
    </Box>
  );
}

export default AdminLost;
