const Order = require("../models/orderModel");
const Product = require("../models/productModel");
const ErrorHandler = require("../utils/errorhander");
const catchAsyncErrors = require("../middleware/catchAsyncErrors");

//CREATE NEW ORDER
exports.newOrder = catchAsyncErrors(async (req, res, next) => {
    const { shippingInfo, orderItems, paymentInfo, itemsPrice, taxPrice, shippingPrice, totalPrice, } = req.body;

    const order = await Order.create({
        shippingInfo,
        orderItems,
        paymentInfo,
        itemsPrice,
        taxPrice,
        shippingPrice,
        totalPrice,
        paidAt: Date.now(),
        user: req.user._id,
    });

    res.status(201).json({
        success: true,
        order,
    });

});

//GET SINGLE ORDER Details
exports.getSingleOrder = catchAsyncErrors(async (req, res, next) => {
    // const order = await Order.findById(req.params.id)-> will give user id
    //.populate("user","name email") -> will go to users database and also give the name and email of the user
    const order = await Order.findById(req.params.id).populate(
        "user",
        "name email"
    );

    if (!order) {
        return next(new ErrorHandler("Order not found with this Id", 404));
    }

    res.status(200).json({
        success: true,
        order,
    });

});

//GET LOGGED IN USER ORDER
exports.myOrders = catchAsyncErrors(async (req, res, next) => {
    //{user:req.user._id} ->finding all the orders in the database where id in user fied is ame as loged in id(req.user._id)
    const orders = await Order.find({ user: req.user._id });
  
    res.status(200).json({
      success: true,
      orders,
    });
  });