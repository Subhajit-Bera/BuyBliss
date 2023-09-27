import React from "react";
import playStore from "../../../images/playstore.png";
import appStore from "../../../images/Appstore.png";
import "./Footer.css";

const Footer = () => {
    return (
        <footer id="footer">
            <div className="leftFooter">
                <h4>DOWNLOAD OUR APP</h4>
                <p>Download App for Android and IOS mobile phone</p>
                <img src={playStore} alt="playstore" />
                <img src={appStore} alt="Appstore" />
            </div>

            <div className="midFooter">
                <h1>BuyNew.</h1>
                <p>Quality Service is our first priority</p>

                <p>Made with ❤️  &copy; Subha</p>
            </div>

            <div className="rightFooter">
                <h4>Follow Us</h4>
                <a href="https://www.instagram.com/subhajit_bera_/"> Instagram</a>
                <a href="https://github.com/Subhajit-Bera">Github</a>
                <a href="https://www.linkedin.com/in/subhajit-bera-a76a1b207/">LinkedIN</a>
            </div>
        </footer>
    );
};


export default Footer;