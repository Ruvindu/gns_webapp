import React, { useState, useEffect } from 'react';
import axios from 'axios';
import useConfig from '../../useConfig';
import {
  Box, Typography, Card, CardContent, TextField, Button, MenuItem, IconButton, Stack, Tooltip, Backdrop, CircularProgress, Snackbar, Alert, Chip, Dialog, DialogTitle, DialogActions, DialogContent, DialogContentText
} from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import Grid from '@mui/material/Grid2';
import SaveIcon from '@mui/icons-material/Save';
import DeleteIcon from '@mui/icons-material/Delete';
import RefreshIcon from '@mui/icons-material/Refresh';
import EditIcon from '@mui/icons-material/Edit';
import SmsIcon from '@mui/icons-material/Sms';
import EmailIcon from '@mui/icons-material/Email';
import QuestionMarkIcon from '@mui/icons-material/QuestionMark';

const Templates = () => {

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



  /* Template Form Consts */

  const [formData, setFormData] = useState({
    templateId: '',
    templateType: '',
    subjectTemplate: '',
    bodyTemplate: '',
    templateDescription: '',
    language: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    //load configurations
    if (!config) {
      console.error('Configuration is not loaded yet.');
      return;
    }

    handleOpenBackDrop();

    try {
      const { templateType, ...dataToSend } = formData;

      let response = null;

      if (templateType === "1") {
        if (formData.templateId !== '') {
          response = await axios.put(`${config.restProtocol}://${config.host}:${config.port}${config.contextPath}${config.updateSmsTemplate}`,
            dataToSend,
          );
        } else {
          response = await axios.post(`${config.restProtocol}://${config.host}:${config.port}${config.contextPath}${config.createSmsTemplate}`,
            dataToSend,
          );
        }
      } else {
        if (formData.templateId !== '') {
          response = await axios.put(`${config.restProtocol}://${config.host}:${config.port}${config.contextPath}${config.updateEmailTemplate}`,
            dataToSend,
          );
        }
        else {
          response = await axios.post(`${config.restProtocol}://${config.host}:${config.port}${config.contextPath}${config.createEmailTemplate}`,
            dataToSend,
          );
        }
      }


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
      retrieveTemplateRepository();
    }

  };


  const handleReset = () => {
    setFormData({
      templateId: '',
      templateType: '',
      subjectTemplate: '',
      bodyTemplate: '',
      templateDescription: '',
      language: ''
    });
  };

  const isSmsSelected = formData.templateType === "1"; // 1 corresponds to SMS

  const languages = [
    { value: 'ENG', label: 'English' },
    { value: 'SPA', label: 'Spanish' },
    { value: 'FRA', label: 'French' },
    { value: 'DEU', label: 'German' },
    { value: 'ITA', label: 'Italian' },
    { value: 'RUS', label: 'Russian' },
    { value: 'JPN', label: 'Japanese' },
    { value: 'CHN', label: 'Chinese' },
    { value: 'KOR', label: 'Korean' },
    { value: 'ARA', label: 'Arabic' },
    { value: 'HIN', label: 'Hindi' },
    { value: 'POR', label: 'Portuguese' },
    { value: 'NLD', label: 'Dutch' },
    { value: 'SWE', label: 'Swedish' },
    { value: 'NOR', label: 'Norwegian' },
    { value: 'DAN', label: 'Danish' },
    { value: 'FIN', label: 'Finnish' },
    { value: 'GRE', label: 'Greek' },
    { value: 'HEB', label: 'Hebrew' },
    { value: 'TUR', label: 'Turkish' },
    { value: 'POL', label: 'Polish' },
    { value: 'THA', label: 'Thai' },
    { value: 'VIE', label: 'Vietnamese' },
    { value: 'IND', label: 'Indonesian' },
    { value: 'MAL', label: 'Malay' },
    { value: 'BUL', label: 'Bulgarian' },
    { value: 'CZE', label: 'Czech' },
    { value: 'HUN', label: 'Hungarian' },
    { value: 'RON', label: 'Romanian' },
    { value: 'SLK', label: 'Slovak' },
    { value: 'HRV', label: 'Croatian' },
    { value: 'SRP', label: 'Serbian' },
    { value: 'UKR', label: 'Ukrainian' },
    { value: 'LAV', label: 'Latvian' },
    { value: 'LIT', label: 'Lithuanian' },
    { value: 'EST', label: 'Estonian' },
    { value: 'ISL', label: 'Icelandic' },
    { value: 'FIL', label: 'Filipino' },
    { value: 'URD', label: 'Urdu' },
    { value: 'BEN', label: 'Bengali' },
    { value: 'TAM', label: 'Tamil' },
    { value: 'TEL', label: 'Telugu' },
    { value: 'MAR', label: 'Marathi' },
    { value: 'GUJ', label: 'Gujarati' },
    { value: 'KAN', label: 'Kannada' },
    { value: 'PUN', label: 'Punjabi' },
    { value: 'NEP', label: 'Nepali' },
    { value: 'SIN', label: 'Sinhala' },
    { value: 'MYA', label: 'Burmese' },
    { value: 'KHM', label: 'Khmer' },
    { value: 'LAO', label: 'Lao' },
    { value: 'BOS', label: 'Bosnian' },
    { value: 'ALB', label: 'Albanian' },
    { value: 'MKD', label: 'Macedonian' },
    { value: 'ARM', label: 'Armenian' },
    { value: 'GEO', label: 'Georgian' },
    { value: 'AZE', label: 'Azerbaijani' },
    { value: 'KAZ', label: 'Kazakh' },
    { value: 'UZB', label: 'Uzbek' },
    { value: 'TJK', label: 'Tajik' },
    { value: 'KIR', label: 'Kyrgyz' },
    { value: 'TURKM', label: 'Turkmen' },
    { value: 'MONG', label: 'Mongolian' },
    { value: 'ZUL', label: 'Zulu' },
    { value: 'AFR', label: 'Afrikaans' },
    { value: 'SWA', label: 'Swahili' },
    { value: 'YOR', label: 'Yoruba' },
    { value: 'IGB', label: 'Igbo' },
    { value: 'HAU', label: 'Hausa' },
    { value: 'SOM', label: 'Somali' },
    { value: 'AMH', label: 'Amharic' },
    { value: 'TIR', label: 'Tigrinya' },
    { value: 'ORO', label: 'Oromo' },
    { value: 'SOT', label: 'Sesotho' },
    { value: 'TSN', label: 'Tswana' },
    { value: 'XHO', label: 'Xhosa' },
  ];


  /* Template Table Consts*/

  // Custom function to render
  const renderType = (type) => {
    if (type === '1') {
      return <Chip icon={<SmsIcon />} label="SMS" size="small" sx={{ padding: '5px' }} />;

    } else if (type === '2') {
      return <Chip icon={<EmailIcon />} label="Email" size="small" sx={{ padding: '5px' }} />;
    }
    else {
      return <Chip icon={<QuestionMarkIcon />} label="Unknown" size="small" sx={{ padding: '5px' }} />;
    }

  };

  const columns = [
    { field: 'id', headerName: 'ROW NO', width: 100 },
    { field: 'templateId', headerName: 'TEMPLATE ID', width: 110 },
    { field: 'templateType', headerName: 'TEMPLATE TYPE', width: 130, headerAlign: 'center', align: 'center', renderCell: (params) => renderType(params.value) },
    { field: 'templateDescription', headerName: 'DESCRIPTION', width: 200 },
    { field: 'language', headerName: 'LANGUAGE', width: 100 },
    { field: 'subjectTemplate', headerName: 'SUBJECT TEMPLATE', width: 200 },
    { field: 'bodyTemplate', headerName: 'BODY TEMPLATE', width: 300 }
  ];

  const [loading, setLoading] = useState(false);
  const [paginationModel, setPaginationModel] = useState({ page: 0, pageSize: 100 });
  const [templateTableRows, setTemplateTableRows] = useState([]);
  const [totalItems, setTotalItems] = useState(0); // Track total items for pagination
  const [selectedRows, setSelectedRows] = useState([]);

  const retrieveTemplateRepository = async () => {
    setLoading(true);

    /* load configurations */
    if (!config) {
      console.error('Configuration is not loaded yet.');
      return;
    }

    try {
      const response = await axios.get(`${config.restProtocol}://${config.host}:${config.port}${config.contextPath}${config.getTemplateRepository}?page=${paginationModel.page}&size=${paginationModel.pageSize}`);

      const data = response.data;
      console.log('Success:', data);

      //Map response to the structure needed for useState
      const newNotificationTableRows = data.content.map((templateRow, index) => ({
        id: index + 1, // Incremental id based on index
        templateType: templateRow.templateType?.toString() ?? "",
        templateId: templateRow.smsTemplate?.templateId || templateRow.emailTemplate?.templateId || "",
        templateDescription: templateRow.smsTemplate?.templateDescription || templateRow.emailTemplate?.templateDescription || "",
        language: templateRow.smsTemplate?.language || templateRow.emailTemplate?.language || "",
        subjectTemplate: templateRow.emailTemplate?.subjectTemplate || "",
        bodyTemplate: templateRow.smsTemplate?.bodyTemplate || templateRow.emailTemplate?.bodyTemplate || ""
      }));


      // Update the state, keeping the default value as the first element
      setTemplateTableRows(newNotificationTableRows);
      setTotalItems(data.totalItems);


    } catch (error) {
      console.error('Error:', error);

      if (error.response) {
        // Server responded with a status code outside of the range of 2xx
        handleOpenSnackbar(
          error.response.data.message || 'Template repository loading failed. Unexpected error occurred',
          'error'
        );
      } else if (error.request) {
        // The request was made but no response was received
        handleOpenSnackbar('Template repository loading failed. No response received from server', 'error');
      } else {
        // Something else happened while setting up the request
        handleOpenSnackbar(error.message, 'error');
      }
    } finally {
      setLoading(false);
    }

  }

  //Fetch notifications on component mount and when pagination model changes
  useEffect(() => {
    if (config) {
      retrieveTemplateRepository(paginationModel.page, paginationModel.pageSize);
    }
  }, [config, paginationModel]);


  const editSelectedRow = () => {
    if (!selectedRows.length > 0) {
      handleOpenSnackbar('No templates seleted', 'warning');
      return;
    }

    if (selectedRows.length === 1) {
      //get first selected row
      const rowToEdit = templateTableRows.find((templateTableRows) => templateTableRows.id === selectedRows[0]);

      setFormData({
        templateId: rowToEdit.templateId,
        templateType: rowToEdit.templateType,
        subjectTemplate: rowToEdit.subjectTemplate,
        bodyTemplate: rowToEdit.bodyTemplate,
        templateDescription: rowToEdit.templateDescription,
        language: rowToEdit.language
      });

    } else {
      handleOpenSnackbar('Can not edit multiple rows. Select a single row', 'warning');
    }
  }

  const deleteSelectedRows = () => {

    if (!selectedRows.length > 0) {
      handleOpenSnackbar('No templates seleted', 'warning');
      return;
    }

    handleOpenDialog(
      "Are you sure want to delete this templates?",
      "This action cannot be undone.",
      deleteTemplates
    );
  }

  const deleteTemplates = async () => {
    handleOpenBackDrop();
    handleCloseDialog();

    // Create an array to hold the data
    let dataToDelete = selectedRows.map(selectedRowId => {
      // Find the corresponding row in the templateTableRows
      const rowToDelete = templateTableRows.find(row => row.id === selectedRowId);
      return {
        templateType: rowToDelete.templateType,
        templateId: rowToDelete.templateId
      };
    });

    console.log(dataToDelete);


    try {

      const response = await axios.delete(`${config.restProtocol}://${config.host}:${config.port}${config.contextPath}${config.deleteAnyTemplate}`, {
        data: dataToDelete
      });

      const data = response.data;
      console.log('Success:', data);


    } catch (error) {
      console.error('Error:', error);

      if (error.response) {
        // Server responded with a status code outside of the range of 2xx
        handleOpenSnackbar(
          error.response.data.message || 'Templates delete failed. Unexpected error occurred',
          'error'
        );
      } else if (error.request) {
        // The request was made but no response was received
        handleOpenSnackbar('Templates delete failed. No response received from server', 'error');
      } else {
        // Something else happened while setting up the request
        handleOpenSnackbar(error.message, 'error');
      }
    } finally {
      handleCloseBackDrop();
      retrieveTemplateRepository()
    }

  };


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
          Template Repository
        </Typography>
      </Grid>

      <Grid size={{ xs: 12, md: 4 }} marginTop={2}>
        <Card variant="outlined">
          <CardContent>
            <Typography gutterBottom sx={{ color: 'text.secondary', fontSize: 17, marginBottom: 2 }}>
              Create/Update Template
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
                label="Template ID"
                name="templateId"
                value={formData.templateId}
                onChange={handleChange}
                fullWidth
                size='small'
                disabled
              />

              <TextField
                id="template-type"
                select
                label="Template Type"
                defaultValue="1"
                name="templateType"
                value={formData.templateType}
                onChange={handleChange}
                size='small'
                required
                fullWidth
              >
                <MenuItem value="1">SMS</MenuItem>
                <MenuItem value="2">Email</MenuItem>
              </TextField>

              <TextField
                label="Subject Template"
                name="subjectTemplate"
                value={formData.subjectTemplate}
                onChange={handleChange}
                fullWidth
                size='small'
                disabled={isSmsSelected}
              />

              <TextField
                label="Body Template"
                name="bodyTemplate"
                value={formData.bodyTemplate}
                onChange={handleChange}
                fullWidth
                maxRows={10}
                multiline
                required
                size='small'
              />

              <TextField
                label="Template Description"
                name="templateDescription"
                value={formData.templateDescription}
                onChange={handleChange}
                fullWidth
                required
                size='small'
              />

              <TextField
                id="language"
                select
                label="Language"
                defaultValue="1"
                name="language"
                value={formData.language}
                onChange={handleChange}
                size='small'
                required
                fullWidth
              >
                {languages.map((option) => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </TextField>

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
                <Button type="submit" variant="contained" color="primary" startIcon={<SaveIcon />} fullWidth>
                  Save
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
                All Templates
              </Typography>


              <Stack direction="row" >
                <Tooltip title="Refresh">
                  <IconButton aria-label="refresh" onClick={() => retrieveTemplateRepository()}>
                    <RefreshIcon />
                  </IconButton>
                </Tooltip>

                <Tooltip title="Edit">
                  <IconButton aria-label="edit" onClick={() => editSelectedRow()}>
                    <EditIcon />
                  </IconButton>
                </Tooltip>

                <Tooltip title="Delete">
                  <IconButton aria-label="delete" onClick={() => deleteSelectedRows()}>
                    <DeleteIcon />
                  </IconButton>
                </Tooltip>
              </Stack>

            </Box>

            <Box sx={{ height: 407, width: '100%' }}>
              <DataGrid
                rows={templateTableRows}
                columns={columns}
                loading={loading}
                pagination
                paginationMode="server"
                rowCount={totalItems}
                pageSize={paginationModel.pageSize}
                page={paginationModel.page}
                onPaginationModelChange={(newPaginationModel) => {
                  console.log(newPaginationModel);
                  setPaginationModel(newPaginationModel);
                }}
                checkboxSelection
                onRowSelectionModelChange={(newSelection) => {
                  setSelectedRows(newSelection);
                }}
                onSelectionModelChange={(newSelection) => {
                  console.log(newSelection);
                }}
                sx={{ border: 0 }}
              />
            </Box>

          </CardContent>
        </Card>

      </Grid>
    </Grid >
  );
};

export default Templates;
