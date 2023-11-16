import React from 'react';
import Login from './Login';
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Signup from './Signup';
import Home from './Home';
import SendParcel from './SendParcel';
import Notifications from './Notifications';
import DeleteAccountButton from './DeleteAccount';
import Logout from './Logout';


function App() {
  return (
    <BrowserRouter>
      <div style={{ textAlign: 'center', marginTop: '50px' }}>
        <h1 style={{ fontSize: '5em', color: 'blue' }}>Parcel</h1>
        <p style={{ fontSize: '2em', color: 'darkblue' }}>Send parcels locally conveniently.</p>
      </div>
      <Routes>
        <Route path='/' element={<Login />} />
        <Route path='/signup' element={<Signup />} />
        <Route path='/home' element={<Home />} />
        <Route path='/sendparcel' element={<SendParcel />} />
        <Route path='/notifications' element={<Notifications />} />
        <Route path='/deleteaccount' element={<DeleteAccountButton />} />
        <Route path='/logout' element={<Logout />} />
      </Routes>
      <div style={{ marginTop: '50px', textAlign: 'center', color: 'black' }}>
        <p>OAMK, Advanced Web Applications Development, GSL</p>
        <p>&copy; {new Date().getFullYear()} Parcel</p>
      </div>
    </BrowserRouter>
  );
}

export default App;
