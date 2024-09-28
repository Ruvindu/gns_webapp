import React from 'react';
import { Box, Typography, Card, CardContent} from '@mui/material';
import { PieChart } from '@mui/x-charts';


const NotificationsOverview= () => {

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
              <PieChart
                series={[
                  {
                    data: [
                      { id: 0, value: 60, label: 'SMS' },
                      { id: 1, value: 152, label: 'Emails' },
                    ],
                    highlightScope: { fade: 'global', highlight: 'item' },
                    faded: { innerRadius: 30, additionalRadius: -30, color: 'gray' },
                    arcLabel: (item) => `${item.value}%`,
                  },
                ]}
                width={380}
                height={215}
              />
            </Box>
          </CardContent>
          <Box>
            <Typography gutterBottom sx={{ color: 'text.secondary', fontSize: 14, marginBottom: 2, marginLeft: 2 }}>
              Total Notificaions : {1000}
            </Typography>
          </Box>
        </Card>
    );
};

export default NotificationsOverview;
