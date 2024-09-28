import React from 'react';
import { Typography } from '@mui/material';
import Grid from '@mui/material/Grid2';
import NotificationSummary from './Dasboard/NotificationSummary';
import RealtimeNotifications from './Dasboard/RealtimeNotifications';
import ComponentMonitoring from './Dasboard/ComponentMonitoring';
import TemplatesOverview from './Dasboard/TemplatesOverview';
import NotificationsOverview from './Dasboard/NotificationsOverview';



const DashBoard = () => {

  return (
    <Grid container spacing={3} padding={5}>

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
        <ComponentMonitoring />
      </Grid>

    </Grid >
  );
};

export default DashBoard;
