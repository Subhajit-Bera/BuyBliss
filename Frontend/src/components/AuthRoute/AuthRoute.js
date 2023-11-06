import React from "react";
import Login from "../Users/Forms/Login";

//Here children is the component we want to diplay
const AuthRoute = ({ children }) => {
  //get user from localstorage
  const user = JSON.parse(localStorage.getItem("userInfo"));
  const isLoggedIn = user?.token ? true : false;
  if (!isLoggedIn) return <Login />; //When user try to access a private route before login->it will redirect to login page
  return <>{children}</>;
};

export default AuthRoute;
