import React from 'react';
import './App.css';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Registerpage from './components/Registerpage';
import Login from './components/Login';
import Homepage from './components/Homepage';
import { useNavigate, useLocation } from 'react-router-dom';
import { useEffect } from 'react';

function App() {

  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    // Check if the current path is not the root path
    if (location.pathname !== "/") {
      navigate('/');
    }
  }, []);

  return (
    <Routes>
      <Route path='/' element={<Registerpage/>}></Route>
      <Route path='/login' element={<Login/>}/>
      <Route path='/home' element={<Homepage/>}/>
    </Routes>
  );
}

export default App;
