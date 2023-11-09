import React from 'react';
import Login from './Login';
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Signup from './Signup';
import Home from './Home';
import SendParcel from './SendParcel';
import Notifications from './Notifications';
import AccountSettings from './AccountSettings';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<Login />} />
        <Route path='/signup' element={<Signup />} />
        <Route path='/home' element={<Home />} />
        <Route path='/sendparcel' element={<SendParcel />} />
        <Route path='/notifications' element={<Notifications />} />
        <Route path='/accountsettings' element={<AccountSettings />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
