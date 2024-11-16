import React, { useState, useEffect } from 'react';
import { Box, Typography, Card, CardContent, Skeleton } from '@mui/material';
import { PieChart } from '@mui/x-charts';


const NotificationsOverview = ({ wsMessages }) => {

  const [smsNotificationsPresentage, setSmsNotificationsPresentage] = useState(0);
  const [emailNotificationsPresentage, setEmailNotificationsPresentage] = useState(0);
  const [totalSmsNotifications, setTotalSmsNotifications] = useState(0);
  const [totalEmailNotifications, setTotalEmailNotifications] = useState(0);
  const [totalNotifications, setTotalNotifications] = useState(0);


  const updateNotificationsOverview = (jsonMsg) => {
    setSmsNotificationsPresentage(jsonMsg.data.notificationOverview.smsNotificationPercentage);
    setEmailNotificationsPresentage(jsonMsg.data.notificationOverview.emailNotificationPercentage);
    setTotalSmsNotifications(jsonMsg.data.notificationOverview.totalSmsNotifications);
    setTotalEmailNotifications(jsonMsg.data.notificationOverview.totalEmailNotifications);
    setTotalNotifications(jsonMsg.data.notificationOverview.totalNotifications);
  }


  useEffect(() => {
    if (wsMessages !== null) {
      updateNotificationsOverview(wsMessages);
    }
  }, [wsMessages]);


  return (
    <Card variant="outlined" sx={{ minHeight: "340px" }}>
      <CardContent>
        <Typography gutterBottom sx={{ color: 'text.secondary', fontSize: 17, marginBottom: 2 }}>
          Notifications Overview
        </Typography>
        <Box sx={{
          display: "flex",
          justifyContent: 'space-between',
        }}>

          {
            (smsNotificationsPresentage && emailNotificationsPresentage) ? (
              <PieChart
                series={[
                  {
                    data: [
                      { id: 0, percentage: smsNotificationsPresentage, value: totalSmsNotifications, label: 'SMS' },
                      { id: 1, percentage: emailNotificationsPresentage, value: totalEmailNotifications, label: 'Emails' },
                    ],
                    highlightScope: { fade: 'global', highlight: 'item' },
                    faded: { innerRadius: 30, additionalRadius: -30, color: 'gray' },
                    arcLabel: (item) => `${item.percentage}%`,
                  },
                ]}
                width={380}
                height={215}
              />

            ) : (
              <Skeleton variant="rounded" width="100%" height={215} />
            )
          }
        </Box>
      </CardContent>
      <Box>
        {
          totalNotifications ? (
            <Typography gutterBottom sx={{ color: 'text.secondary', fontSize: 14, marginBottom: 2, marginLeft: 2 }}>
              Total Notificaions : {totalNotifications}
            </Typography>

          ) : (
            <Skeleton variant="rounded" width={220} sx={{ marginBottom: 2, marginLeft: 2 }} />
          )
        }
      </Box>
    </Card>
  );
};

export default NotificationsOverview;
