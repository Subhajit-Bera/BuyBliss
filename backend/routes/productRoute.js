const express=require("express");
const { getAllProducts,createProduct,updateProduct,deleteProduct,getProductDetails} = require("../controllers/productController");
const router=express.Router();
const {isAuthenticatedUser,authorizeRoles}=require("../middleware/auth");


//Products
router.route("/products").get(getAllProducts);
router.route("/admin/product/new").post(isAuthenticatedUser,authorizeRoles("admin"),createProduct); //Admin
router.route("/admin/product/:id").put(isAuthenticatedUser,authorizeRoles("admin"),updateProduct).delete(isAuthenticatedUser,authorizeRoles("admin"),deleteProduct);

router.route("/product/:id").get(getProductDetails);
module.exports=router;