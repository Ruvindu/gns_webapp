// App.js
import React from 'react';
import Paper from "@mui/material/Paper";
import Sidebar from './components/header/Sidebar';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import DashBoard from './components/pages/Dashboard';
import NotificationManager from './components/pages/NotificationManager';
import Settings from './components/pages/Settings';
import Cache from './components/pages/Cache';
import Templates from './components/pages/Templates';
import PageNotFound from './components/pages/PageNotFound';



function App() {
  return (

    // <Paper>
      <BrowserRouter>
      <Sidebar />
        <Routes>
          <Route path="/" element={<DashBoard />}></Route>
          <Route path="/NotificationManager" element={<NotificationManager />}></Route>
          <Route path="/Templates" element={<Templates />}></Route>
          <Route path="/Cache" element={<Cache />}></Route>
          <Route path="/Settings" element={<Settings />}></Route>
          <Route path="*" element={<PageNotFound />}></Route>
        </Routes>
      </BrowserRouter>
    // </Paper>

  );
}

export default App;
