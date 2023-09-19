const Product = require("../models/productModel");
const ErrorHandler = require("../utils/errorhander");
const catchAsyncErrors = require("../middleware/catchAsyncErrors");
const ApiFeatures = require("../utils/apifeatures");

//CREATE PRODUCT ---Admin
exports.createProduct=catchAsyncErrors(async (req,res,next)=>{
    req.body.user=req.user.id;
    const product=await Product.create(req.body);
    
    res.status(201).json({
        success:true,
        product
    })
});

//GET ALL PRODUCTS
exports.getAllProducts=catchAsyncErrors(async(req,res)=>{

    const resultPerPage = 5;
    //Show the count products in dashboard
    const productsCount = await Product.countDocuments(); 

    //query=Procuct.find()->All products queryStr=req.query
    const apiFeature =new ApiFeatures(Product.find(), req.query).search().filter().pagination(resultPerPage);
    const products=await apiFeature.query;
    res.status(200).json({
        success:true,
        products,
        productsCount
    })
});


//GET PRODUCT DETAILS
exports.getProductDetails =catchAsyncErrors(async(req, res, next)=>{
    const product = await Product.findById(req.params.id);

    if (!product) {
        return next(new ErrorHandler("Product not found", 404));
    }

    res.status(200).json({
        success: true,
        product
    });
});

//UPDATE PRODUCT --Admin
exports.updateProduct = catchAsyncErrors(async (req, res, next)=>{
    let product = await Product.findById(req.params.id); //using let because we are going to change the product


    if (!product) {
        return next(new ErrorHandler("Product not found", 404));
    }

    product = await Product.findByIdAndUpdate(req.params.id,req.body, {
        new: true,
        runValidators: true,
        useFindAndModify: false,
    })

    res.status(200).json({
        success: true,
        product,
    });
});

//DELETE PRODUCT
exports.deleteProduct = catchAsyncErrors(async (req, res, next) =>{
    const product = await Product.findById(req.params.id);

    if (!product) {
        return next(new ErrorHandler("Product not found", 404));
    }

    await product.deleteOne();

    res.status(200).json({
        success: true,
        message:"Product Deleted Successfully"
    });
});