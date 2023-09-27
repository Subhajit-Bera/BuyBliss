import React from "react";
import './App.css';
import { BrowserRouter as Router, Route, Switch,Routes } from "react-router-dom";
import WebFont from "webfontloader";
import Header from "./component/layout/Header/Header.js";
import Footer from "./component/layout/Footer/Footer";
import Home from "./component/Home/Home";



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
    <Routes>
    <Route path="/" element={<Home/>}/>

    </Routes>
    <Footer/>
    
  </Router>;
}

export default App;
