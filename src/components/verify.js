import React, { useEffect, useState } from 'react';
import {
  Box,
  Stack,
  Button,
  Modal,
  TextField,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  Breadcrumbs,
  Link,
  TableRow,
  Paper,
  IconButton,
  Tooltip,
  CircularProgress,
  Grid,
  Divider,
  Fade,
  Backdrop,
  styled,
  FormControl,
  FormLabel,
  Select,
  InputLabel,
  MenuItem,
} from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import AdminSidebar from './adminsidebar';
import AdminBar from './adminbar';
import Footer from './footer';
import stringSimilarity from 'string-similarity';

const ModalContainer = styled(Box)(({ theme }) => ({
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  bgcolor: '#fff',
  boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.2)',
  p: 4,
  borderRadius: '10px',
  width: '80%',
  maxWidth: '600px',
  [theme.breakpoints.down('md')]: {
    width: '90%',
  },
}));

function Verify() {
  const [loading, setLoading] = useState(true);
  const [successModalOpen, setSuccessModalOpen] = useState(false);
  const [replyModalOpen, setReplyModalOpen] = useState(false);
  const [replyMessage, setReplyMessage] = useState('');
  const [selectedClaim, setSelectedClaim] = useState(null);
  const [accounts, setAccounts] = useState([]);
  const [verificationStatus, setVerificationStatus] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const accountsResponse = await fetch('http://localhost:5000/api/replies');
        const claimsResponse = await fetch('http://localhost:5000/claim'); 

        if (accountsResponse.ok && claimsResponse.ok) {
          const accountsData = await accountsResponse.json();
          const claimsData = await claimsResponse.json();

          const associatedAccounts = accountsData.map((account) => ({
            ...account,
            claim: claimsData.find(
              (claim) => claim.username === account.username
            ),
          }));

          setAccounts(associatedAccounts);
          setLoading(false);
        } else {
          console.error(
            'Failed to fetch data:',
            accountsResponse.statusText || claimsResponse.statusText
          );
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  const handleOpenReplyModal = (claim) => {
    setSelectedClaim(claim);
    setReplyModalOpen(true);

    // Calculate similarity and set initial status
    const similarity = calculateSimilarity(
      claim.claim.description,
      claim.message
    );
    const initialStatus = similarity > 60 ? 'Verified' : 'Not Verified';

    setVerificationStatus(initialStatus);
    setReplyMessage(generateFeedbackMessage(initialStatus));
  };

  const handleCloseReplyModal = () => {
    setReplyModalOpen(false);
    setReplyMessage('');
    setSelectedClaim(null);
    setVerificationStatus('');
  };

  const handleSendReply = async () => {
    try {
      const response = await fetch('http://localhost:5000/decision', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: selectedClaim.username,
          claimedItem: selectedClaim.claim.itemName,
          itemDescription: selectedClaim.claim.description,
          claimerDescription: selectedClaim.message,
          message: replyMessage, 
          verified: verificationStatus === 'Verified',
        }),
      });

      if (response.ok) {
        // ... (update accounts state if needed - see previous examples)
        setSuccessModalOpen(true);
        handleCloseReplyModal(); 
      } else {
        console.error('Failed to send decision:', response.statusText);
      }
    } catch (error) {
      console.error('Error sending decision:', error);
    }
  };

  const calculateSimilarity = (str1, str2) => {
    const similarity = stringSimilarity.compareTwoStrings(str1, str2);
    return Math.round(similarity * 100);
  };

  const generateFeedbackMessage = (status = verificationStatus) => {
    if (selectedClaim && selectedClaim.claim && selectedClaim.claim.itemName) {
      if (status === 'Verified') {
        return `The claim for item ${selectedClaim.claim.itemName} has been verified. You can reach out to the finder on tel: ${selectedClaim.claim.contact} or chat with username: ${selectedClaim.claim.founderUsername}.`;
      } else {
        return `The claim for item ${selectedClaim.claim.itemName} has been declined. Please reclaim the item and enter the correct description or contact the admin.`;
      }
    } else {
      return ''; 
    }
  };

  const handleVerificationStatusChange = (e) => {
    setVerificationStatus(e.target.value);
    setReplyMessage(generateFeedbackMessage(e.target.value)); 
    const newStatus = e.target.value;

    // Only allow changing to "Verified" if similarity is above 60%
    if (newStatus === 'Not Verified' || calculateSimilarity(selectedClaim.claim.description, selectedClaim.message) > 60) {
      setVerificationStatus(newStatus);
      setReplyMessage(generateFeedbackMessage(newStatus));
    } else {
      // You might want to display an error message here,
      // e.g., using a snackbar or alert
      console.warn("Similarity must be greater than 60% to verify.");
    }
  };
  
  // Update replyMessage whenever selectedClaim or verificationStatus changes
  useEffect(() => {
    setReplyMessage(generateFeedbackMessage());
  }, [selectedClaim, verificationStatus]); 

  return (
    <Box className="bg-slate-50 min-h-screen font-san">
      <AdminBar />
      <Stack direction={{ xs: 'column', sm: 'row' }} className="mt-16">
        <AdminSidebar />
        <Box flex={1} p={4} marginLeft={30}  ml={{ xs: 0, sm: 100, md: 30 }}>
          <Typography variant="h5" gutterBottom>
            Verification
          </Typography>
          <Breadcrumbs aria-label="breadcrumb">
              <Link underline="hover" color="primary" to="/dash">
                Home
              </Link>
              <Link underline="hover" color="inherit" to="#">
                verification
              </Link>
            </Breadcrumbs>
          {loading ? (
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                height: '200px',
              }}
            >
 


              <CircularProgress />
            </Box>
          ) : accounts.length > 0 ? (
            <TableContainer component={Paper} className="mt-4"
            style={{
              boxShadow: '0 4px 30px rgba(0, 0, 0, 0.1)',
              backdropFilter: 'blur(12.2px)',
              WebkitBackdropFilter: 'blur(12.2px)',
              border: '1px solid rgba(255, 255, 255, 0.15)',
              borderRadius: '5px',
            }}>
              <Table>
                <TableHead style={{ backgroundColor: 'rgb(22, 163, 74)' }}>
                  <TableRow>
                    <TableCell>
                      <b style={{ color: 'white' }}>Claimer Name</b>
                    </TableCell>
                    <TableCell>
                      <b style={{ color: 'white' }}>Claimed Item</b>
                    </TableCell>
                    <TableCell>
                      <b style={{ color: 'white' }}>Claimer Description</b>
                    </TableCell>
                    <TableCell>
                      <b style={{ color: 'white' }}>Item Description</b>
                    </TableCell>
                    <TableCell align="right"></TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {accounts.map((account) => (
                    <TableRow key={account._id}>
                      <TableCell>{account.username}</TableCell>
                      <TableCell>
                        {account.claim ? account.claim.itemName : 'N/A'}
                      </TableCell>
                      <TableCell>{account.message}</TableCell>
                      <TableCell>
                        {account.claim ? account.claim.description : 'N/A'}
                      </TableCell>
                      <TableCell align="right">
                        {account.claim ? (
                          <Tooltip title="Send feedback to claimer">
                            <IconButton
                              color="primary"
                              onClick={() => handleOpenReplyModal(account)}
                              style={{ color: 'rgb(22, 163, 74)' }}
                            >
                              <SendIcon />
                            </IconButton>
                          </Tooltip>
                        ) : (
                          <Typography variant="body2">No Claim</Typography>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          ) : (
            <Typography variant="body1">No claims found.</Typography>
          )}
        </Box>
      </Stack>

      {/* Success Modal */}
      <Modal
        open={successModalOpen}
        onClose={() => setSuccessModalOpen(false)}
        closeAfterTransition
        BackdropComponent={Backdrop}
        BackdropProps={{
          timeout: 500,
        }}
      >
        <Fade in={successModalOpen}>
          <Box
            sx={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              bgcolor: 'background.paper',
              boxShadow: 24,
              p: 4,
              borderRadius: 2,
              textAlign: 'center',
            }}
          >
            <Typography variant="h6" component="h2" color="success.main">
              Feedback Sent Successfully to Claimer!
            </Typography>
            <Button
              variant="contained"
              color="primary"
              onClick={() => setSuccessModalOpen(false)}
              sx={{ mt: 3 }}
              style={{
                backgroundColor: 'rgb(22, 163, 74)',
                boxShadow: 'none',
                borderRadius: '10px',
              }}
            >
              OK
            </Button>
          </Box>
        </Fade>
      </Modal>
 {/* Reply Modal */}
 <Modal
      open={replyModalOpen}
      onClose={handleCloseReplyModal}
      closeAfterTransition
      BackdropComponent={Backdrop}
      BackdropProps={{
        timeout: 500,
      }}
    >
      <Fade in={replyModalOpen}>
        <ModalContainer style={{ backgroundColor: 'white', padding: '10px' }}>
          <Typography
            variant="h5"
            component="h5"
            gutterBottom
            textAlign="center"
            style={{ color: '#22a34a' }}
          >
            Send Feedback to Claimer
          </Typography>
          <Divider sx={{ my: 2 }} />

          {selectedClaim && ( 
            <Grid container spacing={2} sx={{ mb: 2 }}>
              {/* Claimer Name */}
              <Grid item xs={12} md={6}>
                <Typography variant="body1" gutterBottom>
                  <strong>Claimer:</strong> {selectedClaim.username}
                </Typography>
              </Grid>

              {/* Claimed Item */}
              <Grid item xs={12} md={6}>
                <Typography variant="body1" gutterBottom>
                  <strong>Claimed Item:</strong>{' '}
                  {selectedClaim.claim.itemName}
                </Typography>
              </Grid>

              {/* Item Description */}
              <Grid item xs={12} md={6}>
                <Typography variant="body1" gutterBottom>
                  <strong>Item Description:</strong>{' '}
                  {selectedClaim.claim.description}
                </Typography>
              </Grid>

              {/* Claimer Description */}
              <Grid item xs={12} md={6}>
                <Typography variant="body1" gutterBottom>
                  <strong>Claimer Description:</strong>{' '}
                  {selectedClaim.message}
                </Typography>
              </Grid>

              {/* Description Similarity */}
              <Grid item xs={12} md={6}>
                <Typography variant="body1" gutterBottom>
                  <strong>Description Similarity:</strong>{' '}
                  {calculateSimilarity(
                    selectedClaim.claim.description,
                    selectedClaim.message
                  )}
                  %
                </Typography>
              </Grid>
              <Grid item xs={12} md={6}>
              <Typography variant="body1" gutterBottom>
                    <strong
                      style={{
                        paddingLeft: '10px',
                      }}
                    >
                      Verification Status:
                    </strong>
                    <Typography
                      variant="body2"
                      style={
                        verificationStatus === 'Verified'
                          ? {
                              backgroundColor: 'green',
                              color: 'white',
                              padding: '5px 10px',
                              borderRadius: '5px',
                            }
                          : {
                              backgroundColor: 'red',
                              color: 'white',
                              padding: '5px 10px',
                              borderRadius: '5px',
                            }
                      }
                    >
                      {verificationStatus}
                    </Typography>
                  </Typography>


              </Grid>

              {/* Verification Status */}
              <Grid item xs={12} md={6}>
                <FormControl fullWidth margin="normal">
                  <InputLabel>Verification Status</InputLabel>
                  <Select
                    value={verificationStatus}
                    onChange={handleVerificationStatusChange}
                    style={{ color: 'rgb(22, 163, 74)' }}
                  >
                    <MenuItem value="Verified">Verified</MenuItem>
                    <MenuItem value="Not Verified">
                      Declined
                    </MenuItem>
                  </Select>
                </FormControl>
              </Grid>
            </Grid>
          )}
                  

            {/* Feedback Message Text Field */}
          <TextField
            label="Feedback Message to Claimer"
            multiline
            rows={4}
            fullWidth
            margin="normal"
            value={replyMessage} // Display automatically generated message
            onChange={(e) => setReplyMessage(e.target.value)}
            InputLabelProps={{
              style: {
                zIndex: 2,
                background: 'white',
                padding: '0 5px',
              },
            }}
          />

            <Box
              textAlign="center"
              mt={2}
              style={{
                backgroundColor: 'white',
                padding: '10px',
              }}
            >
              <Button
                variant="contained"
                color="primary"
                onClick={handleSendReply}
                style={{
                  backgroundColor: 'rgb(22, 163, 74)',
                  boxShadow: 'none',
                  borderRadius: '10px',
                }}
              >
                Send Feedback
              </Button>
              <Button
                variant="outlined"
                color="secondary"
                onClick={handleCloseReplyModal}
                sx={{ ml: 2 }}
                style={{
                  borderColor: 'rgb(22, 163, 74)',
                  color: 'rgb(22, 163, 74)',
                  borderRadius: '10px',
                }}
              >
                Cancel
              </Button>
            </Box>
          </ModalContainer>
        </Fade>
      </Modal>
      <Footer />
    </Box>
  );
}

export default Verify;


