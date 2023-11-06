import asyncHandler from "express-async-handler";
import Product from "../model/Product.js";
import Review from "../model/Review.js";

// CREATE NEW REVIEW
// @route   POST /api/v1/reviews
// @access  Private/Admin
export const createReviewCtrl = asyncHandler(async (req, res) => {
  const { product, message, rating } = req.body;
  //1. Find the product
  const { productID } = req.params;
  const productFound = await Product.findById(productID).populate("reviews");
  if (!productFound) {
    throw new Error("Product Not Found");
  }

  //check if user already reviewed this product
  const hasReviewed = productFound?.reviews?.find((review) => {
    return review?.user?.toString() === req?.userAuthId?.toString();
  });
  
  if (hasReviewed) {
    throw new Error("You have already reviewed this product");
  }

  //Create review
  const review = await Review.create({
    message,
    rating,
    product: productFound?._id,
    user: req.userAuthId,
  });

  //Push review into product Found (product has an array of reviews)
  productFound.reviews.push(review?._id);
  //resave
  await productFound.save();

  res.status(201).json({
    success: true,
    message: "Review created successfully",
  });
});
