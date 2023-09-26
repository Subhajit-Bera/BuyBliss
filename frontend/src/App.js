import React from "react";
import './App.css';
import Header from "./component/layout/Header.js";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import WebFont from "webfontloader";



function App() {
  React.useEffect(()=>{
    WebFont.load({
      google:{
        families: ["Roboto", "Droid Sans", "Chilanka"],
      }
  
    })
  })
  return <Router>
    <Header/>
  </Router>;
}

export default App;
