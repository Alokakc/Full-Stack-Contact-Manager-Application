import React from 'react'
import './Registerpage.css'
import axios from 'axios';
import { useState } from 'react';
import Login from './Login';
import { useNavigate } from 'react-router-dom';

export default function Registerpage() {

  const navigate = useNavigate();
  const loginChange = () => {
    navigate('/login');
  };

  const [formData, setFormData] = useState({
      username: '',
      email: '',
      password: ''
  });

  const handleChange = (e) => {
      const newFormData = {
        username: formData.username,
        email: formData.email,
        password: formData.password,
      };
    
      newFormData[e.target.id] = e.target.value;
      setFormData(newFormData);
  };

    const handleSubmit = async (e) => {
      const username = formData.username;
      const email = formData.email;
      const password = formData.password;
      if(!username || !email || !password) {
        alert('All fields are mandatory!');
        return;
      }
      const emailTest = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
      if(!emailTest.test(email)) {
        alert('Invalid Email Address!');
        return;
      }

        e.preventDefault();
        try {
          const response = await axios.post('http://localhost:5001/api/users/register', formData);
          console.log('Registration successful', response.data);
        } catch (error) {
          alert('User already registered!')
          return;
        }
        const loginData = {
            email: formData.email,
            password: formData.password,
        };

        try {
            const response = await axios.post('http://localhost:5001/api/users/login', loginData);
            console.log('Login successful', response.data);
            navigate('/home', { state: { token: response.data.accessToken } });
          } catch (error) {
            console.error('Login error', error);
          }
    };


  return (
    <div>
      <div className='container'>
        <h3>Register Yourself!</h3>
      <label for='username'>UserName:</label>
      <input className='box' type='text' id='username' value={formData.username} onChange={handleChange}></input>
      <label for='email'>Email:</label>
      <input className='box' type='email' id='email' value={formData.email} onChange={handleChange}></input>
      <label for='password'>Password:</label>
      <input className='box' type='text' id='password' value={formData.password} onChange={handleChange}></input>
      <button className='box btn btn-primary' onClick={handleSubmit}>Register</button>
      <button className="text-button" onClick={loginChange}>Already have account?</button>
    </div>
    </div>
  )
}
