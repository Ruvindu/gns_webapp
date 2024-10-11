import React, { useState } from 'react';
import useConfig from '../../useConfig';
import { Typography, Snackbar, Alert } from '@mui/material';
import Grid from '@mui/material/Grid2';
import NotificationSummary from './Dasboard/NotificationSummary';
import RealtimeNotifications from './Dasboard/RealtimeNotifications';
import ComponentMonitoring from './Dasboard/ComponentMonitoring';
import TemplatesOverview from './Dasboard/TemplatesOverview';
import NotificationsOverview from './Dasboard/NotificationsOverview';



const DashBoard = () => {

  const config = useConfig();

  /* Snackbar */
  const [openSnackbar, setOpenSnackbar] = useState({
    open: false,
    message: '',
    type: ''
  });

  const handleOpenSnackbar = (snackbarMessage, SnackbarType) => {
    setOpenSnackbar({
      open: true,
      message: snackbarMessage,
      type: SnackbarType,
    });
  };

  const handleCloseSnackbar = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }

    setOpenSnackbar(prevState => ({
      ...prevState,
      open: false,
    }));
  };

  return (
    <Grid container spacing={3} padding={5}>

      {/* Helper components */}
      <Snackbar open={openSnackbar.open} anchorOrigin={{ vertical: 'top', horizontal: 'right' }} autoHideDuration={5000} onClose={handleCloseSnackbar} >
        <Alert
          onClose={handleCloseSnackbar}
          severity={openSnackbar.type}
          variant="filled"
          sx={{ width: '100%' }}
        >
          {openSnackbar.message}
        </Alert>
      </Snackbar>


      <Grid size={12}>
        <Typography variant="h6" sx={{ fontWeight: 'bold', color: 'gray' }}>
          Dashboard
        </Typography>
      </Grid>

      <Grid size={{ xs: 12, md: 3 }} marginTop={2}>
        <NotificationsOverview />
      </Grid>

      <Grid size={{ xs: 12, md: 3 }} marginTop={2}>
        <TemplatesOverview />
      </Grid>

      <Grid size={{ xs: 12, md: 6 }} marginTop={2}>
        <RealtimeNotifications />
      </Grid>

      <Grid size={{ xs: 12, md: 6 }} marginTop={2}>
        <NotificationSummary />
      </Grid>

      <Grid size={{ xs: 12, md: 6 }} marginTop={2}>
        <ComponentMonitoring  config={config} handleOpenSnackbar={handleOpenSnackbar}/>
      </Grid>

    </Grid >
  );
};

export default DashBoard;
