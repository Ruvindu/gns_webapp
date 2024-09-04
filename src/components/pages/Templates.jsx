import React, { useState } from 'react';
import { Box, Typography, Card, CardContent, TextField, Button, MenuItem, IconButton, Stack, Tooltip, Backdrop, CircularProgress, Snackbar, Alert } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import Grid from '@mui/material/Grid2';
import SaveIcon from '@mui/icons-material/Save';
import DeleteIcon from '@mui/icons-material/Delete';
import RefreshIcon from '@mui/icons-material/Refresh';
import EditIcon from '@mui/icons-material/Edit';

const Templates = () => {

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

    handleOpenBackDrop();

    // Timeout function that rejects the promise after a specified time
    const timeout = (ms) => new Promise((_, reject) => setTimeout(() => reject(new Error('Request timed out')), ms));

    try {
      const { templateType, ...dataToSend } = formData;

      let response = null;
      let fetchMethod = null;
      const fetchWithTimeout = (url) => {
        return Promise.race([
          fetch(url, {
            method: fetchMethod,
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(dataToSend)
          }),
          timeout(10000) // Set timeout to 10 seconds (10000 milliseconds)
        ]);
      };

      if (templateType === "1") {
        if (formData.templateId !== '') {
          fetchMethod = 'PUT';
          response = await fetchWithTimeout('http://localhost:8081/api/templates/update-sms-template');
        } else {
          fetchMethod = 'POST';
          response = await fetchWithTimeout('http://localhost:8081/api/templates/create-sms-template');
        }
      } else {
        if (formData.templateId !== '') {
          fetchMethod = 'PUT';
          response = await fetchWithTimeout('http://localhost:8081/api/templates/update-email-template');
        }
        else {
          fetchMethod = 'POST';
          response = await fetchWithTimeout('http://3.104.30.209:8081/api/templates/create-email-template');
        }
      }

      if (!response.ok) {
        throw new Error('Unexpected error occurred');
      }

      let data = await response.json();
      console.log('Success:', data);

      if (data.status === 1) {
        handleOpenSnackbar(data.narration, 'success');
        handleReset();
      } else {
        handleOpenSnackbar(data.narration, 'error');
      }

    } catch (error) {
      console.error('Error:', error);
      handleOpenSnackbar(error.message, 'error');
    } finally {
      handleCloseBackDrop();
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

  const columns = [
    { field: 'id', headerName: 'TEMPLATE ID', width: 110 },
    { field: 'templateType', headerName: 'TEMPLATE TYPE', width: 130 },
    { field: 'templateDescription', headerName: 'DESCRIPTION', width: 200 },
    { field: 'language', headerName: 'LANGUAGE', width: 150 },
    { field: 'subjectTemplate', headerName: 'SUBJECT TEMPLATE', width: 200 },
    { field: 'bodyTemplate', headerName: 'BODY TEMPLATE', width: 260 }
  ];


  const rows = [
    { id: 1, templateType: 'SMS', templateDescription: "OTP", language: "ENG", subjectTemplate: null, bodyTemplate: "Hi,\n This is your OTP ${otp}" },
    { id: 2, templateType: 'SMS', templateDescription: "OTP", language: "ENG", subjectTemplate: null, bodyTemplate: "Hi,\n This is your OTP ${otp}" }

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
          Notification Templates
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
                  <IconButton aria-label="refresh">
                    <RefreshIcon />
                  </IconButton>
                </Tooltip>

                <Tooltip title="Edit">
                  <IconButton aria-label="edit">
                    <EditIcon />
                  </IconButton>
                </Tooltip>

                <Tooltip title="Delete">
                  <IconButton aria-label="delete">
                    <DeleteIcon />
                  </IconButton>
                </Tooltip>
              </Stack>

            </Box>

            <Box sx={{ height: 407, width: '100%' }}>
              <DataGrid
                rows={rows}
                columns={columns}
                initialState={{ pagination: { paginationModel } }}
                pageSizeOptions={[5, 10]}
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

export default Templates;
