const asyncHandler = require("express-async-handler");
const Contact = require("../models/contactModel");

// @desc Get all contacts
// @route GET /api/contacts
// @access private
const getAllcontacts = asyncHandler(async (req, res) =>{
    const contacts = await Contact.find({user_id: req.user.id});
    res.status(200).json(contacts);     
});

// @desc Create a new contact
// @route POST /api/contactss
// @access private
const createContact = asyncHandler(async (req, res) =>{
    console.log("The data from client is ", req.body);
    const {name, email, phone} = req.body;
    if(!name || !email || !phone) {
        res.status(400);
        throw new Error("All fields are mandatory !");
    }
    const contact = await Contact.create({
        name,
        email,
        phone,
        user_id: req.user.id
    });
    res.status(201).json({message: "Contact created successfully", contact});
});

// @desc Get a single contact
// @route GET /api/contacts/id
// @access private
const getContact = asyncHandler(async (req, res) =>{
    const contact = await Contact.findById(req.params.id);
    if(!contact) {
        res.status(404);
        throw new Error("Contact not found !");
    }
    res.status(200).json({message: "Contact fetched successfully", contact});
});

// @desc Update the contact
// @route PUT /api/contacts/id
// @access private
const updateContact = asyncHandler(async (req, res) =>{ 
    const contact = await Contact.findById(req.params.id);
    if(!contact) {
        res.status(404);
        throw new Error("Contact not found !");
    }

    if(contact.user_id.toString() != req.user.id) {
        res.status(403);
        throw new Error("User does not have permission to update other user contacts");
    }

    const newContact = await Contact.findByIdAndUpdate(
        req.params.id, 
        req.body,
        { new: true }
    );
    res.status(200).json({message: "Contact updated successfully", newContact});
});

// @desc Delete the contact
// @route DELETE /api/contacts/id
// @access private
const deleteContact = asyncHandler(async (req, res) => {
    const contact = await Contact.findById(req.params.id); 
    if (!contact) {
        res.status(404);
        throw new Error("Contact not found!");
    }

    if(contact.user_id.toString() != req.user.id) {
        res.status(403);
        throw new Error("User does not have permission to delete other user contacts");
    }

    await Contact.findByIdAndDelete(contact._id);   
    res.status(200).json({ message: "Contact deleted successfully", contact });
});

module.exports = {
    getAllcontacts, 
    createContact, 
    getContact, 
    updateContact, 
    deleteContact,
};
