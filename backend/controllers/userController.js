const ErrorHandler = require("../utils/errorhander");
const catchAsyncErrors = require("../middleware/catchAsyncErrors");
const User = require("../models/userModel");

exports.registerUser = catchAsyncErrors(async (req, res, next) => {

    //Fetch data from req.body , so we send object directly inside create() mehod instead of req,body
    const { name, email, password } = req.body;

    const user = await User.create({
        name,
        email,
        password,
        avatar:{
            public_id:"this is a sample id",
            url:"profilepicUrl"
        }
    });

    res.status(100).json({
        success:true,
        user,
    })
})