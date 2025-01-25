import React, { useEffect, useState, useRef } from 'react';
import {
  Box,
  Stack,
  Button,
  Modal,
  Typography,
  Breadcrumbs,
  Link,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Tooltip,
} from '@mui/material';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import DeleteIcon from '@mui/icons-material/Delete';
import AdminSidebar from './adminsidebar';
import AdminBar from './adminbar';
import Footer from './footer';
import SearchIcon from '@mui/icons-material/Search';

function Claim() {
  const [loading, setLoading] = useState(true);
  const [successModalOpen, setSuccessModalOpen] = useState(false);
  const [claims, setClaims] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const deleteButtonRef = useRef(null);

  useEffect(() => {
    const fetchClaims = async () => {
      try {
        const response = await fetch('http://localhost:5000/claim');
        if (response.ok) {
          const data = await response.json();
          setClaims(data);
        } else {
          console.error('Failed to fetch claims:', response.statusText);
        }
      } catch (error) {
        console.error('Error fetching claims:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchClaims();
  }, []);

  const handleVerify = async (claimId, username, itemName) => {
    try {
      const response = await fetch('http://localhost:5000/verify', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          claimId: claimId,
          username: username,
          message: `Send the description for the ${itemName} you claimed`,
        }),
      });
      if (response.ok) {
        setSuccessModalOpen(true);
        // Update the claims state to reflect the verification
        setClaims((prevClaims) =>
          prevClaims.map((claim) =>
            claim._id === claimId
              ? { ...claim, verified: true } // Mark as verified
              : claim
          )
        );
      } else {
        console.error('Failed to verify item:', response.statusText);
      }
    } catch (error) {
      console.error('Error verifying item:', error);
    }
  };

  const handleDeleteClaim = async (claimId) => {
    try {
      const response = await fetch(`http://localhost:5000/claim/${claimId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        console.log('Claim deleted successfully');
        setClaims((prevClaims) =>
          prevClaims.filter((claim) => claim._id !== claimId)
        );
        setSuccessModalOpen(true);
        deleteButtonRef.current = null;
      } else {
        console.error('Failed to delete claim:', response.statusText);
      }
    } catch (error) {
      console.error('Error deleting claim:', error);
    }
  };

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const filteredClaims = searchTerm
    ? claims.filter(
        (claim) =>
          claim.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
          claim.itemName.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : claims;

  return (
    <Box className="bg-slate-50 min-h-screen font-san">
      <AdminBar />
      <Stack direction={{ xs: 'column', sm: 'row' }} className="mt-16">
        <AdminSidebar />
        <Box
          flex={1}
          p={4}
          ml={{ xs: 0, sm: 100, md: 30 }}
          display="flex"
          flexDirection="column"
          // alignItems="center"
        >
           <Typography variant="h4" component="h1" gutterBottom>
              claims
            </Typography>
          <Box
            display="flex"
            alignItems="center"
            justifyContent="space-between"
            marginBottom={2}
            style={{ width: '100%' }}
          >
            <Breadcrumbs aria-label="breadcrumb">
              <Link underline="hover" color="primary" to="/dash">
                Home
              </Link>
              <Link underline="hover" color="inherit" to="#">
                Claims
              </Link>
            </Breadcrumbs>
            <input
              type="text"
              placeholder="Search Claims by Username or Item Name"
              className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={searchTerm}
              onChange={handleSearchChange}
              style={{
                boxShadow: '0 4px 30px rgba(0, 0, 0, 0.1)',
                backdropFilter: 'blur(12.2px)',
                WebkitBackdropFilter: 'blur(12.2px)',
                border: '1px solid rgba(255, 255, 255, 0.15)',
                borderRadius: '5px',
                color: 'black',
                width: '40%',
                backgroundColor: 'white',
                padding: '10px',
              }}
            />
          </Box>

          {loading ? (
            <Typography variant="body1">Loading claims...</Typography>
          ) : filteredClaims.length > 0 ? (
            <TableContainer
              component={Paper}
              className="mt-4"
              style={{
                boxShadow: '0 4px 30px rgba(0, 0, 0, 0.1)',
                backdropFilter: 'blur(12.2px)',
                WebkitBackdropFilter: 'blur(12.2px)',
                border: '1px solid rgba(255, 255, 255, 0.15)',
                borderRadius: '5px',
              }}
            >
              <Table
                sx={{ minWidth: 650 }}
                aria-label="simple table"
                style={{
                  boxShadow: 'none',
                  borderRadius: '10px',
                }}
              >
                <TableHead
                  style={{
                    backgroundColor: 'rgb(22, 163, 74)',
                    color: 'white',
                  }}
                >
                  <TableRow>
                    <TableCell>
                      <b style={{ color: 'white' }}>Claimer</b>
                    </TableCell>
                    <TableCell>
                      <b style={{ color: 'white' }}>Item Name</b>
                    </TableCell>
                    <TableCell>
                      <b style={{ color: 'white' }}>Description</b>
                    </TableCell>
                    <TableCell>
                      <b style={{ color: 'white' }}>Claimer Contact</b>
                    </TableCell>
                    <TableCell>
                      <b style={{ color: 'white' }}>Founder Contact</b>
                    </TableCell>
                    <TableCell>
                      <b style={{ color: 'white' }}>Founder Username</b>
                    </TableCell>
                    <TableCell align="right">
                      <b style={{ color: 'white' }}>Actions</b>
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {filteredClaims.map((claim) => (
                    <TableRow
                      key={claim._id}
                      sx={{
                        '&:last-child td, &:last-child th': { border: 0 },
                      }}
                    >
                      <TableCell
                        style={claim.verified ? { color: 'lightgray' } : {}} // Gray out if verified
                      >
                        {claim.username}
                      </TableCell>
                      <TableCell
                        style={claim.verified ? { color: 'lightgray' } : {}} // Gray out if verified
                      >
                        {claim.itemName}
                      </TableCell>
                      <TableCell
                        style={claim.verified ? { color: 'lightgray' } : {}} // Gray out if verified
                      >
                        {claim.description}
                      </TableCell>
                      <TableCell
                        style={claim.verified ? { color: 'lightgray' } : {}} // Gray out if verified
                      >
                        {claim.phone}
                      </TableCell>
                      <TableCell
                        style={claim.verified ? { color: 'lightgray' } : {}} // Gray out if verified
                      >
                        {claim.contact}
                      </TableCell>
                      <TableCell
                        style={claim.verified ? { color: 'lightgray' } : {}} // Gray out if verified
                      >
                        {claim.founderUsername}
                      </TableCell>
                      <TableCell align="right">
                        {/* Only show the verify button if the claim is not verified */}
                        {!claim.verified && (
                          <Tooltip title="Request item description from claimer">
                            <IconButton
                              color="success"
                              onClick={() =>
                                handleVerify(claim._id, claim.username, claim.itemName)
                              }
                            >
                              <CheckCircleOutlineIcon />
                            </IconButton>
                          </Tooltip>
                        )}

                        <Tooltip title="Delete Claim">
                          <IconButton
                            color="error"
                            ref={deleteButtonRef}
                            onClick={() => handleDeleteClaim(claim._id)}
                          >
                            <DeleteIcon />
                          </IconButton>
                        </Tooltip>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          ) : (
            <Typography variant="body1" className="mt-4 mb-5">
              No items claimed yet.
            </Typography>
          )}
        </Box>
      </Stack>

      <Modal open={successModalOpen} onClose={() => setSuccessModalOpen(false)}>
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
          <Typography variant="h6" component="h2">
            Action Completed!
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
      </Modal>
      <Footer />
    </Box>
  );
}

export default Claim;