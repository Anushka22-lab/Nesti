const express = require("express");

const {
    registerUser,
    loginUser,
    getCurrentUser
} = require("../controllers/auth.controller");

const authMiddleware =
    require("../middlewares/auth.middleware");

const authorizeRoles =
    require("../middlewares/authorize.middleware");

const router = express.Router();


// ========================================
// PUBLIC CUSTOMER REGISTRATION
// ========================================

router.post(
    "/register",
    registerUser
);


// ========================================
// LOGIN
// ========================================

router.post(
    "/login",
    loginUser
);


// ========================================
// LOGOUT
// ========================================

router.post(
    "/logout",
    (req, res) => {

        res.clearCookie(
            "token",
            {
                httpOnly: true,
                sameSite: "lax",
                secure: false,
                path: "/"
            }
        );

        return res.status(200).json({

            success: true,

            message:
                "Logged out successfully"

        });

    }
);


// ========================================
// CURRENT USER
// ========================================

router.get(
    "/me",
    authMiddleware,
    getCurrentUser
);


// ========================================
// ADMIN TEST
// ========================================

router.get(
    "/admin-test",
    authMiddleware,
    authorizeRoles("admin"),
    (req, res) => {

        return res.status(200).json({

            success: true,

            message:
                "Welcome Admin"

        });

    }
);


module.exports = router;