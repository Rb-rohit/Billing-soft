const User = require("../models/User");
const jwt = require("jsonwebtoken");



// Register
exports.register = async (req, res) => {
    try{
        const { name, email, password, role } = req.body;

        if (!name || !email || !password) {
            return res.status(400).json({ message: "All field are requires" });
        }

        // check existing user
        const userExists = await User.findOne({ email });
        if (userExists) {
            return res.status(400).json({
                message: "User already exists"
            });
        }

        // create user 
        const user = await User.create({
            name,
            email,
            password,
            role: role || "staff"
        });

        res.status(201).json({
            message: "User register successfully",
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role
            }
        });

    } catch (error) {
        console.log("Register Error:", error);
        res.status(500).json({ message: error.message });
    }
};

// Login 
exports.login = async (req, res) => {
    try {
        const {email, password} = req.body;

        //check user
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({
                message: "Invalid email or password"
            });
        }

        // compare password
        const isMatch = await user.comparePassword(password);

        if (!isMatch) {
            return res.status(400).json({
                message: "Invalid email or Password"
            });
        }

        // create token
        const token = jwt.sign(
            {
                userId: user._id,
                role: user.role
            },
            process.env.JWT_SECRET,
            { expiresIn: "7d"}
        );

        res.json({
            message: "Login successful",
            token,
            user: {
                id: user._id,
                name: user.name,
                role: user.role
            }
        });

    }catch (error) {
        res.status(500).json({ message: error.message});
    }
};

// get logged user
exports.getMe = async (req, res) => {
    try {
        const user = await User
            .findById(req.user.userId)
            .select("-password");

        res.status(200).json({
            message: "User fetched successfully",
            user
        });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};