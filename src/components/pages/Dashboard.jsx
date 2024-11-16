import React, { useState, useEffect } from 'react';
import useConfig from '../../useConfig';
import { Typography, Snackbar, Alert, Button, Dialog, DialogTitle, DialogActions, DialogContent, DialogContentText } from '@mui/material';
import Grid from '@mui/material/Grid2';
import NotificationSummary from './Dasboard/NotificationSummary';
import RealtimeNotifications from './Dasboard/RealtimeNotifications';
import ComponentMonitoring from './Dasboard/ComponentMonitoring';
import TemplatesOverview from './Dasboard/TemplatesOverview';
import NotificationsOverview from './Dasboard/NotificationsOverview';
import ExternalConnections from './Dasboard/ExternalConnections';



const DashBoard = () => {

  const config = useConfig();
  const [wsMsgsToRealtimeNotifications, setWsMsgsToRealtimeNotifications] = useState([]);
  const [wsMsgsToComponentMonitoring, setWsMsgsToComponentMonitoring] = useState([]);
  const [wsMsgsToTemplatesOverview, setWsMsgsToTemplatesOverview] = useState(null);
  const [wsMsgsToNotificationsOverview, setWsMsgsToNotificationsOverview] = useState(null);
  const [wsMsgsToNotificationSummary, setWsMsgsToNotificationSummary] = useState(null);
  const [wsMsgsToExternalConnections, setWsMsgsToExternalConnections] = useState([]);

  let socket;

  useEffect(() => {
    const connectWebSocket = () => {
      if (config && !socket) {
        socket = new WebSocket(`${config.wsProtocol}://${config.host}:${config.port}${config.contextPath}${config.streamingApi}`);

        socket.onmessage = (event) => {
          try {
            let wsMessage = event.data;
            if (wsMessage !== null || wsMessage !== undefined) {
              let jsonMsg = JSON.parse(wsMessage);

              switch (jsonMsg.head.msgType) {
                case 1:
                  setWsMsgsToRealtimeNotifications((prevMsgs) => [...prevMsgs, jsonMsg]);
                  break;
                case 2:
                case 3:
                  setWsMsgsToComponentMonitoring((prevMsgs) => [...prevMsgs, jsonMsg]);
                  break;
                case 4:
                  setWsMsgsToTemplatesOverview(jsonMsg);
                  setWsMsgsToNotificationsOverview(jsonMsg);
                  break;
                case 5:
                  setWsMsgsToNotificationSummary(jsonMsg);
                  break;
                case 6:
                  setWsMsgsToExternalConnections((prevMsgs) => [...prevMsgs, jsonMsg]);
                  break;
                default:
                  console.warn('Unknown message type :', jsonMsg);
                  break;
              }

            }
          } catch (error) {
            console.warn('Error parsing WebSocket message:', error);
          }

        };

        socket.onopen = () => {
          console.log('WebSocket connected');
        };

        socket.onclose = () => {
          console.log('WebSocket disconnected');
          socket = null;
        };

        socket.onerror = (error) => {
          console.log('WebSocket error: ', error);
        };
      }
    };

    connectWebSocket(); // Initial connection attempt

    const intervalId = setInterval(() => {
      if (!socket || socket.readyState !== WebSocket.OPEN) {
        connectWebSocket(); // Attempt to reconnect if not connected
      }
    }, 6000); // Retry every 10 seconds


    return () => {
      clearInterval(intervalId); // Clear the interval on cleanup
    };
  }, [config]);


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

  /* Dialog box */
  const [openDialog, setOpenDialog] = useState({
    open: false,
    title: '',
    content: '',
    callback: () => { }
  });

  const handleCloseDialog = () => {
    setOpenDialog(prevState => ({
      ...prevState,
      open: false,
    }));
  };

  const handleOpenDialog = (dialogTitle, dialogContent, customAction) => {
    setOpenDialog({
      open: true,
      title: dialogTitle,
      content: dialogContent,
      callback: customAction
    });
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

      <Dialog
        open={openDialog.open}
        onClose={handleCloseDialog}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          {openDialog.title}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            {openDialog.content}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>No</Button>
          <Button onClick={openDialog.callback} autoFocus>Yes</Button>
        </DialogActions>
      </Dialog>



      <Grid size={12}>
        <Typography variant="h6" sx={{ fontWeight: 'bold', color: 'gray' }}>
          Dashboard
        </Typography>
      </Grid>

      <Grid size={{ xs: 12, md: 3 }} marginTop={2}>
        <NotificationsOverview wsMessages={wsMsgsToNotificationsOverview} />
      </Grid>

      <Grid size={{ xs: 12, md: 3 }} marginTop={2}>
        <TemplatesOverview wsMessages={wsMsgsToTemplatesOverview} />
      </Grid>

      <Grid size={{ xs: 12, md: 6 }} marginTop={2}>
        <RealtimeNotifications wsMessages={wsMsgsToRealtimeNotifications} />
      </Grid>

      <Grid size={{ xs: 12, md: 6 }} marginTop={2}>
        <NotificationSummary wsMessages={wsMsgsToNotificationSummary} />
      </Grid>

      <Grid size={{ xs: 12, md: 6 }} marginTop={2}>
        <ComponentMonitoring config={config} wsMessages={wsMsgsToComponentMonitoring} handleOpenSnackbar={handleOpenSnackbar} handleOpenDialog={handleOpenDialog} handleCloseDialog={handleCloseDialog} />
      </Grid>

      <Grid size={{ xs: 12, md: 4 }} marginTop={2}>
        <ExternalConnections wsMessages={wsMsgsToExternalConnections} />
      </Grid>

    </Grid >
  );
};

export default DashBoard;
