import React from 'react';
import { Typography, Card, CardContent } from '@mui/material';
import { BarChart } from '@mui/x-charts';
import { useTheme } from '@mui/material/styles';


const NotificationSummary = () => {

    const theme = useTheme();

    return (
        <Card variant="outlined" sx={{ minHeight: "490px" }}>
            <CardContent>
                <Typography gutterBottom sx={{ color: 'text.secondary', fontSize: 17, marginBottom: 2 }}>
                    Notification summary
                </Typography>
                <BarChart
                    xAxis={[
                        { scaleType: 'band', data: ['09/22', '09/23', '09/24', '09/25', '09/26', '09/27', '09/28'] }
                    ]}
                    series={[
                        { data: [10, 15, 12, 2, 30], label: 'Processed', stack: '1' },
                        { data: [5, 10, 8, 0, 0], label: 'Processing', color: theme.palette.primary.light, stack: '1' },
                        { data: [5, 10, 8, 4, 1], label: 'Failed', color: theme.palette.error.light, stack: '1' },
                    ]}
                    //slotProps={{ legend: { hidden: true } }}
                    width={700}
                    height={400}
                />

            </CardContent>
        </Card>
    );
};

export default NotificationSummary;
