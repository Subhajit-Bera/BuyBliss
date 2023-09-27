import React, { Fragment, useEffect } from "react";
import { CgMouse } from 'react-icons/cg';
import "./Home.css";
// import ProductCard from "./ProductCard.js";
import Product from "./Product.js";
import MetaData from "../layout/MetaData";

const product={
    name:"Blue Tshirt",
    images:[{url:"https://assets.myntassets.com/h_1440,q_100,w_1080/v1/assets/images/1197827/2018/3/7/11520418139882-ETHER-Light-Blue-T-shirt-5521520418139565-1.jpg"}],
    price:"₹300",
    _id:"subhajit"
}
const Home = () => {
    return (
        <Fragment>
            <MetaData title="BuyNew" />
            <div className="banner">
                <p>Welcome to BuyNew</p>
                <h1>FIND AMAZING PRODUCTS BELOW</h1>

                <a href="#container">
                    <button>
                        Scroll <CgMouse />
                    </button>
                </a>
            </div>


            <h2 className="homeHeading">Featured Products</h2>

            <div className="container" id="container">
                {/* {products &&
                    products.map((product) => (
                        <ProductCard key={product._id} product={product} />
                    ))
                } */}
                <Product product={product}/>
                <Product product={product}/>
                <Product product={product}/>
                <Product product={product}/>
                <Product product={product}/>
                <Product product={product}/>
                <Product product={product}/>
                <Product product={product}/>

            </div>
        </Fragment>
    );
};

export default Home;