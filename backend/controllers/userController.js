const ErrorHandler = require("../utils/errorhander");
const catchAsyncErrors = require("../middleware/catchAsyncErrors");
const User = require("../models/userModel");


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

    const token = user.getJWTToken();

    res.status(201).json({
        success: true,
        token,
    })
})


//LOGIN USER
exports.loginUser = catchAsyncErrors(async (req, res, next) => {
    const { email, password } = req.body;

    // Checking if user has given password and email both
    if (!email || !password) {
        return next(new ErrorHandler("Please Enter Email & Password", 400));
    }

    //Finding the user
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

    const token = user.getJWTToken();

    res.status(200).json({
        success: true,
        token,
    })
});