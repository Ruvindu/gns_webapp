import React, { useState, useEffect } from 'react';
import axios from 'axios';
import useConfig from '../../useConfig';
import {
  Box, Typography, Card, CardContent, TextField, Button, MenuItem, IconButton, Stack, Tooltip, Backdrop, CircularProgress, Snackbar, Alert, Chip, Dialog, DialogTitle, DialogActions, DialogContent, DialogContentText
} from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import Grid from '@mui/material/Grid2';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import RefreshIcon from '@mui/icons-material/Refresh';

const Cache = () => {

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


  /* Common */
  const [loadingTbl1, setLoadingTbl1] = useState(false);
  const [loadingTbl2, setLoadingTbl2] = useState(false);


  /* Cache enties */
  const [cacheEntriesRows, setCacheEntriesRows] = useState([]);
  const [selectedEntryRow, setSelectedEntryRow] = useState([]);

  const cacheEntiesColumns = [
    { field: 'id', headerName: 'ROW NO', width: 100 },
    { field: 'size', headerName: 'SIZE', width: 100 },
    { field: 'entryName', headerName: 'ENTRY NAME', flex: 1 }
  ];

  const retrieveCacheEntriesRow = async () => {
    setLoadingTbl1(true);

    try {
      const response = await axios.get(`${config.restProtocol}://${config.host}:${config.port}${config.contextPath}${config.getCacheEntries}`);

      const data = response.data;
      console.log('Success:', data);

      //Map response to the structure needed for useState
      const newCacheEntriesRows = data.content.map((entriesRow, index) => ({
        id: index + 1, // Incremental id based on index
        size: entriesRow.cacheEntrySize,
        entryName: entriesRow.cacheEntryName
      }));

      // Update the state
      setCacheEntriesRows(newCacheEntriesRows);

    } catch (error) {
      console.error('Error:', error);

      if (error.response) {
        // Server responded with a status code outside of the range of 2xx
        handleOpenSnackbar(
          error.response.data.message || 'Cache entries loading failed. Unexpected error occurred',
          'error'
        );
      } else if (error.request) {
        // The request was made but no response was received
        handleOpenSnackbar('Cache entries loading failed. No response received from server', 'error');
      } else {
        // Something else happened while setting up the request
        handleOpenSnackbar(error.message, 'error');
      }
    } finally {
      setLoadingTbl1(false);
    }
  }


  const clearSelectedCacheEntry = () => {
    if (!selectedEntryRow.length > 0) {
      handleOpenSnackbar('No entries seleted', 'warning');
      return;
    }

    handleOpenDialog(
      `Are you sure want to clear this cache entry?`,
      `This action cannot be undone.`,
      clearCacheEntry
    );
  }

  const clearCacheEntry = async () => {
    handleCloseDialog();

    try {
      const selectetEntryToGetObj = cacheEntriesRows.find((cacheEntriesRows) => cacheEntriesRows.id === selectedEntryRow[0]);

      if (!selectetEntryToGetObj.size > 0) {
        handleOpenSnackbar(`${selectetEntryToGetObj.entryName} entry is already empty`, 'warning');
        return;
      }

      const response = await axios.post(`${config.restProtocol}://${config.host}:${config.port}${config.contextPath}${config.clearCacheEntry}${selectetEntryToGetObj.entryName}`);

      const data = response.data;
      console.log('Success:', data);

      handleOpenSnackbar(`${selectetEntryToGetObj.entryName} Entry cleared`, 'success');

    } catch (error) {
      console.error('Error:', error);

      if (error.response) {
        // Server responded with a status code outside of the range of 2xx
        handleOpenSnackbar(
          error.response.data.message || 'Failed to clear cache entry. Unexpected error occurred',
          'error'
        );
      } else if (error.request) {
        // The request was made but no response was received
        handleOpenSnackbar('Failed to clear cache entry. No response received from server', 'error');
      } else {
        // Something else happened while setting up the request
        handleOpenSnackbar(error.message, 'error');
      }
    } finally {
      setCacheObjectsRows([]);
      retrieveCacheEntriesRow();
    }

  }

  //Fetch Cache enties
  useEffect(() => {
    if (config) {
      retrieveCacheEntriesRow();
    }
  }, [config]);




  /* Cache objects */
  const [cacheObjectsRows, setCacheObjectsRows] = useState([]);
  const [selectedObjectsRows, setSelectedObjectsRows] = useState([]);

  const cacheObjectsColumns = [
    { field: 'id', headerName: 'ROW NO', width: 100 },
    { field: 'cacheObjId', headerName: 'CACHE ID', width: 100 },
    { field: 'cacheObjValue', headerName: 'CACHE VALUE', flex: 1 }
  ];


  const retrieveCacheObjectsRow = async () => {
    if (!selectedEntryRow.length > 0) {
      return;
    }

    setLoadingTbl2(true);

    try {
      const selectetEntryToGetObj = cacheEntriesRows.find((cacheEntriesRows) => cacheEntriesRows.id === selectedEntryRow[0]);
      const response = await axios.get(`${config.restProtocol}://${config.host}:${config.port}${config.contextPath}${config.getCacheObjects}${selectetEntryToGetObj.entryName}`);

      const data = response.data;
      console.log('Success:', data);

      //Map response to the structure needed for useState
      const newCacheObjectsRows = data.content.map((objectRow, index) => ({
        id: index + 1, // Incremental id based on index
        cacheObjId: objectRow.cacheObjectId,
        cacheObjValue: objectRow.cacheObject
      }));

      // Update the state
      setCacheObjectsRows(newCacheObjectsRows);

    } catch (error) {
      console.error('Error:', error);

      if (error.response) {
        // Server responded with a status code outside of the range of 2xx
        handleOpenSnackbar(
          error.response.data.message || 'Cache objects loading failed. Unexpected error occurred',
          'error'
        );
      } else if (error.request) {
        // The request was made but no response was received
        handleOpenSnackbar('Cache objects loading failed. No response received from server', 'error');
      } else {
        // Something else happened while setting up the request
        handleOpenSnackbar(error.message, 'error');
      }
    } finally {
      setLoadingTbl2(false);
    }
  }


  const clearSelectedCacheObjects = () => {
    if (!selectedObjectsRows.length > 0) {
      handleOpenSnackbar('No cache objects seleted', 'warning');
      return;
    }

    handleOpenDialog(
      `Are you sure want to clear this cache object(s)?`,
      `You have selected ${selectedObjectsRows.length} cache object(s) to clear. This action cannot be undone.`,
      clearCacheObjects
    );
  }

  const clearCacheObjects = async () => {
    handleCloseDialog();

    try {

      let objIdsToClear = selectedObjectsRows.map(element =>
        cacheObjectsRows.find(cacheObjectsRow => cacheObjectsRow.id === element).cacheObjId
      );

      const selectetEntryToGetObj = cacheEntriesRows.find((cacheEntriesRows) => cacheEntriesRows.id === selectedEntryRow[0]);
      const response = await axios.post(`${config.restProtocol}://${config.host}:${config.port}${config.contextPath}${config.clearCacheObjects}${selectetEntryToGetObj.entryName}`,
        objIdsToClear
      );

      const data = response.data;
      console.log('Success:', data);

      handleOpenSnackbar(`Cache objects cleared`, 'success');

    } catch (error) {
      console.error('Error:', error);

      if (error.response) {
        // Server responded with a status code outside of the range of 2xx
        handleOpenSnackbar(
          error.response.data.message || 'Failed to clear cache objects. Unexpected error occurred',
          'error'
        );
      } else if (error.request) {
        // The request was made but no response was received
        handleOpenSnackbar('Failed to clear cache objects. No response received from server', 'error');
      } else {
        // Something else happened while setting up the request
        handleOpenSnackbar(error.message, 'error');
      }
    } finally {
      retrieveCacheObjectsRow();
      retrieveCacheEntriesRow();
    }

  }

  //Fetch Cache objects
  useEffect(() => {
    if (config, selectedEntryRow) {
      retrieveCacheObjectsRow();
    }
  }, [config, selectedEntryRow]);


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
          Cache Manager
        </Typography>
      </Grid>

      <Grid size={{ xs: 12, md: 5 }} marginTop={2}>
        <Card variant="outlined">
          <CardContent>

            <Box sx={{
              display: "flex",
              justifyContent: 'space-between',
            }} >
              <Typography gutterBottom sx={{ color: 'text.secondary', fontSize: 17, marginBottom: 2 }}>
                All Cache Entries
              </Typography>


              <Stack direction="row" >
                <Tooltip title="Refresh">
                  <IconButton aria-label="Refresh" onClick={() => retrieveCacheEntriesRow()} >
                    <RefreshIcon />
                  </IconButton>
                </Tooltip>

                <Tooltip title="Clear">
                  <IconButton aria-label="Clear" onClick={() => clearSelectedCacheEntry()}>
                    <DeleteForeverIcon />
                  </IconButton>
                </Tooltip>
              </Stack>

            </Box>

            <Box sx={{ height: 407, width: '100%' }}>
              <DataGrid
                rows={cacheEntriesRows}
                columns={cacheEntiesColumns}
                loading={loadingTbl1}
                onRowSelectionModelChange={(newSelection) => {
                  setSelectedEntryRow(newSelection)
                }}
                sx={{ border: 0 }}
              />
            </Box>

          </CardContent>
        </Card>
      </Grid>


      <Grid size={{ xs: 12, md: 7 }} marginTop={2}>
        <Card variant='outlined'>
          <CardContent>

            <Box sx={{
              display: "flex",
              justifyContent: 'space-between',
            }} >
              <Typography gutterBottom sx={{ color: 'text.secondary', fontSize: 17, marginBottom: 2 }}>
                Cache Objects
              </Typography>


              <Stack direction="row" >
                <Tooltip title="Refresh">
                  <IconButton aria-label="Refresh" onClick={() => retrieveCacheObjectsRow()}>
                    <RefreshIcon />
                  </IconButton>
                </Tooltip>

                <Tooltip title="Clear">
                  <IconButton aria-label="Clear" onClick={() => clearSelectedCacheObjects()}>
                    <DeleteForeverIcon />
                  </IconButton>
                </Tooltip>
              </Stack>

            </Box>

            <Box sx={{ height: 407, width: '100%' }}>
              <DataGrid
                rows={cacheObjectsRows}
                columns={cacheObjectsColumns}
                loading={loadingTbl2}
                checkboxSelection
                onRowSelectionModelChange={(newSelection) => {
                  setSelectedObjectsRows(newSelection);
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

export default Cache;
