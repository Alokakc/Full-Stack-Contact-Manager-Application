import React, { useState, useEffect } from 'react'
import axios from 'axios';
import './Homepage.css';
import { useLocation, useNavigate } from 'react-router-dom';
import MyModel from './Model';
import UpdateModelContact from './UpdateModelContact';
import SearchedContacts from './SearchedContacts';

export default function Homepage() {
  const [showModel, setShowModel] = useState(false);
  const [updateShowModel, setUpdateShowModel] = useState(false);
  const [contacts, setContacts] = useState([]);
  const location = useLocation();
  const { token } = location.state || {};
  const url = 'http://localhost:5001/api/contacts';

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await axios.get(url, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });
  
        console.log('Success:', response.data);
        setContacts(response.data); // Store fetched data in state
      } catch (error) {
        console.error('Error:', error.response ? error.response.data : error.message);
      }
    }
  
    fetchData();
  }, [token, url]); // Run when token or url changes

  const handleCreateContact = (newContact) => {
    setContacts([...contacts, newContact]);
  };

  const handleUpdateContact = (newContact) => {
    // fetchData();
    contacts.forEach(currContact => {
      if(currContact._id === newContact._id) {
        currContact.name = newContact.name;
        currContact.email = newContact.email;
        currContact.phone = newContact.phone;
        setContacts(contacts);
      }
    })
  };

  const [updateContact, setUpdateContact] = useState(null);
  const handleEdit = (contact) => {
    setUpdateContact(contact);
    setUpdateShowModel(true);
  };
    
  const handleDelete = async (contactId) => {
    try {
      const response = await axios.delete(`http://localhost:5001/api/contacts/${contactId}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      console.log('Deletion successful', contactId);
      setContacts(contacts.filter(contact => contact._id !== contactId));
    } catch (error) {
      console.error('Contact does not exist', error);
    }
  };

  const closeModel = () => {
    setShowModel(false);
  };

  const closeUpdateModel = () => {
    setUpdateShowModel(false);
  };

  const handleClick = () => {
    setShowModel(true);
  };

  const [searchedData, setSearchData] = useState('');
  const searchHandle = (e) => {
    setSearchData(e.target.value);
  }

  const [showSearchedContact, setShowSearchedContact] = useState(false);
  const showSearchedData = () => {
    setShowSearchedContact(true);
  }
  const closeSearchedData = () => {
    setShowSearchedContact(false);
  }

  return (
    <div>
      <nav className="navbar navbar-expand-lg bg-body-tertiary">
        <div className="container-fluid">
          <a className="navbar-brand" href="#">ContactManager</a>
          <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse" id="navbarSupportedContent">
            <ul className="navbar-nav me-auto mb-2 mb-lg-0">
              <li className="nav-item">
                <button className="nav-link active" aria-current="page">Home</button>
              </li>
              <li className="nav-item">
                <button className="nav-link active" aria-current="page" onClick={handleClick}>Create</button>
              </li>
            </ul>
              <input value={searchedData} onChange={searchHandle} className="form-control me-2 smallWidth" type="text" placeholder="Search Contact" aria-label="Search"/>
              <button onClick={showSearchedData} className="btn btn-primary">Search</button>
          </div>
        </div>
      </nav>
      {showModel && <MyModel closeModel={closeModel} token={token} onCreateContact={handleCreateContact} />}
      {updateShowModel && <UpdateModelContact updateContact={updateContact} closeUpdateModel={closeUpdateModel} token={token} onUpdateContact={handleUpdateContact} />}
      {showSearchedContact && <SearchedContacts searchedData={searchedData} contacts={contacts} closeSearchedData={closeSearchedData}/>}
      <div className='contacts-container'>
        {contacts.map(contact => (
          <div className='contact-card' key={contact._id}>
            <h2>{contact.name}</h2>
            <p>Email: {contact.email}</p>
            <p>Phone: {contact.phone}</p>
            <div className='card-actions'>
              <button className='btn btn-primary btn-lg' onClick={() => handleEdit(contact)}>Update</button>
              <button className='btn btn-secondary btn-lg' onClick={() => handleDelete(contact._id)}>Delete</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
