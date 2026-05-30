const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const UserModel = require('../Models/user');

const signup = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        const userExists = await UserModel.findOne({ email });

        if (userExists) {
            return res.status(400).json({
                message: "User already exists",
                success: false
            });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = new UserModel({
            name,
            email,
            password: hashedPassword
        });

        await user.save();

        res.status(201).json({
            message: "User created successfully",
            success: true
        });

    } catch (error) {
        res.status(500).json({
            message: "Internal Server Error",
            success: false,
            error
        });
    }
}

const login = async (req, res) => {
    try {
        const {email, password } = req.body;

        const userExists = await UserModel.findOne({ email });
        const errorMsg = "Authentication Failed or password is incorrect";
        if (!userExists) {
            return res.status(403).json({
                message: errorMsg,
                success: false
            });
        }

      const isPasswordValid = await bcrypt.compare(password, userExists.password);

        if (!isPasswordValid) { 
            return res.status(403).json({
                message: errorMsg,
                success: false
            });
        } 
        const jwtToken = jwt.sign({ email: userExists.email, id: userExists._id }, process.env.JWT_SECRET, { expiresIn: '24h' });

        res.status(200).json({
            message: "Login successfully",
            success: true,
            jwtToken,
            email,
                name: userExists.name
        });

    } catch (error) {
        res.status(500).json({
            message: "Internal Server Error",
            success: false,
            error
        });
    }
}

module.exports = {
    signup,
    login,

};