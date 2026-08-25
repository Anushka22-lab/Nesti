const userModel = require("../models/user.model");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");


// ========================================
// REGISTER USER
// ========================================

const registerUser = async (req, res) => {

    try {

        const {
            name,
            email,
            password,
            role,
            department
        } = req.body;


        const existingUser =
            await userModel.findOne({ email });


        if (existingUser) {

            return res.status(400).json({
                success: false,
                message: "User already exists"
            });

        }


        const hashedPassword =
            await bcrypt.hash(
                password,
                10
            );


        const user =
            await userModel.create({

                name,

                email,

                password:
                    hashedPassword,

                role:
                    role || "customer",

                department:
                    department || "General Support"

            });


        return res.status(201).json({

            success: true,

            message:
                "User registered successfully",

            user: {

                id:
                    user._id,

                name:
                    user.name,

                email:
                    user.email,

                role:
                    user.role,

                department:
                    user.department

            }

        });


    } catch (error) {

        console.error(
            "REGISTER ERROR:",
            error
        );


        return res.status(500).json({

            success: false,

            message:
                error.message

        });

    }

};


// ========================================
// LOGIN USER
// ========================================

const loginUser = async (req, res) => {

    try {

        const {
            email,
            password
        } = req.body;


        const user =
            await userModel.findOne({
                email
            });


        if (!user) {

            return res.status(400).json({

                success: false,

                message:
                    "Invalid email or password"

            });

        }


        const isPasswordCorrect =
            await bcrypt.compare(
                password,
                user.password
            );


        if (!isPasswordCorrect) {

            return res.status(400).json({

                success: false,

                message:
                    "Invalid email or password"

            });

        }


        // ========================================
        // CREATE JWT
        // ========================================

        const token =
            jwt.sign(

                {
                    id:
                        user._id.toString(),

                    role:
                        user.role

                },

                process.env.JWT_SECRET,

                {
                    expiresIn:
                        "7d"
                }

            );


        // ========================================
        // SAVE JWT IN HTTP-ONLY COOKIE
        // ========================================

        res.cookie(
            "token",
            token,
            {

                httpOnly: true,

                secure: false,

                sameSite: "lax",

                path: "/",

                maxAge:
                    7 * 24 * 60 * 60 * 1000

            }
        );


        // ========================================
        // RESPONSE
        // ========================================

        return res.status(200).json({

            success: true,

            message:
                "Login successful",

            // Used by Socket.IO
            // Frontend keeps this only in memory
            token,

            user: {

                id:
                    user._id,

                name:
                    user.name,

                email:
                    user.email,

                role:
                    user.role,

                department:
                    user.department

            }

        });


    } catch (error) {

        console.error(
            "LOGIN ERROR:",
            error
        );


        return res.status(500).json({

            success: false,

            message:
                error.message

        });

    }

};


// ========================================
// CURRENT USER
// ========================================

const getCurrentUser = async (req, res) => {

    try {

        const user =
            await userModel

                .findById(
                    req.user.id
                )

                .select("-password");


        if (!user) {

            return res.status(404).json({

                success: false,

                message:
                    "User not found"

            });

        }


        return res.status(200).json({

            success: true,

            user

        });


    } catch (error) {

        return res.status(500).json({

            success: false,

            message:
                error.message

        });

    }

};


module.exports = {

    registerUser,

    loginUser,

    getCurrentUser

};