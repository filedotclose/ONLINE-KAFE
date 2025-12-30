import mongoose from "mongoose";

const orderItemSchema = new mongoose.Schema({
  menuItem: {
    type: String,
    required: true,
  },
  quantity: {
    type: Number,
    default: 1,
    required: true,
  },
  price: {
    type: Number,
    default : 0,
    required: true 
    }
});

const orderSchema = new mongoose.Schema({
    userId : {
        type : mongoose.Schema.Types.ObjectId, ref : "users", required : true
    },
    orderItems : {
        type : [orderItemSchema],
        required : true
    },
    totalprice : {
      type : Number,
      required : true,
      defualt : 0
    },
    payment : {
        type : String,
        required : true
    },
    iat : {
        type : Date,
        default : Date.now()
    },
    orderId : {
        type : String,
    }
})

export default mongoose.models.orders || mongoose.model("orders", orderSchema)