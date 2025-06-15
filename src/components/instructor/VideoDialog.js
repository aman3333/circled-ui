import { Dialog, DialogContent, DialogTitle, IconButton, Box, FormControlLabel, Checkbox } from '@mui/material';
import { Close as CloseIcon } from '@mui/icons-material';
import { useState, useEffect } from 'react';

export default function VideoDialog({ open, onClose }) {
  const [dontShowAgain, setDontShowAgain] = useState(false);

  // useEffect(() => {
  //   // Check if user has previously chosen not to show the video
  //   const shouldShowVideo = localStorage.getItem('showCreateProgramVideo');
  //   if (shouldShowVideo === 'false') {
  //     onClose();
  //   }
  // }, []);

  const handleClose = () => {
    if (dontShowAgain) {
      localStorage.setItem('showCreateProgramVideo', 'false');
    }
    onClose();
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth="lg"
      fullWidth
    >
      <DialogTitle>
        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="center"
        >
          <span>How to Create a Program</span>
          <IconButton
            onClick={handleClose}
            size="small"
          >
            <CloseIcon />
          </IconButton>
        </Box>
      </DialogTitle>
      <DialogContent>
        <Box
          mt={2}
          sx={{ position: 'relative', paddingTop: '56.25%' }}
        >
          <iframe
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              border: 'none',
            }}
            src="https://www.youtube.com/embed/VvK2sVbhKJQ"
            title="How to Create a Program"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        </Box>
        <Box mt={2}>
          <FormControlLabel
            control={
              <Checkbox
                checked={dontShowAgain}
                onChange={(e) => setDontShowAgain(e.target.checked)}
              />
            }
            label="Don't show this video again"
          />
        </Box>
      </DialogContent>
    </Dialog>
  );
}
