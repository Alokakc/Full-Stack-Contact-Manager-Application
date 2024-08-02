import React, { useEffect } from 'react';
import './SearchedContacts.css';

const SearchedContacts = ({ searchedData, contacts, closeSearchedData }) => {
  console.log(searchedData);

  useEffect(() => {
    document.body.style.overflowY = "hidden";
    return () => {
      document.body.style.overflowY = "scroll";
    };
  }, []);

  const toPrint = contacts.filter(contact => contact.name === searchedData);

  return (
    <>
      <div className="model-wrapper" onClick={closeSearchedData}></div>
      <div className="model-container">
        <button className='close fixed' onClick={closeSearchedData}>&#10006;</button>
        <div className='contacts-container additionalCSS'>
          {toPrint.length > 0 ? (
            toPrint.map(contact => (
              <div className='contact-card' key={contact._id}>
                <h2>{contact.name}</h2>
                <p>Email: {contact.email}</p>
                <p>Phone: {contact.phone}</p>
              </div>
            ))
          ) : (
            <h3 className='no-contacts'>
              No Contact Found!
            </h3>
          )}
        </div>
      </div>
    </>
  );
};

export default SearchedContacts;
