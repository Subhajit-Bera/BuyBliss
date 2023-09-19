const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Please Enter Your Name"],
        maxLength: [30, "Name cannot exceed 30 characters"],
        minLength: [4, "Name should have more than 4 characters"],
    },
    email: {
        type: String,
        required: [true, "Please Enter Your Email"],
        unique: true,
        validate: [validator.isEmail, "Please Enter a valid Email"],
    },
    password: {
        type: String,
        required: [true, "Please Enter Your Password"],
        minLength: [8, "Password should be greater than 8 characters"],
        select: false, //when we run find() method password will not be returned/accessed
    },
    avatar: {
        public_id: {
            type: String,
            required: true,
        },
        url: {
            type: String,
            required: true,
        },
    },
    role: {
        type: String,
        default: "user", //until we make the user admin
    },

    resetPasswordToken: String,
    resetPasswordExpire: Date,
})


//FOR ENCRYPT PASSEORD
userSchema.pre("save", async function (next) {
    //If user only update it's user name and avtar or email, in that case password is no need to modified
    if (!this.isModified("password")) {
        next();
    }

    //Here 10 is basically power means how much stronger the password should be. It can be greater than 10, but 10 is a recommended value
    this.password = await bcrypt.hash(this.password, 10);
});


// JWT TOKEN (Function for Create token)
userSchema.methods.getJWTToken = function () {
    return jwt.sign({ id: this._id }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRE,
    });
};


//Compare entered password by a user
userSchema.methods.comparePassword = async function (password) {
    return await bcrypt.compare(password, this.password);
    //bycrypt has it's own mrthod to compare
};


module.exports = mongoose.model("User", userSchema);