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


        // ========================================
        // VALIDATION
        // ========================================

        if (
            !name ||
            !email ||
            !password
        ) {

            return res.status(400).json({

                success: false,

                message:
                    "Name, email and password are required"

            });

        }


        if (password.length < 6) {

            return res.status(400).json({

                success: false,

                message:
                    "Password must be at least 6 characters"

            });

        }


        // ========================================
        // NORMALIZE EMAIL
        // ========================================

        const normalizedEmail =
            email.trim().toLowerCase();


        // ========================================
        // CHECK EXISTING USER
        // ========================================

        const existingUser =
            await userModel.findOne({
                email: normalizedEmail
            });


        if (existingUser) {

            return res.status(400).json({

                success: false,

                message:
                    "User already exists"

            });

        }


        // ========================================
        // VALIDATE ROLE
        // ========================================

        const allowedRoles = [
            "customer",
            "agent",
            "admin"
        ];


        const selectedRole =
            role || "customer";


        if (
            !allowedRoles.includes(
                selectedRole
            )
        ) {

            return res.status(400).json({

                success: false,

                message:
                    "Invalid user role"

            });

        }


        // ========================================
        // HASH PASSWORD
        // ========================================

        const hashedPassword =
            await bcrypt.hash(
                password,
                10
            );


        // ========================================
        // CREATE USER
        // ========================================

        const user =
            await userModel.create({

                name:
                    name.trim(),

                email:
                    normalizedEmail,

                password:
                    hashedPassword,

                role:
                    selectedRole,

                department:
                    department ||
                    "General Support"

            });


        // ========================================
        // RESPONSE
        // ========================================

        return res.status(201).json({

            success: true,

            message:
                `${selectedRole} account registered successfully`,

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


        // ========================================
        // VALIDATION
        // ========================================

        if (
            !email ||
            !password
        ) {

            return res.status(400).json({

                success: false,

                message:
                    "Email and password are required"

            });

        }


        // ========================================
        // FIND USER
        // ========================================

        const user =
            await userModel.findOne({

                email:
                    email
                        .trim()
                        .toLowerCase()

            });


        if (!user) {

            return res.status(400).json({

                success: false,

                message:
                    "Invalid email or password"

            });

        }


        // ========================================
        // CHECK PASSWORD
        // ========================================

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
        // SAVE JWT COOKIE
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
                    7 *
                    24 *
                    60 *
                    60 *
                    1000

            }
        );


        // ========================================
        // RESPONSE
        // ========================================

        return res.status(200).json({

            success: true,

            message:
                "Login successful",

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

        console.error(
            "CURRENT USER ERROR:",
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
// EXPORTS
// ========================================

module.exports = {

    registerUser,

    loginUser,

    getCurrentUser

};