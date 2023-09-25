const ErrorHandler = require("../utils/errorhander");
const catchAsyncErrors = require("../middleware/catchAsyncErrors");
const User = require("../models/userModel");
const sendToken = require("../utils/jwtToken");
const sendEmail = require("../utils/sendEmail");
const crypto = require("crypto");

//REGISTER USER
exports.registerUser = catchAsyncErrors(async (req, res, next) => {

    //Fetch data from req.body , so we send object directly inside create() mehod instead of req,body
    const { name, email, password } = req.body;

    const user = await User.create({
        name,
        email,
        password,
        avatar: {
            public_id: "this is a sample id",
            url: "profilepicUrl"
        }
    });

    sendToken(user, 201, res);
})


//LOGIN USER
exports.loginUser = catchAsyncErrors(async (req, res, next) => {
    const { email, password } = req.body;

    // Checking if user has given password and email both
    if (!email || !password) {
        return next(new ErrorHandler("Please Enter Email & Password", 400));
    }

    //Finding the user     "+passwor bacause -> password select is set to false"
    const user = await User.findOne({ email }).select("+password");

    //If user not found
    if (!user) {
        return next(new ErrorHandler("Invalid email or password", 401));
    }

    //A variable to compare the enterd password
    const isPasswordMatched = await user.comparePassword(password);

    //If password not matched
    if (!isPasswordMatched) {
        return next(new ErrorHandler("Invalid email or password", 401));
    }


    sendToken(user, 200, res);
});


//LOGOUT USER
exports.logout = catchAsyncErrors(async (req, res, next) => {
    res.cookie("token", null, {
        expires: new Date(Date.now()),
        httpOnly: true,
    });

    res.status(200).json({
        success: true,
        message: "Logged Out",
    });
});


//FORGOT PASSWORD
exports.forgotPassword = catchAsyncErrors(async (req, res, next) => {
    const user = await User.findOne({ email: req.body.email });

    if (!user) {
        return next(new ErrorHandler("User not found", 404));
    }

    // Get ResetPassword Token
    const resetToken = user.getResetPasswordToken();

    //Save the user(resetPasswordToken,resetPasswordExpire)
    await user.save({ validateBeforeSave: false });

    //Sending the resetToken as link to user
    //req.protocol: http/https 
    const resetPasswordUrl = `${req.protocol}://${req.get("host")}/password/reset/${resetToken}`;

    const message = `Your password reset token is :- \n\n ${resetPasswordUrl} \n\nIf you have not requested this email then, please ignore it.`;

    try {
        await sendEmail({
            email: user.email,
            subject: `BuyNew Password Recovery`,
            message,
        });

        res.status(200).json({
            success: true,
            message: `Email sent to ${user.email} successfully`,
        });
    } catch (error) {
        user.resetPasswordToken = undefined;
        user.resetPasswordExpire = undefined;

        await user.save({ validateBeforeSave: false });

        return next(new ErrorHandler(error.message, 500));
    }

});

//RESET PASSWORD(After resetToken link send to user)
exports.resetPassword = catchAsyncErrors(async (req, res, next) => {

    //Creating token hash for finding the user in database  
    const resetPasswordToken = crypto
        .createHash("sha256")
        .update(req.params.token) //getting the resetToken 
        .digest("hex");


    //Finding the user in database
    const user = await User.findOne({
        resetPasswordToken,
        resetPasswordExpire: { $gt: Date.now() },
    });

    //If user not found or resetPasswordExpire is exceed 15 mins
    if (!user) {
        return next(
            new ErrorHandler(
                "Reset Password Token is invalid or has been expired",
                400
            )
        );
    }

    //If password and confirmPassword given by user are not sama
    if (req.body.password !== req.body.confirmPassword) {
        return next(new ErrorHandler("Password does not password", 400));
    }

    //If everything is all right set the user password to the new given password
    user.password = req.body.password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;

    //Save the user's password in database
    await user.save();

    //Login the user
    sendToken(user, 200, res);
});


//Backend API Users

//GET USER DETAILS
exports.getUserDetails = catchAsyncErrors(async (req, res, next) => {
    const user = await User.findById(req.user.id);

    res.status(200).json({
        success: true,
        user,
    });
});

//UPDATE USER PASSWORD
exports.updatePassword = catchAsyncErrors(async (req, res, next) => {
    const user = await User.findById(req.user.id).select("+password");

    const isPasswordMatched = await user.comparePassword(req.body.oldPassword);

    //If old password is not matched
    if (!isPasswordMatched) {
        return next(new ErrorHandler("Old password is incorrect", 400));
    }

    //If new given password and confirm password is not matched
    if (req.body.newPassword !== req.body.confirmPassword) {
        return next(new ErrorHandler("password does not match", 400));
    }

    user.password = req.body.newPassword;

    await user.save();

    sendToken(user, 200, res);
});


//UPDATE USER PROFILE
exports.updateProfile = catchAsyncErrors(async (req, res, next) => {
    const newUserData = {
        name: req.body.name,
        email: req.body.email,
    };

    //We will update cloudinary later.

    const user = await User.findByIdAndUpdate(req.user.id, newUserData, {
        new: true,
        runValidators: true,
        useFindAndModify: false,
    });

    res.status(200).json({
        success: true,
    });

});

//Backend Api ADMIN

//GET ALL USERS --Admin
exports.getAllUser = catchAsyncErrors(async (req, res, next) => {
    const users = await User.find();

    res.status(200).json({
        success: true,
        users,
    });
});



//GET SINGLE/INDIVIDUAL USER DETAILS --Admin
exports.getSingleUser = catchAsyncErrors(async (req, res, next) => {
    const user = await User.findById(req.params.id);

    if (!user) {
        return next(
            new ErrorHandler(`User does not exist with Id: ${req.params.id}`)
        );
    }

    res.status(200).json({
        success: true,
        user,
    });
});


//UPDATE USER ROLE --Admin
exports.updateUserRole = catchAsyncErrors(async (req, res, next) => {
    const newUserData = {
        name: req.body.name,
        email: req.body.email,
        role: req.body.role,
    };

    const user = User.findById(req.params.id);  //req.user.id -> Admin id  req.params.id->user id
    if (!user) {
        return next(
            new ErrorHandler(`User does not exist with Id: ${req.params.id}`, 400)
        );
    }

    await User.findByIdAndUpdate(req.params.id, newUserData, {
        new: true,
        runValidators: true,
        useFindAndModify: false,
    });

    res.status(200).json({
        success: true,
    });
});


//DELETE USER --Admin
exports.deleteUser = catchAsyncErrors(async (req, res, next) => {
    const user = await User.findById(req.params.id);
    //We will update cloudinary later.
    if (!user) {
        return next(
            new ErrorHandler(`User does not exist with Id: ${req.params.id}`, 400)
        );
    }

    await user.deleteOne();
    res.status(200).json({
        success: true,
        message: "User Deleted Successfully",
    });
})