// // // import React, { useEffect, useState } from 'react';
// // // import {
// // //   Box,
// // //   Stack,
// // //   Button,
// // //   Modal,
// // //   TextField,
// // //   Typography,
// // //   Table,
// // //   TableBody,
// // //   TableCell,
// // //   TableContainer,
// // //   TableHead,
// // //   TableRow,
// // //   Paper,
// // //   IconButton,
// // //   Tooltip,
// // //   CircularProgress,
// // //   Grid,
// // //   Divider,
// // //   Fade,
// // //   Backdrop,
// // //   styled,
// // //   Checkbox,
// // //   RadioGroup,
// // //   Radio,
// // //   FormControlLabel,
// // //   FormControl,
// // //   FormLabel,
// // //   Select,
// // //   InputLabel,
// // //   MenuItem,
// // // } from '@mui/material';
// // // import SendIcon from '@mui/icons-material/Send';
// // // import AdminSidebar from './adminsidebar';
// // // import AdminBar from './adminbar';
// // // import Footer from './footer';
// // // import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
// // // import CancelIcon from '@mui/icons-material/Cancel';
// // // import stringSimilarity from 'string-similarity';

// // // // Custom styling for the verification modal
// // // const ModalContainer = styled(Box)(({ theme }) => ({
// // //   position: 'absolute',
// // //   top: '50%',
// // //   left: '50%',
// // //   transform: 'translate(-50%, -50%)',
// // //   bgcolor: '#fff', // White background
// // //   boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.2)', // Subtle shadow
// // //   p: 4,
// // //   borderRadius: '10px',
// // //   width: '80%',
// // //   maxWidth: '600px',
// // //   [theme.breakpoints.down('md')]: {
// // //     width: '90%',
// // //   },
// // // }));

// // // // Style for the tab panel content
// // // const TabPanel = styled(Box)(({ theme }) => ({
// // //   padding: theme.spacing(3),
// // //   marginTop: theme.spacing(2),
// // // }));

// // // // Style for the form control label
// // // const FormControlLabelStyled = styled(FormControlLabel)(({ theme }) => ({
// // //   '& .MuiFormControlLabel-label': {
// // //     color: theme.palette.text.primary, // Match the text color
// // //   },
// // // }));

// // // function Verify() {
// // //   const [loading, setLoading] = useState(true);
// // //   const [successModalOpen, setSuccessModalOpen] = useState(false);
// // //   const [replyModalOpen, setReplyModalOpen] = useState(false);
// // //   const [replyMessage, setReplyMessage] = useState('');
// // //   const [selectedClaim, setSelectedClaim] = useState(null);
// // //   const [accounts, setAccounts] = useState([]);
// // //   const [verificationStatus, setVerificationStatus] = useState('');

// // //   useEffect(() => {
// // //     const fetchData = async () => {
// // //       try {
// // //         const accountsResponse = await fetch('http://localhost:5000/api/replies');
// // //         const claimsResponse = await fetch('http://localhost:5000/claim');

// // //         if (accountsResponse.ok && claimsResponse.ok) {
// // //           const accountsData = await accountsResponse.json();
// // //           const claimsData = await claimsResponse.json();

// // //           const associatedAccounts = accountsData.map((account) => ({
// // //             ...account,
// // //             claim: claimsData.find(
// // //               (claim) => claim.username === account.username
// // //             ),
// // //           }));

// // //           setAccounts(associatedAccounts);
// // //           setLoading(false);
// // //         } else {
// // //           console.error(
// // //             'Failed to fetch data:',
// // //             accountsResponse.statusText || claimsResponse.statusText
// // //           );
// // //         }
// // //       } catch (error) {
// // //         console.error('Error fetching data:', error);
// // //       }
// // //     };

// // //     fetchData();
// // //   }, []);

// // //   const handleOpenReplyModal = (claim) => {
// // //     setSelectedClaim(claim);
// // //     setReplyModalOpen(true);
// // //     // Automatically set verification status based on similarity
// // //     const similarity = calculateSimilarity(
// // //       claim.claim.description,
// // //       claim.message
// // //     );
// // //     if (similarity > 60) {
// // //       setVerificationStatus('Verified');
// // //     } else {
// // //       setVerificationStatus('Not Verified');
// // //     }
// // //     // Set the feedback message based on initial verification status
// // //     setReplyMessage(generateFeedbackMessage(claim, similarity));
// // //   };

// // //   const handleCloseReplyModal = () => {
// // //     setReplyModalOpen(false);
// // //     setReplyMessage('');
// // //     setSelectedClaim(null);
// // //     setVerificationStatus('');
// // //   };

// // //   const handleSendReply = async () => {
// // //     try {
// // //       const response = await fetch('http://localhost:5000/decision', {
// // //         method: 'POST',
// // //         headers: {
// // //           'Content-Type': 'application/json',
// // //         },
// // //         body: JSON.stringify({
// // //           username: selectedClaim.username,
// // //           claimedItem: selectedClaim.claim.itemName,
// // //           itemDescription: selectedClaim.claim.description,
// // //           claimerDescription: selectedClaim.message,
// // //           message: replyMessage,
// // //           verified: verificationStatus === 'Verified',
// // //         }),
// // //       });

// // //       if (response.ok) {
// // //         setSuccessModalOpen(true);
// // //         handleCloseReplyModal();
// // //       } else {
// // //         console.error('Failed to send decision:', response.statusText);
// // //       }
// // //     } catch (error) {
// // //       console.error('Error sending decision:', error);
// // //     }
// // //   };

// // //   const calculateSimilarity = (str1, str2) => {
// // //     const similarity = stringSimilarity.compareTwoStrings(str1, str2);
// // //     return Math.round(similarity * 100);
// // //   };

// // //   // Function to generate feedback message based on verification status
// // //   const generateFeedbackMessage = (claim, similarity) => {
// // //     if (claim && claim.claim && claim.claim.itemName) {
// // //       let feedbackMessage = '';
// // //       if (verificationStatus === 'Verified') {
// // //         feedbackMessage = `The claim for item ${claim.claim.itemName} has been verified. You can reach out to the finder on tel: ${claim.claim.contact} or chat with username: ${claim.claim.founderUsername}.`;
// // //       } else {
// // //         feedbackMessage = `The claim for item ${claim.claim.itemName} has been declined. Please reclaim the item and enter the correct description or contact the admin.`;
// // //       }
// // //       return feedbackMessage;
// // //     } else {
// // //       return '';
// // //     }
// // //   };

// // //   return (
// // //     <Box className="bg-slate-50 min-h-screen font-san">
// // //       <AdminBar />
// // //       <Stack direction={{ xs: 'column', sm: 'row' }} className="mt-16">
// // //         <AdminSidebar />
// // //         <Box flex={1} p={4} marginLeft={30} marginRight={30}>
// // //           <Typography variant="h5" gutterBottom>
// // //             Verification
// // //           </Typography>
// // //           {loading ? (
// // //             <Box
// // //               sx={{
// // //                 display: 'flex',
// // //                 justifyContent: 'center',
// // //                 alignItems: 'center',
// // //                 height: '200px',
// // //               }}
// // //             >
// // //               <CircularProgress />
// // //             </Box>
// // //           ) : accounts.length > 0 ? (
// // //             <TableContainer component={Paper} className="mt-4">
// // //               <Table>
// // //                 <TableHead style={{ backgroundColor: 'rgb(22, 163, 74)' }}>
// // //                   <TableRow>
// // //                     <TableCell>
// // //                       <b style={{ color: 'white' }}>Claimer Name</b>
// // //                     </TableCell>
// // //                     <TableCell>
// // //                       <b style={{ color: 'white' }}>Claimed Item</b>
// // //                     </TableCell>
// // //                     <TableCell>
// // //                       <b style={{ color: 'white' }}>Claimer Description</b>
// // //                     </TableCell>
// // //                     <TableCell>
// // //                       <b style={{ color: 'white' }}>Item Description</b>
// // //                     </TableCell>
// // //                     <TableCell align="right"></TableCell>
// // //                   </TableRow>
// // //                 </TableHead>
// // //                 <TableBody>
// // //                   {accounts.map((account) => (
// // //                     <TableRow key={account._id}>
// // //                       <TableCell>{account.username}</TableCell>
// // //                       <TableCell>
// // //                         {account.claim ? account.claim.itemName : 'N/A'}
// // //                       </TableCell>
// // //                       <TableCell>{account.message}</TableCell>
// // //                       <TableCell>
// // //                         {account.claim ? account.claim.description : 'N/A'}
// // //                       </TableCell>
// // //                       <TableCell align="right">
// // //                         {account.claim ? (
// // //                           <Tooltip title="Send feedback to claimer">
// // //                             <IconButton
// // //                               color="primary"
// // //                               onClick={() => handleOpenReplyModal(account)}
// // //                               style={{ color: 'rgb(22, 163, 74)' }}
// // //                             >
// // //                               <SendIcon />
// // //                             </IconButton>
// // //                           </Tooltip>
// // //                         ) : (
// // //                           <Typography variant="body2">No Claim</Typography>
// // //                         )}
// // //                       </TableCell>
// // //                     </TableRow>
// // //                   ))}
// // //                 </TableBody>
// // //               </Table>
// // //             </TableContainer>
// // //           ) : (
// // //             <Typography variant="body1">No claims found.</Typography>
// // //           )}
// // //         </Box>
// // //       </Stack>

// // //       <Modal
// // //         open={successModalOpen}
// // //         onClose={() => setSuccessModalOpen(false)}
// // //         closeAfterTransition
// // //         BackdropComponent={Backdrop}
// // //         BackdropProps={{
// // //           timeout: 500,
// // //         }}
// // //       >
// // //         <Fade in={successModalOpen}>
// // //           <Box
// // //             sx={{
// // //               position: 'absolute',
// // //               top: '50%',
// // //               left: '50%',
// // //               transform: 'translate(-50%, -50%)',
// // //               bgcolor: 'background.paper',
// // //               boxShadow: 24,
// // //               p: 4,
// // //               borderRadius: 2,
// // //               textAlign: 'center',
// // //             }}
// // //           >
// // //             <Typography variant="h6" component="h2" sx={{
// // //               color:'black',
// // //             }}>
// // //               Feedback Sent Successfully to Claimer!
// // //             </Typography>
// // //             <Button
// // //               variant="contained"
// // //               color="primary"
// // //               onClick={() => setSuccessModalOpen(false)}
// // //               sx={{ mt: 3 }}
// // //               style={{
// // //                 backgroundColor: 'rgb(22, 163, 74)',
// // //                 boxShadow: 'none',
// // //                 borderRadius: '10px',
// // //               }}
// // //             >
// // //               OK
// // //             </Button>
// // //           </Box>
// // //         </Fade>
// // //       </Modal>

// // //       <Modal
// // //         open={replyModalOpen}
// // //         onClose={handleCloseReplyModal}
// // //         closeAfterTransition
// // //         BackdropComponent={Backdrop}
// // //         BackdropProps={{
// // //           timeout: 500,
// // //         }}
// // //       >
// // //         <Fade in={replyModalOpen}>
// // //           <ModalContainer
// // //             style={{
// // //               backgroundColor: 'white',
// // //               padding: '10px',
// // //             }}
// // //           >
// // //             <Typography
// // //               variant="h5"
// // //               component="h5"
// // //               gutterBottom
// // //               textAlign="center"
// // //               style={{ color: '#22a34a' }}
// // //             >
// // //               Send Feedback to Claimer
// // //             </Typography>

// // //             <Divider sx={{ my: 2 }} />

// // //             {selectedClaim && (
// // //               <Grid
// // //                 container
// // //                 spacing={2}
// // //                 sx={{ mb: 2 }}
// // //                 style={{
// // //                   paddingLeft: '10px',
// // //                 }}
// // //               >
// // //                 <Grid
// // //                   item
// // //                   xs={12}
// // //                   md={6}
// // //                   style={{
// // //                     paddingLeft: '10px',
// // //                   }}
// // //                 >
// // //                   <Typography variant="body1" gutterBottom>
// // //                     <strong>Claimer username:</strong> {selectedClaim.username}
// // //                   </Typography>
// // //                   <Typography variant="body1" gutterBottom>
// // //                     <strong>Claimed Item:</strong>{' '}
// // //                     {selectedClaim.claim.itemName}
// // //                   </Typography>
// // //                 </Grid>
// // //                 <Grid
// // //                   item
// // //                   xs={12}
// // //                   md={6}
// // //                   style={{
// // //                     paddingLeft: '10px',
// // //                   }}
// // //                 >
// // //                   <Typography variant="body1" gutterBottom>
// // //                     <strong>Claimer Description:</strong>{' '}
// // //                     {selectedClaim.message}
// // //                   </Typography>
// // //                 </Grid>
// // //                 <Grid
// // //                   item
// // //                   xs={12}
// // //                   md={6}
// // //                   style={{
// // //                     paddingLeft: '10px',
// // //                   }}
// // //                 >
// // //                   <Typography variant="body1" gutterBottom>
// // //                     <strong>Item Description:</strong>{' '}
// // //                     {selectedClaim.claim.description}
// // //                   </Typography>
// // //                 </Grid>
// // //                 <Grid
// // //                   item
// // //                   xs={12}
// // //                   md={6}
// // //                   style={{
// // //                     paddingLeft: '10px',
// // //                   }}
// // //                 >
// // //                   <Typography variant="body1" gutterBottom>
// // //                     <strong
// // //                       style={{
// // //                         paddingLeft: '10px',
// // //                       }}
// // //                     >
// // //                       Verification Status:
// // //                     </strong>
// // //                     <Typography
// // //                       variant="body2"
// // //                       style={
// // //                         verificationStatus === 'Verified'
// // //                           ? {
// // //                               backgroundColor: 'green',
// // //                               color: 'white',
// // //                               padding: '5px 10px',
// // //                               borderRadius: '5px',
// // //                             }
// // //                           : {
// // //                               backgroundColor: 'red',
// // //                               color: 'white',
// // //                               padding: '5px 10px',
// // //                               borderRadius: '5px',
// // //                             }
// // //                       }
// // //                     >
// // //                       {verificationStatus}
// // //                     </Typography>
// // //                   </Typography>
// // //                 </Grid>
// // //                 <Grid style={{ paddingLeft: '10px' }}>
// // //                   <FormControl
// // //                     fullWidth
// // //                     margin="normal"
// // //                     InputLabelProps={{
// // //                       style: {
// // //                         zIndex: 2,
// // //                         background: 'white',
// // //                         padding: '0 5px',
// // //                         width: '500px',
// // //                       },
// // //                     }}
// // //                   >
// // //                     <InputLabel>Verification Status</InputLabel>
// // //                     <Select
// // //                       value={verificationStatus}
// // //                       onChange={(e) => {
// // //                         setVerificationStatus(e.target.value);
// // //                         // Update replyMessage when verification status changes
// // //                         setReplyMessage(generateFeedbackMessage(selectedClaim, calculateSimilarity(selectedClaim.claim.description, selectedClaim.message)));
// // //                       }}
// // //                       style={{ color: 'rgb(22, 163, 74)' }}
// // //                     >
// // //                       <MenuItem value="Verified">Verified</MenuItem>
// // //                       <MenuItem value="Not Verified">Declined</MenuItem>
// // //                     </Select>
// // //                   </FormControl>
// // //                 </Grid>
// // //                 <Grid item xs={12}>
// // //                   <Typography variant="body1" gutterBottom>
// // //                     <strong> Description Similarity:</strong>{' '}
// // //                     {calculateSimilarity(
// // //                       selectedClaim.claim.description,
// // //                       selectedClaim.message
// // //                     )}
// // //                     %
// // //                   </Typography>
// // //                 </Grid>
// // //               </Grid>
// // //             )}

// // //             <TextField
// // //               label="Feedback Message to Claimer"
// // //               multiline
// // //               rows={4}
// // //               fullWidth
// // //               margin="normal"
// // //               value={replyMessage}
// // //               onChange={(e) => setReplyMessage(e.target.value)}
// // //               InputLabelProps={{
// // //                 style: {
// // //                   zIndex: 2,
// // //                   background: 'white',
// // //                   padding: '0 5px',
// // //                 },
// // //               }}
// // //             />

// // //             <Box
// // //               textAlign="center"
// // //               mt={2}
// // //               style={{
// // //                 backgroundColor: 'white',
// // //                 padding: '10px',
// // //               }}
// // //             >
// // //               <Button
// // //                 variant="contained"
// // //                 color="primary"
// // //                 onClick={handleSendReply}
// // //                 style={{
// // //                   backgroundColor: 'rgb(22, 163, 74)',
// // //                   boxShadow: 'none',
// // //                   borderRadius: '10px',
// // //                 }}
// // //               >
// // //                 Send Feedback
// // //               </Button>
// // //               <Button
// // //                 variant="outlined"
// // //                 color="secondary"
// // //                 onClick={handleCloseReplyModal}
// // //                 sx={{ ml: 2 }}
// // //                 style={{
// // //                   borderColor: 'rgb(22, 163, 74)',
// // //                   color: 'rgb(22, 163, 74)',
// // //                   borderRadius: '10px',
// // //                 }}
// // //               >
// // //                 Cancel
// // //               </Button>
// // //             </Box>
// // //           </ModalContainer>
// // //         </Fade>
// // //       </Modal>
// // //       <Footer />
// // //     </Box>
// // //   );
// // // }

// // // export default Verify;

// // import React, { useEffect, useState } from 'react';
// // import {
// //   Box,
// //   Stack,
// //   Button,
// //   Modal,
// //   TextField,
// //   Typography,
// //   Table,
// //   TableBody,
// //   TableCell,
// //   TableContainer,
// //   TableHead,
// //   TableRow,
// //   Paper,
// //   IconButton,
// //   Tooltip,
// //   CircularProgress,
// //   Grid,
// //   Divider,
// //   Fade,
// //   Backdrop,
// //   styled,
// //   FormControl,
// //   FormLabel,
// //   Select,
// //   InputLabel,
// //   MenuItem,
// // } from '@mui/material';
// // import SendIcon from '@mui/icons-material/Send';
// // import AdminSidebar from './adminsidebar';
// // import AdminBar from './adminbar';
// // import Footer from './footer';
// // import stringSimilarity from 'string-similarity';

// // const ModalContainer = styled(Box)(({ theme }) => ({
// //   position: 'absolute',
// //   top: '50%',
// //   left: '50%',
// //   transform: 'translate(-50%, -50%)',
// //   bgcolor: '#fff',
// //   boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.2)',
// //   p: 4,
// //   borderRadius: '10px',
// //   width: '80%',
// //   maxWidth: '600px',
// //   [theme.breakpoints.down('md')]: {
// //     width: '90%',
// //   },
// // }));

// // function Verify() {
// //   const [loading, setLoading] = useState(true);
// //   const [successModalOpen, setSuccessModalOpen] = useState(false);
// //   const [replyModalOpen, setReplyModalOpen] = useState(false);
// //   const [replyMessage, setReplyMessage] = useState('');
// //   const [selectedClaim, setSelectedClaim] = useState(null);
// //   const [accounts, setAccounts] = useState([]);
// //   const [verificationStatus, setVerificationStatus] = useState('');

// //   useEffect(() => {
// //     const fetchData = async () => {
// //       try {
// //         const accountsResponse = await fetch('http://localhost:5000/api/replies');
// //         const claimsResponse = await fetch('http://localhost:5000/claim'); 

// //         if (accountsResponse.ok && claimsResponse.ok) {
// //           const accountsData = await accountsResponse.json();
// //           const claimsData = await claimsResponse.json();

// //           const associatedAccounts = accountsData.map((account) => ({
// //             ...account,
// //             claim: claimsData.find(
// //               (claim) => claim.username === account.username
// //             ),
// //           }));

// //           setAccounts(associatedAccounts);
// //           setLoading(false);
// //         } else {
// //           console.error(
// //             'Failed to fetch data:',
// //             accountsResponse.statusText || claimsResponse.statusText
// //           );
// //         }
// //       } catch (error) {
// //         console.error('Error fetching data:', error);
// //       }
// //     };

// //     fetchData();
// //   }, []);

// //   const handleOpenReplyModal = (claim) => {
// //     setSelectedClaim(claim);
// //     setReplyModalOpen(true);

// //     // Set initial verification status and message
// //     const initialStatus = claim.claim && claim.claim.verified ? 'Verified' : 'Not Verified';
// //     setVerificationStatus(initialStatus);
// //     setReplyMessage(generateFeedbackMessage(initialStatus)); 
// //   };

// //   const handleCloseReplyModal = () => {
// //     setReplyModalOpen(false);
// //     setReplyMessage('');
// //     setSelectedClaim(null);
// //     setVerificationStatus('');
// //   };

// //   const handleSendReply = async () => {
// //     try {
// //       const response = await fetch('http://localhost:5000/decision', {
// //         method: 'POST',
// //         headers: {
// //           'Content-Type': 'application/json',
// //         },
// //         body: JSON.stringify({
// //           username: selectedClaim.username,
// //           claimedItem: selectedClaim.claim.itemName,
// //           itemDescription: selectedClaim.claim.description,
// //           claimerDescription: selectedClaim.message,
// //           message: replyMessage, 
// //           verified: verificationStatus === 'Verified',
// //         }),
// //       });

// //       if (response.ok) {
// //         // ... (update accounts state if needed - see previous examples)
// //         setSuccessModalOpen(true);
// //         handleCloseReplyModal(); 
// //       } else {
// //         console.error('Failed to send decision:', response.statusText);
// //       }
// //     } catch (error) {
// //       console.error('Error sending decision:', error);
// //     }
// //   };

// //   const calculateSimilarity = (str1, str2) => {
// //     const similarity = stringSimilarity.compareTwoStrings(str1, str2);
// //     return Math.round(similarity * 100);
// //   };

// //   const generateFeedbackMessage = (status = verificationStatus) => {
// //     if (selectedClaim && selectedClaim.claim && selectedClaim.claim.itemName) {
// //       if (status === 'Verified') {
// //         return `The claim for item ${selectedClaim.claim.itemName} has been verified. You can reach out to the finder on tel: ${selectedClaim.claim.contact} or chat with username: ${selectedClaim.claim.founderUsername}.`;
// //       } else {
// //         return `The claim for item ${selectedClaim.claim.itemName} has been declined. Please reclaim the item and enter the correct description or contact the admin.`;
// //       }
// //     } else {
// //       return ''; 
// //     }
// //   };

// //   const handleVerificationStatusChange = (e) => {
// //     setVerificationStatus(e.target.value);
// //     setReplyMessage(generateFeedbackMessage(e.target.value)); 
// //   };

// //   return (
// //     <Box className="bg-slate-50 min-h-screen font-san">
// //       <AdminBar />
// //       <Stack direction={{ xs: 'column', sm: 'row' }} className="mt-16">
// //         <AdminSidebar />
// //         <Box flex={1} p={4} marginLeft={30} marginRight={30}>
// //           <Typography variant="h5" gutterBottom>
// //             Verify Claimer's Descriptions
// //           </Typography>
// //           {loading ? (
// //             <Box
// //               sx={{
// //                 display: 'flex',
// //                 justifyContent: 'center',
// //                 alignItems: 'center',
// //                 height: '200px',
// //               }}
// //             >
// //               <CircularProgress />
// //             </Box>
// //           ) : accounts.length > 0 ? (
// //             <TableContainer component={Paper} className="mt-4">
// //               <Table>
// //                 <TableHead style={{ backgroundColor: 'rgb(22, 163, 74)' }}>
// //                   <TableRow>
// //                     <TableCell>
// //                       <b style={{ color: 'white' }}>Claimer Name</b>
// //                     </TableCell>
// //                     <TableCell>
// //                       <b style={{ color: 'white' }}>Claimed Item</b>
// //                     </TableCell>
// //                     <TableCell>
// //                       <b style={{ color: 'white' }}>Claimer Description</b>
// //                     </TableCell>
// //                     <TableCell>
// //                       <b style={{ color: 'white' }}>Item Description</b>
// //                     </TableCell>
// //                     <TableCell align="right"></TableCell>
// //                   </TableRow>
// //                 </TableHead>
// //                 <TableBody>
// //                   {accounts.map((account) => (
// //                     <TableRow key={account._id}>
// //                       <TableCell>{account.username}</TableCell>
// //                       <TableCell>
// //                         {account.claim ? account.claim.itemName : 'N/A'}
// //                       </TableCell>
// //                       <TableCell>{account.message}</TableCell>
// //                       <TableCell>
// //                         {account.claim ? account.claim.description : 'N/A'}
// //                       </TableCell>
// //                       <TableCell align="right">
// //                         {account.claim ? (
// //                           <Tooltip title="Send feedback to claimer">
// //                             <IconButton
// //                               color="primary"
// //                               onClick={() => handleOpenReplyModal(account)}
// //                               style={{ color: 'rgb(22, 163, 74)' }}
// //                             >
// //                               <SendIcon />
// //                             </IconButton>
// //                           </Tooltip>
// //                         ) : (
// //                           <Typography variant="body2">No Claim</Typography>
// //                         )}
// //                       </TableCell>
// //                     </TableRow>
// //                   ))}
// //                 </TableBody>
// //               </Table>
// //             </TableContainer>
// //           ) : (
// //             <Typography variant="body1">No claims found.</Typography>
// //           )}
// //         </Box>
// //       </Stack>

// //       {/* Success Modal */}
// //       <Modal
// //         open={successModalOpen}
// //         onClose={() => setSuccessModalOpen(false)}
// //         closeAfterTransition
// //         BackdropComponent={Backdrop}
// //         BackdropProps={{
// //           timeout: 500,
// //         }}
// //       >
// //         <Fade in={successModalOpen}>
// //           <Box
// //             sx={{
// //               position: 'absolute',
// //               top: '50%',
// //               left: '50%',
// //               transform: 'translate(-50%, -50%)',
// //               bgcolor: 'background.paper',
// //               boxShadow: 24,
// //               p: 4,
// //               borderRadius: 2,
// //               textAlign: 'center',
// //             }}
// //           >
// //             <Typography variant="h6" component="h2" color="success.main">
// //               Feedback Sent Successfully to Claimer!
// //             </Typography>
// //             <Button
// //               variant="contained"
// //               color="primary"
// //               onClick={() => setSuccessModalOpen(false)}
// //               sx={{ mt: 3 }}
// //               style={{
// //                 backgroundColor: 'rgb(22, 163, 74)',
// //                 boxShadow: 'none',
// //                 borderRadius: '10px',
// //               }}
// //             >
// //               OK
// //             </Button>
// //           </Box>
// //         </Fade>
// //       </Modal>

// //       {/* Reply Modal */}
// //       <Modal
// //         open={replyModalOpen}
// //         onClose={handleCloseReplyModal}
// //         closeAfterTransition
// //         BackdropComponent={Backdrop}
// //         BackdropProps={{
// //           timeout: 500,
// //         }}
// //       >
// //         <Fade in={replyModalOpen}>
// //           <ModalContainer
// //             style={{
// //               backgroundColor: 'white',
// //               padding: '10px',
// //             }}
// //           >
// //             <Typography
// //               variant="h5"
// //               component="h5"
// //               gutterBottom
// //               textAlign="center"
// //               style={{ color: '#22a34a' }}
// //             >
// //               Send Feedback to Claimer
// //             </Typography>

// //             <Divider sx={{ my: 2 }} />

// //             {selectedClaim && (
// //               <Grid
// //                 container
// //                 spacing={2}
// //                 sx={{ mb: 2 }}
// //                 style={{
// //                   paddingLeft: '10px',
// //                 }}
// //               >
// //                 {/* ... your existing Grid items ... */}
// //                 <Grid style={{ paddingLeft: '10px' }}>
// //                   <FormControl
// //                     fullWidth
// //                     margin="normal"
// //                     InputLabelProps={{
// //                       style: {
// //                         zIndex: 2,
// //                         background: 'white',
// //                         padding: '0 5px',
// //                         width: '500px', 
// //                       },
// //                     }}
// //                   >
// //                     <InputLabel>Verification Status</InputLabel>
// //                     <Select
// //                       value={verificationStatus}
// //                       onChange={handleVerificationStatusChange}
// //                       style={{ color: 'rgb(22, 163, 74)' }}
// //                     >
// //                       <MenuItem value="Verified">Verified</MenuItem>
// //                       <MenuItem value="Not Verified">Not Verified</MenuItem>
// //                     </Select>
// //                   </FormControl>
// //                 </Grid>
// //                 {/* ... your existing Grid items ... */}
// //               </Grid>
// //             )}

// //             <TextField
// //               label="Feedback Message to Claimer"
// //               multiline
// //               rows={4}
// //               fullWidth
// //               margin="normal"
// //               value={replyMessage}
// //               onChange={(e) => setReplyMessage(e.target.value)}
// //               InputLabelProps={{
// //                 style: {
// //                   zIndex: 2,
// //                   background: 'white',
// //                   padding: '0 5px',
// //                 },
// //               }}
// //             />

// //             <Box
// //               textAlign="center"
// //               mt={2}
// //               style={{
// //                 backgroundColor: 'white',
// //                 padding: '10px',
// //               }}
// //             >
// //               <Button
// //                 variant="contained"
// //                 color="primary"
// //                 onClick={handleSendReply}
// //                 style={{
// //                   backgroundColor: 'rgb(22, 163, 74)',
// //                   boxShadow: 'none',
// //                   borderRadius: '10px',
// //                 }}
// //               >
// //                 Send Feedback
// //               </Button>
// //               <Button
// //                 variant="outlined"
// //                 color="secondary"
// //                 onClick={handleCloseReplyModal}
// //                 sx={{ ml: 2 }}
// //                 style={{
// //                   borderColor: 'rgb(22, 163, 74)',
// //                   color: 'rgb(22, 163, 74)',
// //                   borderRadius: '10px',
// //                 }}
// //               >
// //                 Cancel
// //               </Button>
// //             </Box>
// //           </ModalContainer>
// //         </Fade>
// //       </Modal>
// //       <Footer />
// //     </Box>
// //   );
// // }

// // export default Verify;

// // import React, { useEffect, useState } from 'react';
// // import {
// //   Box,
// //   Stack,
// //   Button,
// //   Modal,
// //   TextField,
// //   Typography,
// //   Table,
// //   TableBody,
// //   TableCell,
// //   TableContainer,
// //   TableHead,
// //   TableRow,
// //   Paper,
// //   IconButton,
// //   Tooltip,
// //   CircularProgress,
// //   Grid,
// //   Divider,
// //   Fade,
// //   Backdrop,
// //   styled,
// //   FormControl,
// //   FormLabel,
// //   Select,
// //   InputLabel,
// //   MenuItem,
// // } from '@mui/material';
// // import SendIcon from '@mui/icons-material/Send';
// // import AdminSidebar from './adminsidebar';
// // import AdminBar from './adminbar';
// // import Footer from './footer';
// // import stringSimilarity from 'string-similarity';

// // const ModalContainer = styled(Box)(({ theme }) => ({
// //   position: 'absolute',
// //   top: '50%',
// //   left: '50%',
// //   transform: 'translate(-50%, -50%)',
// //   bgcolor: '#fff',
// //   boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.2)',
// //   p: 4,
// //   borderRadius: '10px',
// //   width: '80%',
// //   maxWidth: '600px',
// //   [theme.breakpoints.down('md')]: {
// //     width: '90%',
// //   },
// // }));

// // function Verify() {
// //   const [loading, setLoading] = useState(true);
// //   const [successModalOpen, setSuccessModalOpen] = useState(false);
// //   const [replyModalOpen, setReplyModalOpen] = useState(false);
// //   const [replyMessage, setReplyMessage] = useState('');
// //   const [selectedClaim, setSelectedClaim] = useState(null);
// //   const [accounts, setAccounts] = useState([]);
// //   const [verificationStatus, setVerificationStatus] = useState('');

// //   useEffect(() => {
// //     const fetchData = async () => {
// //       try {
// //         const accountsResponse = await fetch('http://localhost:5000/api/replies');
// //         const claimsResponse = await fetch('http://localhost:5000/claim'); 

// //         if (accountsResponse.ok && claimsResponse.ok) {
// //           const accountsData = await accountsResponse.json();
// //           const claimsData = await claimsResponse.json();

// //           const associatedAccounts = accountsData.map((account) => ({
// //             ...account,
// //             claim: claimsData.find(
// //               (claim) => claim.username === account.username
// //             ),
// //           }));

// //           setAccounts(associatedAccounts);
// //           setLoading(false);
// //         } else {
// //           console.error(
// //             'Failed to fetch data:',
// //             accountsResponse.statusText || claimsResponse.statusText
// //           );
// //         }
// //       } catch (error) {
// //         console.error('Error fetching data:', error);
// //       }
// //     };

// //     fetchData();
// //   }, []);

// //   const handleOpenReplyModal = (claim) => {
// //     setSelectedClaim(claim);
// //     setReplyModalOpen(true);

// //     // Calculate similarity and set initial status
// //     const similarity = calculateSimilarity(
// //       claim.claim.description,
// //       claim.message
// //     );
// //     const initialStatus = similarity > 60 ? 'Verified' : 'Not Verified';

// //     setVerificationStatus(initialStatus);
// //     setReplyMessage(generateFeedbackMessage(initialStatus));
// //   };

// //   const handleCloseReplyModal = () => {
// //     setReplyModalOpen(false);
// //     setReplyMessage('');
// //     setSelectedClaim(null);
// //     setVerificationStatus('');
// //   };

// //   const handleSendReply = async () => {
// //     try {
// //       const response = await fetch('http://localhost:5000/decision', {
// //         method: 'POST',
// //         headers: {
// //           'Content-Type': 'application/json',
// //         },
// //         body: JSON.stringify({
// //           username: selectedClaim.username,
// //           claimedItem: selectedClaim.claim.itemName,
// //           itemDescription: selectedClaim.claim.description,
// //           claimerDescription: selectedClaim.message,
// //           message: replyMessage, 
// //           verified: verificationStatus === 'Verified',
// //         }),
// //       });

// //       if (response.ok) {
// //         // ... (update accounts state if needed - see previous examples)
// //         setSuccessModalOpen(true);
// //         handleCloseReplyModal(); 
// //       } else {
// //         console.error('Failed to send decision:', response.statusText);
// //       }
// //     } catch (error) {
// //       console.error('Error sending decision:', error);
// //     }
// //   };

// //   const calculateSimilarity = (str1, str2) => {
// //     const similarity = stringSimilarity.compareTwoStrings(str1, str2);
// //     return Math.round(similarity * 100);
// //   };

// //   const generateFeedbackMessage = (status = verificationStatus) => {
// //     if (selectedClaim && selectedClaim.claim && selectedClaim.claim.itemName) {
// //       if (status === 'Verified') {
// //         return `The claim for item ${selectedClaim.claim.itemName} has been verified. You can reach out to the finder on tel: ${selectedClaim.claim.contact} or chat with username: ${selectedClaim.claim.founderUsername}.`;
// //       } else {
// //         return `The claim for item ${selectedClaim.claim.itemName} has been declined. Please reclaim the item and enter the correct description or contact the admin.`;
// //       }
// //     } else {
// //       return ''; 
// //     }
// //   };

// //   const handleVerificationStatusChange = (e) => {
// //     setVerificationStatus(e.target.value);
// //     setReplyMessage(generateFeedbackMessage(e.target.value)); 
// //     const newStatus = e.target.value;

// //     // Only allow changing to "Verified" if similarity is above 60%
// //     if (newStatus === 'Not Verified' || calculateSimilarity(selectedClaim.claim.description, selectedClaim.message) > 60) {
// //       setVerificationStatus(newStatus);
// //       setReplyMessage(generateFeedbackMessage(newStatus));
// //     } else {
// //       // You might want to display an error message here,
// //       // e.g., using a snackbar or alert
// //       console.warn("Similarity must be greater than 60% to verify.");
// //     }
// //   };
  
// //   // Update replyMessage whenever selectedClaim or verificationStatus changes
// //   useEffect(() => {
// //     setReplyMessage(generateFeedbackMessage());
// //   }, [selectedClaim, verificationStatus]); 

// //   return (
// //     <Box className="bg-slate-50 min-h-screen font-san">
// //       <AdminBar />
// //       <Stack direction={{ xs: 'column', sm: 'row' }} className="mt-16">
// //         <AdminSidebar />
// //         <Box flex={1} p={4} marginLeft={30} marginRight={30}>
// //           <Typography variant="h5" gutterBottom>
// //             Verify Claimer's Descriptions
// //           </Typography>
// //           {loading ? (
// //             <Box
// //               sx={{
// //                 display: 'flex',
// //                 justifyContent: 'center',
// //                 alignItems: 'center',
// //                 height: '200px',
// //               }}
// //             >
// //               <CircularProgress />
// //             </Box>
// //           ) : accounts.length > 0 ? (
// //             <TableContainer component={Paper} className="mt-4">
// //               <Table>
// //                 <TableHead style={{ backgroundColor: 'rgb(22, 163, 74)' }}>
// //                   <TableRow>
// //                     <TableCell>
// //                       <b style={{ color: 'white' }}>Claimer Name</b>
// //                     </TableCell>
// //                     <TableCell>
// //                       <b style={{ color: 'white' }}>Claimed Item</b>
// //                     </TableCell>
// //                     <TableCell>
// //                       <b style={{ color: 'white' }}>Claimer Description</b>
// //                     </TableCell>
// //                     <TableCell>
// //                       <b style={{ color: 'white' }}>Item Description</b>
// //                     </TableCell>
// //                     <TableCell align="right"></TableCell>
// //                   </TableRow>
// //                 </TableHead>
// //                 <TableBody>
// //                   {accounts.map((account) => (
// //                     <TableRow key={account._id}>
// //                       <TableCell>{account.username}</TableCell>
// //                       <TableCell>
// //                         {account.claim ? account.claim.itemName : 'N/A'}
// //                       </TableCell>
// //                       <TableCell>{account.message}</TableCell>
// //                       <TableCell>
// //                         {account.claim ? account.claim.description : 'N/A'}
// //                       </TableCell>
// //                       <TableCell align="right">
// //                         {account.claim ? (
// //                           <Tooltip title="Send feedback to claimer">
// //                             <IconButton
// //                               color="primary"
// //                               onClick={() => handleOpenReplyModal(account)}
// //                               style={{ color: 'rgb(22, 163, 74)' }}
// //                             >
// //                               <SendIcon />
// //                             </IconButton>
// //                           </Tooltip>
// //                         ) : (
// //                           <Typography variant="body2">No Claim</Typography>
// //                         )}
// //                       </TableCell>
// //                     </TableRow>
// //                   ))}
// //                 </TableBody>
// //               </Table>
// //             </TableContainer>
// //           ) : (
// //             <Typography variant="body1">No claims found.</Typography>
// //           )}
// //         </Box>
// //       </Stack>

// //       {/* Success Modal */}
// //       <Modal
// //         open={successModalOpen}
// //         onClose={() => setSuccessModalOpen(false)}
// //         closeAfterTransition
// //         BackdropComponent={Backdrop}
// //         BackdropProps={{
// //           timeout: 500,
// //         }}
// //       >
// //         <Fade in={successModalOpen}>
// //           <Box
// //             sx={{
// //               position: 'absolute',
// //               top: '50%',
// //               left: '50%',
// //               transform: 'translate(-50%, -50%)',
// //               bgcolor: 'background.paper',
// //               boxShadow: 24,
// //               p: 4,
// //               borderRadius: 2,
// //               textAlign: 'center',
// //             }}
// //           >
// //             <Typography variant="h6" component="h2" color="success.main">
// //               Feedback Sent Successfully to Claimer!
// //             </Typography>
// //             <Button
// //               variant="contained"
// //               color="primary"
// //               onClick={() => setSuccessModalOpen(false)}
// //               sx={{ mt: 3 }}
// //               style={{
// //                 backgroundColor: 'rgb(22, 163, 74)',
// //                 boxShadow: 'none',
// //                 borderRadius: '10px',
// //               }}
// //             >
// //               OK
// //             </Button>
// //           </Box>
// //         </Fade>
// //       </Modal>
// //  {/* Reply Modal */}
// //  <Modal
// //       open={replyModalOpen}
// //       onClose={handleCloseReplyModal}
// //       closeAfterTransition
// //       BackdropComponent={Backdrop}
// //       BackdropProps={{
// //         timeout: 500,
// //       }}
// //     >
// //       <Fade in={replyModalOpen}>
// //         <ModalContainer style={{ backgroundColor: 'white', padding: '10px' }}>
// //           <Typography
// //             variant="h5"
// //             component="h5"
// //             gutterBottom
// //             textAlign="center"
// //             style={{ color: '#22a34a' }}
// //           >
// //             Send Feedback to Claimer
// //           </Typography>
// //           <Divider sx={{ my: 2 }} />

// //           {selectedClaim && ( 
// //             <Grid container spacing={2} sx={{ mb: 2 }}>
// //               {/* Claimer Name */}
// //               <Grid item xs={12} md={6}>
// //                 <Typography variant="body1" gutterBottom>
// //                   <strong>Claimer:</strong> {selectedClaim.username}
// //                 </Typography>
// //               </Grid>

// //               {/* Claimed Item */}
// //               <Grid item xs={12} md={6}>
// //                 <Typography variant="body1" gutterBottom>
// //                   <strong>Claimed Item:</strong>{' '}
// //                   {selectedClaim.claim.itemName}
// //                 </Typography>
// //               </Grid>

// //               {/* Item Description */}
// //               <Grid item xs={12} md={6}>
// //                 <Typography variant="body1" gutterBottom>
// //                   <strong>Item Description:</strong>{' '}
// //                   {selectedClaim.claim.description}
// //                 </Typography>
// //               </Grid>

// //               {/* Claimer Description */}
// //               <Grid item xs={12} md={6}>
// //                 <Typography variant="body1" gutterBottom>
// //                   <strong>Claimer Description:</strong>{' '}
// //                   {selectedClaim.message}
// //                 </Typography>
// //               </Grid>

// //               {/* Description Similarity */}
// //               <Grid item xs={12} md={6}>
// //                 <Typography variant="body1" gutterBottom>
// //                   <strong>Description Similarity:</strong>{' '}
// //                   {calculateSimilarity(
// //                     selectedClaim.claim.description,
// //                     selectedClaim.message
// //                   )}
// //                   %
// //                 </Typography>
// //               </Grid>
// //               <Grid item xs={12} md={6}>
// //               <Typography variant="body1" gutterBottom>
// //                     <strong
// //                       style={{
// //                         paddingLeft: '10px',
// //                       }}
// //                     >
// //                       Verification Status:
// //                     </strong>
// //                     <Typography
// //                       variant="body2"
// //                       style={
// //                         verificationStatus === 'Verified'
// //                           ? {
// //                               backgroundColor: 'green',
// //                               color: 'white',
// //                               padding: '5px 10px',
// //                               borderRadius: '5px',
// //                             }
// //                           : {
// //                               backgroundColor: 'red',
// //                               color: 'white',
// //                               padding: '5px 10px',
// //                               borderRadius: '5px',
// //                             }
// //                       }
// //                     >
// //                       {verificationStatus}
// //                     </Typography>
// //                   </Typography>


// //               </Grid>

// //               {/* Verification Status */}
// //               <Grid item xs={12} md={6}>
// //                 <FormControl fullWidth margin="normal">
// //                   <InputLabel>Verification Status</InputLabel>
// //                   <Select
// //                     value={verificationStatus}
// //                     onChange={handleVerificationStatusChange}
// //                     style={{ color: 'rgb(22, 163, 74)' }}
// //                   >
// //                     <MenuItem value="Verified">Verified</MenuItem>
// //                     <MenuItem value="Not Verified">
// //                       Declined
// //                     </MenuItem>
// //                   </Select>
// //                 </FormControl>
// //               </Grid>
// //             </Grid>
// //           )}
                  

// //             {/* Feedback Message Text Field */}
// //           <TextField
// //             label="Feedback Message to Claimer"
// //             multiline
// //             rows={4}
// //             fullWidth
// //             margin="normal"
// //             value={replyMessage} // Display automatically generated message
// //             onChange={(e) => setReplyMessage(e.target.value)}
// //             InputLabelProps={{
// //               style: {
// //                 zIndex: 2,
// //                 background: 'white',
// //                 padding: '0 5px',
// //               },
// //             }}
// //           />

// //             <Box
// //               textAlign="center"
// //               mt={2}
// //               style={{
// //                 backgroundColor: 'white',
// //                 padding: '10px',
// //               }}
// //             >
// //               <Button
// //                 variant="contained"
// //                 color="primary"
// //                 onClick={handleSendReply}
// //                 style={{
// //                   backgroundColor: 'rgb(22, 163, 74)',
// //                   boxShadow: 'none',
// //                   borderRadius: '10px',
// //                 }}
// //               >
// //                 Send Feedback
// //               </Button>
// //               <Button
// //                 variant="outlined"
// //                 color="secondary"
// //                 onClick={handleCloseReplyModal}
// //                 sx={{ ml: 2 }}
// //                 style={{
// //                   borderColor: 'rgb(22, 163, 74)',
// //                   color: 'rgb(22, 163, 74)',
// //                   borderRadius: '10px',
// //                 }}
// //               >
// //                 Cancel
// //               </Button>
// //             </Box>
// //           </ModalContainer>
// //         </Fade>
// //       </Modal>
// //       <Footer />
// //     </Box>
// //   );
// // }

// // export default Verify;


// import { Logout, FeedbackOutlined, ShareRounded, PresentToAll, InfoOutlined, MessageRounded, PersonRemoveAlt1, NoteAdd, RemoveRedEye, Print, Search, CommentOutlined } from '@mui/icons-material'
// import { Box, Stack, Button, Modal, Breadcrumbs, TextField, Skeleton, Tooltip } from '@mui/material'
// import React, { useEffect, useState } from 'react'
// import '../App.css'
// import StarIcon from '@mui/icons-material/Star';
// import StarBorderIcon from '@mui/icons-material/StarBorder';
// import axios from 'axios';
// import { Alert, Share, View } from 'react-native';
// import Card from '@mui/material/Card';
// import CardContent from '@mui/material/CardContent';
// import CardMedia from '@mui/material/CardMedia';
// import Typography from '@mui/material/Typography';
// import { CardActionArea, CardActions } from '@mui/material';
// import { NavLink, Link } from 'react-router-dom'

// import Sidebar from './sidebar';
// import { RateReviewTwoTone } from '@material-ui/icons';
// import Navbar from './navbar';
// import Footer from './footer';
// import Banner from './Banner';
// import Ribboned from './Ribboned';
// import FeedbackSystem from './FeedbackSystem';
// import {
//   FacebookShareButton,
//   TwitterShareButton,
//   LinkedinShareButton,
//   WhatsappShareButton,
//   FacebookIcon,
//   TwitterIcon,
//   LinkedinIcon,
//   WhatsappIcon
// } from 'react-share';


// function ViewLost() {
//   const [loading, setLoading] = useState(true);
//   const [foundItems, setFoundItems] = useState([]);
//   const [successModalOpen, setSuccessModalOpen] = useState(false);
//   const [openModal1, setOpenModal1] = useState(false);
//   const [openModal2, setOpenModal2] = useState(false);
//   const [openModal3, setOpenModal3] = useState(false);
//   const [rating, setRating] = useState(0);
//   const [selectedReward, setSelectedReward] = useState('');
//   const [openShareModal, setOpenShareModal] = useState(false);
//   const [selectedItem, setSelectedItem] = useState(null);
//   const [shareLink, setShareLink] = useState('');
//   const [searchQuery, setSearchQuery] = useState('');
//   const [searchResults, setSearchResults] = useState([]);
//   const [isModalOpen, setIsModalOpen] = useState(false);
//   const [itemInformation, setItemInformation] = useState('');
//   // Track if the reward is shown for the selected item (instead of a global flag)
//   const [showRewardForItem, setShowRewardForItem] = useState(new Map()); 
//   const [currentUser, setCurrentUser] = useState(null); // Define currentUser here

//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         const response = await fetch('http://localhost:5000/api/Lost');
//         let data = await response.json();
//         data.sort((a, b) => b.searchNumber - a.searchNumber);
//         setFoundItems(data);
//         setLoading(false);
//       } catch (error) {
//         console.error('Error fetching data:', error);
//         setLoading(false);
//       }
//     };
//     fetchData();
//   }, []);


//   //////////////////////////////////////////////////////////////////////////////////////////
  

//   useEffect(() => {
//     const storedUsername = localStorage.getItem('username');
//     if (storedUsername) {
//       // Update currentUser state instead of using 'setUsername'
//       setCurrentUser(storedUsername); 
//     }
//   }, []);

 

//   ////////////////////////////////////////////////////////////////////////////////////////

//   const handleClose = () => {
//     setOpenModal2(false);
//   };

//   const handleStarClick = (index) => {
//     setRating(index + 1);
//   };

//   const handleSearch = async () => {
//     try {
//       const response = await fetch('http://localhost:5000/api/searchlost', {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json'
//         },
//         body: JSON.stringify({ searchQuery })
//       });
//       const data = await response.json();
//       setSearchResults(data);
//       console.log('Search results:', data);
//     } catch (error) {
//       console.error('Error searching items:', error);
//     }
//   };

//   const handleOpenModal = (item) => { 
//     setSelectedItem(item); 
//     setIsModalOpen(true);
//   };

//   const handleCloseModal = () => {
//     setIsModalOpen(false);
//     // Reset showReward for the selected item when the modal closes
//     setShowRewardForItem(new Map(showRewardForItem).set(selectedItem, false)); 
//   };

//   const handleSubmitInformation = async () => {
//     // Send the information to the backend
//     try {
//       const response = await fetch('http://localhost:5000/information', {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json'
//         },
//         body: JSON.stringify({
//           itemName: selectedItem.itemName,
//           information: itemInformation,
//           username: currentUser, // Use currentUser state here
//         })
//       });

//       // Handle the response
//       if (response.ok) {
//         console.log('Information submitted successfully!');
//         // You might want to update the UI based on the response, e.g., show a success message
//         setShowRewardForItem(new Map(showRewardForItem).set(selectedItem, true));
//       } else {
//         console.error('Error submitting information:', response.statusText);
//         // Handle the error appropriately (e.g., display an error message)
//       }
//     } catch (error) {
//       console.error('Error submitting information:', error);
//     }

//     // Reset the text field
//     setItemInformation(''); 
//   };

//   const [isHovered, setIsHovered] = useState(false);
//   const buttonStyle = {
//     backgroundColor: '#b1c5ff',
//     color: 'black',
//     borderRadius: 'none',
//     border: isHovered ? '2px dashed #000' : '2px solid #000',
//   };

//   const [isHover, setIsHover] = useState(false);
//   const buttonStyled = {
//     backgroundColor: '#b6ffc0',
//     color: 'black',
//     borderRadius: 'none',
//     border: isHover ? '2px dashed #000' : '2px solid #000',
//   };

//   return (
//     <div className='bg-slate-50 h-[100vh] font-san'>
//       <Navbar />
//       <FeedbackSystem />
//       <Footer />

//       <div className='mt-[100px]'>
//         <Stack direction={{ xs: 'column', sm: 'row' }} className='m-2 ' gap="10px">
//           <Sidebar />

//           <Box className="bg-inherit fixed top-0 left-0 h-full overflow-y-scroll"
//             sx={{
//               marginTop: '64px',
//               padding: '10px',
//             }}>
//             <Banner />
//             <div className='flex justify-between items-center p-3 m-1 mx-2'>
//               <div className=' flex gap-5'>
//                 <Typography variant='h5' sx={{
//                   fontFamily: 'serif',
//                   fontWeight: 600,
//                   color: '#333',
//                   textShadow: '0px 1px 2px rgba(0, 0, 0, 0.2)',
//                   marginBottom: '1rem',
//                   textAlign: 'center',
//                 }}>
//                   Lost Items
//                 </Typography>
//               </div>

//               <div className=''>
//                 <Breadcrumbs aria-label="breadcrumb">
//                   <Link underline="hover" color="primary" to="/found">
//                     <p className=' text-[1em] hover:border-dashed active:border-2 active:border-black  focus:border-2 focus:border-black hover:underline' style={{
//                       color: '#b1c5ff',
//                       webkitTextStrokeWidth: '0.3px',
//                       webkitTextStrokeColor: 'black',
//                     }}>Found Items</p>
//                   </Link>
//                   <Link underline="hover" color="inherit" to="/lostfound">
//                     <p className=' text-[0.9em] hover:border-dashed active:border-2 active:border-black  focus:border-2 focus:border-black hover:underline' style={{
//                       color: '#d5b3ff',
//                       webkitTextStrokeWidth: '0.3px',
//                       webkitTextStrokeColor: 'black',
//                     }}>Lost Items</p>
//                   </Link>
//                 </Breadcrumbs>
//               </div>

//               <div className='p-1 bg-white border-black border-2 px-7  flex gap-3 items-center' style={{
//                 marginRight: '25px',
//               }}>
//                 <input className='outline-none p-1 bg-white'
//                   value={searchQuery}
//                   onChange={(e) => setSearchQuery(e.target.value)}
//                   placeholder="search items"
//                   type='text' />
//                 <Search color='primary' onClick={handleSearch} sx={{ fontSize: '2em', cursor: 'pointer', color: '#ff764d' }} />
//               </div>
//             </div>

//             <Box className='border-none p-3 ' display='grid' gridTemplateColumns='repeat(4, 1fr)' gap={3} p={1} m={2}>
//               {(loading ? Array.from(new Array(8)) : (searchResults.length > 0 ? searchResults : foundItems)).map((item, index) => (
//                 <Card key={index}
//                   sx={{
//                     maxWidth: 345,
//                     position: 'relative',
//                     maxWidth: { xs: 345, md: 345 },
//                     borderRadius: '10px',
//                     boxShadow: 'none',
//                     border: 'none',
//                     minHeight: 320,
//                     margin: '10px 20px 20px 30px',
//                   }}>
//                   {loading ? (
//                     <Skeleton variant="rectangular" sx={{ backgroundColor: 'rgb(248 250 252)' }} width="100%" height={300} />
//                   ) : (
//                     <>
//                       <CardActionArea>
//                         {item.imagePath && <img src={`http://localhost:5000/` + item.imagePath} alt={`Image ${index + 1}`} className='w-full h-[30vh] rounded-none border-none mb-0' />}
//                         <Ribboned>Lost</Ribboned>
//                         <CardContent>
//                           <Typography gutterBottom variant="h5" component="div" sx={{
//                             color: 'black',
//                             fontSize: '20px'
//                           }}>
//                             {item.itemName}
//                           </Typography>
//                         </CardContent>
//                       </CardActionArea>
//                       <div>
//                         <CardActions style={{
//                           display: 'flex',
//                           justifyContent: 'space-between',
//                         }}>
//                           {/* Share Button */}
//                           <Button onClick={() => onShare(item.itemName)} size="small" color="primary">
//                             <ShareRounded />Share
//                           </Button>

//                           {/* Info Button */}
//                           <Tooltip title="Do you have any information about the lost item?">
//                             <Button
//                               variant="contained"
//                               onClick={() => handleOpenModal(item)} // Pass the item to the function
//                               startIcon={<CommentOutlined />}
//                               sx={{
//                                 backgroundColor: '#fdd835', // Yellow color
//                                 color: 'black',
//                                 '&:hover': {
//                                   backgroundColor: '#ffeb3b', // Slightly lighter yellow on hover
//                                 },
//                               }}
//                             >
//                               Info
//                             </Button>
//                           </Tooltip>

//                           {/* Reward Button (conditionally shown for selected item only) */}
//                           {selectedItem === item && showRewardForItem.get(selectedItem) && selectedItem.reward !== '' && ( // Only show if item is selected 
//                             <Button
//                               variant='contained'
//                               style={{
//                                 boxShadow: 'none',
//                                 backgroundColor: 'rgb(220, 38, 38)',
//                                 color: 'white',
//                                 padding: '5px',
//                               }}
//                             >
//                               REWARD
//                             </Button>
//                           )}
//                         </CardActions>
//                       </div>
//                     </>
//                   )}
//                 </Card>
//               ))}
//             </Box>
//           </Box>
//         </Stack>
//       </div>

//       {/* Modals */}
//       <Modal
//         open={openModal1}
//         onClose={() => setOpenModal1(false)}
//         aria-labelledby="modal-modal-title"
//         aria-describedby="modal-modal-description"
//       >
//         <Box
//           sx={{
//             position: 'absolute',
//             width: 400,
//             bgcolor: 'white',
//             p: 4,
//             top: '50%',
//             left: '50%',
//             transform: 'translate(-50%, -50%)',
//           }}
//         >
//           <h6 className='text-[1.2em] text-center mb-3 p-3 text-gray-800  font-medium'> ENTER YOUR FEEDBACK BELOW</h6>
//           <hr style={{
//             height: '2.5px',
//             background: 'black',
//           }}></hr>
//           <TextField
//             label="feedback"
//             multiline
//             fullWidth
//             margin="normal"
//           />
//           <Button variant="contained">
//             SEND
//           </Button>
//         </Box>
//       </Modal>

//       {/* Success Modal */}
//       <Modal open={successModalOpen} onClose={() => setSuccessModalOpen(false)}>
//         <div style={{
//           position: 'absolute',
//           top: '50%',
//           left: '50%',
//           transform: 'translate(-50%, -50%)',
//           backgroundColor: 'white',
//           padding: '100px',
//           border: '2px solid black'
//         }}>
//           <h2 className='text-[1.5em] font-medium ' style={{
//             color: '#ff764d',
//           }}>Feedback sent!</h2>

//           <div className='mt-5 flex justify-center'>
//             <p onClick={() => setSuccessModalOpen(false)} className='text-black p-2 mt-4 text-center font-medium text-md cursor-pointer rounded-lg w-[50%]'
//               style={{
//                 border: '2px solid black',
//                 backgroundColor: '#b1c5ff',
//               }}>OK</p>
//           </div>
//         </div>
//       </Modal>

//       {/* Rate Modal */}
//       <Modal
//         open={openModal2}
//         onClose={handleClose}
//         aria-labelledby="modal-modal-title"
//         aria-describedby="modal-modal-description"
//       >
//         <Box
//           sx={{
//             position: 'absolute',
//             width: 400,
//             bgcolor: 'white',
//             p: 4,
//             top: '50%',
//             left: '50%',
//             transform: 'translate(-50%, -50%)',
//           }}
//         >
//           <h2 style={{ textAlign: 'center' }} className='font-bold'>RATE US</h2>
//           <hr style={{
//             height: '2.5px',
//             background: 'black',
//           }}></hr>
//           <div style={{ display: 'flex', justifyContent: 'center', gap: '5px' }} className='my-5'>
//             {[...Array(5)].map((_, index) => (
//               <div key={index} onClick={() => handleStarClick(index)}>
//                 {index < rating ? (
//                   <StarIcon sx={{ fontSize: 50, color: '#ff764d' }} />
//                 ) : (
//                   <StarBorderIcon sx={{ fontSize: 40, color: 'blue' }} />
//                 )}
//               </div>
//             ))}
//           </div>
//           <hr style={{
//             height: '2.5px',
//             background: 'black',
//           }}></hr>
//           <div className='flex justify-center mt-4'>
//             <Button variant='contained' color='secondary' onClick={handleClose}
//               style={buttonStyled}
//               onMouseEnter={() => setIsHover(true)}
//               onMouseLeave={() => setIsHover(false)}
//             >OK</Button>
//           </div>
//         </Box>
//       </Modal>

//       {/* Item Information Modal */}
//       <Modal open={isModalOpen} onClose={handleCloseModal}>
//         <Box
//           sx={{
//             position: 'absolute',
//             top: '50%',
//             left: '50%',
//             transform: 'translate(-50%, -50%)',
//             bgcolor: 'background.paper',
//             boxShadow: 24,
//             p: 4,
//             borderRadius: 2,
//           }}
//         >
//           <Typography variant="h6" component="h2" gutterBottom>
//             Provide Item Information
//           </Typography>

//           <TextField
//             label="Information"
//             multiline
//             rows={4}
//             fullWidth
//             margin="normal"
//             value={itemInformation}
//             onChange={(e) => setItemInformation(e.target.value)}
//           />

//           <Button variant="contained" onClick={handleSubmitInformation}>
//             Submit
//           </Button>

//           {/* Show reward only after submission */}
//           {showRewardForItem.get(selectedItem) && selectedItem.reward && (
//             <Typography variant="body1" mt={2}>
//               The reward for this item is: {selectedItem.reward} UGX
//             </Typography>
//           )}
//         </Box>
//       </Modal>
//     </div>
//   )
// }

// export default ViewLost;