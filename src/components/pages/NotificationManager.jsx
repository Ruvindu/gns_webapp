import React, { useState } from 'react';
import axios from 'axios';
import useConfig from '../../useConfig';
import { Box, Typography, Card, CardContent, TextField, Button, Chip, MenuItem, IconButton, Stack, Tooltip, Backdrop, CircularProgress, Snackbar, Alert } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import Grid from '@mui/material/Grid2';
import SendIcon from '@mui/icons-material/Send';
import AttachFileIcon from '@mui/icons-material/AttachFile';
import DeleteIcon from '@mui/icons-material/Delete';
import RefreshIcon from '@mui/icons-material/Refresh';

const NotificationManager = () => {

  const config = useConfig();

  /* BackDrop */
  const [openBackDrop, setOpenBackDrop] = useState(false);
  const handleCloseBackDrop = () => {
    setOpenBackDrop(false);
  };
  const handleOpenBackDrop = () => {
    setOpenBackDrop(true);
  };

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


  /* Notification Form Consts */

  const [formData, setFormData] = useState({
    notificationType: '',
    priority: '',
    templateId: '',
    subject: '',
    body: '',
    recipient: '',
    recipientCC: '',
    recipientBCC: '',
    attachments: [],
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });

    if (name === "notificationType") {
      retriveTemplates(value);
    }
  };

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    setFormData((prevData) => ({
      ...prevData,
      attachments: [...prevData.attachments, ...files],
    }));
  };

  const handleFileDelete = (fileToDelete) => {
    setFormData({
      ...formData,
      attachments: formData.attachments.filter((file) => file !== fileToDelete),
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    //load configurations
    if (!config) {
      console.error('Configuration is not loaded yet.');
      return;
    }

    handleOpenBackDrop();

    // Prepare the form data
    const formDataToSend = new FormData();
    formDataToSend.append('notificationType', formData.notificationType);
    formDataToSend.append('priority', formData.priority);
    formDataToSend.append('templateId', formData.templateId);
    formDataToSend.append('subject', formData.subject);
    formDataToSend.append('body', formData.body);
    formDataToSend.append('recipient', formData.recipient);
    formDataToSend.append('recipientCC', formData.recipientCC);
    formDataToSend.append('recipientBCC', formData.recipientBCC);

    formData.attachments.forEach((file) => {
      formDataToSend.append('attachments', file);
    });

    try {
      const response = await axios.post(`${config.apiBaseUrl}${config.createNotification}`,
        formDataToSend,
      );

      const data = response.data;
      console.log('Success:', data);

      if (data.status === 1) {
        handleOpenSnackbar(data.narration, 'success');
        handleReset();
      } else {
        handleOpenSnackbar(data.narration, 'error');
      }

    } catch (error) {
      console.error('Error:', error);

      if (error.response) {
        // Server responded with a status code outside of the range of 2xx
        handleOpenSnackbar(
          error.response.data.message || 'Unexpected error occurred',
          'error'
        );
      } else if (error.request) {
        // The request was made but no response was received
        handleOpenSnackbar('No response received from server', 'error');
      } else {
        // Something else happened while setting up the request
        handleOpenSnackbar(error.message, 'error');
      }
    } finally {
      handleCloseBackDrop();
    }

  };

  const handleReset = () => {
    setFormData({
      notificationType: '',
      priority: '',
      templateId: '',
      subject: '',
      body: '',
      recipient: '',
      recipientCC: '',
      recipientBCC: '',
      attachments: [],
    });
  };


  /* Retrive Templates */
  const [templateIds, setTemplateIds] = useState([{ value: '0', label: '0 - No Template Selected' }]);

  const retriveTemplates = async (notificationType) => {
    handleOpenBackDrop();

    try {
      let response = null;

      if (notificationType === '1') { // SMS
        response = await axios.get(`${config.apiBaseUrl}${config.getAllSmsTemplates}`);
      } else {
        response = await axios.get(`${config.apiBaseUrl}${config.getAllEmailTemplates}`);
      }

      const data = response.data;
      console.log('Success:', data);

      if (data.status === 1) {
        handleOpenSnackbar(data.narration, 'success');
      } else {
        handleOpenSnackbar(data.narration, 'error');
      }

      // Map response to the structure needed for useState
      const newTemplateOptions = data.content.map(template => ({
        value: template.templateId.toString(),
        label: `${template.templateId} - ${template.templateDescription}`
      }));

      // Update the state, keeping the default value as the first element
      setTemplateIds([
        { value: '0', label: '0 - No Template Selected' },
        ...newTemplateOptions // Add new options from the response
      ]);


    } catch (error) {
      console.error('Error:', error);

      if (error.response) {
        // Server responded with a status code outside of the range of 2xx
        handleOpenSnackbar(
          error.response.data.message || 'Template loading failed. Unexpected error occurred',
          'error'
        );
      } else if (error.request) {
        // The request was made but no response was received
        handleOpenSnackbar('Template loading failed. No response received from server', 'error');
      } else {
        // Something else happened while setting up the request
        handleOpenSnackbar(error.message, 'error');
      }
    } finally {
      handleCloseBackDrop();
    }

  }

  const isSmsSelected = formData.notificationType === "1"; // 1 corresponds to SMS


  /* Notification Table Consts*/

  const columns = [
    // { field: 'id', headerName: 'ID', width: 70 },
    // { field: 'firstName', headerName: 'First name', width: 130 },
    // { field: 'lastName', headerName: 'Last name', width: 130 },
    // {
    //   field: 'age',
    //   headerName: 'Age',
    //   type: 'number',
    //   width: 90,
    // },
    // {
    //   field: 'fullName',
    //   headerName: 'Full name',
    //   description: 'This column has a value getter and is not sortable.',
    //   sortable: false,
    //   width: 160,
    //   valueGetter: (value, row) => `${row.firstName || ''} ${row.lastName || ''}`,
    // },

    { field: 'id', headerName: 'ID', width: 100 },
    { field: 'type', headerName: 'TYPE', width: 100 },
    { field: 'priority', headerName: 'PRIORITY', width: 100 },
    { field: 'template', headerName: 'TEMPLATE', width: 120 },
    { field: 'status', headerName: 'STATUS', width: 100 },
    { field: 'subject', headerName: 'SUBJECT', width: 150 },
    { field: 'body', headerName: 'BODY', width: 200 },
    { field: 'recipient', headerName: 'RECIPIENT', width: 100 },
    { field: 'recipientCC', headerName: 'RECIPIENT CC', width: 100 },
    { field: 'recipientBCC', headerName: 'RECIPIENT BCC', width: 100 },
    { field: 'attachment_available', headerName: 'ATTACHMENT AVAILABLE', width: 100 }
  ];


  const rows = [
    { id: 1, type: 'SMS', priority: 'HIGH', template: 2, status: "SENT", subject: null, body: "Your OTP is 1234", recipient: "0711234500", recipientCC: null, recipientBCC: null, attachment_available: 0 },
    { id: 2, type: 'SMS', priority: 'HIGH', template: 2, status: "SENT", subject: null, body: "Your OTP is 1234", recipient: "0711234500", recipientCC: null, recipientBCC: null, attachment_available: 0 },
    { id: 3, type: 'EMAIL', priority: 'LOW', template: 2, status: "SENT", subject: "OTP Message", body: "Your OTP is 1234", recipient: "test@gmail.com", recipientCC: null, recipientBCC: null, attachment_available: 0 }

  ];

  const paginationModel = { page: 0, pageSize: 10 };

  return (
    <Grid container spacing={3} padding={5}>

      {/* Helper components */}
      <Backdrop
        sx={(theme) => ({ color: '#fff', zIndex: theme.zIndex.drawer + 1 })}
        open={openBackDrop}
      >
        <CircularProgress color="inherit" />
      </Backdrop>

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
          Notification Manager
        </Typography>
      </Grid>

      <Grid size={{ xs: 12, md: 4 }} marginTop={2}>
        <Card variant="outlined">
          <CardContent>
            <Typography gutterBottom sx={{ color: 'text.secondary', fontSize: 17, marginBottom: 2 }}>
              Create New Notification
            </Typography>

            <Box
              component="form"
              onSubmit={handleSubmit}
              onReset={handleReset}
              sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: 2,
                padding: 2,
              }}
            >
              <TextField
                id="notifiation-type-label"
                select
                label="Notification Type"
                defaultValue="1"
                name="notificationType"
                value={formData.notificationType}
                onChange={handleChange}
                size='small'
                required
                fullWidth
              >
                <MenuItem value="1">SMS</MenuItem>
                <MenuItem value="2">Email</MenuItem>
              </TextField>

              <TextField
                id="priority-label"
                select
                label="Priority"
                defaultValue="1"
                name="priority"
                value={formData.priority}
                onChange={handleChange}
                size='small'
                required
                fullWidth
              >
                <MenuItem value="1">High</MenuItem>
                <MenuItem value="2">Low</MenuItem>
              </TextField>

              <TextField
                id="template-id-label"
                select
                label="Template ID"
                defaultValue="0"
                name="templateId"
                value={formData.templateId}
                onChange={handleChange}
                size='small'
                required
                fullWidth
              >
                {templateIds.map((option) => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </TextField>

              <TextField
                label="Subject"
                name="subject"
                value={formData.subject}
                onChange={handleChange}
                fullWidth
                size='small'
                disabled={isSmsSelected}
              />

              <TextField
                label="Body"
                name="body"
                value={formData.body}
                onChange={handleChange}
                fullWidth
                maxRows={10}
                multiline
                size='small'
              />

              <TextField
                label="Recipient"
                name="recipient"
                value={formData.recipient}
                onChange={handleChange}
                fullWidth
                size='small'
              />

              <TextField
                label="Recipient CC"
                name="recipientCC"
                value={formData.recipientCC}
                onChange={handleChange}
                fullWidth
                size='small'
                disabled={isSmsSelected}
              />

              <TextField
                label="Recipient BCC"
                name="recipientBCC"
                value={formData.recipientBCC}
                onChange={handleChange}
                fullWidth
                size='small'
                disabled={isSmsSelected}
              />

              <Button
                variant="outlined"
                component="label"
                fullWidth
                startIcon={<AttachFileIcon />}
                disabled={isSmsSelected}
              >
                Attach Files
                <input
                  type="file"
                  hidden
                  onChange={handleFileChange}
                  multiple
                />
              </Button>

              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                {formData.attachments.map((file, index) => (
                  <Chip
                    key={index}
                    label={file.name}
                    onDelete={() => handleFileDelete(file)}
                    color="primary"
                    variant="outlined"
                  />
                ))}
              </Box>

              <Box sx={{
                display: 'flex',
                flexDirection: 'row',
                alignItems: 'flex-start',
                gap: 2,
                width: '100%'
              }}>
                <Button type="reset" variant="outlined" color="primary" fullWidth>
                  Reset
                </Button>
                <Button type="submit" variant="contained" color="primary" endIcon={<SendIcon />} fullWidth>
                  Send
                </Button>
              </Box>
            </Box>
          </CardContent>
        </Card>
      </Grid>


      <Grid size={{ xs: 12, md: 8 }} marginTop={2}>
        <Card variant='outlined'>
          <CardContent>

            <Box sx={{
              display: "flex",
              justifyContent: 'space-between',
            }} >
              <Typography gutterBottom sx={{ color: 'text.secondary', fontSize: 17, marginBottom: 2 }}>
                All Notification
              </Typography>


              <Stack direction="row" >
                <Tooltip title="Refresh">
                  <IconButton aria-label="refresh">
                    <RefreshIcon />
                  </IconButton>
                </Tooltip>

                <Tooltip title="Re Send">
                  <IconButton aria-label="resend">
                    <SendIcon />
                  </IconButton>
                </Tooltip>

                <Tooltip title="Delete">
                  <IconButton aria-label="delete">
                    <DeleteIcon />
                  </IconButton>
                </Tooltip>
              </Stack>

            </Box>

            <Box sx={{ height: 585, width: '100%' }}>
              <DataGrid
                rows={rows}
                columns={columns}
                initialState={{ pagination: { paginationModel } }}
                pageSizeOptions={[10, 20]}
                checkboxSelection
                sx={{ border: 0 }}
              />
            </Box>

          </CardContent>
        </Card>

      </Grid>
    </Grid >
  );
};

export default NotificationManager;
