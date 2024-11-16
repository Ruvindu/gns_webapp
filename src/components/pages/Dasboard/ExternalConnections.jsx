import React, { useState, useEffect } from 'react';
import { Box, Typography, Card, CardContent, List, ListItem, Avatar, ListItemText, ListItemAvatar, Badge, Skeleton } from '@mui/material';
import DnsIcon from '@mui/icons-material/Dns';

const ExternalConnections = ({ wsMessages }) => {

    const [allExternalConnections, setAllExternalConnections] = useState([]);


    const loadExternalConnections = (jsonMsg) => {
        const newConnection = jsonMsg.data;
        const { uniqueId } = newConnection;

        // Update state and localStorage
        setAllExternalConnections((prevExternalConnections) => {
            const updatedConnections = prevExternalConnections.some(
                (connection) => connection.uniqueId === uniqueId
            )
                ? prevExternalConnections.map((connection) =>
                    connection.uniqueId === uniqueId
                        ? { ...connection, ...newConnection }
                        : connection
                )
                : [...prevExternalConnections, newConnection];

            // Save to localStorage
            sessionStorage.setItem("GNSExternalConnections", JSON.stringify(updatedConnections));

            return updatedConnections; // Return updated state
        });
    };

    // Load data from localStorage on component mount
    useEffect(() => {
        const storedConnections = JSON.parse(sessionStorage.getItem("GNSExternalConnections")) || [];
        setAllExternalConnections(storedConnections);
    }, []);


    useEffect(() => {
        while (wsMessages.length > 0) {
            loadExternalConnections(wsMessages.shift());
        }
    }, [wsMessages]);


    return (
        <Card variant="outlined" sx={{ minHeight: "240px" }}>
            <CardContent>
                <Typography gutterBottom sx={{ color: 'text.secondary', fontSize: 17, marginBottom: 2 }}>
                    External Connections
                </Typography>
                <Box sx={{
                    display: "flex",
                    justifyContent: 'space-between',
                }}>


                    <List>
                        {allExternalConnections.map((connection, index) => (
                            <ListItem key={connection.uniqueId || index}>
                                <ListItemAvatar>
                                    <Badge
                                        color={connection.health === "UP" ? "success" : "warning"}
                                        overlap="circular"
                                        variant="dot"
                                    >
                                        <Avatar>
                                            <DnsIcon />
                                        </Avatar>
                                    </Badge>
                                </ListItemAvatar>
                                <ListItemText
                                    primary={connection.svrName || "Unknown Server"}
                                    secondary={
                                        connection.Summary ? connection.Summary : ""
                                    }
                                />
                            </ListItem>
                        ))}
                    </List>

                </Box>
            </CardContent>
        </Card>
    );
};

export default ExternalConnections;
