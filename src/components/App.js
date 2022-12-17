import React from 'react';
import axios from 'axios';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Navbar from './Navbar';
import Home from './Home';
import About from './About';
import Neighbourhoods from './Neighbourhoods';
import Profiles from './Profiles';
import SingleProfile from './SingleProfile';
import Services from './Services';
import Register from './Register';
import Login from './auth/Login';
import ServiceProfiles from './ServiceProfiles';

if (process.env.NODE_ENV === 'production') {
  // as opposed to 'local'
  axios.defaults.baseURL = 'https://neighbour-needs-api.onrender.com';
}

const App = () => {
  function extractDate(timestamp) {
    return timestamp.split('T')[0];
  }

  function extractTime(timestamp) {
    return timestamp.split('T')[1].split('.')[0].slice(0, -3);
  }
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/about' element={<About />} />
        <Route path='/neighbourhoods' element={<Neighbourhoods />} />
        <Route
          path='/profiles'
          element={<Profiles extractDate={extractDate} extractTime={extractTime} />}
        />
        <Route
          path='/single-profile/:id'
          element={<SingleProfile extractDate={extractDate} extractTime={extractTime} />}
        />
        <Route path='/services' element={<Services />} />
        <Route path='/services/profiles' element={<ServiceProfiles />} />
        <Route path='/register' element={<Register />} />
        <Route path='/login' element={<Login />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
