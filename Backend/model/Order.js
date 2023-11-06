import mongoose from "mongoose";
const Schema = mongoose.Schema;
//Generate random numbers for order
const randomTxt = Math.random().toString(36).substring(7).toLocaleUpperCase();
const randomNumbers = Math.floor(1000 + Math.random() * 90000);
const OrderSchema = new Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    orderItems: [
      {
        //save the entire order into this rather then referencing the product model
        //Because a user cannot have millions of orders, so we can use the embedded way.

        // ** orderItems represent the individual product that the user wants to place.
        type: Object,
        required: true,
      },
    ],
    shippingAddress: {

      // we are going to use the shippingAddress from the User and push 
      //it into the shippingAddress of the Order.

      type: Object,
      required: true,
    },
    orderNumber: {
      //this one will help the admin for order management
      type: String,
      default: randomTxt + randomNumbers, //Generating orderNumber(admin) (both function is declared at the beginning)
    },
    //for stripe payment
    paymentStatus: {
      type: String,
      default: "Not paid",
    },
    paymentMethod: {
      type: String,
      default: "Not specified",
    },
    totalPrice: {
      type: Number,
      default: 0.0,
    },
    currency: {
      type: String,
      default: "Not specified",
    },
    //For admin
    status: {
      type: String,
      default: "pending",
      //These are some accepted values
      enum: ["pending", "processing", "shipped", "delivered"],
    },
    deliveredAt: {
      type: Date,
    },
  },
  {
    //Give date document(Order) would be created and updated
    timestamps: true,
  }
);

//compile to form model
const Order = mongoose.model("Order", OrderSchema);

export default Order;
