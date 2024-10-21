import React, { useState, useEffect } from 'react';
import { Box, Typography, Card, CardContent, Skeleton } from '@mui/material';
import { PieChart } from '@mui/x-charts';
import useWsHandler from '../../../useWsHandler';


const TemplatesOverview = () => {

    const palette = ['gray', 'orange', 'brown'];

    const wsMessages = useWsHandler();

    const [smsTemplatesPresentage, setSmsTemplatesPresentage] = useState(0);
    const [emailTemplatesPresentage, setEmailTemplatesPresentage] = useState(0);
    const [totalSmsTemplates, setTotalSmsTemplates] = useState(0);
    const [totalEmailTemplates, setTotalEmailTemplates] = useState(0);
    const [totalTemplates, setTotalTemplates] = useState(0);


    const updateNotificationsOverview = (jsonMsg) => {
        setSmsTemplatesPresentage(jsonMsg.data.templateOverview.smsTemplatePercentage);
        setEmailTemplatesPresentage(jsonMsg.data.templateOverview.emailTemplatePercentage);
        setTotalSmsTemplates(jsonMsg.data.templateOverview.totalSmsTemplates);
        setTotalEmailTemplates(jsonMsg.data.templateOverview.totalEmailTemplates);
        setTotalTemplates(jsonMsg.data.templateOverview.totalTemplates);
    }


    useEffect(() => {
        try {
            if (wsMessages !== undefined) {
                let msg = JSON.parse(wsMessages);

                if (msg.head.msgType === 4) updateNotificationsOverview(msg);
            }
        } catch (error) {
            console.warn('Error parsing WebSocket message:', error);
        }
    }, [wsMessages]);

    return (
        <Card variant="outlined" sx={{ minHeight: "340px" }}>
            <CardContent>
                <Typography gutterBottom sx={{ color: 'text.secondary', fontSize: 17, marginBottom: 2 }}>
                    Templates Overview
                </Typography>
                <Box sx={{
                    display: "flex",
                    justifyContent: 'space-between',
                }}>
                    {
                        (smsTemplatesPresentage && emailTemplatesPresentage) ? (
                            <PieChart
                                series={[
                                    {
                                        data: [
                                            { id: 0, percentage: smsTemplatesPresentage, value: totalSmsTemplates, label: 'SMS' },
                                            { id: 1, percentage: emailTemplatesPresentage, value: totalEmailTemplates, label: 'Emails' },
                                        ],
                                        highlightScope: { fade: 'global', highlight: 'item' },
                                        faded: { innerRadius: 30, additionalRadius: -30, color: 'gray' },
                                        arcLabel: (item) => `${item.percentage}%`,
                                    },
                                ]}
                                colors={palette}
                                width={380}
                                height={215}
                            />

                        ) : (
                            <Skeleton variant="rounded" width={380} height={215} />
                        )
                    }
                </Box>
            </CardContent>
            <Box>
                {
                    totalTemplates ? (
                        <Typography gutterBottom sx={{ color: 'text.secondary', fontSize: 14, marginBottom: 2, marginLeft: 2 }}>
                            Total Templates : {totalTemplates}
                        </Typography>

                    ) : (
                        <Skeleton variant="rounded" width={220} sx={{ marginBottom: 2, marginLeft: 2 }} />
                    )
                }
            </Box>
        </Card>
    );
};

export default TemplatesOverview;
