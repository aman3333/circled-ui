import React, { useState, useEffect } from "react";
import axios from 'src/utils/axios'
import api from 'src/utils/api'
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Typography } from "@mui/material";
import { LoadingButton } from "@mui/lab";
const UpdateChecker = () => {
  const [currentVersion, setCurrentVersion] = useState(null);
  const [localVersion, setLocalVersion] = useState(import.meta.env.VITE_APP_PROJECT_VERSION || "1.0.0");
  const [isUpdateAvailable, setIsUpdateAvailable] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [loading , setLoading] = useState(false)
  useEffect(() => {
    // Fetch the current version from the API
    const fetchVersion = async () => {
      try {
        const response = await  axios.get(`${api.protocol}${api.baseUrl}misc/get-current-version`); // Replace with your API endpoint
        setCurrentVersion(response.data.version);

        if (response.data.version !== localVersion) {
          setIsUpdateAvailable(true);
          setIsDialogOpen(true);
        }
      } catch (error) {
        console.error("Error fetching version:", error);
      }
    };

    fetchVersion();
    const intervalId = setInterval(fetchVersion, 30000); // Run every 15 seconds

    return () => clearInterval(intervalId); // Cleanup on component unmount
  }, [localVersion]);

  const handleUpdate = () => {
    // Trigger a service worker update
    setLoading(true)
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker.getRegistrations().then((registrations) => {
        registrations.forEach((registration) => {
          registration.update().then(() => {
            setTimeout(() => {
              window.location.reload();
              handleCloseDialog()
            }
            , 5000)
             // Reload the app to apply the update
          });
        });
      }).catch((error) => {
        alert("Error updating service worker:", error
        );
        handleCloseDialog()
      })
    }
   
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
  };

  return (
    

      <Dialog open={isDialogOpen} onClose={handleCloseDialog}>
        <DialogTitle>Update Available</DialogTitle>
        <DialogContent>
          <Typography>
            A new version of the application is available. Please update to the latest version to enjoy new features and improvements.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} color="secondary">
            Later
          </Button>
          <LoadingButton loading={loading} onClick={handleUpdate} color="primary">
            Update Now
          </LoadingButton>
        </DialogActions>
      </Dialog>

  );
};

export default UpdateChecker;
