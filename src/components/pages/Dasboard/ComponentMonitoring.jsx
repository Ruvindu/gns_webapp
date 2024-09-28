import React from 'react';
import { Box, Typography, Card, CardContent, Accordion, AccordionSummary, AccordionDetails, Badge, Button, Chip, IconButton, Tooltip, Backdrop, CircularProgress, Snackbar, Alert, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import PowerSettingsNewIcon from '@mui/icons-material/PowerSettingsNew';
import MoreVertIcon from '@mui/icons-material/MoreVert';


const ComponentMonitoring = () => {

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

                        <Badge badgeContent={1} color={`success`}>
                            <Chip label={`online`} variant="outlined" color={`success`} size='small' />
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
                                            <TableCell align="center">Actions</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        <TableRow>
                                            <TableCell>127.0.0.1</TableCell>
                                            <TableCell align="center">8081</TableCell>
                                            <TableCell align="center"> <Chip label={`online`} variant="outlined" color={`success`} size='small' /></TableCell>
                                            <TableCell align="center">00:10:01</TableCell>
                                            <TableCell align="center">

                                                <Tooltip title="Shutdown">
                                                    <IconButton size="medium" color='error'>
                                                        <PowerSettingsNewIcon />
                                                    </IconButton>
                                                </Tooltip>

                                                <Tooltip title="More">
                                                    <IconButton size="medium" color='default'>
                                                        <MoreVertIcon />
                                                    </IconButton>
                                                </Tooltip>

                                            </TableCell>
                                        </TableRow>
                                        {/* {rows.map((row) => (
                          <TableRow
                            // key={row.name}
                            // sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                          >
                            <TableCell>{row.name}</TableCell>
                            <TableCell>{row.calories}</TableCell>
                            <TableCell>{row.fat}</TableCell>
                          </TableRow>
                        ))} */}
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

                        <Badge badgeContent={2} color={`success`}>
                            <Chip label={`online`} variant="outlined" color={`success`} size='small' />
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
                                            <TableCell align="center">Actions</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        <TableRow>
                                            <TableCell>127.0.0.1</TableCell>
                                            <TableCell align="center">8081</TableCell>
                                            <TableCell align="center"> <Chip label={`online`} variant="outlined" color={`success`} size='small' /></TableCell>
                                            <TableCell align="center">00:10:01</TableCell>
                                            <TableCell align="center">

                                                <Tooltip title="Shutdown">
                                                    <IconButton size="medium" color='error'>
                                                        <PowerSettingsNewIcon />
                                                    </IconButton>
                                                </Tooltip>

                                                <Tooltip title="More">
                                                    <IconButton size="medium" color='default'>
                                                        <MoreVertIcon />
                                                    </IconButton>
                                                </Tooltip>

                                            </TableCell>
                                        </TableRow>
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

                        <Badge badgeContent={0} color={`error`} >
                            <Chip label={`offline`} variant="outlined" color={`error`} size='small' />
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
                                            <TableCell align="center">Actions</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        <TableRow>
                                            <TableCell>127.0.0.1</TableCell>
                                            <TableCell align="center">8081</TableCell>
                                            <TableCell align="center"> <Chip label={`online`} variant="outlined" color={`success`} size='small' /></TableCell>
                                            <TableCell align="center">00:10:01</TableCell>
                                            <TableCell align="center">

                                                <Tooltip title="Shutdown">
                                                    <IconButton size="medium" color='error'>
                                                        <PowerSettingsNewIcon />
                                                    </IconButton>
                                                </Tooltip>

                                                <Tooltip title="More">
                                                    <IconButton size="medium" color='default'>
                                                        <MoreVertIcon />
                                                    </IconButton>
                                                </Tooltip>

                                            </TableCell>
                                        </TableRow>
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
