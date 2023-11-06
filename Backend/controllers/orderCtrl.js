import asyncHandler from "express-async-handler";
import dotenv from "dotenv";
dotenv.config();
import Stripe from "stripe";
import Order from "../model/Order.js";
import Product from "../model/Product.js";
import User from "../model/User.js";
import Coupon from "../model/Coupon.js";

//CREATE ORDERS  (Payment using strinpe)
//@route POST /api/v1/orders
//@access private

//Stripe instance
const stripe = new Stripe(process.env.STRIPE_KEY);

export const createOrderCtrl = asyncHandler(async (req, res) => {
  
  //Get the coupon  : url :/orders/?coupon=coupon_name(NEW-YEAR)
  // const { coupon } = req?.query;

  // const couponFound = await Coupon.findOne({
  //   code: coupon?.toUpperCase(),
  // });
  // if (couponFound?.isExpired) {
  //   throw new Error("Coupon has expired");
  // }
  // if (!couponFound) {
  //   throw new Error("Coupon does not exists");
  // }

  //get discount
  // const discount = couponFound?.discount / 100; //convert it into %

  //Get the payload(user, orderItems, shipppingAddress, totalPrice);
  const { orderItems, shippingAddress, totalPrice } = req.body;
  // console.log(req.body);

  //Find the user
  const user = await User.findById(req.userAuthId);

  //Check if user has shipping address
  if (!user?.hasShippingAddress) {
    throw new Error("Please provide shipping address");
  }

  //Check if order is not empty
  if (orderItems?.length <= 0) {
    throw new Error("No Order Items are Found");
  }

  //Place/create order - save into DB
  const order = await Order.create({
    user: user?._id, //or we can use req.userAuthId
    orderItems,
    shippingAddress,
    // totalPrice: couponFound ? totalPrice - totalPrice * discount : totalPrice,
    totalPrice,
  });
  // console.log(order);


  //Update the product qty 
  // retrieve all documents from the Product collection where the _id field matches any of the values in the orderItems array           
  const products = await Product.find({ _id: { $in: orderItems } }); //here _id: Id of a particular product inside orderItems 
 
  //getting total no of ptoduct sold(totalSold) : we can show quantity left + best seller
  orderItems?.map(async (order) => {
    const product = products?.find((product) => {
      return product?._id?.toString() === order?._id?.toString();
    });
    if (product) {
      product.totalSold += order.qty;
    }
    await product.save();
  });

  //Push order into User (Have an array of orders)
  user.orders.push(order?._id);
  await user.save();

  //Make payment (stripe)
  //convert order items to have same structure that stripe need
  const convertedOrders = orderItems.map((item) => {
    return {
      price_data: {
        // currency: "usd",
        currency: "inr",
        product_data: {
          name: item?.name,
          description: item?.description,
        },
        unit_amount: item?.price*100,
        // unit_amount: item?.price * 100, incase of usd , we need to convert it to cents so *100
      },
      quantity: item?.qty,
    };
  });
  const session = await stripe.checkout.sessions.create({
    line_items: convertedOrders,
    metadata: { //through metadata we can pass the order to the webhook inorder to update its status
      orderId: JSON.stringify(order?._id),
      //In case of strire when we passing metadata ,we have to strigify it
    },
    mode: "payment",
    success_url: "http://localhost:3000/success",
    cancel_url: "http://localhost:3000/cancel",
  });
  //sending the url to the user
  res.send({ url: session.url }); //session.url -> is what is going to render the actual form for the user to enter his or her credit.
});


//GET ALL PRODUCTS
//@route GET /api/v1/orders
//@access private
export const getAllordersCtrl = asyncHandler(async (req, res) => {
  //find all orders
  const orders = await Order.find().populate("user");
  res.json({
    success: true,
    message: "All orders",
    orders,
  });
});


//GET SINGLE PRODUCT
//@route GET /api/v1/orders/:id
//@access private/admin
export const getSingleOrderCtrl = asyncHandler(async (req, res) => {
  //get the id from params
  const id = req.params.id;
  const order = await Order.findById(id);
  //send response
  res.status(200).json({
    success: true,
    message: "Single order",
    order,
  });
});


//UPDATE ORDER STATUS -> Admin will update the order
//@route PUT /api/v1/orders/update/:id
//@access private/admin ((Admin can change the order status))
export const updateOrderCtrl = asyncHandler(async (req, res) => {
  //get the id from params
  const id = req.params.id;
  //update
  const updatedOrder = await Order.findByIdAndUpdate(
    id,
    {
      status: req.body.status,
    },
    {
      new: true,
    }
  );
  res.status(200).json({
    success: true,
    message: "Order status updated",
    updatedOrder,
  });
});


//SUM OF ALL ORDERS (SALES)
//@route GET /api/v1/orders/sales/sum
//@access private/admin  
export const getOrderStatsCtrl = asyncHandler(async (req, res) => {
  //Get order stats (totalSales, minimum sale and maximumSale)
  const orders = await Order.aggregate([
    {
      //group means that we are going to combine all the orders together
      $group: {
        _id: null, //ther is no record as _id:null So we can gets all the orders
        minimumSale: {
          $min: "$totalPrice",
        },
        totalSales: {
          $sum: "$totalPrice",
        },
        maxSale: {
          $max: "$totalPrice",
        },
        avgSale: {
          $avg: "$totalPrice",
        },
      },
    },
  ]);

  //Get today sale
  //get the date
  const date = new Date();
  const today = new Date(date.getFullYear(), date.getMonth(), date.getDate());
  const saleToday = await Order.aggregate([
    {
      $match: {
        createdAt: {
          $gte: today,
        },
      },
    },
    {
      $group: {
        _id: null,
        totalSales: {
          $sum: "$totalPrice",
        },
      },
    },
  ]);
  
  //send response
  res.status(200).json({
    success: true,
    message: "Sum of orders",
    orders,
    saleToday,
  });
});
