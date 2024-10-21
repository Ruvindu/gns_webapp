import React, { useState, useEffect } from 'react';
import { Typography, Card, CardContent } from '@mui/material';
import { BarChart } from '@mui/x-charts';
import { useTheme } from '@mui/material/styles';
import useWsHandler from '../../../useWsHandler';


const NotificationSummary = () => {

    const theme = useTheme();
    const wsMessages = useWsHandler();

    const [dates, setDates] = useState([]);
    const [processed, setProcessed] = useState([]);
    const [failed, setFailed] = useState([]);

    const updateNotificationsSummary= (jsonMsg) => {
        setDates(jsonMsg.data.dates);
        setProcessed(jsonMsg.data.totalProcessed);
        setFailed(jsonMsg.data.totalFailed);
    }

    useEffect(() => {
        try {
            if (wsMessages !== undefined) {
                let msg = JSON.parse(wsMessages);

                if (msg.head.msgType === 5) updateNotificationsSummary(msg);
            }
        } catch (error) {
            console.warn('Error parsing WebSocket message:', error);
        }
    }, [wsMessages]);


    return (
        <Card variant="outlined" sx={{ minHeight: "490px" }}>
            <CardContent>
                <Typography gutterBottom sx={{ color: 'text.secondary', fontSize: 17, marginBottom: 2 }}>
                    Notification summary
                </Typography>
                <BarChart
                    xAxis={[
                        { scaleType: 'band', data: dates }
                    ]}
                    series={[
                        { data: processed, label: 'Processed', stack: '1' },
                        { data: failed, label: 'Failed', color: theme.palette.error.light, stack: '1' },
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
