import mongoose from "mongoose";

const menuItemSchema = new mongoose.Schema({
  name: {
     type: String, 
     required: true 
    },
  categoryId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Category",
    required: true,
  },
  price: {
    type: Number,
    default : 0,
    required: true 
    },
  description: {
    type: String 
    },
  imageUrl: {
    type: String 
    },
  available: {
    type: Boolean, default: true 
}
});

export default mongoose.models.menuitems || mongoose.model("menuitems", menuItemSchema);
