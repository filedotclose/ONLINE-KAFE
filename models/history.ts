import mongoose from "mongoose";

const historyItemSchema = new mongoose.Schema({
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

const historySchema = new mongoose.Schema({
    userId : {
        type : mongoose.Schema.Types.ObjectId, ref : "users", required : true
    },
    orderItems : {
        type : [historyItemSchema],
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

export default mongoose.models.history || mongoose.model("history", historySchema)