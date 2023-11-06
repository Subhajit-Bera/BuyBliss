import asyncHandler from "express-async-handler";
import Coupon from "../model/Coupon.js";

//CREATE NEW COUPON
// @route   POST /api/v1/coupons
// @access  Private/Admin
export const createCouponCtrl = asyncHandler(async (req, res) => {
  const { code, startDate, endDate, discount } = req.body;
  // console.log(req.body);

  //check if coupon already exists
  const couponsExists = await Coupon.findOne({
    code,
  });
  if (couponsExists) {
    throw new Error("Coupon already exists");
  }

  //check if discount is a number
  if (isNaN(discount)) {
    throw new Error("Discount value must be a number");
  }

  //create coupon
  const coupon = await Coupon.create({
    code: code,
    startDate,
    endDate,
    discount,
    user: req.userAuthId,
  });

  //send the response
  res.status(201).json({
    status: "success",
    message: "Coupon created successfully",
    coupon,
  });
});


//GET ALL COUPONS
// @route   GET /api/v1/coupons
// @access  Private/Admin
export const getAllCouponsCtrl = asyncHandler(async (req, res) => {
  const coupons = await Coupon.find();
  res.status(200).json({
    status: "success",
    message: "All coupons",
    coupons,
  });
});


//GET SINGLE COUPON
// @route   GET /api/v1/coupons/:id
// @access  Private/Admin
export const getCouponCtrl = asyncHandler(async (req, res) => {
  const coupon = await Coupon.findOne({ code: req.query.code }); ///coupons/single?code=NEW-YEAR
  //check if is not found
  if (coupon === null) {
    throw new Error("Coupon not found");
  }
  //check if expired
  if (coupon.isExpired) {
    throw new Error("Coupon Expired");
  }
  res.json({
    status: "success",
    message: "Coupon fetched",
    coupon,
  });
});


//UPDATE COUPON
// @route   GET /api/v1/coupons/:id
// @access  Private/Admin
export const updateCouponCtrl = asyncHandler(async (req, res) => {
  const { code, startDate, endDate, discount } = req.body;
  const coupon = await Coupon.findByIdAndUpdate(
    req.params.id,
    {
      code: code?.toUpperCase(),
      discount,
      startDate,
      endDate,
    },
    {
      new: true,
    }
  );
  res.json({
    status: "success",
    message: "Coupon updated successfully",
    coupon,
  });
});


//DELETE COUPON
// @route   GET /api/v1/coupons/:id
// @access  Private/Admin
export const deleteCouponCtrl = asyncHandler(async (req, res) => {
  const coupon = await Coupon.findByIdAndDelete(req.params.id);
  res.json({
    status: "success",
    message: "Coupon deleted successfully",
    coupon,
  });
});
