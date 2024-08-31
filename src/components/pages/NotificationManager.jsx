import React, { useState } from 'react';
import { Box, Paper, Typography, Card, CardContent, TextField, Button, Chip, MenuItem } from '@mui/material';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import Grid from '@mui/material/Grid2';
import SendIcon from '@mui/icons-material/Send';
import AttachFileIcon from '@mui/icons-material/AttachFile';

const NotificationManager = () => {

  /* Notification Form Consts*/

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

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(formData);
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

  const templateIds = [
    { value: '0', label: '0 - No Template Selected' },
    { value: '1', label: '1' },
    { value: '2', label: '2' },
  ];

  const isSmsSelected = formData.notificationType === "1"; // 1 corresponds to SMS


  /* Notification Table Consts*/

  const columns = [
    { field: 'id', headerName: 'ID', width: 70 },
    { field: 'firstName', headerName: 'First name', width: 130 },
    { field: 'lastName', headerName: 'Last name', width: 130 },
    {
      field: 'age',
      headerName: 'Age',
      type: 'number',
      width: 90,
    },
    {
      field: 'fullName',
      headerName: 'Full name',
      description: 'This column has a value getter and is not sortable.',
      sortable: false,
      width: 160,
      valueGetter: (value, row) => `${row.firstName || ''} ${row.lastName || ''}`,
    },
  ];
  
  
  const rows = [
    { id: 1, lastName: 'Snow', firstName: 'Jon', age: 35 },
    { id: 2, lastName: 'Lannister', firstName: 'Cersei', age: 42 },
    { id: 3, lastName: 'Lannister', firstName: 'Jaime', age: 45 },
    { id: 4, lastName: 'Stark', firstName: 'Arya', age: 16 },
    { id: 5, lastName: 'Targaryen', firstName: 'Daenerys', age: null },
    { id: 6, lastName: 'Melisandre', firstName: null, age: 150 },
    { id: 7, lastName: 'Clifford', firstName: 'Ferrara', age: 44 },
    { id: 8, lastName: 'Frances', firstName: 'Rossini', age: 36 },
    { id: 9, lastName: 'Roxie', firstName: 'Harvey', age: 65 },
  ];
  
  const paginationModel = { page: 0, pageSize: 10 };

  return (
    <Grid container spacing={3} padding={5}>
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
        
        <Paper sx={{ height: 666, width: '100%' }}>
          <DataGrid
            rows={rows}
            columns={columns}
            initialState={{ pagination: { paginationModel } }}
            pageSizeOptions={[10, 20]}
            checkboxSelection
            sx={{ border: 0 }}
          />
        </Paper>

      </Grid>
    </Grid>
  );
};

export default NotificationManager;
