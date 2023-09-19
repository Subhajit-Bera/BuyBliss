// For creating cookie and avoid using the below code we are making sendToken function.

// res.status(201).json({ 
//     success: true,
//     token,
// })


//Create Token and saving in cookie
const sendToken = (user, statusCode, res) => {

    //Create token
    const token = user.getJWTToken();

    
    // options for cookie
    const options = {
        expires: new Date(
            Date.now() + process.env.COOKIE_EXPIRE * 24 * 60 * 60 * 1000 //convert the time in milliseconds
        ),
        httpOnly: true,
    };

    //Sending token in cookie
    res.status(statusCode).cookie("token", token, options).json({
        success: true,
        user,
        token,
    });
};

module.exports = sendToken;