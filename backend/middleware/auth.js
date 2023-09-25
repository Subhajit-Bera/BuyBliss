const ErrorHandler = require("../utils/errorhander");
const catchAsyncErrors = require("./catchAsyncErrors");
const jwt = require("jsonwebtoken");
const User = require("../models/userModel");

//User is login
exports.isAuthenticatedUser = catchAsyncErrors(async (req, res, next) => {
    //Get token from cookies
    //We were getting token as an object so we do {token} to get only token
    const { token } = req.cookies;

    //If token not found means user is not login 
    if (!token) {
        return next(new ErrorHandler("Please Login to access this resource", 401));
    }

    
    const decodedData = jwt.verify(token, process.env.JWT_SECRET);

    req.user = await User.findById(decodedData.id);

    next();
});


exports.authorizeRoles = (...roles) => {
    return (req, res, next) => {

        //inside the roles array we have admin ,but-> if req.user.role is "user"( not "admin") then the roles array is not includes "user", in that case it will throw error
        if (!roles.includes(req.user.role)) {
            return next(
                new ErrorHandler(
                    `Role: ${req.user.role} is not allowed to access this resouce `,
                    403
                )
            );
        }

        next();
    };
};