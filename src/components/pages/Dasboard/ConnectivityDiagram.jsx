import React, { useState, useEffect } from 'react';
import { Box, Typography, Card, CardContent, Alert, AlertTitle, Stack } from '@mui/material';
import { Timeline, TimelineItem, TimelineSeparator, TimelineConnector, TimelineContent, TimelineOppositeContent, TimelineDot } from '@mui/lab';

import StorageOutlinedIcon from '@mui/icons-material/StorageOutlined';
import CloudOutlinedIcon from '@mui/icons-material/CloudOutlined';


const ConnectivityDiagram = ({wsMessages}) => {

    useEffect(() => {
        try {
            if (wsMessages !== null) {
                let msg = JSON.parse(wsMessages);

                // if (msg.head.msgType === 2) updateConnectivityDiagram(msg);
            }
        } catch (error) {
            console.warn('Error parsing WebSocket message:', error);
        }
    }, [wsMessages]);

    return (
        <Card variant='outlined'>
            <CardContent>
                <Typography gutterBottom sx={{ color: 'text.secondary', fontSize: 17, marginBottom: 2 }}>
                    Connectivity Diagram
                </Typography>

                <Box sx={{
                    marginLeft: {
                        xs: '0',
                        sm: '0',
                        md: '-12em',
                    }
                }}>

                    <Timeline position="right" >

                        <TimelineItem>
                            <TimelineOppositeContent sx={{ m: 'auto 0' }}>
                                <Typography variant="h6" component="span">
                                    Database
                                </Typography>

                                <Typography variant="body2">
                                    {3} node(s) connected
                                </Typography>
                            </TimelineOppositeContent>

                            <TimelineSeparator>
                                <TimelineConnector />
                                <TimelineDot>
                                    <StorageOutlinedIcon />
                                </TimelineDot>
                                <TimelineConnector />
                            </TimelineSeparator>

                            <TimelineContent sx={{ py: '12px', px: 2 }}>
                                <Stack spacing={1}>
                                    <Alert severity="success" >
                                        <AlertTitle >Connected</AlertTitle>
                                        <Typography variant="caption" component="span">
                                            GNS PRODUCER SERVER | 127.0.0.1 | 8081
                                        </Typography>
                                    </Alert>

                                    <Alert severity="success">
                                        <AlertTitle >Connected</AlertTitle>
                                        <Typography variant="caption" component="span">
                                            GNS SMS WORKER | 127.0.0.1 | 8081
                                        </Typography>
                                    </Alert>

                                    <Alert severity="success">
                                        <AlertTitle >Connected</AlertTitle>
                                        <Typography variant="caption" component="span">
                                            GNS EMAIL WORKER | 127.0.0.1 | 8081
                                        </Typography>
                                    </Alert>

                                </Stack>
                            </TimelineContent>
                        </TimelineItem>

                        <TimelineItem>
                            <TimelineOppositeContent
                                sx={{ m: 'auto 0' }}
                            >
                                <Typography variant="h6" component="span">
                                    MQ Server
                                </Typography>

                                <Typography variant="body2">
                                    {3} node(s) connected
                                </Typography>
                            </TimelineOppositeContent>

                            <TimelineSeparator>
                                <TimelineConnector />
                                <TimelineDot>
                                    <StorageOutlinedIcon />
                                </TimelineDot>
                                <TimelineConnector />
                            </TimelineSeparator>

                            <TimelineContent sx={{ py: '12px', px: 2 }}>
                                <Stack spacing={1}>
                                    <Alert severity="success" >
                                        <AlertTitle >Connected</AlertTitle>
                                        <Typography variant="caption" component="span">
                                            GNS SERVER | 127.0.0.1 | 8081
                                        </Typography>
                                    </Alert>

                                    <Alert severity="success">
                                        <AlertTitle >Connected</AlertTitle>
                                        <Typography variant="caption" component="span">
                                            GNS SMS WORKER | 127.0.0.1 | 8081
                                        </Typography>
                                    </Alert>

                                    <Alert severity="success">
                                        <AlertTitle >Connected</AlertTitle>
                                        <Typography variant="caption" component="span">
                                            GNS EMAIL WORKER | 127.0.0.1 | 8081
                                        </Typography>
                                    </Alert>

                                </Stack>
                            </TimelineContent>
                        </TimelineItem>

                        <TimelineItem>
                            <TimelineOppositeContent
                                sx={{ m: 'auto 0' }}
                            >
                                <Typography variant="h6" component="span">
                                    SMTP Server
                                </Typography>

                                <Typography variant="body2">
                                    {1} node(s) connected
                                </Typography>
                            </TimelineOppositeContent>

                            <TimelineSeparator>
                                <TimelineConnector />
                                <TimelineDot>
                                    <CloudOutlinedIcon />
                                </TimelineDot>
                                <TimelineConnector />
                            </TimelineSeparator>

                            <TimelineContent sx={{ py: '12px', px: 2 }}>
                                <Stack spacing={1}>

                                    <Alert severity="success">
                                        <AlertTitle >Connected</AlertTitle>
                                        <Typography variant="caption" component="span">
                                            GNS EMAIL WORKER | 127.0.0.1 | 8081
                                        </Typography>
                                    </Alert>

                                </Stack>
                            </TimelineContent>
                        </TimelineItem>


                    </Timeline>

                </Box>
            </CardContent>
        </Card >
    );
};

export default ConnectivityDiagram;
