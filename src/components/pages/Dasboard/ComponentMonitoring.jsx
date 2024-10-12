import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Box, Typography, Card, CardContent, Accordion, AccordionSummary, AccordionDetails, Badge, Button, Chip, IconButton, Tooltip, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import PowerSettingsNewIcon from '@mui/icons-material/PowerSettingsNew';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import useWsHandler from '../../../useWsHandler';


const ComponentMonitoring = ({ config, handleOpenSnackbar, handleOpenDialog, handleCloseDialog }) => {

    const wsMessages = useWsHandler();

    const [activeProducerComponents, setActiveProducerComponents] = useState([]);
    const [activeSMSWorkerComponents, setActiveSMSWorkerComponents] = useState([]);
    const [activeEmailWorkerComponents, setActiveEmailWorkerComponents] = useState([]);
    const [toShutDown, setToShutDown] = useState();


    const createComponentId = (jsonMsg) => {
        return jsonMsg.head.srcHost + ":" + jsonMsg.head.srcPort + ":" + jsonMsg.head.nodeType;
    }

    const createComponentData = (jsonMsg) => {
        const component = {
            componentId: createComponentId(jsonMsg),
            host: jsonMsg.head.srcHost,
            port: jsonMsg.head.srcPort,
            nodeType: jsonMsg.head.nodeType,
            status: "online",
            upTime: 0,
            cpu: 0,
            memory: 0,
            health: "UP",
            lastUpdatedAt: new Date()
        }
        return component;
    }



    const updateMetrics = (prevComponents, jsonMsg, compId) => {
        return prevComponents.map(component => {
            if (component.componentId === compId) {
                return { ...component, upTime: jsonMsg.data.uptime, cpu: jsonMsg.data.cpuUsage, memory: jsonMsg.data.memoryUsage, lastUpdatedAt: new Date() };
            }
            return component;
        });
    }

    const updateHealth = (prevComponents, jsonMsg, compId) => {
        return prevComponents.map(component => {
            if (component.componentId === compId) {
                return { ...component, health: jsonMsg.data.status, lastUpdatedAt: new Date() };
            }
            return component;
        });
    }

    const initiateAndUpdateComponents = (jsonMsg) => {
        const newComponent = createComponentData(jsonMsg);

        if (newComponent.nodeType === "gns-producer") {
            setActiveProducerComponents((prevComponents) => {
                const exists = prevComponents.some(component => component.componentId === newComponent.componentId);
                if (!exists) {
                    return [...prevComponents, newComponent];
                } else {
                    if (jsonMsg.head.msgType === 3) return updateMetrics(prevComponents, jsonMsg, newComponent.componentId);
                    if (jsonMsg.head.msgType === 2) return updateHealth(prevComponents, jsonMsg, newComponent.componentId);
                }
            });
        } if (newComponent.nodeType === "gns-sms-worker") {
            setActiveSMSWorkerComponents((prevComponents) => {
                const exists = prevComponents.some(component => component.componentId === newComponent.componentId);
                if (!exists) {
                    return [...prevComponents, newComponent];
                } else {
                    if (jsonMsg.head.msgType === 3) return updateMetrics(prevComponents, jsonMsg, newComponent.componentId);
                    if (jsonMsg.head.msgType === 2) return updateHealth(prevComponents, jsonMsg, newComponent.componentId);
                }
            });
        } if (newComponent.nodeType === "gns-email-worker") {
            setActiveEmailWorkerComponents((prevComponents) => {
                const exists = prevComponents.some(component => component.componentId === newComponent.componentId);
                if (!exists) {
                    return [...prevComponents, newComponent];
                } else {
                    if (jsonMsg.head.msgType === 3) return updateMetrics(prevComponents, jsonMsg, newComponent.componentId);
                    if (jsonMsg.head.msgType === 2) return updateHealth(prevComponents, jsonMsg, newComponent.componentId);
                }
            });
        }
    };


    const formatTime = (seconds) => {
        // Extract hours, minutes, seconds, and milliseconds
        const hrs = Math.floor(seconds / 3600);
        const mins = Math.floor((seconds % 3600) / 60);
        const secs = Math.floor(seconds % 60);

        // Format the time components to always have two digits
        const formattedHrs = String(hrs).padStart(2, '0');
        const formattedMins = String(mins).padStart(2, '0');
        const formattedSecs = String(secs).padStart(2, '0');

        // Return formatted time string
        return `${formattedHrs}:${formattedMins}:${formattedSecs}`;
    }

    const initiateShutdown = (url) => {
        setToShutDown(url);
        handleOpenDialog(
            "Are you sure you want to shut down this component?",
            "Currently processing notifications will not be sent. ",
            shutdownComponent
        );
    }

    const shutdownComponent = async () => {
        handleCloseDialog();
        try {
            const response = await axios.post(`${toShutDown}`);
            console.log('Success:', response.data);

            handleOpenSnackbar(response.data.message, 'success');
        } catch (error) {
            console.error('Error:', error);

            if (error.response) {
                // Server responded with a status code outside of the range of 2xx
                handleOpenSnackbar(
                    error.response.data.message || 'Unexpected error occurred',
                    'error'
                );
            } else if (error.request) {
                // The request was made but no response was received
                handleOpenSnackbar('No response received from server', 'error');
            } else {
                // Something else happened while setting up the request
                handleOpenSnackbar(error.message, 'error');
            }
        }
    }

    const removeDeactiveComponents = () => {

        activeProducerComponents.forEach((component, index) => {
            if (component.lastUpdatedAt instanceof Date) {
                let timeDiff = new Date() - component.lastUpdatedAt;
                if (timeDiff > 3000) {
                    activeProducerComponents.splice(index, 1);
                }
            }
        });

        activeSMSWorkerComponents.forEach((component, index) => {
            if (component.lastUpdatedAt instanceof Date) {
                let timeDiff = new Date() - component.lastUpdatedAt;
                if (timeDiff > 3000) {
                    activeSMSWorkerComponents.splice(index, 1);
                }
            }
        });

        activeEmailWorkerComponents.forEach((component, index) => {
            if (component.lastUpdatedAt instanceof Date) {
                let timeDiff = new Date() - component.lastUpdatedAt;
                if (timeDiff > 3000) {
                    activeEmailWorkerComponents.splice(index, 1);
                }
            }
        });

    };



    useEffect(() => {
        try {
            if (wsMessages !== undefined) {
                let msg = JSON.parse(wsMessages);

                initiateAndUpdateComponents(msg);
                removeDeactiveComponents()
            }
        } catch (error) {
            console.warn('Error parsing WebSocket message:', error);
        }
    }, [wsMessages]);


    // useEffect(() => {
    //     const interval = setInterval(() => {
    //         console.log(activeProducerComponents);
    //         // console.log(activeProducerComponents);
    //         // updateComponentStatus(activeProducerComponents);
    //     }, 3000); // Runs every 2 seconds

    //     return () => clearInterval(interval); // Cleanup on component unmount
    // }, [wsMessages]);

    return (
        <Card variant='outlined' sx={{ minHeight: "490px" }}>
            <CardContent>
                <Typography gutterBottom sx={{ color: 'text.secondary', fontSize: 17, marginBottom: 2 }}>
                    Component Monitoring
                </Typography>


                <Accordion defaultExpanded>
                    <AccordionSummary
                        expandIcon={<ExpandMoreIcon />}
                        aria-controls="panel1-content"
                        id="panel1-header"
                    >
                        <Typography marginRight={2}>
                            GNS Producer
                        </Typography>

                        <Badge badgeContent={activeProducerComponents.length} color={(activeProducerComponents.some(component => component.health === 'UP')) ? `success` : `warning`}>
                            <Chip label={(activeProducerComponents.length > 0) ? `online` : `offline`}
                                color={(activeProducerComponents.length > 0) ? (activeProducerComponents.some(component => component.health === 'UP')) ? `success` : `warning` : `error`}
                                variant="outlined"
                                size='small' />
                        </Badge>

                    </AccordionSummary>
                    <AccordionDetails>

                        <Box sx={{
                            display: "flex",
                            justifyContent: 'space-between',
                        }}>

                            <TableContainer>
                                <Table aria-label="simple table" >
                                    <TableHead>
                                        <TableRow>
                                            <TableCell>Host</TableCell>
                                            <TableCell align="center">Port</TableCell>
                                            <TableCell align="center">Status</TableCell>
                                            <TableCell align="center">Uptime</TableCell>
                                            <TableCell align="center">CPU</TableCell>
                                            <TableCell align="center">Memory</TableCell>
                                            <TableCell align="center">Actions</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {config && activeProducerComponents.length > 0 ? (
                                            activeProducerComponents.map((produceRow) => (
                                                <TableRow key={produceRow.componentId}>
                                                    <TableCell>{produceRow.host}</TableCell>
                                                    <TableCell align="center">{produceRow.port}</TableCell>
                                                    <TableCell align="center">
                                                        <Chip
                                                            label={produceRow.status}
                                                            variant="outlined"
                                                            color={produceRow.health === "UP" ? "success" : "warning"}
                                                            size="small"
                                                        />
                                                    </TableCell>
                                                    <TableCell align="center">{formatTime(produceRow.upTime)}</TableCell>
                                                    <TableCell align="center">{produceRow.cpu.toFixed(2) + '%'}</TableCell>
                                                    <TableCell align="center">{produceRow.memory.toFixed(2) + '%'}</TableCell>
                                                    <TableCell align="center">
                                                        <Tooltip title="Shutdown">
                                                            <IconButton size="medium" color="error" onClick={() => initiateShutdown(`${config.restProtocol}://${produceRow.componentId.split(':')[0]}:${produceRow.componentId.split(':')[1]}${config.contextPath}${config.actuatorShutdown}`)}>
                                                                <PowerSettingsNewIcon />
                                                            </IconButton>
                                                        </Tooltip>
                                                    </TableCell>
                                                </TableRow>
                                            ))
                                        ) : (
                                            <TableRow>
                                                <TableCell colSpan={7} align="center">
                                                    No active producer servers
                                                </TableCell>
                                            </TableRow>
                                        )}
                                    </TableBody>
                                </Table>
                            </TableContainer>

                        </Box>

                    </AccordionDetails>
                </Accordion>

                <Accordion>
                    <AccordionSummary
                        expandIcon={<ExpandMoreIcon />}
                        aria-controls="panel2-content"
                        id="panel2-header"
                    >
                        <Typography marginRight={2}>
                            GNS SMS Workers
                        </Typography>

                        <Badge badgeContent={activeSMSWorkerComponents.length} color={(activeSMSWorkerComponents.some(component => component.health === 'UP')) ? `success` : `warning`}>
                            <Chip label={(activeSMSWorkerComponents.length > 0) ? `online` : `offline`}
                                color={(activeSMSWorkerComponents.length > 0) ? (activeSMSWorkerComponents.some(component => component.health === 'UP')) ? `success` : `warning` : `error`}
                                variant="outlined" size='small' />
                        </Badge>

                    </AccordionSummary>
                    <AccordionDetails>
                        <Box sx={{
                            display: "flex",
                            justifyContent: 'space-between',
                        }}>

                            <TableContainer>
                                <Table aria-label="simple table" >
                                    <TableHead>
                                        <TableRow>
                                            <TableCell>Host</TableCell>
                                            <TableCell align="center">Port</TableCell>
                                            <TableCell align="center">Status</TableCell>
                                            <TableCell align="center">Uptime</TableCell>
                                            <TableCell align="center">CPU</TableCell>
                                            <TableCell align="center">Memory</TableCell>
                                            <TableCell align="center">Actions</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {config && activeSMSWorkerComponents.length > 0 ? (
                                            activeSMSWorkerComponents.map((smsWorkerRow) => (
                                                <TableRow key={smsWorkerRow.componentId}>
                                                    <TableCell>{smsWorkerRow.host}</TableCell>
                                                    <TableCell align="center">{smsWorkerRow.port}</TableCell>
                                                    <TableCell align="center">
                                                        <Chip
                                                            label={smsWorkerRow.status}
                                                            variant="outlined"
                                                            color={smsWorkerRow.health === "UP" ? "success" : "warning"}
                                                            size="small"
                                                        />
                                                    </TableCell>
                                                    <TableCell align="center">{formatTime(smsWorkerRow.upTime)}</TableCell>
                                                    <TableCell align="center">{smsWorkerRow.cpu.toFixed(2) + '%'}</TableCell>
                                                    <TableCell align="center">{smsWorkerRow.memory.toFixed(2) + '%'}</TableCell>
                                                    <TableCell align="center">
                                                        <Tooltip title="Shutdown">
                                                            <IconButton size="medium" color="error" onClick={() => initiateShutdown(`${config.restProtocol}://${smsWorkerRow.componentId.split(':')[0]}:${smsWorkerRow.componentId.split(':')[1]}${config.contextPath}${config.actuatorShutdown}`)}>
                                                                <PowerSettingsNewIcon />
                                                            </IconButton>
                                                        </Tooltip>
                                                        {/* <Tooltip title="More">
                                                            <IconButton size="medium" color="default">
                                                                <MoreVertIcon />
                                                            </IconButton>
                                                        </Tooltip> */}
                                                    </TableCell>
                                                </TableRow>
                                            ))
                                        ) : (
                                            <TableRow>
                                                <TableCell colSpan={7} align="center">
                                                    No active sms workers
                                                </TableCell>
                                            </TableRow>
                                        )}
                                    </TableBody>
                                </Table>
                            </TableContainer>

                        </Box>
                    </AccordionDetails>
                </Accordion>

                <Accordion>
                    <AccordionSummary
                        expandIcon={<ExpandMoreIcon />}
                        aria-controls="panel3-content"
                        id="panel3-header"
                    >
                        <Typography marginRight={2}>
                            GNS Email Workers
                        </Typography>

                        <Badge badgeContent={activeEmailWorkerComponents.length} color={(activeEmailWorkerComponents.some(component => component.health === 'UP')) ? `success` : `warning`} >
                            <Chip label={(activeEmailWorkerComponents.length > 0) ? `online` : `offline`}
                                color={(activeEmailWorkerComponents.length > 0) ? (activeEmailWorkerComponents.some(component => component.health === 'UP')) ? `success` : `warning` : `error`}
                                variant="outlined" size='small' />
                        </Badge>

                    </AccordionSummary>
                    <AccordionDetails>
                        <Box sx={{
                            display: "flex",
                            justifyContent: 'space-between',
                        }}>

                            <TableContainer>
                                <Table aria-label="simple table" >
                                    <TableHead>
                                        <TableRow>
                                            <TableCell>Host</TableCell>
                                            <TableCell align="center">Port</TableCell>
                                            <TableCell align="center">Status</TableCell>
                                            <TableCell align="center">Uptime</TableCell>
                                            <TableCell align="center">CPU</TableCell>
                                            <TableCell align="center">Memory</TableCell>
                                            <TableCell align="center">Actions</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {config && activeEmailWorkerComponents.length > 0 ? (
                                            activeEmailWorkerComponents.map((emailWorkerRow) => (
                                                <TableRow key={emailWorkerRow.componentId}>
                                                    <TableCell>{emailWorkerRow.host}</TableCell>
                                                    <TableCell align="center">{emailWorkerRow.port}</TableCell>
                                                    <TableCell align="center">
                                                        <Chip
                                                            label={emailWorkerRow.status}
                                                            variant="outlined"
                                                            color={emailWorkerRow.health === "UP" ? "success" : "warning"}
                                                            size="small"
                                                        />
                                                    </TableCell>
                                                    <TableCell align="center">{formatTime(emailWorkerRow.upTime)}</TableCell>
                                                    <TableCell align="center">{emailWorkerRow.cpu.toFixed(2) + '%'}</TableCell>
                                                    <TableCell align="center">{emailWorkerRow.memory.toFixed(2) + '%'}</TableCell>
                                                    <TableCell align="center">
                                                        <Tooltip title="Shutdown">
                                                            <IconButton size="medium" color="error" onClick={() => initiateShutdown(`${config.restProtocol}://${emailWorkerRow.componentId.split(':')[0]}:${emailWorkerRow.componentId.split(':')[1]}${config.contextPath}${config.actuatorShutdown}`)}>
                                                                <PowerSettingsNewIcon />
                                                            </IconButton>
                                                        </Tooltip>
                                                        <Tooltip title="More">
                                                            <IconButton size="medium" color="default">
                                                                <MoreVertIcon />
                                                            </IconButton>
                                                        </Tooltip>
                                                    </TableCell>
                                                </TableRow>
                                            ))
                                        ) : (
                                            <TableRow>
                                                <TableCell colSpan={7} align="center">
                                                    No active email workers
                                                </TableCell>
                                            </TableRow>
                                        )}
                                    </TableBody>
                                </Table>
                            </TableContainer>

                        </Box>
                    </AccordionDetails>

                </Accordion>


            </CardContent>
        </Card>
    );
};

export default ComponentMonitoring;
