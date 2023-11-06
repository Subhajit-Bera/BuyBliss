import { getTokenFromHeader } from "../utils/getTokenFromHeader.js";
import { verifyToken } from "../utils/verifyToken.js";

export const isLoggedIn = (req, res, next) => {
  //get token from header
  const token = getTokenFromHeader(req);

  //verify the token
  const decodedUser = verifyToken(token);

  //If verifyToken return false
  if (!decodedUser) {
    throw new Error("Invalid/Expired token, please login again");
  } else {
    //If verifyToken return the user
    //save the user into req obj
    //We are adding userAuthId (custom) field to the req object and assign the decodedUser id to **
    req.userAuthId = decodedUser?.id;
    next();
  }
};
