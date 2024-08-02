import React from 'react'
import { useState, useEffect } from 'react';
import axios from 'axios';
import './Model.css';

const UpdateModelContact = ({ updateContact, closeUpdateModel, token, onUpdateContact }) => {
  const [contact, setContact] = useState({
    name: updateContact.name,
    email: updateContact.email,
    phone: updateContact.phone
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
      const response = await axios.put(`http://localhost:5001/api/contacts/${updateContact._id}`, contact, 
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      )
      console.log('Contact has been Updated');
      console.log(response);
      onUpdateContact(response.data.newContact); // Pass the updated contact to the parent component
    }
    catch (error) {
      console.log("Cannot update contact", error);
      throw error;
    }
    closeUpdateModel();
  }

  useEffect(() => {
    document.body.style.overflowY = "hidden";
    return () => {
      document.body.style.overflowY = "scroll";
    }
  }, []);

  return (
    <>
      <div className="model-wrapper" onClick={closeUpdateModel}></div>
      <div className="model-container">
        <button className='close' onClick={closeUpdateModel}>&#10006;</button>
        <div className='container-1'>
          <h3>Update Contact</h3>
          <label htmlFor='name'>Name:</label>
          <input className='box' type='text' id='name' value={contact.name} onChange={handleChange}></input>
          <label htmlFor='email'>Email:</label>
          <input className='box' type='email' id='email' value={contact.email} onChange={handleChange}></input>
          <label htmlFor='phone'>Phone:</label>
          <input className='box' type='text' id='phone' value={contact.phone} onChange={handleChange}></input>
          <button className='btn btn-primary marg' onClick={handleSubmit}>Update Contact</button>
        </div>
      </div>
    </>
  )
}

export default UpdateModelContact;
