import React from 'react';
import Login from './Login';
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Signup from './Signup';
import Profile from './Profile';
import SendParcel from './SendParcel';
import Notifications from './Notifications';
import DeleteAccountButton from './DeleteAccount';
import Logout from './Logout';
import History from './History';



function App() {
  return (
    <BrowserRouter>
      <div style={{ textAlign: 'center', marginTop: '20px' }}>
        <h1 style={{ fontSize: '4em', color: 'blue' }}>Parcel</h1>
        <p style={{ fontSize: '2em', color: 'darkblue' }}>Send parcels locally conveniently.</p>
      </div>
      <div style={{ flex: 1, width: '100%', marginTop: '30px', marginBottom: '20px', overflowY: 'auto', boxSizing: 'border-box' }}> 
        <Routes>
          <Route path='/' element={<Login />} />
          <Route path='/signup' element={<Signup />} />
          <Route path='/profile' element={<Profile />} />
          <Route path='/sendparcel' element={<SendParcel />} />
          <Route path='/notifications' element={<Notifications />} />
          <Route path='/deleteaccount' element={<DeleteAccountButton />} />
          <Route path='/logout' element={<Logout />} />
          <Route path='/history' element={<History />} />
        </Routes>
      </div>
      <div style={{ marginTop: '30px', textAlign: 'center', color: 'black' }}>
        <p>OAMK, Advanced Web Applications Development, GSL</p>
        <p>&copy; {new Date().getFullYear()} Parcel</p>
      </div>
    </BrowserRouter>
  );
}

export default App;
