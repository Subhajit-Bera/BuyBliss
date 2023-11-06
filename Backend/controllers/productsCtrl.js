import asyncHandler from "express-async-handler";
import Brand from "../model/Brand.js";
import Category from "../model/Category.js";
import Product from "../model/Product.js";



//CREATE NEW PRODUCT
// @route   POST /api/v1/products
// @access  Private/Admin
export const createProductCtrl = asyncHandler(async (req, res) => {
  // console.log(req.files); req.files->images
  
  // console.log(req.body);
  const { name, description, category, sizes, colors, price, totalQty, brand } = req.body;
  
  const convertedImgs = req?.files?.map((file) => file?.path);

  //Product already exists
  const productExists = await Product.findOne({ name });
  if (productExists) {
    throw new Error("Product Already Exists");
  }


  //find the brand
  const brandFound = await Brand.findOne({
    name: brand,
  });

  if (!brandFound) {
    throw new Error(
      "Brand not found, please create brand first or check brand name"
    );
  }

  //find the category
  const categoryFound = await Category.findOne({
    name: category,
  });
  if (!categoryFound) {
    throw new Error(
      "Category not found, please create category first or check category name"
    );
  }

  //Create the product
  const product = await Product.create({
    name,
    description,
    category,
    sizes,
    colors,
    user: req.userAuthId, //unless you are locked in by providing the token first, you can't create a product.
    price,
    totalQty,
    brand,
    images: convertedImgs,
  });

  //Push the product into category (In category we have an array called products)
  categoryFound.products.push(product._id); //here the type declared as: mongoose.Schema.Types.ObjectId
  //resave
  await categoryFound.save();

  //push the product into brand
  brandFound.products.push(product._id);
  //resave
  await brandFound.save();


  //send response
  res.json({
    status: "success",
    message: "Product created successfully",
    product,
  });
});




//GET ALL PROUCTS
// @route   GET /api/v1/products
// @access  Public
export const getProductsCtrl = asyncHandler(async (req, res) => {
  // console.log(req.query);
  
  //query
  let productQuery = Product.find();

  //Search by name
  if (req.query.name) {
    productQuery = productQuery.find({
      //$regex -> Provides regular expression capabilities for pattern matching strings in queries.
      //$options: "i" -> match both lower case and upper case pattern in the string
      name: { $regex: req.query.name, $options: "i" },
    });
  }

  //Filter by brand
  if (req.query.brand) {
    productQuery = productQuery.find({
      brand: { $regex: req.query.brand, $options: "i" },
    });
  }

  //Filter by category
  if (req.query.category) {
    productQuery = productQuery.find({
      category: { $regex: req.query.category, $options: "i" },
    });
  }

  //Filter by color
  if (req.query.color) {
    productQuery = productQuery.find({
      colors: { $regex: req.query.color, $options: "i" },
    });
  }

  //Filter by size
  if (req.query.size) {
    productQuery = productQuery.find({
      sizes: { $regex: req.query.size, $options: "i" },
    });
  }


  //Filter by price range   (Here the query looks like : product?price=100-500)
  if (req.query.price) {
    const priceRange = req.query.price.split("-");
    //gte: greater or equal
    //lte: less than or equal to
    productQuery = productQuery.find({
      price: { $gte: priceRange[0], $lte: priceRange[1] },
    });
  }


  //Pagination

  //Page
  const page = parseInt(req.query.page) ? parseInt(req.query.page) : 1;

  //Limit
  const limit = parseInt(req.query.limit) ? parseInt(req.query.limit) : 10;

  //Start Index
  const startIndex = (page - 1) * limit;

  //End Index
  const endIndex = page * limit;

  //Total
  const total = await Product.countDocuments();

  
  //for 1st page: skip=(1-1)*10(default limit) = 0  -> So it will show the no of limits assign without skip 
  //for 2nd page: skip=(2-1)*10 = 10  ->skip=10 :it will skip first 10 products 
  productQuery = productQuery.skip(startIndex).limit(limit);

  //Pagination results
  const pagination = {};

  //For next page
  if (endIndex < total) {
    pagination.next = {
      page: page + 1,
      limit,
    };
  }
  //For previous page
  if (startIndex > 0) {
    pagination.prev = {
      page: page - 1,
      limit,
    };
  }

  //await the query
  const products = await productQuery.populate("reviews");
  res.json({
    status: "success",
    total,
    results: products.length,
    pagination,
    message: "Products fetched successfully",
    products,
  });
});


//GET SINGLE PRODUCT
// @route   GET /api/products/:id
// @access  Public 
export const getProductCtrl = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id).populate({
    path: "reviews",
    populate: {
      path: "user",
      select: "fullname",
    },
  });
  if (!product) {
    throw new Error("Prouduct not found");
  }
  res.json({
    status: "success",
    message: "Product fetched successfully",
    product,
  });
});



//UPDATE PRODUCT
// @route   PUT /api/products/:id/update
// @access  Private/Admin
export const updateProductCtrl = asyncHandler(async (req, res) => {
  const {
    name,
    description,
    category,
    sizes,
    colors,
    user,
    price,
    totalQty,
    brand,
  } = req.body;
  //validation

  //update
  const product = await Product.findByIdAndUpdate(
    req.params.id,
    {
      name,
      description,
      category,
      sizes,
      colors,
      user,
      price,
      totalQty,
      brand,
    },
    {
      new: true,
      runValidators: true,
    }
  );
  res.json({
    status: "success",
    message: "Product updated successfully",
    product,
  });
});


// DELETE PRODUCT
// @route   DELETE /api/products/:id/delete
// @access  Private/Admin
export const deleteProductCtrl = asyncHandler(async (req, res) => {
  await Product.findByIdAndDelete(req.params.id);
  res.json({
    status: "success",
    message: "Product deleted successfully",
  });
});
