import React from 'react'
import './Login.css'
import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

export default function Login() {

  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });

  const handleChange = (e) => {
    const newFormData = {
      email: formData.email,
      password: formData.password,
    }

    newFormData[e.target.id] = e.target.value;
    setFormData(newFormData);
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    const email = formData.email;
    const password = formData.password;
    if(!email || !password) {
      alert('All fields are mandatory!');
      return;
    }
    const emailTest = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if(!emailTest.test(email)) {
      alert('Invalid Email Address!');
      return;
    }

    try {
        const response = await axios.post('http://localhost:5001/api/users/login', formData);
        console.log('Login successful', response.data);
        navigate('/home', { state: { token: response.data.accessToken } });
      } catch (error) {
        console.error('Login error', error);
        alert("Invalid email or password!!");
      }
};

  return (
    <div>
      <div className='container'>
        <h3>Login Yourself!</h3>
      <label for='email'>Email:</label>
      <input className='box' type='email' id='email' value={formData.email} onChange={handleChange}></input>
      <label for='password'>Password:</label>
      <input className='box' type='text' id='password' value={formData.password} onChange={handleChange}></input>
      <button className='box btn btn-primary' onClick={handleSubmit}>Login</button>
    </div>
    </div>
  )
}
