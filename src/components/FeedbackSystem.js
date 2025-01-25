import React, { useState } from 'react';
import { Fab, Modal, Box, Typography, TextField, Button, Rating, Snackbar, Tooltip } from '@mui/material';
import FeedbackIcon from '@mui/icons-material/Feedback';
import Alert from '@mui/material/Alert';
import axios from 'axios';

const FeedbackSystem = () => {
  const [open, setOpen] = useState(false);
  const [rating, setRating] = useState(0);
  const [feedback, setFeedback] = useState('');
  const [successOpen, setSuccessOpen] = useState(false);
  const [validationError, setValidationError] = useState(false);

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const handleSuccessClose = () => {
    setSuccessOpen(false);
    // Reset form fields after successful submission
    setRating(0);
    setFeedback(''); 
  };
  const handleValidationErrorClose = () => setValidationError(false);

  const handleSubmit = async () => {
    if (rating === 0 || feedback.trim() === '') {
      setValidationError(true);
      return;
    }

    try {
      await axios.post('http://localhost:5000/api/feedback', { rating, feedback });
      handleClose();
      setSuccessOpen(true);
    } catch (error) {
      console.error('Error submitting feedback:', error);
      // Optionally, show an error message to the user
    }
  };

  const styles = {
    fab: {
      position: 'fixed',
      bottom: 20,
      right: 20,
    },
    button: {
      boxShadow: 'none',
      backgroundColor: 'rgb(22, 163, 74)',
    },
    modalBox: {
      p: 4,
      bgcolor: 'background.paper',
      boxShadow: 24,
      borderRadius: 2,
      maxWidth: 400,
      mx: 'auto',
      my: 4,
    },
  };

  return (
    <div>
      <Tooltip title="online lost and found item system feedback and rating">
        <Fab
          color="secondary"
          aria-label="feedback"
          onClick={handleOpen}
          sx={styles.fab}
          
        >
          <FeedbackIcon />
        </Fab>
      </Tooltip>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="feedback-modal-title"
        aria-describedby="feedback-modal-description"
      >
        <Box sx={styles.modalBox}>
          <Typography id="feedback-modal-title" variant="h6" component="h2">
            Rate Us
          </Typography>

          {validationError && (
            <Alert severity="error" onClose={handleValidationErrorClose} sx={{ mb: 2 }}>
              Please provide both a rating and feedback.
            </Alert>
          )}

          <Rating
            name="rating"
            value={rating}
            onChange={(event, newValue) => {
              setRating(newValue);
            }}
            sx={{ mb: 2, color:'orange' }}
            aria-labelledby="rating-label"
          />
          <TextField
            label="Feedback"
            multiline
            rows={4}
            variant="outlined"
            fullWidth
            value={feedback}
            onChange={(e) => setFeedback(e.target.value)}
            sx={{ mb: 2 }}
            InputLabelProps={{
              style: {
                background: 'white',
                padding: '0 5px',
              },
            }}
            aria-labelledby="feedback-label"
          />
          <Button
            variant="contained"
            color="primary"
            onClick={handleSubmit}
            sx={styles.button}
          >
            Submit
          </Button>
        </Box>
      </Modal>

      <Snackbar
        open={successOpen}
        autoHideDuration={6000}
        onClose={handleSuccessClose}
      >
        <Alert onClose={handleSuccessClose} severity="success">
          Feedback submitted successfully!
        </Alert>
      </Snackbar>
    </div>
  );
};

export default FeedbackSystem;
