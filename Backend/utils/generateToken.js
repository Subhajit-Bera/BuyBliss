import jwt from "jsonwebtoken";

//Paload represents the login user ->here we are using id
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_KEY, { expiresIn: "3d" });
};

export default generateToken;
