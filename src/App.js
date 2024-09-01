import React, { useEffect } from 'react';
import Sidebar from './components/header/Sidebar';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import DashBoard from './components/pages/Dashboard';
import NotificationManager from './components/pages/NotificationManager';
import Settings from './components/pages/Settings';
import Cache from './components/pages/Cache';
import Templates from './components/pages/Templates';
import PageNotFound from './components/pages/PageNotFound';
import { ThemeProvider, createTheme } from '@mui/material/styles';

function App() {
  useEffect(() => {
    document.body.style.backgroundColor = '#fafafa'; // Set the desired background color here

    return () => {
      document.body.style.backgroundColor = '';
    };
  }, []);

  const theme = createTheme({
    palette: {
      primary: {
        main: '#1976d2', // Set your desired primary color here
      },
    },
  });

  return (
    <ThemeProvider theme={theme}>
      <BrowserRouter>
        <Sidebar />
        <Routes>
          <Route path="/" element={<DashBoard />} />
          <Route path="/NotificationManager" element={<NotificationManager />} />
          <Route path="/Templates" element={<Templates />} />
          <Route path="/Cache" element={<Cache />} />
          <Route path="/Settings" element={<Settings />} />
          <Route path="*" element={<PageNotFound />} />
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;
