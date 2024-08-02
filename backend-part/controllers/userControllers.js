const asyncHandler = require("express-async-handler");
const User = require("../models/userModel");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");


// @desc Register user
// @route POST /api/users/register
// @access public
const registerUser = asyncHandler(async (req, res) => {
    const { username, email, password } = req.body;
    
    // Ensure all fields are present
    if (!username || !email || !password) {
        res.status(400).json({ message: "All fields are mandatory!" });
        return;
    }

    try {
        // Check if the user already exists
        const userAvailable = await User.findOne({ email });
        if (userAvailable) {
            res.status(400).json({ message: "User already registered!" });
            return;
        }

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);
        console.log("Hashed password: ", hashedPassword);

        // Create the user
        const user = await User.create({
            username,
            email,
            password: hashedPassword,
        });
        console.log(`User created: ${user}`);

        // Respond with the created user details
        if (user) {
            res.status(201).json({ _id: user.id, email: user.email });
        } else {
            res.status(400).json({ message: "User data is not valid" });
        }
    } catch (error) {
        console.error('Error registering user:', error);
        res.status(500).json({ message: error.message });
    }
});

// @desc Login user
// @route POST /api/users/login
// @access public
const loginUser = asyncHandler(async (req, res) => {
    const {email, password} = req.body;
    if(!email || !password) {
        res.status(400);
        throw new Error("All fields are mandatory!");
    }
    const user = await User.findOne({email});
    //Compare password with hashedPassword
    if(user && (await bcrypt.compare(password, user.password))) {
        const accessToken = jwt.sign({
            user: {
                username: user.username,
                email: user.email,
                id: user.id, 
            }, 
        },
        process.env.ACCESS_TOKEN_SECRET,
        {expiresIn: "15m"}
        );
        res.status(200).json({accessToken}); 
    } else {
        res.status(401);
        throw new Error("email or password is not valid");
    }
});

// @desc Current user info
// @route GET /api/users/current
// @access private
const currentUser = asyncHandler(async (req, res) => {
    res.status(200).json(req.user);
});

// @desc delete registered user
// @route GET /api/users/delete
// @access public 
const deleteUser = asyncHandler(async (req, res) => {
    const email = req.body;
    if(!email) {
        res.status(400);
        throw new Error("email is mandatory!");
    }
    const userAvailable = await User.findOne({email});
    if(!userAvailable) {
        res.status(400);
        throw new Error("account not found!");
    }
    await User.findByIdAndDelete(userAvailable._id);   
    res.status(200).json({ message: "account deleted successfully", userAvailable });
});

module.exports = {
    registerUser,
    loginUser,
    currentUser,
    deleteUser
};