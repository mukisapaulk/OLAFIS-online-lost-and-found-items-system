// import React, { useEffect, useState } from 'react';
// import {
//   Box,
//   Stack,
//   Button,
//   Modal,
//   TextField,
//   Typography,
//   Table,
//   TableBody,
//   TableCell,
//   TableContainer,
//   TableHead,
//   TableRow,
//   Paper,
//   IconButton,
//   Tooltip,
//   CircularProgress,
//   Grid,
//   Divider,
//   Fade,
//   Backdrop,
//   styled,
//   Checkbox,
//   RadioGroup,
//   Radio,
//   FormControlLabel,
//   FormControl,
//   FormLabel,
//   Select,
//   InputLabel,
//   MenuItem,
// } from '@mui/material';
// import SendIcon from '@mui/icons-material/Send';
// import AdminSidebar from './adminsidebar';
// import AdminBar from './adminbar';
// import Footer from './footer';
// import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
// import CancelIcon from '@mui/icons-material/Cancel';
// import stringSimilarity from 'string-similarity';

// // Custom styling for the verification modal
// const ModalContainer = styled(Box)(({ theme }) => ({
//   position: 'absolute',
//   top: '50%',
//   left: '50%',
//   transform: 'translate(-50%, -50%)',
//   bgcolor: '#fff', // White background
//   boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.2)', // Subtle shadow
//   p: 4,
//   borderRadius: '10px',
//   width: '80%',
//   maxWidth: '600px',
//   [theme.breakpoints.down('md')]: {
//     width: '90%',
//   },
// }));

// // Style for the tab panel content
// const TabPanel = styled(Box)(({ theme }) => ({
//   padding: theme.spacing(3),
//   marginTop: theme.spacing(2),
// }));

// // Style for the form control label
// const FormControlLabelStyled = styled(FormControlLabel)(({ theme }) => ({
//   '& .MuiFormControlLabel-label': {
//     color: theme.palette.text.primary, // Match the text color
//   },
// }));

// function Verify() {
//   const [loading, setLoading] = useState(true);
//   const [successModalOpen, setSuccessModalOpen] = useState(false);
//   const [replyModalOpen, setReplyModalOpen] = useState(false);
//   const [replyMessage, setReplyMessage] = useState('');
//   const [selectedClaim, setSelectedClaim] = useState(null);
//   const [accounts, setAccounts] = useState([]);
//   const [verificationStatus, setVerificationStatus] = useState('');

//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         const accountsResponse = await fetch('http://localhost:5000/api/replies');
//         const claimsResponse = await fetch('http://localhost:5000/claim');

//         if (accountsResponse.ok && claimsResponse.ok) {
//           const accountsData = await accountsResponse.json();
//           const claimsData = await claimsResponse.json();

//           const associatedAccounts = accountsData.map((account) => ({
//             ...account,
//             claim: claimsData.find(
//               (claim) => claim.username === account.username
//             ),
//           }));

//           setAccounts(associatedAccounts);
//           setLoading(false);
//         } else {
//           console.error(
//             'Failed to fetch data:',
//             accountsResponse.statusText || claimsResponse.statusText
//           );
//         }
//       } catch (error) {
//         console.error('Error fetching data:', error);
//       }
//     };

//     fetchData();
//   }, []);

//   const handleOpenReplyModal = (claim) => {
//     setSelectedClaim(claim);
//     setReplyModalOpen(true);
//     setVerificationStatus(
//       claim.claim && claim.claim.verified ? 'Verified' : 'Not Verified'
//     );
//     // Automatically set verification status based on similarity
//     const similarity = calculateSimilarity(
//       claim.claim.description,
//       claim.message
//     );
//     if (similarity > 51) {
//       setVerificationStatus('Verified');
//     } else {
//       setVerificationStatus('Not Verified');
//     }
//   };

//   const handleCloseReplyModal = () => {
//     setReplyModalOpen(false);
//     setReplyMessage('');
//     setSelectedClaim(null);
//     setVerificationStatus('');
//   };

//   const handleSendReply = async () => {
//     try {
//       const response = await fetch('http://localhost:5000/decision', {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify({
//           username: selectedClaim.username,
//           claimedItem: selectedClaim.claim.itemName,
//           itemDescription: selectedClaim.claim.description,
//           claimerDescription: selectedClaim.message,
//           message: replyMessage,
//           verified: verificationStatus === 'Verified',
//         }),
//       });

//       if (response.ok) {
//         setSuccessModalOpen(true);
//         handleCloseReplyModal();
//       } else {
//         console.error('Failed to send decision:', response.statusText);
//       }
//     } catch (error) {
//       console.error('Error sending decision:', error);
//     }
//   };

//   const calculateSimilarity = (str1, str2) => {
//     const similarity = stringSimilarity.compareTwoStrings(str1, str2);
//     return Math.round(similarity * 100);
//   };

//   // Function to generate feedback message based on verification status
//   const generateFeedbackMessage = () => {
//     // Check if selectedClaim and its nested properties are valid before accessing them
//     if (selectedClaim && selectedClaim.claim && selectedClaim.claim.itemName) {
//       let feedbackMessage = '';
//       if (verificationStatus === 'Verified') {
//         feedbackMessage = `The claim for item ${selectedClaim.claim.itemName} has been verified. You can reach out to the finder on tel: ${selectedClaim.claim.phone} or chat with username: ${selectedClaim.username}.`;
//       } else {
//         feedbackMessage = `The claim for item ${selectedClaim.claim.itemName} has been declined. Please reclaim the item and enter the correct description or contact the admin.`;
//       }
//       return feedbackMessage;
//     } else {
//       return ''; // Return an empty string or a placeholder message if no claim is available
//     }
//   };

//   return (
//     <Box className="bg-slate-50 min-h-screen font-san">
//       <AdminBar />
//       <Stack direction={{ xs: 'column', sm: 'row' }} className="mt-16">
//         <AdminSidebar />
//         <Box flex={1} p={4} marginLeft={30} marginRight={30}>
//           <Typography variant="h5" gutterBottom>
//             Verify Claimer's Descriptions
//           </Typography>
//           {loading ? (
//             <Box
//               sx={{
//                 display: 'flex',
//                 justifyContent: 'center',
//                 alignItems: 'center',
//                 height: '200px',
//               }}
//             >
//               <CircularProgress />
//             </Box>
//           ) : accounts.length > 0 ? (
//             <TableContainer component={Paper} className="mt-4">
//               <Table>
//                 <TableHead style={{ backgroundColor: 'rgb(22, 163, 74)' }}>
//                   <TableRow>
//                     <TableCell>
//                       <b style={{ color: 'white' }}>Claimer Name</b>
//                     </TableCell>
//                     <TableCell>
//                       <b style={{ color: 'white' }}>Claimed Item</b>
//                     </TableCell>
//                     <TableCell>
//                       <b style={{ color: 'white' }}>Claimer Description</b>
//                     </TableCell>
//                     <TableCell>
//                       <b style={{ color: 'white' }}>Item Description</b>
//                     </TableCell>
//                     <TableCell align="right"></TableCell>
//                   </TableRow>
//                 </TableHead>
//                 <TableBody>
//                   {accounts.map((account) => (
//                     <TableRow key={account._id}>
//                       <TableCell>{account.username}</TableCell>
//                       <TableCell>
//                         {account.claim ? account.claim.itemName : 'N/A'}
//                       </TableCell>
//                       <TableCell>{account.message}</TableCell>
//                       <TableCell>
//                         {account.claim ? account.claim.description : 'N/A'}
//                       </TableCell>
//                       <TableCell align="right">
//                         {account.claim ? (
//                           <Tooltip title="Send feedback to claimer">
//                             <IconButton
//                               color="primary"
//                               onClick={() => handleOpenReplyModal(account)}
//                               style={{ color: 'rgb(22, 163, 74)' }}
//                             >
//                               <SendIcon />
//                             </IconButton>
//                           </Tooltip>
//                         ) : (
//                           <Typography variant="body2">No Claim</Typography>
//                         )}
//                       </TableCell>
//                     </TableRow>
//                   ))}
//                 </TableBody>
//               </Table>
//             </TableContainer>
//           ) : (
//             <Typography variant="body1">No claims found.</Typography>
//           )}
//         </Box>
//       </Stack>

//       <Modal
//         open={successModalOpen}
//         onClose={() => setSuccessModalOpen(false)}
//         closeAfterTransition
//         BackdropComponent={Backdrop}
//         BackdropProps={{
//           timeout: 500,
//         }}
//       >
//         <Fade in={successModalOpen}>
//           <Box
//             sx={{
//               position: 'absolute',
//               top: '50%',
//               left: '50%',
//               transform: 'translate(-50%, -50%)',
//               bgcolor: 'background.paper',
//               boxShadow: 24,
//               p: 4,
//               borderRadius: 2,
//               textAlign: 'center',
//             }}
//           >
//             <Typography variant="h6" component="h2" color="success.main">
//               Feedback Sent Successfully to Claimer!
//             </Typography>
//             <Button
//               variant="contained"
//               color="primary"
//               onClick={() => setSuccessModalOpen(false)}
//               sx={{ mt: 3 }}
//               style={{
//                 backgroundColor: 'rgb(22, 163, 74)',
//                 boxShadow: 'none',
//                 borderRadius: '10px',
//               }}
//             >
//               OK
//             </Button>
//           </Box>
//         </Fade>
//       </Modal>

//       <Modal
//         open={replyModalOpen}
//         onClose={handleCloseReplyModal}
//         closeAfterTransition
//         BackdropComponent={Backdrop}
//         BackdropProps={{
//           timeout: 500,
//         }}
//       >
//         <Fade in={replyModalOpen}>
//           <ModalContainer
//             style={{
//               backgroundColor: 'white',
//               padding: '10px',
//             }}
//           >
//             <Typography
//               variant="h5"
//               component="h5"
//               gutterBottom
//               textAlign="center"
//               style={{ color: '#22a34a' }}
//             >
//               Send Feedback to Claimer
//             </Typography>

//             <Divider sx={{ my: 2 }} />

//             {selectedClaim && (
//               <Grid
//                 container
//                 spacing={2}
//                 sx={{ mb: 2 }}
//                 style={{
//                   paddingLeft: '10px',
//                 }}
//               >
//                 <Grid
//                   item
//                   xs={12}
//                   md={6}
//                   style={{
//                     paddingLeft: '10px',
//                   }}
//                 >
//                   <Typography variant="body1" gutterBottom>
//                     <strong>Claimer:</strong> {selectedClaim.username}
//                   </Typography>
//                   <Typography variant="body1" gutterBottom>
//                     <strong>Claimed Item:</strong>{' '}
//                     {selectedClaim.claim.itemName}
//                   </Typography>
//                 </Grid>
//                 <Grid
//                   item
//                   xs={12}
//                   md={6}
//                   style={{
//                     paddingLeft: '10px',
//                   }}
//                 >
//                   <Typography variant="body1" gutterBottom>
//                     <strong>Claimer Description:</strong>{' '}
//                     {selectedClaim.message}
//                   </Typography>
//                 </Grid>
//                 <Grid
//                   item
//                   xs={12}
//                   md={6}
//                   style={{
//                     paddingLeft: '10px',
//                   }}
//                 >
//                   <Typography variant="body1" gutterBottom>
//                     <strong>Item Description:</strong>{' '}
//                     {selectedClaim.claim.description}
//                   </Typography>
//                 </Grid>
//                 <Grid
//                   item
//                   xs={12}
//                   md={6}
//                   style={{
//                     paddingLeft: '10px',
//                   }}
//                 >
//                   <Typography variant="body1" gutterBottom>
//                     <strong
//                       style={{
//                         paddingLeft: '10px',
//                       }}
//                     >
//                       Verification Status:
//                     </strong>
//                     <Typography
//                       variant="body2"
//                       style={
//                         verificationStatus === 'Verified'
//                           ? {
//                               backgroundColor: 'green',
//                               color: 'white',
//                               padding: '5px 10px',
//                               borderRadius: '5px',
//                             }
//                           : {
//                               backgroundColor: 'red',
//                               color: 'white',
//                               padding: '5px 10px',
//                               borderRadius: '5px',
//                             }
//                       }
//                     >
//                       {verificationStatus}
//                     </Typography>
//                   </Typography>
//                 </Grid>
//                 <Grid style={{ paddingLeft: '10px' }}>
//                   <FormControl
//                     fullWidth
//                     margin="normal"
//                     InputLabelProps={{
//                       style: {
//                         zIndex: 2,
//                         background: 'white',
//                         padding: '0 5px',
//                         width: '500px',
//                       },
//                     }}
//                   >
//                     <InputLabel>Verification Status</InputLabel>
//                     <Select
//                       value={verificationStatus}
//                       onChange={(e) =>
//                         setVerificationStatus(e.target.value)
//                       }
//                       style={{ color: 'rgb(22, 163, 74)' }}
//                     >
//                       <MenuItem value="Verified">Verified</MenuItem>
//                       <MenuItem value="Not Verified">
//                         Not Verified
//                       </MenuItem>
//                     </Select>
//                   </FormControl>
//                 </Grid>
//                 <Grid item xs={12}>
//                   <Typography variant="body1" gutterBottom>
//                     <strong> Description Similarity:</strong>{' '}
//                     {calculateSimilarity(
//                       selectedClaim.claim.description,
//                       selectedClaim.message
//                     )}
//                     %
//                   </Typography>
//                 </Grid>
//               </Grid>
//             )}

//             <TextField
//               label="Feedback Message to Claimer"
//               multiline
//               rows={4}
//               fullWidth
//               margin="normal"
//               value={generateFeedbackMessage()} 
//               onChange={(e) => setReplyMessage(e.target.value)}
//               InputLabelProps={{
//                 style: {
//                   zIndex: 2,
//                   background: 'white',
//                   padding: '0 5px',
//                 },
//               }}
//             />

//             <Box
//               textAlign="center"
//               mt={2}
//               style={{
//                 backgroundColor: 'white',
//                 padding: '10px',
//               }}
//             >
//               <Button
//                 variant="contained"
//                 color="primary"
//                 onClick={handleSendReply}
//                 style={{
//                   backgroundColor: 'rgb(22, 163, 74)',
//                   boxShadow: 'none',
//                   borderRadius: '10px',
//                 }}
//               >
//                 Send Feedback
//               </Button>
//               <Button
//                 variant="outlined"
//                 color="secondary"
//                 onClick={handleCloseReplyModal}
//                 sx={{ ml: 2 }}
//                 style={{
//                   borderColor: 'rgb(22, 163, 74)',
//                   color: 'rgb(22, 163, 74)',
//                   borderRadius: '10px',
//                 }}
//               >
//                 Cancel
//               </Button>
//             </Box>
//           </ModalContainer>
//         </Fade>
//       </Modal>
//       <Footer />
//     </Box>
//   );
// }

// export default Verify;