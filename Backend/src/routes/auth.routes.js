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
// REGISTER
// ========================================
//
// Registration receives the selected role:
// customer / agent / admin
//

router.post(
    "/register",
    registerUser
);


// ========================================
// LOGIN
// ========================================
//
// One login endpoint is used.
// Frontend checks that the returned role
// matches the selected login portal.
//

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


// ========================================
// AGENT TEST
// ========================================

router.get(
    "/agent-test",
    authMiddleware,
    authorizeRoles("agent"),
    (req, res) => {

        return res.status(200).json({

            success: true,

            message:
                "Welcome Agent"

        });

    }
);


// ========================================
// CUSTOMER TEST
// ========================================

router.get(
    "/customer-test",
    authMiddleware,
    authorizeRoles("customer"),
    (req, res) => {

        return res.status(200).json({

            success: true,

            message:
                "Welcome Customer"

        });

    }
);


module.exports = router;