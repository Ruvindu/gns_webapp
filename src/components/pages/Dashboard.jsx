import React, { useState, useEffect, useRef } from 'react';
import { Client } from '@stomp/stompjs';
import SockJS from 'sockjs-client';
import useConfig from '../../useConfig';
import { Typography, Snackbar, Alert, Button, Dialog, DialogTitle, DialogActions, DialogContent, DialogContentText } from '@mui/material';
import Grid from '@mui/material/Grid2';
import NotificationSummary from './Dasboard/NotificationSummary';
import RealtimeNotifications from './Dasboard/RealtimeNotifications';
import ComponentMonitoring from './Dasboard/ComponentMonitoring';
import TemplatesOverview from './Dasboard/TemplatesOverview';
import NotificationsOverview from './Dasboard/NotificationsOverview';
import ConnectivityDiagram from './Dasboard/ConnectivityDiagram';



const DashBoard = () => {

  const config = useConfig();
  const stompClientRef = useRef(null);
  const [wsMsgsToRealtimeNotifications, setWsMsgsToRealtimeNotifications] = useState([]);
  const [wsMsgsToComponentMonitoring, setWsMsgsToComponentMonitoring] = useState(null);
  const [wsMsgsToTemplatesOverview, setWsMsgsToTemplatesOverview] = useState(null);
  const [wsMsgsToNotificationsOverview, setWsMsgsToNotificationsOverview] = useState(null);
  const [wsMsgsToNotificationSummary, setWsMsgsToNotificationSummary] = useState(null);
  // const [wsMsgsToConnectivityDiagram, setWsMsgsToConnectivityDiagram] = useState(null);


  useEffect(() => {
    if (config && !stompClientRef.current) { // Check if stomp ClientRef is already initialized

      const socket = new SockJS(`${config.restProtocol}://${config.host}:${config.port}${config.contextPath}`);
      const stompClient = new Client({
        webSocketFactory: () => socket,
        onConnect: (frame) => {
          stompClient.subscribe(`${config.streamingApi}`, (wsMessage) => {

            try {
              if (wsMessage.body !== null || wsMessage.body !== undefined) {
                let jsonMsg = JSON.parse(wsMessage.body);

                switch (jsonMsg.head.msgType) {
                  case 1:
                    setWsMsgsToRealtimeNotifications((prevMsgs) => [...prevMsgs, jsonMsg]);
                    break;
                  case 2:
                  case 3:
                    setWsMsgsToComponentMonitoring(jsonMsg);
                    break;
                  case 4:
                    setWsMsgsToTemplatesOverview(jsonMsg);
                    setWsMsgsToNotificationsOverview(jsonMsg);
                    break;
                  case 5:
                    setWsMsgsToNotificationSummary(jsonMsg);
                    break;
                  default:
                    console.warn('Unknown message type :', jsonMsg);
                    break;
                }

              }
            } catch (error) {
              console.warn('Error parsing WebSocket message:', error);
            }

          });
        },
        onStompError: (error) => {
          console.error("STOMP error:", error);
        }
      });

      stompClient.activate();
      stompClientRef.current = stompClient;
    }

    return () => {
      if (stompClientRef.current) {
        stompClientRef.current.deactivate();
        stompClientRef.current = null; // Clean up the reference on unmount
      }
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

      <Grid size={{ xs: 12, md: 6 }} marginTop={2}>
        <ConnectivityDiagram />
      </Grid>

    </Grid >
  );
};

export default DashBoard;
