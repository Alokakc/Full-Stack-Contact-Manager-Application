import React from 'react'
import { useState, useEffect } from 'react';
import axios from 'axios';
import './Model.css';

const MyModel = ({ closeModel, token, onCreateContact }) => {
  const [contact, setContact] = useState({
    name: '',
    email: '',
    phone: ''
  });

  const handleChange = (e) => {
    const newData = {
      name: contact.name,
      email: contact.email,
      phone: contact.phone,
    };
    newData[e.target.id] = e.target.value;
    setContact(newData);
  }

  const handleSubmit = async () => {
    const name = contact.name;
    const email = contact.email;
    const phone = contact.phone;
    if (!name || !email || !phone) {
      alert('All fields are mandatory!');
      return;
    }
    const emailTest = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailTest.test(email)) {
      alert('Invalid Email Address!');
      return;
    }
    if (phone.length !== 10) {
      alert('Invalid Phone Number!');
      return;
    }
    try {
      const response = await axios.post('http://localhost:5001/api/contacts', contact, 
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      )
      console.log('Contact has been created');
      console.log(response);
      onCreateContact(response.data.contact); // Pass the new contact to the parent component
    }
    catch (error) {
      console.log("Cannot create contact", error);
      throw error;
    }
    closeModel();
  }

  useEffect(() => {
    document.body.style.overflowY = "hidden";
    return () => {
      document.body.style.overflowY = "scroll";
    }
  }, []);

  return (
    <>
      <div className="model-wrapper" onClick={closeModel}></div>
      <div className="model-container">
        <button className='close' onClick={closeModel}>&#10006;</button>
        <div className='container-1'>
          <h3>Create New Contact</h3>
          <label htmlFor='name'>Name:</label>
          <input className='box' type='text' id='name' value={contact.name} onChange={handleChange}></input>
          <label htmlFor='email'>Email:</label>
          <input className='box' type='email' id='email' value={contact.email} onChange={handleChange}></input>
          <label htmlFor='phone'>Phone:</label>
          <input className='box' type='text' id='phone' value={contact.phone} onChange={handleChange}></input>
          <button className='btn btn-primary marg' onClick={handleSubmit}>Create Contact</button>
        </div>
      </div>
    </>
  )
}

export default MyModel;
