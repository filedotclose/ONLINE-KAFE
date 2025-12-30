import mongoose from "mongoose";

const cartItemSchema = new mongoose.Schema({
  menuItem: {
    type: String,
    required: true,
  },
  quantity: {
    type: Number,
    default: 1,
    required: true,
  },
  price : {
    type : Number,
    default : 0,
    required : true
  }
});

const cartSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Users",
    required: true,
    unique: true, 
  },
  cartItems: {
    type: [cartItemSchema], 
    required: true,
  },
  totalprice : {
    type : Number,
    required : true,
    default : 0 
  },
  uat: {
    type: Date,
    default: Date.now(),
  },
});

export default mongoose.models.cart || mongoose.model("cart", cartSchema);
