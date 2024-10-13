import React, { useState, useEffect } from 'react';
import { Box, Typography, Card, CardContent, Chip, CircularProgress } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { DataGrid } from '@mui/x-data-grid';
import SmsIcon from '@mui/icons-material/Sms';
import EmailIcon from '@mui/icons-material/Email';
import QuestionMarkIcon from '@mui/icons-material/QuestionMark';
import PriorityHighIcon from '@mui/icons-material/PriorityHigh';
import DoneIcon from '@mui/icons-material/Done';
import useWsHandler from '../../../useWsHandler';


const RealtimeNotifications = () => {

    const wsMessages = useWsHandler();

    const [realTimeNotifications, setRealTimeNotifications] = useState([]);


    const createRealTimeNotification = (jsonMsg) => {
        const realTimeNotification = {
            id: jsonMsg.data.id,
            type: jsonMsg.data.type,
            priority: jsonMsg.data.priority,
            status: jsonMsg.data.status,
            time: jsonMsg.data.timeConsumed
        }
        return realTimeNotification;
    }

    const initiateAndUpdateRealTimeNotifications = (jsonMsg) => {

        const newRealTimeNotification = createRealTimeNotification(jsonMsg);

        setRealTimeNotifications((prevRealTimeNotifications) => {
            const exists = prevRealTimeNotifications.some(realTimeNotification => realTimeNotification.id === newRealTimeNotification.id);
            if (!exists) {
                return [...prevRealTimeNotifications, newRealTimeNotification];
            } else {
                return prevRealTimeNotifications.map(realTimeNotification => {
                    if (realTimeNotification.id === newRealTimeNotification.id) {
                        return { ...realTimeNotification, status: newRealTimeNotification.status, time: newRealTimeNotification.time };
                    }
                    return realTimeNotification;
                });
            }
        });
    }

    
    useEffect(() => {
        try {
            if (wsMessages !== undefined) {
                let msg = JSON.parse(wsMessages);

                if (msg.head.msgType === 1) initiateAndUpdateRealTimeNotifications(msg);
            }
        } catch (error) {
            console.warn('Error parsing WebSocket message:', error);
        }
    }, [wsMessages]);




    // Custom function to render
    const renderType = (type) => {
        if (type === 1) {
            return <Chip icon={<SmsIcon />} label="SMS" size="small" sx={{ padding: '5px' }} />;

        } else if (type === 2) {
            return <Chip icon={<EmailIcon />} label="Email" size="small" sx={{ padding: '5px' }} />;
        }
        else {
            return <Chip icon={<QuestionMarkIcon />} label="Unknown" size="small" sx={{ padding: '5px' }} />;
        }

    };

    const renderPriority = (priority) => {
        if (priority === 1) {
            return <Chip label="High" size="small" color="error" variant="outlined" />

        } else if (priority === 2) {
            return <Chip label="Low" size="small" color="warning" variant="outlined" />
        }
        else {
            return <Chip label="Unknown" size="small" color="default" variant="outlined" />
        }

    };

    const renderStatus = (status) => {
        if (status === 1) {
            return <Chip
                label={
                    <Box display="flex" alignItems="center">
                        <CircularProgress
                            size={16}
                            style={{ marginRight: 5 }}
                        />
                        Processing
                    </Box>
                }
                color="primary"
                size="small"
                variant="outlined"
            />
        }
        else if (status === 2) {
            return <Chip
                label={
                    <Box display="flex" alignItems="center">
                        <CircularProgress
                            size={16}
                            style={{ marginRight: 5 }}
                            color="warning"
                        />
                        Queued
                    </Box>
                }
                color="warning"
                size="small"
                variant="outlined"
            />
        }
        else if (status === 3) {
            return <Chip
                label={
                    <Box display="flex" alignItems="center">
                        <CircularProgress
                            size={16}
                            style={{ marginRight: 5 }}
                            color="warning"
                        />
                        Dequeued
                    </Box>
                }
                color="warning"
                size="small"
                variant="outlined"
            />
        }
        else if (status === 4) {
            return <Chip icon={<DoneIcon />} label="Proccessed" color="success" size="small" variant="outlined" />;
        }
        else if (status === -1) {
            return <Chip icon={<PriorityHighIcon />} label="Failed" color="error" size="small" variant="outlined" />;
        }
        else {
            return <Chip label="Unknown" color="error" size="small" variant="outlined" />;
        }
    };

    const columns = [
        { field: 'id', headerName: 'ID', width: 110 },
        { field: 'type', headerName: 'Type', width: 100, headerAlign: 'center', align: 'center', renderCell: (params) => renderType(params.value) },
        { field: 'priority', headerName: 'Priority', width: 100, headerAlign: 'center', align: 'center', renderCell: (params) => renderPriority(params.value) },
        { field: 'status', headerName: 'Status', width: 170, headerAlign: 'center', align: 'center', renderCell: (params) => renderStatus(params.value) },
        { field: 'time', headerName: 'Time Consumed (sec)', width: 160, headerAlign: 'center', align: 'center' }
    ];



    return (
        <Card variant='outlined' sx={{ minHeight: "340px" }}>
            <CardContent>
                <Typography gutterBottom sx={{ color: 'text.secondary', fontSize: 17, marginBottom: 2 }}>
                    Realtime Notifications
                </Typography>


                <Box sx={{ height: 250, width: '100%' }}>
                    <DataGrid
                        rows={realTimeNotifications}
                        columns={columns}
                        hideFooterPagination={true}
                        hideFooter={true}
                        pageSize={2}
                        sortModel={[
                            {
                                field: 'id',
                                sort: 'desc',
                            },
                        ]}
                    />
                </Box>

            </CardContent>
        </Card>
    );
};

export default RealtimeNotifications;
